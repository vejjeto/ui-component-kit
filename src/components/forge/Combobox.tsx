"use client";

import { cn } from "@/lib/cn";
import { Check, ChevronDown, X } from "lucide-react";
import * as React from "react";

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  label?: string;
  clearable?: boolean;
  className?: string;
}

export function Combobox({
  options,
  value = "",
  onValueChange,
  placeholder = "Seleccionar opción...",
  searchPlaceholder = "Filtrar opciones...",
  emptyMessage = "Sin resultados para la búsqueda.",
  label,
  clearable = true,
  className,
}: ComboboxProps): React.ReactElement {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const listboxId = React.useId();
  const labelId = React.useId();

  const selectedOption = options.find((opt) => opt.value === value) ?? null;

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        (opt.description?.toLowerCase().includes(q) ?? false),
    );
  }, [options, query]);

  React.useEffect(() => {
    setActiveIndex(0);
  }, [query, open]);

  React.useEffect(() => {
    if (!open) return;
    const handleOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  const selectOption = (nextValue: string) => {
    onValueChange?.(nextValue);
    setOpen(false);
    setQuery("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) setOpen(true);
      else
        setActiveIndex((prev) =>
          filtered.length ? (prev + 1) % filtered.length : 0,
        );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) setOpen(true);
      else {
        setActiveIndex((prev) =>
          filtered.length ? (prev - 1 + filtered.length) % filtered.length : 0,
        );
      }
    } else if (event.key === "Enter" && open && filtered[activeIndex]) {
      event.preventDefault();
      selectOption(filtered[activeIndex].value);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      setQuery("");
    }
  };

  const activeOption = open ? filtered[activeIndex] : undefined;

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {label ? (
        <label
          id={labelId}
          className="mb-1.5 block text-xs font-medium text-[var(--text-primary)]"
        >
          {label}
        </label>
      ) : null}

      <div className="relative flex h-9 w-full items-center rounded-[var(--radius-ui)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 text-sm focus-within:ring-2 focus-within:ring-[var(--ring)]">
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-labelledby={label ? labelId : undefined}
          aria-activedescendant={
            activeOption ? `${listboxId}-${activeOption.value}` : undefined
          }
          value={open ? query : (selectedOption?.label ?? "")}
          placeholder={open ? searchPlaceholder : placeholder}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!open) setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className="h-full w-full bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
        />

        {clearable && value ? (
          <button
            type="button"
            aria-label="Limpiar selección"
            onClick={() => {
              onValueChange?.("");
              setQuery("");
              inputRef.current?.focus();
            }}
            className="mr-1 inline-flex h-5 w-5 items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}

        <button
          type="button"
          tabIndex={-1}
          aria-label="Alternar opciones"
          onClick={() => {
            setOpen((prev) => !prev);
            inputRef.current?.focus();
          }}
          className="inline-flex h-5 w-5 items-center justify-center text-[var(--text-muted)]"
        >
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
          />
        </button>
      </div>

      {open ? (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-40 mt-1.5 max-h-60 w-full overflow-auto rounded-[var(--radius-ui)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-1 shadow-xl"
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-4 text-center text-xs text-[var(--text-muted)]">
              {emptyMessage}
            </li>
          ) : (
            filtered.map((opt, idx) => {
              const isSelected = opt.value === value;
              const isActive = idx === activeIndex;
              return (
                <li
                  key={opt.value}
                  id={`${listboxId}-${opt.value}`}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    selectOption(opt.value);
                  }}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-2 rounded-md px-2.5 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                      : "text-[var(--text-secondary)]",
                  )}
                >
                  <div className="min-w-0">
                    <div className="truncate font-medium text-[var(--text-primary)]">
                      {opt.label}
                    </div>
                    {opt.description ? (
                      <div className="truncate text-xs text-[var(--text-muted)]">
                        {opt.description}
                      </div>
                    ) : null}
                  </div>
                  {isSelected ? (
                    <Check
                      className="h-4 w-4 shrink-0 text-[var(--accent)]"
                      aria-hidden="true"
                    />
                  ) : null}
                </li>
              );
            })
          )}
        </ul>
      ) : null}
    </div>
  );
}
