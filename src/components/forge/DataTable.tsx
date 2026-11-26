"use client";

import { cn } from "@/lib/cn";
import {
  type ColumnDef,
  type PaginationState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import * as React from "react";

export interface DataTableColumn<T extends Record<string, unknown>> {
  key: Extract<keyof T, string>;
  header: string;
  sortable?: boolean;
  align?: "left" | "right";
  render?: (row: T) => React.ReactNode;
}

export interface DataTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: DataTableColumn<T>[];
  rowKey: (row: T) => string;
  searchable?: boolean;
  searchPlaceholder?: string;
  pageSize?: number;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  rowKey,
  searchable = true,
  searchPlaceholder = "Buscar en tabla...",
  pageSize = 5,
  loading = false,
  emptyMessage = "No hay registros que coincidan con el filtro.",
  className,
}: DataTableProps<T>): React.ReactElement {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  React.useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0, pageSize }));
  }, [pageSize]);

  const columnDefs = React.useMemo<ColumnDef<T>[]>(
    () =>
      columns.map((col) => ({
        id: col.key,
        accessorFn: (row) => row[col.key],
        header: col.header,
        enableSorting: Boolean(col.sortable),
        enableGlobalFilter: true,
        meta: {
          align: col.align ?? "left",
        },
        cell: (info) =>
          col.render
            ? col.render(info.row.original)
            : String(info.getValue() ?? ""),
      })),
    [columns],
  );

  const table = useReactTable({
    data,
    columns: columnDefs,
    getRowId: (row) => rowKey(row),
    state: {
      sorting,
      globalFilter,
      pagination,
    },
    onSortingChange: (updater) => {
      setSorting(updater);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    },
    onGlobalFilterChange: (updater) => {
      setGlobalFilter(updater);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const totalRows = table.getFilteredRowModel().rows.length;
  const totalPages = Math.max(1, table.getPageCount());
  const currentPage = Math.min(
    table.getState().pagination.pageIndex + 1,
    totalPages,
  );
  const visibleRows = table.getRowModel().rows;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {searchable ? (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex h-9 w-full max-w-xs items-center gap-2 rounded-[var(--radius-ui)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 focus-within:ring-2 focus-within:ring-[var(--ring)]">
            <Search
              className="h-4 w-4 text-[var(--text-muted)]"
              aria-hidden="true"
            />
            <input
              type="search"
              value={globalFilter}
              onChange={(e) => table.setGlobalFilter(e.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="h-full w-full bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
            />
          </div>
          <span className="text-xs text-[var(--text-muted)]">
            {totalRows} {totalRows === 1 ? "registro" : "registros"}
          </span>
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-[var(--radius-ui)] border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]"
              >
                {headerGroup.headers.map((header) => {
                  const colMeta = header.column.columnDef.meta as
                    | { align?: "left" | "right" }
                    | undefined;
                  const align = colMeta?.align ?? "left";
                  const canSort = header.column.getCanSort();
                  const sortDir = header.column.getIsSorted();
                  const ariaSort =
                    sortDir === "asc"
                      ? "ascending"
                      : sortDir === "desc"
                        ? "descending"
                        : "none";

                  return (
                    <th
                      key={header.id}
                      scope="col"
                      aria-sort={canSort ? ariaSort : undefined}
                      className={cn(
                        "px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]",
                        align === "right" && "text-right",
                      )}
                    >
                      {canSort ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded px-1 py-0.5 transition-colors hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
                            align === "right" && "flex-row-reverse",
                          )}
                        >
                          <span>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                          </span>
                          {sortDir === "asc" ? (
                            <ArrowUp className="h-3.5 w-3.5 text-[var(--accent)]" />
                          ) : sortDir === "desc" ? (
                            <ArrowDown className="h-3.5 w-3.5 text-[var(--accent)]" />
                          ) : (
                            <ArrowUpDown className="h-3.5 w-3.5 opacity-45" />
                          )}
                        </button>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-[var(--border-subtle)]">
            {loading ? (
              Array.from({ length: Math.min(pageSize, 4) }).map((_, rowIdx) => (
                <tr key={`skeleton-${rowIdx}`}>
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <div className="forge-skeleton h-4 w-4/5 rounded bg-[var(--bg-elevated)]" />
                    </td>
                  ))}
                </tr>
              ))
            ) : visibleRows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-sm text-[var(--text-muted)]"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              visibleRows.map((row) => (
                <tr
                  key={row.id}
                  className="transition-colors hover:bg-[var(--bg-elevated)]/60"
                >
                  {row.getVisibleCells().map((cell) => {
                    const colMeta = cell.column.columnDef.meta as
                      | { align?: "left" | "right" }
                      | undefined;
                    const align = colMeta?.align ?? "left";
                    return (
                      <td
                        key={cell.id}
                        className={cn(
                          "px-4 py-3 text-[var(--text-primary)]",
                          align === "right" && "text-right",
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && totalPages > 1 ? (
        <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
              aria-label="Página anterior"
              className="inline-flex h-8 items-center gap-1 rounded-[var(--radius-ui)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 font-medium text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] disabled:pointer-events-none disabled:opacity-45"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Anterior
            </button>
            <button
              type="button"
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
              aria-label="Página siguiente"
              className="inline-flex h-8 items-center gap-1 rounded-[var(--radius-ui)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 font-medium text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] disabled:pointer-events-none disabled:opacity-45"
            >
              Siguiente
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
