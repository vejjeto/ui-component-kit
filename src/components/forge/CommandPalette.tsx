"use client";

import { cn } from "@/lib/cn";
import { fuzzyFilter } from "@/lib/fuzzy";
import { Command, Search } from "lucide-react";
import * as React from "react";
import { createPortal } from "react-dom";

export interface CommandItem {
  id: string;
  label: string;
  group: string;
  keywords?: string;
  shortcut?: string;
  icon?: React.ReactNode;
  onSelect: () => void;
}

export interface CommandPaletteProps {
  commands: CommandItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enableGlobalShortcut?: boolean;
  placeholder?: string;
}

function HighlightedText({
  text,
  indices,
}: {
  text: string;
  indices: number[];
}): React.ReactElement {
  if (indices.length === 0) return <>{text}</>;
  const hitSet = new Set(indices);

  return (
    <>
      {Array.from(text).map((char, idx) =>
        hitSet.has(idx) ? (
          <mark
            key={idx}
            className="rounded-sm bg-[var(--accent-soft)] px-0.5 font-semibold text-[var(--accent)]"
          >
            {char}
          </mark>
        ) : (
          <React.Fragment key={idx}>{char}</React.Fragment>
        ),
      )}
    </>
  );
}

export function CommandPalette({
  commands,
  open,
  onOpenChange,
  enableGlobalShortcut = true,
  placeholder = "Escribe un comando o componente...",
}: CommandPaletteProps): React.ReactElement | null {
  const [mounted, setMounted] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!enableGlobalShortcut) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enableGlobalShortcut, open, onOpenChange]);

  React.useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      const timer = window.setTimeout(() => inputRef.current?.focus(), 0);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [open]);

  const scored = React.useMemo(() => {
    return fuzzyFilter(
      commands,
      query,
      (c) => `${c.label} ${c.keywords ?? ""}`,
    );
  }, [commands, query]);

  const grouped = React.useMemo(() => {
    const map = new Map<string, typeof scored>();
    for (const entry of scored) {
      const list = map.get(entry.item.group) ?? [];
      list.push(entry);
      map.set(entry.item.group, list);
    }
    return Array.from(map.entries());
  }, [scored]);

  const flatVisible = React.useMemo(
    () => grouped.flatMap(([, entries]) => entries),
    [grouped],
  );

  React.useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  if (!mounted || !open) return null;

  const execute = (cmd: CommandItem | undefined) => {
    if (!cmd) return;
    onOpenChange(false);
    cmd.onSelect();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onOpenChange(false);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) =>
        flatVisible.length ? (prev + 1) % flatVisible.length : 0,
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) =>
        flatVisible.length
          ? (prev - 1 + flatVisible.length) % flatVisible.length
          : 0,
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      execute(flatVisible[activeIndex]?.item);
    }
  };

  let runningIndex = -1;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]">
      <div
        className="fixed inset-0 bg-black/55 backdrop-blur-[2px]"
        aria-hidden="true"
        onClick={() => onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Paleta de comandos"
        className="relative z-10 w-full max-w-xl overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl"
      >
        <div className="flex items-center gap-2.5 border-b border-[var(--border-subtle)] px-4 py-3">
          <Search
            className="h-4 w-4 text-[var(--text-muted)]"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            aria-label={placeholder}
            className="w-full bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
          />
          <kbd className="rounded border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--text-muted)]">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2" role="listbox">
          {flatVisible.length === 0 ? (
            <div className="py-10 text-center text-sm text-[var(--text-muted)]">
              No se encontraron comandos para &ldquo;{query}&rdquo;.
            </div>
          ) : (
            grouped.map(([groupName, entries]) => (
              <div key={groupName} className="mb-2 last:mb-0">
                <div className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  {groupName}
                </div>
                {entries.map((entry) => {
                  runningIndex += 1;
                  const idx = runningIndex;
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={entry.item.id}
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={() => execute(entry.item)}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                        isActive
                          ? "bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                          : "text-[var(--text-secondary)]",
                      )}
                    >
                      <span className="flex items-center gap-2.5">
                        <span
                          className="text-[var(--text-muted)]"
                          aria-hidden="true"
                        >
                          {entry.item.icon ?? <Command className="h-4 w-4" />}
                        </span>
                        <span>
                          <HighlightedText
                            text={entry.item.label}
                            indices={entry.indices.filter(
                              (i) => i < entry.item.label.length,
                            )}
                          />
                        </span>
                      </span>
                      {entry.item.shortcut ? (
                        <kbd className="rounded border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-1.5 py-0.5 font-mono text-[11px] text-[var(--text-muted)]">
                          {entry.item.shortcut}
                        </kbd>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
