export type SortDirection = "asc" | "desc";

export interface SortState<K extends string = string> {
  key: K;
  direction: SortDirection;
}

export interface TableQueryOptions<T, K extends string = string> {
  search?: string;
  searchKeys?: Array<keyof T>;
  sort?: SortState<K> | null;
  sortAccessor?: (
    row: T,
    key: K,
  ) => string | number | boolean | null | undefined;
  page?: number;
  pageSize?: number;
}

export interface TableQueryResult<T> {
  rows: T[];
  totalRows: number;
  totalPages: number;
  page: number;
  pageSize: number;
}

function compareValues(
  a: string | number | boolean | null | undefined,
  b: string | number | boolean | null | undefined,
): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;

  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }
  if (typeof a === "boolean" && typeof b === "boolean") {
    return Number(a) - Number(b);
  }
  return String(a).localeCompare(String(b), undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

/** Filter rows case-insensitively across `searchKeys` (or all primitive values if omitted). */
export function filterRows<T extends Record<string, unknown>>(
  rows: readonly T[],
  search: string,
  searchKeys?: Array<keyof T>,
): T[] {
  const q = search.trim().toLowerCase();
  if (!q) return [...rows];

  return rows.filter((row) => {
    const keys =
      searchKeys && searchKeys.length > 0
        ? searchKeys
        : (Object.keys(row) as Array<keyof T>);
    return keys.some((key) => {
      const value = row[key];
      if (value == null) return false;
      return String(value).toLowerCase().includes(q);
    });
  });
}

/** Sort rows immutably by column key and direction. */
export function sortRows<
  T extends Record<string, unknown>,
  K extends string = string,
>(
  rows: readonly T[],
  sort: SortState<K> | null | undefined,
  accessor?: (row: T, key: K) => string | number | boolean | null | undefined,
): T[] {
  if (!sort) return [...rows];

  const factor = sort.direction === "asc" ? 1 : -1;
  const copy = [...rows];
  copy.sort((a, b) => {
    const valA = accessor
      ? accessor(a, sort.key)
      : (a[sort.key as keyof T] as
          | string
          | number
          | boolean
          | null
          | undefined);
    const valB = accessor
      ? accessor(b, sort.key)
      : (b[sort.key as keyof T] as
          | string
          | number
          | boolean
          | null
          | undefined);
    return compareValues(valA, valB) * factor;
  });
  return copy;
}

/** Slice rows to a valid 1-based page window. */
export function paginateRows<T>(
  rows: readonly T[],
  page: number,
  pageSize: number,
): TableQueryResult<T> {
  const safeSize = Math.max(1, Math.floor(pageSize));
  const totalRows = rows.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / safeSize));
  const safePage = Math.min(Math.max(1, Math.floor(page)), totalPages);
  const start = (safePage - 1) * safeSize;

  return {
    rows: rows.slice(start, start + safeSize),
    totalRows,
    totalPages,
    page: safePage,
    pageSize: safeSize,
  };
}

/** Run filter -> sort -> paginate pipeline in one deterministic pass. */
export function processTableData<
  T extends Record<string, unknown>,
  K extends string = string,
>(rows: readonly T[], options: TableQueryOptions<T, K>): TableQueryResult<T> {
  const filtered = filterRows(rows, options.search ?? "", options.searchKeys);
  const sorted = sortRows(filtered, options.sort, options.sortAccessor);
  return paginateRows(sorted, options.page ?? 1, options.pageSize ?? 10);
}
