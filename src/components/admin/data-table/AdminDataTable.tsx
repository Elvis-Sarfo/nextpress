'use client';

import { useMemo, useState, type ReactNode } from 'react';
import {
  type Column,
  type Table as TanStackTable,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnFiltersState,
  type OnChangeFn,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
} from '@tanstack/react-table';
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Filter,
  Loader2,
  Search,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { AdminTableColumn } from './types';

interface AdminDataTableProps<Row extends object> {
  rows: Row[];
  columns: AdminTableColumn<Row>[];
  rowKey: (row: Row) => string;
  loading?: boolean;
  error?: string | null;
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  columnFilters: ColumnFiltersState;
  onColumnFiltersChange: OnChangeFn<ColumnFiltersState>;
  rowSelection: RowSelectionState;
  onRowSelectionChange: OnChangeFn<RowSelectionState>;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  renderActions?: (row: Row) => ReactNode;
  toolbar?: ReactNode;
  emptyMessage?: string;
  totalPages?: number;
  total?: number;
}

function getVisiblePages(page: number, totalPages: number): Array<number | 'ellipsis'> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (page <= 4) return [1, 2, 3, 4, 5, 'ellipsis', totalPages];
  if (page >= totalPages - 3) {
    return [1, 'ellipsis', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, 'ellipsis', page - 1, page, page + 1, 'ellipsis', totalPages];
}

function getColumnOptionValues<Row extends object>(
  table: TanStackTable<Row>,
  column: Column<Row, unknown>
): string[] {
  const values = new Set<string>();

  for (const row of table.getCoreRowModel().rows) {
    const rawValue = row.getValue(column.id);
    if (rawValue === null || rawValue === undefined) continue;

    if (Array.isArray(rawValue)) {
      for (const item of rawValue) {
        const text = String(item).trim();
        if (text) values.add(text);
      }
      continue;
    }

    const text = String(rawValue).trim();
    if (text) values.add(text);
  }

  const currentValue = column.getFilterValue();
  if (typeof currentValue === 'string' && currentValue.trim()) {
    values.add(currentValue.trim());
  }

  return Array.from(values).sort((a, b) => a.localeCompare(b));
}

function ColumnFilterDropdown<Row extends object>({
  table,
  column,
}: {
  table: TanStackTable<Row>;
  column: Column<Row, unknown>;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const currentValue = (column.getFilterValue() as string | undefined) ?? '';

  const options = useMemo(() => getColumnOptionValues(table, column), [table, column, table.getState().pagination, table.getState().rowSelection]);
  const filteredOptions = useMemo(
    () => options.filter((option) => option.toLowerCase().includes(query.trim().toLowerCase())),
    [options, query]
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            'inline-flex h-6 w-6 items-center justify-center rounded-md border transition-colors',
            currentValue
              ? 'border-[#91caff] bg-[#e6f4ff] text-[#1677ff]'
              : 'border-transparent text-[#98a2b3] hover:border-[#d9d9d9] hover:bg-white hover:text-[#1677ff]'
          )}
          aria-label={`Filter ${String(column.columnDef.header ?? column.id)}`}
        >
          <Filter className="h-3.5 w-3.5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72 rounded-xl border border-[#e4e7ec] p-0 shadow-[0_12px_32px_rgba(16,24,40,0.14)]">
        <div className="border-b border-[#f2f4f7] p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-[#101828]">
              Filter {String(column.columnDef.header ?? column.id)}
            </p>
            {currentValue ? (
              <button
                type="button"
                className="inline-flex items-center gap-1 text-xs font-medium text-[#1677ff]"
                onClick={() => {
                  column.setFilterValue('');
                  setQuery('');
                }}
              >
                <X className="h-3 w-3" />
                Clear
              </button>
            ) : null}
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98a2b3]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search options"
              className="h-9 w-full rounded-lg border border-[#d0d5dd] bg-white pl-9 pr-3 text-sm text-[#101828] outline-none transition-colors placeholder:text-[#98a2b3] focus:border-[#4096ff]"
            />
          </div>
        </div>
        <div className="max-h-64 overflow-auto p-2">
          {filteredOptions.length === 0 ? (
            <div className="px-2 py-6 text-center text-sm text-[#98a2b3]">No matching values</div>
          ) : (
            <div className="space-y-1">
              {filteredOptions.map((option) => {
                const selected = option === currentValue;
                return (
                  <button
                    key={option}
                    type="button"
                    className={cn(
                      'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors',
                      selected
                        ? 'bg-[#e6f4ff] text-[#1677ff]'
                        : 'text-[#344054] hover:bg-[#f9fafb]'
                    )}
                    onClick={() => {
                      column.setFilterValue(selected ? '' : option);
                      setOpen(false);
                      setQuery('');
                    }}
                  >
                    <span className="truncate">{option}</span>
                    {selected ? <Check className="h-4 w-4 shrink-0" /> : null}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AdminDataTable<Row extends object>({
  rows,
  columns,
  rowKey,
  loading = false,
  error,
  sorting,
  onSortingChange,
  columnFilters,
  onColumnFiltersChange,
  rowSelection,
  onRowSelectionChange,
  pagination,
  onPaginationChange,
  renderActions,
  toolbar,
  emptyMessage = 'No records found.',
  totalPages = 1,
  total = 0,
}: AdminDataTableProps<Row>) {
  const hasActions = Boolean(renderActions);

  const selectionColumn: AdminTableColumn<Row> = {
    id: '__select__',
    header: ({ table }) => (
      <input
        type="checkbox"
        aria-label="Select all"
        checked={table.getIsAllPageRowsSelected()}
        ref={(element) => {
          if (element) element.indeterminate = table.getIsSomePageRowsSelected();
        }}
        onChange={table.getToggleAllPageRowsSelectedHandler()}
        className="h-4 w-4 rounded border-[#d9d9d9] text-[#1677ff] accent-[#1677ff]"
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onChange={row.getToggleSelectedHandler()}
        className="h-4 w-4 rounded border-[#d9d9d9] text-[#1677ff] accent-[#1677ff]"
        aria-label={`Select ${row.id}`}
      />
    ),
    enableSorting: false,
    enableColumnFilter: false,
    enableHiding: false,
    meta: { headerClassName: 'w-10', cellClassName: 'w-10' },
  };

  const actionsColumn: AdminTableColumn<Row> | null = hasActions
    ? {
        id: '__actions__',
        header: 'Actions',
        cell: ({ row }) => renderActions?.(row.original),
        enableSorting: false,
        enableColumnFilter: false,
        enableHiding: false,
        meta: {
          headerClassName: 'text-right',
          cellClassName: 'text-right',
        },
      }
    : null;

  const tableColumns = [selectionColumn, ...columns, ...(actionsColumn ? [actionsColumn] : [])];

  const table = useReactTable({
    data: rows,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: rowKey,
    enableRowSelection: true,
    manualSorting: true,
    manualFiltering: true,
    manualPagination: true,
    pageCount: totalPages,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      pagination,
    },
    onSortingChange,
    onColumnFiltersChange,
    onRowSelectionChange,
    onPaginationChange,
  });

  const dataColumns = table
    .getAllLeafColumns()
    .filter((column) => !['__select__', '__actions__'].includes(column.id));
  const page = pagination.pageIndex + 1;
  const pageItems = getVisiblePages(page, totalPages);

  return (
    <div className="space-y-4">
      {toolbar}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-[#f0f0f0] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-separate border-spacing-0">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-[#fafafa]">
                  {headerGroup.headers.map((header) => {
                    const meta = header.column.columnDef.meta;
                    const canSort = header.column.getCanSort();
                    const isSorted = header.column.getIsSorted();

                    return (
                      <th
                        key={header.id}
                        className={cn(
                          'border-b border-r border-[#f0f0f0] px-4 py-3 text-left text-[13px] font-semibold text-[#667085] last:border-r-0',
                          meta?.headerClassName
                        )}
                      >
                        {header.isPlaceholder ? null : canSort ? (
                          <div className="flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={header.column.getToggleSortingHandler()}
                              className="inline-flex items-center gap-2 text-left transition-colors hover:text-[#1677ff]"
                            >
                              <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                              <span className="flex flex-col leading-none">
                                <ChevronUp
                                  className={cn(
                                    'h-3 w-3',
                                    isSorted === 'asc' ? 'text-[#1677ff]' : 'text-[#bfbfbf]'
                                  )}
                                />
                                <ChevronDown
                                  className={cn(
                                    '-mt-1 h-3 w-3',
                                    isSorted === 'desc' ? 'text-[#1677ff]' : 'text-[#bfbfbf]'
                                  )}
                                />
                              </span>
                            </button>
                            {header.column.columnDef.meta?.filterable ? (
                              <ColumnFilterDropdown table={table} column={header.column} />
                            ) : null}
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-2">
                            <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                            {header.column.columnDef.meta?.filterable ? (
                              <ColumnFilterDropdown table={table} column={header.column} />
                            ) : null}
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={tableColumns.length} className="px-4 py-16 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#1677ff]" />
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={tableColumns.length} className="px-4 py-16 text-center text-sm text-[#98a2b3]">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-[#fafafa]">
                    {row.getVisibleCells().map((cell) => {
                      const meta = cell.column.columnDef.meta;
                      return (
                        <td
                          key={cell.id}
                          className={cn(
                            'border-b border-r border-[#f0f0f0] px-1 py-0 text-sm text-[#1f2937] last:border-r-0',
                            meta?.cellClassName
                          )}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#667085]">Total {total} items</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#d9d9d9] bg-white text-[#344054] transition-colors hover:border-[#4096ff] hover:text-[#1677ff] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {pageItems.map((item, index) =>
            item === 'ellipsis' ? (
              <span key={`ellipsis-${index}`} className="px-1 text-sm text-[#98a2b3]">
                ...
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => table.setPageIndex(item - 1)}
                className={cn(
                  'inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-sm transition-colors',
                  item === page
                    ? 'border-[#1677ff] bg-[#e6f4ff] text-[#1677ff]'
                    : 'border-[#d9d9d9] bg-white text-[#344054] hover:border-[#4096ff] hover:text-[#1677ff]'
                )}
                aria-current={item === page ? 'page' : undefined}
              >
                {item}
              </button>
            )
          )}
          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#d9d9d9] bg-white text-[#344054] transition-colors hover:border-[#4096ff] hover:text-[#1677ff] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <span className="ml-2 text-sm text-[#667085]">
            {page} / {totalPages}
          </span>
        </div>
      </div>
    </div>
  );
}
