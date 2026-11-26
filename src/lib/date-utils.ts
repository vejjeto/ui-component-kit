export interface DateRange {
  start: string | null;
  end: string | null;
}

export interface CalendarCell {
  iso: string;
  day: number;
  inCurrentMonth: boolean;
  isToday: boolean;
}

const SHORT_MONTHS = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

const FULL_MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

function pad2(value: number): string {
  return value < 10 ? `0${value}` : String(value);
}

/** Format year, zero-based month, and day into `YYYY-MM-DD`. */
export function toISODate(
  year: number,
  monthZeroBased: number,
  day: number,
): string {
  const normalized = new Date(Date.UTC(year, monthZeroBased, day));
  return `${normalized.getUTCFullYear()}-${pad2(normalized.getUTCMonth() + 1)}-${pad2(normalized.getUTCDate())}`;
}

/** Parse a strict `YYYY-MM-DD` string into `{ year, month, day }` (zero-based month) or null. */
export function parseISODate(
  iso: string | null | undefined,
): { year: number; month: number; day: number } | null {
  if (!iso) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const probe = new Date(Date.UTC(year, month, day));

  if (
    probe.getUTCFullYear() !== year ||
    probe.getUTCMonth() !== month ||
    probe.getUTCDate() !== day
  ) {
    return null;
  }

  return { year, month, day };
}

/** Format an ISO date into a compact human label like `25 Nov 2026`. */
export function formatDisplayDate(iso: string | null | undefined): string {
  const parsed = parseISODate(iso);
  if (!parsed) return "";
  return `${parsed.day} ${SHORT_MONTHS[parsed.month]} ${parsed.year}`;
}

/** Return the full month and year header label (e.g. `Noviembre 2026`). */
export function formatMonthYear(year: number, monthZeroBased: number): string {
  const safeMonth = ((monthZeroBased % 12) + 12) % 12;
  return `${FULL_MONTHS[safeMonth]} ${year}`;
}

/** Step forward or backward by `deltaMonths`, handling year boundaries cleanly. */
export function shiftMonth(
  year: number,
  monthZeroBased: number,
  deltaMonths: number,
): { year: number; month: number } {
  const d = new Date(Date.UTC(year, monthZeroBased + deltaMonths, 1));
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() };
}

/** Build a 42-cell (6x7 Monday-first) calendar matrix for the given year and zero-based month. */
export function getCalendarDays(
  year: number,
  monthZeroBased: number,
  todayISO?: string,
): CalendarCell[] {
  const today =
    todayISO ??
    (() => {
      const now = new Date();
      return toISODate(now.getFullYear(), now.getMonth(), now.getDate());
    })();

  const firstOfMonth = new Date(Date.UTC(year, monthZeroBased, 1));
  // Convert JS Sunday=0..Saturday=6 into Monday=0..Sunday=6
  const mondayOffset = (firstOfMonth.getUTCDay() + 6) % 7;
  const startDay = 1 - mondayOffset;

  const cells: CalendarCell[] = [];
  for (let i = 0; i < 42; i++) {
    const probe = new Date(Date.UTC(year, monthZeroBased, startDay + i));
    const cellYear = probe.getUTCFullYear();
    const cellMonth = probe.getUTCMonth();
    const cellDay = probe.getUTCDate();
    const iso = toISODate(cellYear, cellMonth, cellDay);

    cells.push({
      iso,
      day: cellDay,
      inCurrentMonth: cellYear === year && cellMonth === monthZeroBased,
      isToday: iso === today,
    });
  }

  return cells;
}

/** Ensure `start <= end` when both endpoints exist. */
export function normalizeDateRange(range: DateRange): DateRange {
  if (range.start && range.end && range.start > range.end) {
    return { start: range.end, end: range.start };
  }
  return range;
}

/** Check whether `iso` falls strictly inside `(start, end)` or matches an endpoint. */
export function isDateInRange(iso: string, range: DateRange): boolean {
  const normalized = normalizeDateRange(range);
  if (!normalized.start) return false;
  if (!normalized.end) return iso === normalized.start;
  return iso >= normalized.start && iso <= normalized.end;
}
