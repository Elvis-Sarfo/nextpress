'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  PencilLine,
  Pencil,
  Trash2,
  Loader2,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  X,
  Upload,
  Download,
  FileSpreadsheet,
  Maximize2,
  Minimize2,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminLocale } from '@/components/providers/AdminLocaleProvider';
import type { CollectionMeta, CollectionFieldMeta } from '@/lib/collections-data';
import { cn } from '@/lib/utils';
import { CollectionEdit } from '@/components/admin/CollectionEdit';

interface CollectionListProps {
  collection: CollectionMeta;
}

type Doc = Record<string, unknown>;
type SortDir = 'asc' | 'desc';
type ImportMode = 'skip' | 'update';
type EditorIntent = 'create' | 'edit';

const IGNORED_COLUMN = '__ignore__';

function labelFor(field: CollectionFieldMeta): string {
  return field.label || field.name;
}

function normalizeHeader(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function csvEscape(input: unknown): string {
  const text = String(input ?? '');
  if (text.includes(',') || text.includes('"') || text.includes('\n')) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function parseDelimited(text: string, delimiter = ','): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        value += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === delimiter && !inQuotes) {
      row.push(value.trim());
      value = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') i += 1;
      row.push(value.trim());
      rows.push(row);
      row = [];
      value = '';
      continue;
    }

    value += char;
  }

  if (value.length > 0 || row.length > 0) {
    row.push(value.trim());
    rows.push(row);
  }

  return rows.filter((r) => r.some((cell) => cell.length > 0));
}

function parseExcelLikeText(text: string): string[][] {
  const parser = new DOMParser();

  if (/<table/i.test(text)) {
    const doc = parser.parseFromString(text, 'text/html');
    const rows = Array.from(doc.querySelectorAll('tr')).map((tr) =>
      Array.from(tr.querySelectorAll('th,td')).map((cell) =>
        (cell.textContent || '').trim()
      )
    );
    return rows.filter((r) => r.some((cell) => cell.length > 0));
  }

  if (/<Worksheet/i.test(text)) {
    const doc = parser.parseFromString(text, 'application/xml');
    const rowEls = Array.from(doc.querySelectorAll('Row'));
    const rows = rowEls.map((rowEl) =>
      Array.from(rowEl.querySelectorAll('Cell')).map((cellEl) => {
        const dataEl = cellEl.querySelector('Data');
        return (dataEl?.textContent || '').trim();
      })
    );
    return rows.filter((r) => r.some((cell) => cell.length > 0));
  }

  return parseDelimited(text, '\t');
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function CollectionList({ collection }: CollectionListProps) {
  const router = useRouter();
  const { locale } = useAdminLocale();

  const [docs, setDocs] = useState<Doc[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editorIntent, setEditorIntent] = useState<EditorIntent>('create');
  const [editorDocId, setEditorDocId] = useState<string | null>(null);
  const [editorExpanded, setEditorExpanded] = useState(false);

  const [importOpen, setImportOpen] = useState(false);
  const [importHeaders, setImportHeaders] = useState<string[]>([]);
  const [importRows, setImportRows] = useState<Record<string, string>[]>([]);
  const [importMapping, setImportMapping] = useState<Record<string, string>>({});
  const [importMode, setImportMode] = useState<ImportMode>('skip');
  const [importDuplicateField, setImportDuplicateField] = useState<string>('id');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const [exportOpen, setExportOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'xls' | 'json'>('csv');
  const [exportColumns, setExportColumns] = useState<Set<string>>(new Set());
  const [exportSearch, setExportSearch] = useState('');
  const [exportFilters, setExportFilters] = useState<Record<string, string>>({});
  const [isExporting, setIsExporting] = useState(false);

  const editorView = collection.admin.editorView ?? 'slider';
  const useInlineEditor = editorView !== 'page';

  const columns = collection.admin.defaultColumns ?? ['id', 'createdAt'];
  const displayFields = useMemo(
    () =>
      columns
        .map((col) => collection.fields.find((f) => f.name === col))
        .filter(Boolean) as CollectionFieldMeta[],
    [collection.fields, columns]
  );

  const editableFields = useMemo(
    () => collection.fields.filter((field) => !field.hidden),
    [collection.fields]
  );

  const filterableFields = useMemo(
    () => displayFields.filter((field) => ['text', 'email', 'textarea', 'select', 'date'].includes(field.type)),
    [displayFields]
  );

  const exportableFields = useMemo(() => {
    const set = new Map<string, CollectionFieldMeta>();
    for (const f of displayFields) set.set(f.name, f);
    for (const f of editableFields) set.set(f.name, f);
    return Array.from(set.values());
  }, [displayFields, editableFields]);

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
        ...(Object.keys(columnFilters).length > 0 ? { filters: JSON.stringify(columnFilters) } : {}),
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
  }, [collection.slug, page, pageSize, searchQuery, sortField, sortDir, columnFilters]);

  useEffect(() => {
    const t = setTimeout(fetchDocs, 250);
    return () => clearTimeout(t);
  }, [fetchDocs]);

  useEffect(() => {
    setSelectedIds(new Set());
  }, [page, searchQuery, pageSize, sortField, sortDir, columnFilters]);

  useEffect(() => {
    if (exportColumns.size === 0) {
      setExportColumns(new Set(exportableFields.map((f) => f.name)));
    }
  }, [exportColumns.size, exportableFields]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const formatCellValue = (field: CollectionFieldMeta, doc: Doc): string => {
    const val = doc[field.name];
    if (val === null || val === undefined) return '—';

    if (field.localized && typeof val === 'object' && !Array.isArray(val)) {
      const localeMap = val as Record<string, unknown>;
      const localeVal = localeMap[locale] ?? localeMap.en;
      if (localeVal === null || localeVal === undefined) return '—';
      if (typeof localeVal === 'object') return JSON.stringify(localeVal);
      return String(localeVal);
    }

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
    if (field.type === 'date' || field.name.endsWith('At')) {
      const dt = new Date(String(val));
      return Number.isNaN(dt.valueOf()) ? String(val) : dt.toLocaleDateString();
    }
    if (typeof val === 'object' && val !== null) {
      const item = val as Record<string, unknown>;
      return String(item.displayName ?? item.name ?? item.email ?? item.id ?? '—');
    }
    return String(val);
  };

  const convertTextToFieldValue = (field: CollectionFieldMeta, raw: string): unknown => {
    if (raw === '') return null;

    if (field.localized) {
      return { [locale]: raw };
    }

    switch (field.type) {
      case 'number': {
        const n = Number(raw);
        return Number.isNaN(n) ? null : n;
      }
      case 'checkbox':
        return ['true', '1', 'yes', 'y'].includes(raw.toLowerCase());
      case 'json': {
        try {
          return JSON.parse(raw);
        } catch {
          return raw;
        }
      }
      case 'relationship':
        return raw;
      default:
        return raw;
    }
  };

  const getComparable = (doc: Doc, fieldName: string): string => {
    const value = doc[fieldName];
    if (value === null || value === undefined) return '';
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return String(value).trim().toLowerCase();
    }
    if (Array.isArray(value)) {
      return value.map((item) => String(item)).join(',').toLowerCase();
    }
    if (typeof value === 'object') {
      const obj = value as Record<string, unknown>;
      if (obj.id) return String(obj.id).toLowerCase();
      if (obj[locale]) return String(obj[locale]).toLowerCase();
      if (obj.en) return String(obj.en).toLowerCase();
      return JSON.stringify(obj).toLowerCase();
    }
    return String(value).toLowerCase();
  };

  const openCreate = () => {
    if (!useInlineEditor) {
      router.push(`/admin/${collection.slug}/new`);
      return;
    }
    setEditorIntent('create');
    setEditorDocId(null);
    setEditorExpanded(false);
    setEditorOpen(true);
  };

  const openEdit = (id: string) => {
    if (!useInlineEditor) {
      router.push(`/admin/${collection.slug}/${id}`);
      return;
    }
    setEditorIntent('edit');
    setEditorDocId(id);
    setEditorExpanded(false);
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    setEditorDocId(null);
  };

  const openEditorInPage = () => {
    const href =
      editorIntent === 'edit' && editorDocId
        ? `/admin/${collection.slug}/${editorDocId}`
        : `/admin/${collection.slug}/new`;

    closeEditor();
    router.push(href);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this document? This cannot be undone.')) return;
    setDeleteId(id);
    try {
      const res = await fetch(`/api/admin/collections/${collection.slug}/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchDocs();
      } else {
        const data = await res.json();
        alert(data.error ?? 'Delete failed');
      }
    } finally {
      setDeleteId(null);
    }
  };

  const handleBulkDelete = async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    if (!confirm(`Delete ${ids.length} selected item${ids.length === 1 ? '' : 's'}? This cannot be undone.`)) return;
    setIsBulkDeleting(true);
    try {
      for (const id of ids) {
        await fetch(`/api/admin/collections/${collection.slug}/${id}`, { method: 'DELETE' });
      }
      setSelectedIds(new Set());
      await fetchDocs();
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    const allIds = docs.map((d) => String(d.id));
    const allSelected = allIds.every((id) => selectedIds.has(id));
    setSelectedIds(allSelected ? new Set() : new Set(allIds));
  };

  const toggleSort = (fieldName: string) => {
    setPage(1);
    if (sortField === fieldName) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(fieldName);
      setSortDir('asc');
    }
  };

  const handleImportFile = async (file: File) => {
    setImportError(null);
    setImportStatus(null);
    try {
      const text = await file.text();
      const ext = file.name.split('.').pop()?.toLowerCase() ?? '';

      let matrix: string[][] = [];
      if (ext === 'csv') {
        matrix = parseDelimited(text, ',');
      } else if (ext === 'xls' || ext === 'xlsx' || ext === 'xml' || ext === 'tsv') {
        matrix = parseExcelLikeText(text);
      } else {
        setImportError('Unsupported format. Use CSV or Excel-compatible text files.');
        return;
      }

      if (matrix.length < 2) {
        setImportError('File must include a header row and at least one data row.');
        return;
      }

      const [headers, ...rows] = matrix;
      const normalizedFields = new Map<string, string>();
      for (const field of editableFields) {
        normalizedFields.set(normalizeHeader(field.name), field.name);
        normalizedFields.set(normalizeHeader(labelFor(field)), field.name);
      }

      const autoMapping: Record<string, string> = {};
      for (const header of headers) {
        autoMapping[header] = normalizedFields.get(normalizeHeader(header)) ?? IGNORED_COLUMN;
      }

      const objects = rows.map((cells) => {
        const row: Record<string, string> = {};
        headers.forEach((header, idx) => {
          row[header] = (cells[idx] ?? '').trim();
        });
        return row;
      }).filter((row) => Object.values(row).some((value) => value !== ''));

      setImportHeaders(headers);
      setImportRows(objects);
      setImportMapping(autoMapping);
      setImportDuplicateField(editableFields[0]?.name ?? 'id');
      setImportStatus(`Loaded ${objects.length} rows from ${file.name}.`);
    } catch {
      setImportError('Failed to parse import file.');
    }
  };

  const runImport = async () => {
    setImportError(null);
    setImportStatus(null);

    const mappedColumns = Object.entries(importMapping).filter(([, target]) => target !== IGNORED_COLUMN);
    if (mappedColumns.length === 0) {
      setImportError('Map at least one source column to a collection field.');
      return;
    }

    const duplicateField = importDuplicateField;
    if (!duplicateField) {
      setImportError('Select a duplicate detection field.');
      return;
    }

    setIsImporting(true);
    try {
      const existing: Doc[] = [];
      let p = 1;
      const limit = 100;

      while (true) {
        const params = new URLSearchParams({ page: String(p), limit: String(limit) });
        const res = await fetch(`/api/admin/collections/${collection.slug}?${params}`);
        if (!res.ok) break;
        const data = await res.json();
        const batch = (data.docs ?? []) as Doc[];
        existing.push(...batch);
        if (batch.length < limit) break;
        p += 1;
      }

      const existingByKey = new Map<string, Doc>();
      for (const doc of existing) {
        const key = getComparable(doc, duplicateField);
        if (key) existingByKey.set(key, doc);
      }

      const seenInFile = new Set<string>();
      let created = 0;
      let updated = 0;
      let skipped = 0;
      let invalid = 0;

      for (const row of importRows) {
        const payload: Record<string, unknown> = {};

        for (const [sourceHeader, targetFieldName] of mappedColumns) {
          const field = editableFields.find((f) => f.name === targetFieldName);
          if (!field) continue;
          payload[targetFieldName] = convertTextToFieldValue(field, row[sourceHeader] ?? '');
        }

        const keyValue = getComparable(payload as Doc, duplicateField);
        if (!keyValue) {
          invalid += 1;
          continue;
        }

        if (seenInFile.has(keyValue)) {
          skipped += 1;
          continue;
        }
        seenInFile.add(keyValue);

        const duplicateDoc = existingByKey.get(keyValue);
        const hasRequiredError = editableFields.some((field) => {
          if (!field.required) return false;
          const value = payload[field.name];
          return value === null || value === undefined || value === '';
        });

        if (hasRequiredError) {
          invalid += 1;
          continue;
        }

        if (duplicateDoc && importMode === 'skip') {
          skipped += 1;
          continue;
        }

        if (duplicateDoc && importMode === 'update') {
          const res = await fetch(`/api/admin/collections/${collection.slug}/${String(duplicateDoc.id)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (res.ok) {
            updated += 1;
          } else {
            invalid += 1;
          }
          continue;
        }

        const res = await fetch(`/api/admin/collections/${collection.slug}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          created += 1;
        } else {
          invalid += 1;
        }
      }

      setImportStatus(`Import complete. Created ${created}, updated ${updated}, skipped ${skipped}, invalid ${invalid}.`);
      await fetchDocs();
    } catch {
      setImportError('Import failed due to a network or server error.');
    } finally {
      setIsImporting(false);
    }
  };

  const fetchAllForExport = async (): Promise<Doc[]> => {
    const all: Doc[] = [];
    let p = 1;
    const limit = 100;

    while (true) {
      const params = new URLSearchParams({
        page: String(p),
        limit: String(limit),
        sortField,
        sortDir,
        ...(exportSearch ? { search: exportSearch } : {}),
        ...(Object.keys(exportFilters).length > 0 ? { filters: JSON.stringify(exportFilters) } : {}),
      });
      const res = await fetch(`/api/admin/collections/${collection.slug}?${params}`);
      if (!res.ok) throw new Error('Failed to fetch export data');
      const data = await res.json();
      const batch = (data.docs ?? []) as Doc[];
      all.push(...batch);
      if (batch.length < limit) break;
      p += 1;
    }

    return all;
  };

  const executeExport = async () => {
    setIsExporting(true);
    try {
      const selected = exportableFields.filter((field) => exportColumns.has(field.name));
      if (selected.length === 0) {
        setIsExporting(false);
        return;
      }

      const rows = await fetchAllForExport();
      const serialized = rows.map((doc) => {
        const row: Record<string, unknown> = {};
        for (const field of selected) {
          row[field.name] = formatCellValue(field, doc);
        }
        return row;
      });

      const filenameBase = `${collection.slug}-export-${new Date().toISOString().slice(0, 10)}`;

      if (exportFormat === 'json') {
        const blob = new Blob([JSON.stringify(serialized, null, 2)], { type: 'application/json' });
        downloadBlob(blob, `${filenameBase}.json`);
      } else if (exportFormat === 'csv') {
        const headerLine = selected.map((field) => csvEscape(field.name)).join(',');
        const lines = serialized.map((row) => selected.map((field) => csvEscape(row[field.name] ?? '')).join(','));
        const csv = [headerLine, ...lines].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        downloadBlob(blob, `${filenameBase}.csv`);
      } else {
        const headers = selected.map((field) => `<th>${labelFor(field)}</th>`).join('');
        const bodyRows = serialized.map((row) => {
          const tds = selected
            .map((field) => `<td>${String(row[field.name] ?? '').replace(/</g, '&lt;')}</td>`)
            .join('');
          return `<tr>${tds}</tr>`;
        }).join('');
        const html = `<html><head><meta charset="utf-8" /></head><body><table><thead><tr>${headers}</tr></thead><tbody>${bodyRows}</tbody></table></body></html>`;
        const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
        downloadBlob(blob, `${filenameBase}.xls`);
      }
    } catch {
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{collection.labels.plural}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {total} {total === 1 ? collection.labels.singular.toLowerCase() : collection.labels.plural.toLowerCase()} total
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setExportOpen(true);
              setExportSearch(searchQuery);
              setExportFilters(columnFilters);
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => setImportOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button type="button" size="sm" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add {collection.labels.singular}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={`Search ${collection.labels.plural.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-md border bg-background py-2 pl-9 pr-3 text-sm"
          />
        </div>

        <select
          value={pageSize}
          onChange={(e) => {
            setPage(1);
            setPageSize(Number(e.target.value));
          }}
          className="h-9 rounded-md border bg-background px-2 text-sm"
          title="Rows per page"
        >
          {[10, 20, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size} / page
            </option>
          ))}
        </select>

        {selectedIds.size > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
            disabled={isBulkDeleting}
          >
            {isBulkDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <AlertTriangle className="mr-2 h-4 w-4" />}
            Delete {selectedIds.size}
          </Button>
        )}
      </div>

      {fetchError && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {fetchError}
        </div>
      )}

      <div className="rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="w-10 px-3 py-2">
                  <input
                    type="checkbox"
                    aria-label="Select all"
                    checked={docs.length > 0 && docs.every((d) => selectedIds.has(String(d.id)))}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </th>
                {displayFields.map((field) => (
                  <th key={field.name} className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">
                    <button
                      type="button"
                      onClick={() => toggleSort(field.name)}
                      className="inline-flex items-center gap-1 hover:text-foreground"
                    >
                      {labelFor(field)}
                      {sortField === field.name ? (
                        sortDir === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronUp className="h-3 w-3 opacity-40" />
                      )}
                    </button>
                  </th>
                ))}
                <th className="px-3 py-2 text-right text-xs font-semibold text-muted-foreground">Actions</th>
              </tr>
              {filterableFields.length > 0 && (
                <tr className="border-b bg-background">
                  <th className="px-3 py-2" />
                  {displayFields.map((field) => (
                    <th key={field.name} className="px-3 py-2">
                      {filterableFields.some((f) => f.name === field.name) ? (
                        <input
                          type="text"
                          value={columnFilters[field.name] ?? ''}
                          placeholder="Filter..."
                          onChange={(e) => {
                            setPage(1);
                            setColumnFilters((prev) => {
                              const next = { ...prev };
                              const v = e.target.value.trim();
                              if (v) next[field.name] = v;
                              else delete next[field.name];
                              return next;
                            });
                          }}
                          className="h-8 w-full rounded border bg-background px-2 text-xs"
                        />
                      ) : null}
                    </th>
                  ))}
                  <th className="px-3 py-2 text-right">
                    {Object.keys(columnFilters).length > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setColumnFilters({});
                          setPage(1);
                        }}
                      >
                        Clear
                      </Button>
                    )}
                  </th>
                </tr>
              )}
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={displayFields.length + 2} className="px-4 py-12 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                  </td>
                </tr>
              ) : docs.length === 0 ? (
                <tr>
                  <td colSpan={displayFields.length + 2} className="px-4 py-12 text-center text-muted-foreground">
                    No records found.
                  </td>
                </tr>
              ) : (
                docs.map((doc) => (
                  <tr key={String(doc.id)} className="border-b transition-colors hover:bg-muted/30">
                    <td className="w-10 px-3 py-2">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(String(doc.id))}
                        onChange={() => toggleSelect(String(doc.id))}
                        className="h-4 w-4 rounded border-gray-300"
                        aria-label={`Select ${doc.id}`}
                      />
                    </td>
                    {displayFields.map((field) => (
                      <td key={field.name} className="px-3 py-2 text-sm">
                        {formatCellValue(field, doc)}
                      </td>
                    ))}
                    <td className="px-3 py-2 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {collection.slug === 'blocks' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/admin/blocks/${doc.id}/content`)}
                            title="Edit Content"
                          >
                            <PencilLine className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(String(doc.id))}
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(String(doc.id))}
                          disabled={deleteId === String(doc.id)}
                          className="text-red-500 hover:bg-red-50 hover:text-red-600"
                          title="Delete"
                        >
                          {deleteId === String(doc.id) ? (
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

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page {page} of {totalPages} · {total} total
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

      {useInlineEditor && editorOpen && (
        <div className="fixed inset-0 z-[80]">
          <button
            type="button"
            className="absolute inset-0 bg-black/35"
            onClick={closeEditor}
            aria-label="Close editor"
          />

          {editorView === 'modal' ? (
            <div className={cn(
              'absolute left-1/2 top-[calc(var(--admin-topbar-height)+0.5rem)] max-h-[calc(100vh-var(--admin-topbar-height)-1rem)] -translate-x-1/2 overflow-y-auto rounded-lg border bg-background shadow-xl',
              editorExpanded ? 'w-[min(98vw,96rem)]' : 'w-[min(96vw,72rem)]'
            )}>
              <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-4 py-2">
                <h2 className="text-sm font-semibold">
                  {editorIntent === 'create' ? `Create ${collection.labels.singular}` : `Edit ${collection.labels.singular}`}
                </h2>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={openEditorInPage}
                    title="Open in page"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="sr-only">Open in page</span>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditorExpanded((prev) => !prev)}
                    title={editorExpanded ? 'Restore size' : 'Expand size'}
                  >
                    {editorExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                  <Button type="button" variant="ghost" size="icon" onClick={closeEditor}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className={cn('p-4', editorExpanded && 'px-5 pb-5')}>
                <CollectionEdit
                  collection={collection}
                  documentId={editorIntent === 'edit' ? (editorDocId ?? undefined) : undefined}
                  mode="modal"
                  onCancel={closeEditor}
                  onSaved={async () => {
                    closeEditor();
                    await fetchDocs();
                  }}
                  onDeleted={async () => {
                    closeEditor();
                    await fetchDocs();
                  }}
                />
              </div>
            </div>
          ) : (
            <div className={cn(
              'absolute right-0 top-[var(--admin-topbar-height)] h-[calc(100vh-var(--admin-topbar-height))] w-full overflow-y-auto border-l bg-background shadow-xl',
              editorExpanded ? 'max-w-[min(98vw,88rem)]' : 'max-w-[min(94vw,56rem)]'
            )}>
              <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-4 py-2">
                <h2 className="text-sm font-semibold">
                  {editorIntent === 'create' ? `Create ${collection.labels.singular}` : `Edit ${collection.labels.singular}`}
                </h2>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={openEditorInPage}
                    title="Open in page"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="sr-only">Open in page</span>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditorExpanded((prev) => !prev)}
                    title={editorExpanded ? 'Restore size' : 'Expand size'}
                  >
                    {editorExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                  <Button type="button" variant="ghost" size="icon" onClick={closeEditor}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className={cn('p-4', editorExpanded && 'px-5 pb-5')}>
                <CollectionEdit
                  collection={collection}
                  documentId={editorIntent === 'edit' ? (editorDocId ?? undefined) : undefined}
                  mode="slider"
                  onCancel={closeEditor}
                  onSaved={async () => {
                    closeEditor();
                    await fetchDocs();
                  }}
                  onDeleted={async () => {
                    closeEditor();
                    await fetchDocs();
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {importOpen && (
        <div className="fixed inset-0 z-[80]">
          <button
            type="button"
            className="absolute inset-0 bg-black/35"
            onClick={() => setImportOpen(false)}
            aria-label="Close import dialog"
          />
          <div className="absolute left-1/2 top-[calc(var(--admin-topbar-height)+1rem)] w-[min(96vw,56rem)] -translate-x-1/2 rounded-lg border bg-background shadow-xl">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h2 className="text-base font-semibold">Import {collection.labels.plural}</h2>
              <Button type="button" variant="ghost" size="icon" onClick={() => setImportOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4 p-4">
              <div className="rounded-md border border-dashed p-3">
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>Upload CSV or Excel-compatible file</span>
                  <input
                    type="file"
                    accept=".csv,.xls,.xlsx,.xml,.tsv"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handleImportFile(file);
                    }}
                  />
                </label>
              </div>

              {importRows.length > 0 && (
                <>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">Duplicate key field</label>
                      <select
                        aria-label='select'
                        value={importDuplicateField}
                        onChange={(e) => setImportDuplicateField(e.target.value)}
                        className="h-9 w-full rounded border bg-background px-2 text-sm"
                      >
                        {editableFields.map((field) => (
                          <option key={field.name} value={field.name}>
                            {labelFor(field)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">Duplicate handling</label>
                      <select
                        aria-label='select'
                        value={importMode}
                        onChange={(e) => setImportMode(e.target.value as ImportMode)}
                        className="h-9 w-full rounded border bg-background px-2 text-sm"
                      >
                        <option value="skip">Skip duplicates</option>
                        <option value="update">Update duplicates</option>
                      </select>
                    </div>
                  </div>

                  <div className="max-h-72 overflow-auto rounded border">
                    <table className="w-full min-w-[640px]">
                      <thead className="sticky top-0 bg-muted/50">
                        <tr>
                          <th className="px-2 py-2 text-left text-xs">Source column</th>
                          <th className="px-2 py-2 text-left text-xs">Map to field</th>
                          <th className="px-2 py-2 text-left text-xs">Sample</th>
                        </tr>
                      </thead>
                      <tbody>
                        {importHeaders.map((header) => (
                          <tr key={header} className="border-t">
                            <td className="px-2 py-2 text-xs font-medium">{header}</td>
                            <td className="px-2 py-2">
                              <select
                                aria-label='select'
                                value={importMapping[header] ?? IGNORED_COLUMN}
                                onChange={(e) =>
                                  setImportMapping((prev) => ({ ...prev, [header]: e.target.value }))
                                }
                                className="h-8 w-full rounded border bg-background px-2 text-xs"
                              >
                                <option value={IGNORED_COLUMN}>Ignore</option>
                                {editableFields.map((field) => (
                                  <option key={field.name} value={field.name}>
                                    {labelFor(field)}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-2 py-2 text-xs text-muted-foreground">
                              {importRows[0]?.[header] ?? '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {importStatus && (
                <div className="rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  {importStatus}
                </div>
              )}
              {importError && (
                <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {importError}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 border-t px-4 py-3">
              <Button type="button" variant="outline" onClick={() => setImportOpen(false)}>
                Close
              </Button>
              <Button type="button" onClick={runImport} disabled={isImporting || importRows.length === 0}>
                {isImporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                {isImporting ? 'Importing...' : 'Run Import'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {exportOpen && (
        <div className="fixed inset-0 z-[80]">
          <button
            type="button"
            className="absolute inset-0 bg-black/35"
            onClick={() => setExportOpen(false)}
            aria-label="Close export dialog"
          />
          <div className="absolute left-1/2 top-[calc(var(--admin-topbar-height)+1rem)] w-[min(96vw,56rem)] -translate-x-1/2 rounded-lg border bg-background shadow-xl">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h2 className="text-base font-semibold">Export {collection.labels.plural}</h2>
              <Button type="button" variant="ghost" size="icon" onClick={() => setExportOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4 p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Format</label>
                  <select
                    aria-label='select'
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value as 'csv' | 'xls' | 'json')}
                    className="h-9 w-full rounded border bg-background px-2 text-sm"
                  >
                    <option value="csv">CSV</option>
                    <option value="xls">Excel (.xls)</option>
                    <option value="json">JSON</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Search filter</label>
                  <input
                    type="text"
                    value={exportSearch}
                    onChange={(e) => setExportSearch(e.target.value)}
                    className="h-9 w-full rounded border bg-background px-2 text-sm"
                    placeholder="Search before export"
                  />
                </div>
              </div>

              {filterableFields.length > 0 && (
                <div className="rounded border p-3">
                  <p className="mb-2 text-xs font-medium text-muted-foreground">Column filters</p>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {filterableFields.map((field) => (
                      <label key={field.name} className="space-y-1 text-xs">
                        <span>{labelFor(field)}</span>
                        <input
                          type="text"
                          value={exportFilters[field.name] ?? ''}
                          onChange={(e) =>
                            setExportFilters((prev) => {
                              const next = { ...prev };
                              const v = e.target.value.trim();
                              if (v) next[field.name] = v;
                              else delete next[field.name];
                              return next;
                            })
                          }
                          className="h-8 w-full rounded border bg-background px-2 text-xs"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded border p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">Columns to export</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setExportColumns(new Set(exportableFields.map((field) => field.name)))}
                  >
                    Select all
                  </Button>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {exportableFields.map((field) => (
                    <label key={field.name} className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={exportColumns.has(field.name)}
                        onChange={(e) => {
                          setExportColumns((prev) => {
                            const next = new Set(prev);
                            if (e.target.checked) next.add(field.name);
                            else next.delete(field.name);
                            return next;
                          });
                        }}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      {labelFor(field)}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t px-4 py-3">
              <Button type="button" variant="outline" onClick={() => setExportOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={executeExport} disabled={isExporting}>
                {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                {isExporting ? 'Exporting...' : 'Export Data'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
