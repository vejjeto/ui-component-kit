"use client";

import { cn } from "@/lib/cn";
import * as React from "react";

export interface DropdownMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  variant?: "default" | "destructive";
  disabled?: boolean;
  onSelect?: () => void;
}

export interface DropdownMenuGroup {
  label?: string;
  items: DropdownMenuItem[];
}

export interface DropdownMenuProps {
  trigger: React.ReactNode;
  groups: DropdownMenuGroup[];
  align?: "start" | "end";
  className?: string;
}

export function DropdownMenu({
  trigger,
  groups,
  align = "start",
  className,
}: DropdownMenuProps): React.ReactElement {
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const itemRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const menuId = React.useId();

  const flatItems = React.useMemo(
    () => groups.flatMap((g) => g.items),
    [groups],
  );

  const findNextEnabled = React.useCallback(
    (start: number, step: 1 | -1): number => {
      const len = flatItems.length;
      if (len === 0) return -1;
      for (let i = 0; i < len; i++) {
        const idx = (start + step * i + len) % len;
        if (!flatItems[idx]?.disabled) return idx;
      }
      return -1;
    },
    [flatItems],
  );

  React.useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  React.useEffect(() => {
    if (open && activeIndex >= 0) {
      itemRefs.current[activeIndex]?.focus();
    }
  }, [open, activeIndex]);

  const handleOpen = (initialDirection: "first" | "last" = "first") => {
    const startIdx =
      initialDirection === "first" ? 0 : Math.max(0, flatItems.length - 1);
    const nextIdx = findNextEnabled(
      startIdx,
      initialDirection === "first" ? 1 : -1,
    );
    setActiveIndex(nextIdx);
    setOpen(true);
  };

  const handleMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex(findNextEnabled(activeIndex + 1, 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex(findNextEnabled(activeIndex - 1, -1));
    } else if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(findNextEnabled(0, 1));
    } else if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(findNextEnabled(flatItems.length - 1, -1));
    }
  };

  let runningIndex = -1;

  const handleTriggerClick = () => {
    if (open) {
      setOpen(false);
    } else {
      handleOpen("first");
    }
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      handleOpen("first");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      handleOpen("last");
    }
  };

  const renderTrigger = () => {
    if (React.isValidElement<Record<string, unknown>>(trigger)) {
      const prevOnClick = trigger.props.onClick as
        | ((e: React.MouseEvent<HTMLElement>) => void)
        | undefined;
      const prevOnKeyDown = trigger.props.onKeyDown as
        | ((e: React.KeyboardEvent<HTMLElement>) => void)
        | undefined;
      return React.cloneElement(trigger, {
        ref: triggerRef,
        "aria-haspopup": "menu",
        "aria-expanded": open,
        "aria-controls": open ? menuId : undefined,
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          prevOnClick?.(e);
          handleTriggerClick();
        },
        onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
          prevOnKeyDown?.(e);
          handleTriggerKeyDown(e);
        },
      });
    }

    return (
      <button
        ref={(el) => {
          triggerRef.current = el;
        }}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
        className="inline-flex items-center rounded-[var(--radius-ui)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]"
      >
        {trigger}
      </button>
    );
  };

  return (
    <div ref={containerRef} className={cn("relative inline-block", className)}>
      {renderTrigger()}

      {open ? (
        <div
          id={menuId}
          role="menu"
          onKeyDown={handleMenuKeyDown}
          className={cn(
            "absolute z-40 mt-2 min-w-[210px] rounded-[var(--radius-ui)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-1.5 shadow-xl",
            align === "end" ? "right-0" : "left-0",
          )}
        >
          {groups.map((group, groupIdx) => (
            <div key={group.label ?? groupIdx} role="group">
              {groupIdx > 0 ? (
                <div
                  className="my-1 h-px bg-[var(--border-subtle)]"
                  role="separator"
                />
              ) : null}
              {group.label ? (
                <div className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  {group.label}
                </div>
              ) : null}
              {group.items.map((item) => {
                runningIndex += 1;
                const itemIdx = runningIndex;
                const isDestructive = item.variant === "destructive";
                return (
                  <button
                    key={item.id}
                    ref={(el) => {
                      itemRefs.current[itemIdx] = el;
                    }}
                    type="button"
                    role="menuitem"
                    disabled={item.disabled}
                    tabIndex={activeIndex === itemIdx ? 0 : -1}
                    onClick={() => {
                      if (item.disabled) return;
                      item.onSelect?.();
                      setOpen(false);
                      triggerRef.current?.focus();
                    }}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors focus:outline-none",
                      isDestructive
                        ? "text-[var(--danger)] hover:bg-red-500/10 focus:bg-red-500/10"
                        : "text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] focus:bg-[var(--bg-elevated)]",
                      item.disabled && "cursor-not-allowed opacity-45",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {item.icon ? (
                        <span
                          className="inline-flex shrink-0 opacity-80"
                          aria-hidden="true"
                        >
                          {item.icon}
                        </span>
                      ) : null}
                      <span>{item.label}</span>
                    </span>
                    {item.shortcut ? (
                      <kbd className="font-mono text-[11px] text-[var(--text-muted)]">
                        {item.shortcut}
                      </kbd>
                    ) : null}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
