'use client';

import { FileSpreadsheet, Loader2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CollectionFieldMeta, CollectionMeta } from '@/lib/collections-data';
import { IGNORED_COLUMN, labelFor } from '@/components/admin/data-table/collection-table-utils';

type ImportMode = 'skip' | 'update';

interface CollectionImportDialogProps {
  collection: CollectionMeta;
  open: boolean;
  editableFields: CollectionFieldMeta[];
  importHeaders: string[];
  importRows: Record<string, string>[];
  importMapping: Record<string, string>;
  importDuplicateField: string;
  importMode: ImportMode;
  importStatus: string | null;
  importError: string | null;
  isImporting: boolean;
  onClose: () => void;
  onFileSelect: (file: File) => Promise<void>;
  onDuplicateFieldChange: (value: string) => void;
  onImportModeChange: (value: ImportMode) => void;
  onImportMappingChange: (header: string, value: string) => void;
  onRunImport: () => Promise<void>;
}

export function CollectionImportDialog({
  collection,
  open,
  editableFields,
  importHeaders,
  importRows,
  importMapping,
  importDuplicateField,
  importMode,
  importStatus,
  importError,
  isImporting,
  onClose,
  onFileSelect,
  onDuplicateFieldChange,
  onImportModeChange,
  onImportMappingChange,
  onRunImport,
}: CollectionImportDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        type="button"
        className="absolute inset-0 bg-black/35"
        onClick={onClose}
        aria-label="Close import dialog"
      />
      <div className="absolute left-1/2 top-[calc(var(--admin-topbar-height)+1rem)] w-[min(96vw,56rem)] -translate-x-1/2 rounded-lg border bg-background shadow-xl">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-base font-semibold">Import {collection.labels.plural}</h2>
          <Button type="button" variant="ghost" size="icon" onClick={onClose}>
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
                  if (file) void onFileSelect(file);
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
                    aria-label="select"
                    value={importDuplicateField}
                    onChange={(e) => onDuplicateFieldChange(e.target.value)}
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
                    aria-label="select"
                    value={importMode}
                    onChange={(e) => onImportModeChange(e.target.value as ImportMode)}
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
                            aria-label="select"
                            value={importMapping[header] ?? IGNORED_COLUMN}
                            onChange={(e) => onImportMappingChange(header, e.target.value)}
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
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button type="button" onClick={() => void onRunImport()} disabled={isImporting || importRows.length === 0}>
            {isImporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            {isImporting ? 'Importing...' : 'Run Import'}
          </Button>
        </div>
      </div>
    </div>
  );
}

