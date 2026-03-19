'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  Copy,
  Download,
  Loader2,
  Pencil,
  PencilLine,
  Plus,
  Search,
  Trash2,
  Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminLocale } from '@/components/providers/AdminLocaleProvider';
import type { CollectionMeta, CollectionFieldMeta } from '@/lib/collections-data';
import { AdminDataTable } from '@/components/admin/data-table/AdminDataTable';
import { buildCollectionColumns } from '@/components/admin/data-table/buildCollectionColumns';
import {
  convertTextToFieldValue,
  csvEscape,
  downloadBlob,
  formatCellValue,
  getComparable,
  IGNORED_COLUMN,
  labelFor,
  normalizeHeader,
  parseDelimited,
  parseExcelLikeText,
} from '@/components/admin/data-table/collection-table-utils';
import { useCollectionTable } from '@/components/admin/data-table/useCollectionTable';
import { CollectionEditorOverlay } from './CollectionEditorOverlay';
import { CollectionImportDialog } from './CollectionImportDialog';
import { CollectionExportDialog } from './CollectionExportDialog';

interface CollectionListProps {
  collection: CollectionMeta;
}

type Doc = Record<string, unknown>;
type ImportMode = 'skip' | 'update';
type EditorIntent = 'create' | 'edit';

export function CollectionList({ collection }: CollectionListProps) {
  const router = useRouter();
  const { locale } = useAdminLocale();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [duplicateId, setDuplicateId] = useState<string | null>(null);
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

  const {
    docs,
    total,
    totalPages,
    pageSize,
    searchQuery,
    filterMap,
    sorting,
    columnFilters,
    pagination,
    rowSelection,
    isLoading,
    fetchError,
    selectedIds,
    fetchDocs,
    setPageSize,
    setSearchQuery,
    sortField,
    sortDir,
    onSortingChange,
    onColumnFiltersChange,
    onPaginationChange,
    onRowSelectionChange,
  } = useCollectionTable({ collection });

  const editorView = collection.admin.editorView ?? 'slider';
  const useInlineEditor = editorView !== 'page';
  const configuredColumns = collection.admin.defaultColumns ?? ['id', 'createdAt'];

  const displayFields = useMemo(
    () =>
      configuredColumns
        .map((col) => collection.fields.find((field) => field.name === col))
        .filter(Boolean) as CollectionFieldMeta[],
    [collection.fields, configuredColumns]
  );

  const editableFields = useMemo(
    () => collection.fields.filter((field) => !field.hidden),
    [collection.fields]
  );

  const exportableFields = useMemo(() => {
    const set = new Map<string, CollectionFieldMeta>();
    for (const field of displayFields) set.set(field.name, field);
    for (const field of editableFields) set.set(field.name, field);
    return Array.from(set.values());
  }, [displayFields, editableFields]);

  const filterableFields = useMemo(
    () => displayFields.filter((field) => ['text', 'email', 'textarea', 'select'].includes(field.type)),
    [displayFields]
  );

  const columns = useMemo(
    () => buildCollectionColumns(displayFields, locale),
    [displayFields, locale]
  );

  useEffect(() => {
    if (exportColumns.size === 0 && exportableFields.length > 0) {
      setExportColumns(new Set(exportableFields.map((field) => field.name)));
    }
  }, [exportColumns.size, exportableFields]);

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

  const handleDuplicate = async (id: string) => {
    setDuplicateId(id);
    try {
      const res = await fetch(`/api/admin/collections/${collection.slug}/${id}/duplicate`, {
        method: 'POST',
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error ?? 'Duplicate failed');
        return;
      }

      const newId = data.doc?.id;
      await fetchDocs();

      if (typeof newId === 'string' && newId.length > 0) {
        router.push(`/admin/${collection.slug}/${newId}`);
      }
    } finally {
      setDuplicateId(null);
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
      onRowSelectionChange({});
      await fetchDocs();
    } finally {
      setIsBulkDeleting(false);
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

      const objects = rows
        .map((cells) => {
          const row: Record<string, string> = {};
          headers.forEach((header, idx) => {
            row[header] = (cells[idx] ?? '').trim();
          });
          return row;
        })
        .filter((row) => Object.values(row).some((value) => value !== ''));

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

    if (!importDuplicateField) {
      setImportError('Select a duplicate detection field.');
      return;
    }

    setIsImporting(true);
    try {
      const existing: Doc[] = [];
      let importPage = 1;
      const limit = 100;

      while (true) {
        const params = new URLSearchParams({ page: String(importPage), limit: String(limit) });
        const res = await fetch(`/api/admin/collections/${collection.slug}?${params}`);
        if (!res.ok) break;
        const data = await res.json();
        const batch = (data.docs ?? []) as Doc[];
        existing.push(...batch);
        if (batch.length < limit) break;
        importPage += 1;
      }

      const existingByKey = new Map<string, Doc>();
      for (const doc of existing) {
        const key = getComparable(doc, importDuplicateField, locale);
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
          const field = editableFields.find((editableField) => editableField.name === targetFieldName);
          if (!field) continue;
          payload[targetFieldName] = convertTextToFieldValue(field, row[sourceHeader] ?? '', locale);
        }

        const keyValue = getComparable(payload as Doc, importDuplicateField, locale);
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
    let exportPage = 1;
    const limit = 100;

    while (true) {
      const params = new URLSearchParams({
        page: String(exportPage),
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
      exportPage += 1;
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
          row[field.name] = formatCellValue(field, doc, locale);
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
        const bodyRows = serialized
          .map((row) => {
            const tds = selected
              .map((field) => `<td>${String(row[field.name] ?? '').replace(/</g, '&lt;')}</td>`)
              .join('');
            return `<tr>${tds}</tr>`;
          })
          .join('');
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

  const toolbar = (
    <>
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
              setExportFilters(filterMap);
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
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground dark:text-[#667085]" />
          <input
            type="text"
            placeholder={`Search ${collection.labels.plural.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground dark:border-[#475467] dark:bg-[#0f172a] dark:text-[#f8fafc] dark:placeholder:text-[#667085]"
          />
        </div>

        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="h-9 rounded-md border border-input bg-background px-2 text-sm text-foreground dark:border-[#475467] dark:bg-[#0f172a] dark:text-[#f8fafc]"
          title="Rows per page"
        >
          {[10, 20, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size} / page
            </option>
          ))}
        </select>

        {selectedIds.size > 0 && (
          <Button variant="destructive" size="sm" onClick={handleBulkDelete} disabled={isBulkDeleting}>
            {isBulkDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <AlertTriangle className="mr-2 h-4 w-4" />}
            Delete {selectedIds.size}
          </Button>
        )}
      </div>
    </>
  );

  return (
    <div className="space-y-3">
      <AdminDataTable
        rows={docs}
        columns={columns}
        rowKey={(row) => String(row.id)}
        loading={isLoading}
        error={fetchError}
        sorting={sorting}
        onSortingChange={onSortingChange}
        columnFilters={columnFilters}
        onColumnFiltersChange={onColumnFiltersChange}
        rowSelection={rowSelection}
        onRowSelectionChange={onRowSelectionChange}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        renderActions={(doc) => (
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
            <Button variant="ghost" size="icon" onClick={() => openEdit(String(doc.id))} title="Edit">
              <Pencil className="h-4 w-4" />
            </Button>
            {collection.slug === 'pages' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDuplicate(String(doc.id))}
                disabled={duplicateId === String(doc.id)}
                title="Duplicate"
              >
                {duplicateId === String(doc.id) ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            )}
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
        )}
        toolbar={toolbar}
        totalPages={totalPages}
        total={total}
      />

      <CollectionEditorOverlay
        collection={collection}
        open={useInlineEditor && editorOpen}
        editorView={editorView}
        editorIntent={editorIntent}
        editorDocId={editorDocId}
        editorExpanded={editorExpanded}
        onClose={closeEditor}
        onToggleExpanded={() => setEditorExpanded((prev) => !prev)}
        onOpenInPage={openEditorInPage}
        onSaved={async () => {
          closeEditor();
          await fetchDocs();
        }}
        onDeleted={async () => {
          closeEditor();
          await fetchDocs();
        }}
      />

      <CollectionImportDialog
        collection={collection}
        open={importOpen}
        editableFields={editableFields}
        importHeaders={importHeaders}
        importRows={importRows}
        importMapping={importMapping}
        importDuplicateField={importDuplicateField}
        importMode={importMode}
        importStatus={importStatus}
        importError={importError}
        isImporting={isImporting}
        onClose={() => setImportOpen(false)}
        onFileSelect={handleImportFile}
        onDuplicateFieldChange={setImportDuplicateField}
        onImportModeChange={setImportMode}
        onImportMappingChange={(header, value) =>
          setImportMapping((prev) => ({ ...prev, [header]: value }))
        }
        onRunImport={runImport}
      />

      <CollectionExportDialog
        collection={collection}
        open={exportOpen}
        exportFormat={exportFormat}
        exportSearch={exportSearch}
        exportFilters={exportFilters}
        exportColumns={exportColumns}
        exportableFields={exportableFields}
        filterableFields={filterableFields}
        isExporting={isExporting}
        onClose={() => setExportOpen(false)}
        onExportFormatChange={setExportFormat}
        onExportSearchChange={setExportSearch}
        onExportFilterChange={(fieldName, value) =>
          setExportFilters((prev) => {
            const next = { ...prev };
            const trimmedValue = value.trim();
            if (trimmedValue) next[fieldName] = trimmedValue;
            else delete next[fieldName];
            return next;
          })
        }
        onToggleColumn={(fieldName, checked) => {
          setExportColumns((prev) => {
            const next = new Set(prev);
            if (checked) next.add(fieldName);
            else next.delete(fieldName);
            return next;
          });
        }}
        onSelectAll={() => setExportColumns(new Set(exportableFields.map((field) => field.name)))}
        onExport={executeExport}
      />
    </div>
  );
}
