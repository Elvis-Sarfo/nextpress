'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  functionalUpdate,
  type ColumnFiltersState,
  type OnChangeFn,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
} from '@tanstack/react-table';
import type { CollectionMeta } from '@/lib/collections-data';

type Doc = Record<string, unknown>;
type SortDir = 'asc' | 'desc';

interface UseCollectionTableArgs {
  collection: CollectionMeta;
  initialSortField?: string;
  initialSortDir?: SortDir;
}

export function useCollectionTable({
  collection,
  initialSortField = 'createdAt',
  initialSortDir = 'desc',
}: UseCollectionTableArgs) {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQueryState] = useState('');
  const [sorting, setSorting] = useState<SortingState>([
    { id: initialSortField, desc: initialSortDir === 'desc' },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const page = pagination.pageIndex + 1;
  const pageSize = pagination.pageSize;
  const sortField = sorting[0]?.id ?? initialSortField;
  const sortDir: SortDir = sorting[0]?.desc ? 'desc' : 'asc';

  const filterMap = useMemo(
    () =>
      Object.fromEntries(
        columnFilters
          .filter((filter) => typeof filter.id === 'string' && typeof filter.value === 'string' && filter.value.trim())
          .map((filter) => [String(filter.id), String(filter.value).trim()])
      ),
    [columnFilters]
  );

  const selectedIds = useMemo(
    () =>
      new Set(
        Object.entries(rowSelection)
          .filter(([, selected]) => Boolean(selected))
          .map(([id]) => id)
      ),
    [rowSelection]
  );

  const fetchDocs = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(pageSize),
        sortField,
        sortDir,
        ...(searchQuery ? { search: searchQuery } : {}),
        ...(Object.keys(filterMap).length > 0 ? { filters: JSON.stringify(filterMap) } : {}),
      });
      const res = await fetch(`/api/admin/collections/${collection.slug}?${params}`);
      if (res.ok) {
        const data = await res.json();
        setDocs(data.docs ?? []);
        setTotal(data.total ?? 0);
      } else if (res.status === 401) {
        setFetchError('Not authenticated. Please sign in again.');
      } else if (res.status === 403) {
        setFetchError('You do not have permission to view this collection.');
      } else {
        const data = await res.json().catch(() => ({}));
        setFetchError(data.error ?? `Error loading data (${res.status})`);
      }
    } catch (e) {
      console.error('Failed to fetch documents', e);
      setFetchError('Network error — could not reach the server.');
    } finally {
      setIsLoading(false);
    }
  }, [collection.slug, page, pageSize, searchQuery, sortField, sortDir, filterMap]);

  useEffect(() => {
    const timeout = setTimeout(fetchDocs, 250);
    return () => clearTimeout(timeout);
  }, [fetchDocs]);

  useEffect(() => {
    setRowSelection({});
  }, [page, pageSize, searchQuery, sorting, columnFilters]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const setPage = useCallback((updater: number | ((currentPage: number) => number)) => {
    setPagination((prev) => {
      const currentPage = prev.pageIndex + 1;
      const nextPage = typeof updater === 'function' ? updater(currentPage) : updater;
      return { ...prev, pageIndex: Math.max(0, nextPage - 1) };
    });
  }, []);

  const setPageSize = useCallback((value: number) => {
    setPagination((prev) => ({ pageIndex: 0, pageSize: value }));
  }, []);

  const setSearchQuery = useCallback((value: string) => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    setSearchQueryState(value);
  }, []);

  const onSortingChange = useCallback<OnChangeFn<SortingState>>((updater) => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    setSorting((prev) => {
      const next = functionalUpdate(updater, prev);
      return next.slice(0, 1);
    });
  }, []);

  const onColumnFiltersChange = useCallback<OnChangeFn<ColumnFiltersState>>((updater) => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    setColumnFilters((prev) =>
      functionalUpdate(updater, prev).filter(
        (filter) => typeof filter.value === 'string' && filter.value.trim().length > 0
      )
    );
  }, []);

  const onPaginationChange = useCallback<OnChangeFn<PaginationState>>((updater) => {
    setPagination((prev) => functionalUpdate(updater, prev));
  }, []);

  const onRowSelectionChange = useCallback<OnChangeFn<RowSelectionState>>((updater) => {
    setRowSelection((prev) => functionalUpdate(updater, prev));
  }, []);

  const clearColumnFilters = useCallback(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    setColumnFilters([]);
  }, []);

  return {
    docs,
    total,
    totalPages,
    page,
    pageSize,
    searchQuery,
    sortField,
    sortDir,
    filterMap,
    sorting,
    columnFilters,
    pagination,
    rowSelection,
    selectedIds,
    isLoading,
    fetchError,
    fetchDocs,
    setPage,
    setPageSize,
    setSearchQuery,
    setRowSelection,
    onSortingChange,
    onColumnFiltersChange,
    onPaginationChange,
    onRowSelectionChange,
    clearColumnFilters,
  };
}
