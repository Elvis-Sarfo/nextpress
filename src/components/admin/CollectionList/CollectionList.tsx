'use client';

/**
 * Collection List Component — fetches data from the admin API and displays it
 * in a sortable, searchable table.
 */

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  ArrowUpDown,
  Pencil,
  Trash2,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CollectionMeta } from '@/lib/collections-data';

interface CollectionListProps {
  collection: CollectionMeta;
}

type Doc = Record<string, unknown>;

export function CollectionList({ collection }: CollectionListProps) {
  const router = useRouter();
  const [docs, setDocs] = useState<Doc[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const limit = 20;
  const columns = collection.admin.defaultColumns ?? ['id', 'createdAt'];
  const displayFields = columns
    .map((col) => collection.fields.find((f) => f.name === col))
    .filter(Boolean) as CollectionMeta['fields'];

  const fetchDocs = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(searchQuery ? { search: searchQuery } : {}),
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
  }, [collection.slug, page, searchQuery]);

  useEffect(() => {
    const t = setTimeout(fetchDocs, 300);
    return () => clearTimeout(t);
  }, [fetchDocs]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this document? This cannot be undone.')) return;
    setDeleteId(id);
    try {
      const res = await fetch(`/api/admin/collections/${collection.slug}/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchDocs();
      } else {
        const data = await res.json();
        alert(data.error ?? 'Delete failed');
      }
    } finally {
      setDeleteId(null);
    }
  };

  const formatCellValue = (field: CollectionMeta['fields'][0], doc: Doc): string => {
    const val = doc[field.name];
    if (val === null || val === undefined) return '—';
    if (Array.isArray(val)) {
      return (
        val
          .map((v: unknown) => {
            const item = v as Record<string, unknown>;
            return item.displayName ?? item.name ?? item.email ?? item.id ?? String(v);
          })
          .join(', ') || '—'
      );
    }
    if (typeof val === 'boolean') return val ? 'Yes' : 'No';
    if (field.name.endsWith('At')) {
      return new Date(val as string).toLocaleDateString();
    }
    return String(val);
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{collection.labels.plural}</h1>
          <p className="text-muted-foreground mt-1">
            {total}{' '}
            {total === 1
              ? collection.labels.singular.toLowerCase()
              : collection.labels.plural.toLowerCase()}{' '}
            total
          </p>
        </div>
        <Link href={`/admin/${collection.slug}/new`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add {collection.labels.singular}
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder={`Search ${collection.labels.plural.toLowerCase()}...`}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
          className="w-full pl-9 pr-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Error */}
      {fetchError && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {fetchError}
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                {displayFields.map((field) => (
                  <th
                    key={field.name}
                    className="px-4 py-3 text-left text-sm font-medium text-muted-foreground"
                  >
                    <span className="flex items-center gap-1">
                      {field.label || field.name}
                      <ArrowUpDown className="h-3 w-3" />
                    </span>
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={displayFields.length + 1} className="px-4 py-12 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  </td>
                </tr>
              ) : docs.length === 0 ? (
                <tr>
                  <td colSpan={displayFields.length + 1} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-muted-foreground">
                        No {collection.labels.plural.toLowerCase()} found
                      </p>
                      <Link href={`/admin/${collection.slug}/new`}>
                        <Button variant="outline" size="sm">
                          <Plus className="mr-2 h-4 w-4" />
                          Create your first {collection.labels.singular.toLowerCase()}
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                docs.map((doc) => (
                  <tr
                    key={doc.id as string}
                    className="border-b hover:bg-muted/30 transition-colors"
                  >
                    {displayFields.map((field) => (
                      <td key={field.name} className="px-4 py-3 text-sm">
                        {formatCellValue(field, doc)}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            router.push(`/admin/${collection.slug}/${doc.id}`)
                          }
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(doc.id as string)}
                          disabled={deleteId === doc.id}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          title="Delete"
                        >
                          {deleteId === (doc.id as string) ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page {page} of {totalPages} — {total} total
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
