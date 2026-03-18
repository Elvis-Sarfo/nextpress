'use client';

import { Download, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CollectionFieldMeta, CollectionMeta } from '@/lib/collections-data';
import { labelFor } from '@/components/admin/data-table/collection-table-utils';

interface CollectionExportDialogProps {
  collection: CollectionMeta;
  open: boolean;
  exportFormat: 'csv' | 'xls' | 'json';
  exportSearch: string;
  exportFilters: Record<string, string>;
  exportColumns: Set<string>;
  exportableFields: CollectionFieldMeta[];
  filterableFields: CollectionFieldMeta[];
  isExporting: boolean;
  onClose: () => void;
  onExportFormatChange: (value: 'csv' | 'xls' | 'json') => void;
  onExportSearchChange: (value: string) => void;
  onExportFilterChange: (fieldName: string, value: string) => void;
  onToggleColumn: (fieldName: string, checked: boolean) => void;
  onSelectAll: () => void;
  onExport: () => Promise<void>;
}

export function CollectionExportDialog({
  collection,
  open,
  exportFormat,
  exportSearch,
  exportFilters,
  exportColumns,
  exportableFields,
  filterableFields,
  isExporting,
  onClose,
  onExportFormatChange,
  onExportSearchChange,
  onExportFilterChange,
  onToggleColumn,
  onSelectAll,
  onExport,
}: CollectionExportDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        type="button"
        className="absolute inset-0 bg-black/35"
        onClick={onClose}
        aria-label="Close export dialog"
      />
      <div className="absolute left-1/2 top-[calc(var(--admin-topbar-height)+1rem)] w-[min(96vw,56rem)] -translate-x-1/2 rounded-lg border bg-background shadow-xl">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-base font-semibold">Export {collection.labels.plural}</h2>
          <Button type="button" variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Format</label>
              <select
                aria-label="select"
                value={exportFormat}
                onChange={(e) => onExportFormatChange(e.target.value as 'csv' | 'xls' | 'json')}
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
                onChange={(e) => onExportSearchChange(e.target.value)}
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
                      onChange={(e) => onExportFilterChange(field.name, e.target.value)}
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
              <Button type="button" variant="ghost" size="sm" onClick={onSelectAll}>
                Select all
              </Button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {exportableFields.map((field) => (
                <label key={field.name} className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={exportColumns.has(field.name)}
                    onChange={(e) => onToggleColumn(field.name, e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  {labelFor(field)}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t px-4 py-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={() => void onExport()} disabled={isExporting}>
            {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            {isExporting ? 'Exporting...' : 'Export Data'}
          </Button>
        </div>
      </div>
    </div>
  );
}
