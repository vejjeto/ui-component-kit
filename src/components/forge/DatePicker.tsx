"use client";

import { cn } from "@/lib/cn";
import {
  type DateRange,
  formatDisplayDate,
  formatMonthYear,
  getCalendarDays,
  isDateInRange,
  normalizeDateRange,
  parseISODate,
  shiftMonth,
} from "@/lib/date-utils";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import * as React from "react";

const WEEKDAYS = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

export interface DatePickerProps {
  mode?: "single" | "range";
  value?: string | null;
  range?: DateRange;
  onValueChange?: (iso: string | null) => void;
  onRangeChange?: (range: DateRange) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

function getInitialMonth(
  mode: "single" | "range",
  value?: string | null,
  range?: DateRange,
): { year: number; month: number } {
  const seedIso = mode === "single" ? value : range?.start;
  const parsed = parseISODate(seedIso);
  if (parsed) return { year: parsed.year, month: parsed.month };
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() };
}

export function DatePicker({
  mode = "single",
  value = null,
  range = { start: null, end: null },
  onValueChange,
  onRangeChange,
  placeholder,
  label,
  className,
}: DatePickerProps): React.ReactElement {
  const [open, setOpen] = React.useState(false);
  const [cursor, setCursor] = React.useState(() =>
    getInitialMonth(mode, value, range),
  );
  const [focusedIndex, setFocusedIndex] = React.useState(14);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const dayButtonsRef = React.useRef<Array<HTMLButtonElement | null>>([]);
  const gridId = React.useId();

  const cells = React.useMemo(
    () => getCalendarDays(cursor.year, cursor.month),
    [cursor.year, cursor.month],
  );

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

  const handleSelectIso = (iso: string) => {
    if (mode === "single") {
      onValueChange?.(iso);
      setOpen(false);
      return;
    }

    if (!range.start || (range.start && range.end)) {
      onRangeChange?.({ start: iso, end: null });
      return;
    }

    const normalized = normalizeDateRange({ start: range.start, end: iso });
    onRangeChange?.(normalized);
    setOpen(false);
  };

  const handleGridKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    idx: number,
  ) => {
    const offsets: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
    };

    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      return;
    }

    const delta = offsets[event.key];
    if (delta === undefined) return;
    event.preventDefault();

    const next = Math.max(0, Math.min(cells.length - 1, idx + delta));
    setFocusedIndex(next);
    dayButtonsRef.current[next]?.focus();
  };

  const displayLabel = React.useMemo(() => {
    if (mode === "single") {
      return value
        ? formatDisplayDate(value)
        : (placeholder ?? "Seleccionar fecha");
    }
    if (range.start && range.end) {
      return `${formatDisplayDate(range.start)} — ${formatDisplayDate(range.end)}`;
    }
    if (range.start) {
      return `${formatDisplayDate(range.start)} — ...`;
    }
    return placeholder ?? "Seleccionar rango de fechas";
  }, [mode, value, range, placeholder]);

  const hasSelection =
    mode === "single" ? Boolean(value) : Boolean(range.start || range.end);

  return (
    <div
      ref={containerRef}
      className={cn("relative inline-block w-full", className)}
    >
      {label ? (
        <span className="mb-1.5 block text-xs font-medium text-[var(--text-primary)]">
          {label}
        </span>
      ) : null}

      <div className="flex h-9 w-full items-center justify-between gap-2 rounded-[var(--radius-ui)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 text-sm">
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? gridId : undefined}
          onClick={() => setOpen((prev) => !prev)}
          className="flex flex-1 items-center gap-2 text-left focus:outline-none"
        >
          <Calendar
            className="h-4 w-4 shrink-0 text-[var(--text-muted)]"
            aria-hidden="true"
          />
          <span
            className={cn(
              "truncate",
              hasSelection
                ? "text-[var(--text-primary)]"
                : "text-[var(--text-muted)]",
            )}
          >
            {displayLabel}
          </span>
        </button>

        {hasSelection ? (
          <button
            type="button"
            aria-label="Limpiar fecha"
            onClick={() => {
              if (mode === "single") onValueChange?.(null);
              else onRangeChange?.({ start: null, end: null });
            }}
            className="inline-flex h-5 w-5 items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>

      {open ? (
        <div
          id={gridId}
          role="dialog"
          aria-label="Calendario"
          className="absolute left-0 z-40 mt-2 w-72 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3 shadow-xl"
        >
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              aria-label="Mes anterior"
              onClick={() => setCursor((c) => shiftMonth(c.year, c.month, -1))}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              {formatMonthYear(cursor.year, cursor.month)}
            </span>
            <button
              type="button"
              aria-label="Mes siguiente"
              onClick={() => setCursor((c) => shiftMonth(c.year, c.month, 1))}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mb-1 grid grid-cols-7 text-center text-[11px] font-medium text-[var(--text-muted)]">
            {WEEKDAYS.map((day) => (
              <span key={day} className="py-1">
                {day}
              </span>
            ))}
          </div>

          <div role="grid" className="grid grid-cols-7 gap-0.5">
            {cells.map((cell, idx) => {
              const isEndpoint =
                mode === "single"
                  ? cell.iso === value
                  : cell.iso === range.start || cell.iso === range.end;
              const inRange =
                mode === "range" && isDateInRange(cell.iso, range);

              return (
                <button
                  key={cell.iso}
                  ref={(el) => {
                    dayButtonsRef.current[idx] = el;
                  }}
                  type="button"
                  tabIndex={idx === focusedIndex ? 0 : -1}
                  aria-label={formatDisplayDate(cell.iso)}
                  aria-pressed={isEndpoint}
                  onClick={() => handleSelectIso(cell.iso)}
                  onKeyDown={(e) => handleGridKeyDown(e, idx)}
                  className={cn(
                    "relative flex h-8 w-full items-center justify-center rounded-md text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
                    !cell.inCurrentMonth &&
                      "text-[var(--text-muted)] opacity-50",
                    cell.inCurrentMonth &&
                      !isEndpoint &&
                      "text-[var(--text-primary)]",
                    inRange &&
                      !isEndpoint &&
                      "bg-[var(--accent-soft)] text-[var(--accent)]",
                    isEndpoint &&
                      "bg-[var(--accent)] font-semibold text-[var(--accent-fg)]",
                    !isEndpoint && "hover:bg-[var(--bg-elevated)]",
                    cell.isToday &&
                      !isEndpoint &&
                      "ring-1 ring-inset ring-[var(--accent)]",
                  )}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
