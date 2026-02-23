'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type {
  QueryableCollectionMeta,
  QueryableFilterField,
} from '@/app/api/admin/datasource/collections/route';

// ─── Public types ─────────────────────────────────────────────────────────────

export interface DataSourceValue {
  collection?: string;
  limit?: number;
  where?: Record<string, unknown>;
  orderBy?: Record<string, 'asc' | 'desc'>;
}

interface DataSourceBuilderProps {
  /** Current data source configuration. */
  value: DataSourceValue;
  onChange: (newValue: DataSourceValue) => void;
}

// ─── Internal types ───────────────────────────────────────────────────────────

interface FilterRow {
  /** Stable React key */
  id: string;
  /** DB field name */
  field: string;
  /** Filter value */
  value: unknown;
}

type RelationMap = Record<string, { id: string; label: string }[]>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function whereToRows(where: Record<string, unknown> | undefined): FilterRow[] {
  if (!where) return [];
  return Object.entries(where).map(([field, val], i) => ({
    id: `row-${i}-${field}-${Date.now()}`,
    field,
    value: val,
  }));
}

function rowsToWhere(rows: FilterRow[]): Record<string, unknown> | undefined {
  const result: Record<string, unknown> = {};
  for (const row of rows) {
    if (row.field && row.value !== '' && row.value !== null && row.value !== undefined) {
      result[row.field] = row.value;
    }
  }
  return Object.keys(result).length > 0 ? result : undefined;
}

// ─── Filter value input ───────────────────────────────────────────────────────

function FilterValueInput({
  fieldMeta,
  value,
  onChange,
  relationMap,
}: {
  fieldMeta: QueryableFilterField | undefined;
  value: unknown;
  onChange: (v: unknown) => void;
  relationMap: RelationMap;
}) {
  const cls =
    'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring';

  if (!fieldMeta || fieldMeta.type === 'text') {
    return (
      <input
        type="text"
        className={cls}
        placeholder="Value"
        value={String(value ?? '')}
        onChange={(e) => onChange(e.target.value || undefined)}
      />
    );
  }

  if (fieldMeta.type === 'number') {
    return (
      <input
        type="number"
        className={cls}
        placeholder="Value"
        value={typeof value === 'number' ? value : ''}
        onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
      />
    );
  }

  if (fieldMeta.type === 'select' && fieldMeta.options) {
    return (
      <select
        aria-label={fieldMeta.label}
        className={cls}
        value={String(value ?? '')}
        onChange={(e) => onChange(e.target.value || undefined)}
      >
        <option value="">— any —</option>
        {fieldMeta.options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }

  if (fieldMeta.type === 'relationship') {
    const opts = relationMap[fieldMeta.relationTo ?? ''] ?? [];
    return (
      <select
        aria-label={fieldMeta.label}
        className={cls}
        value={String(value ?? '')}
        onChange={(e) => onChange(e.target.value || undefined)}
      >
        <option value="">— any —</option>
        {opts.length === 0 && <option disabled>Loading…</option>}
        {opts.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      type="text"
      className={cls}
      placeholder="Value"
      value={String(value ?? '')}
      onChange={(e) => onChange(e.target.value || undefined)}
    />
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * DataSourceBuilder — lets editors configure a live collection query for a block.
 *
 * Renders:
 *   1. A collection picker (fetched dynamically from the server)
 *   2. A limit input
 *   3. A dynamic filter builder (field + value rows, add/remove)
 *   4. A sort field + direction picker
 *
 * Output shape (stored in block.dataSource):
 *   { collection, limit, where: { field: value, … }, orderBy: { field: 'asc'|'desc' } }
 */
export function DataSourceBuilder({ value, onChange }: DataSourceBuilderProps) {
  // Internal filter rows — initialized from value.where on mount
  const [filterRows, setFilterRows] = useState<FilterRow[]>(() => whereToRows(value.where));
  // Cached relationship options by collection slug
  const [relationMap, setRelationMap] = useState<RelationMap>({});
  // All queryable collections with full metadata — fetched from the server
  const [availableCollections, setAvailableCollections] = useState<QueryableCollectionMeta[]>([]);

  // Fetch the full collection list (with field metadata) from the server on mount
  useEffect(() => {
    fetch('/api/admin/datasource/collections')
      .then((r) => r.json())
      .then((data: { collections?: QueryableCollectionMeta[] }) => {
        if (Array.isArray(data.collections)) {
          setAvailableCollections(data.collections);
        }
      })
      .catch(() => {});
  }, []);

  // Derive current collection metadata from the loaded list
  const collectionMeta = value.collection
    ? availableCollections.find((c) => c.slug === value.collection)
    : undefined;

  // Fetch relationship picker options whenever the collection changes
  useEffect(() => {
    if (!collectionMeta) return;
    const relFields = collectionMeta.filterFields.filter(
      (f) => f.type === 'relationship' && f.relationTo
    );
    if (relFields.length === 0) return;

    const seen = new Set<string>();
    for (const field of relFields) {
      const target = field.relationTo!;
      if (seen.has(target)) continue;
      seen.add(target);

      fetch(`/api/admin/collections/${target}?limit=200`)
        .then((r) => r.json())
        .then((data: { docs?: Array<Record<string, unknown>> }) => {
          const opts = (data.docs ?? []).map((doc) => ({
            id: String(doc.id ?? ''),
            label: String(
              doc.name ?? doc.title ?? doc.displayName ?? doc.email ?? doc.id ?? ''
            ),
          }));
          setRelationMap((prev) => ({ ...prev, [target]: opts }));
        })
        .catch(() => { });
    }
  }, [collectionMeta]);

  const cls =
    'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring';

  // ── Collection ──────────────────────────────────────────────────────────────
  const handleCollectionChange = (slug: string) => {
    const meta = availableCollections.find((c) => c.slug === slug);
    setFilterRows([]);
    const newValue: DataSourceValue = slug ? { collection: slug } : {};
    if (meta?.defaultSort) {
      newValue.orderBy = { [meta.defaultSort.field]: meta.defaultSort.direction };
    }
    onChange(newValue);
  };

  // ── Limit ───────────────────────────────────────────────────────────────────
  const handleLimitChange = (raw: string) => {
    const n = parseInt(raw, 10);
    onChange({ ...value, limit: isNaN(n) ? undefined : n });
  };

  // ── Filters ─────────────────────────────────────────────────────────────────
  const applyFilterRows = (rows: FilterRow[]) => {
    setFilterRows(rows);
    onChange({ ...value, where: rowsToWhere(rows) });
  };

  const addFilter = () =>
    applyFilterRows([...filterRows, { id: `row-${Date.now()}`, field: '', value: '' }]);

  const removeFilter = (id: string) =>
    applyFilterRows(filterRows.filter((r) => r.id !== id));

  const setFilterField = (id: string, field: string) =>
    applyFilterRows(filterRows.map((r) => (r.id === id ? { ...r, field, value: '' } : r)));

  const setFilterValue = (id: string, val: unknown) =>
    applyFilterRows(filterRows.map((r) => (r.id === id ? { ...r, value: val } : r)));

  // ── Sort ────────────────────────────────────────────────────────────────────
  const sortEntries = value.orderBy ? Object.entries(value.orderBy) : [];
  const sortField = sortEntries[0]?.[0] ?? '';
  const sortDir = (sortEntries[0]?.[1] ?? 'desc') as 'asc' | 'desc';

  const handleSortField = (field: string) => {
    if (!field) {
      const { orderBy: _, ...rest } = value;
      onChange(rest);
    } else {
      onChange({ ...value, orderBy: { [field]: sortDir } });
    }
  };

  const handleSortDir = (dir: 'asc' | 'desc') => {
    if (sortField) onChange({ ...value, orderBy: { [sortField]: dir } });
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">

      {/* ── Collection ── */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium leading-none">Collection</label>
        <select
          aria-label="Collection"
          className={cls}
          value={value.collection ?? ''}
          onChange={(e) => handleCollectionChange(e.target.value)}
        >
          <option value="">— select a collection —</option>
          {availableCollections.map((col) => (
            <option key={col.slug} value={col.slug}>
              {col.label}
            </option>
          ))}
        </select>
        {value.collection && !collectionMeta && availableCollections.length > 0 && (
          <p className="text-xs text-amber-600">
            Collection &quot;{value.collection}&quot; is not available as a data source.
          </p>
        )}
      </div>

      {value.collection && collectionMeta && (
        <>
          {/* ── Limit ── */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium leading-none">Limit</label>
            <input
              type="number"
              className={cls + ' max-w-[120px]'}
              min={1}
              max={100}
              placeholder="10"
              value={typeof value.limit === 'number' ? value.limit : ''}
              onChange={(e) => handleLimitChange(e.target.value)}
            />
          </div>

          {/* ── Filters ── */}
          {collectionMeta.filterFields.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium leading-none">Filters</label>
                <button
                  type="button"
                  onClick={addFilter}
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <Plus className="h-3 w-3" />
                  Add filter
                </button>
              </div>

              {filterRows.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">
                  No filters — all records will be fetched.
                </p>
              ) : (
                <div className="space-y-2">
                  {filterRows.map((row) => {
                    const fieldMeta = collectionMeta.filterFields.find((f) => f.name === row.field);
                    return (
                      <div key={row.id} className="flex items-center gap-2">
                        {/* Field selector */}
                        <select
                          aria-label={fieldMeta?.label ?? 'Field'}
                          className={cls}
                          value={row.field}
                          onChange={(e) => setFilterField(row.id, e.target.value)}
                        >
                          <option value="">— field —</option>
                          {collectionMeta.filterFields.map((f) => (
                            <option key={f.name} value={f.name}>
                              {f.label}
                            </option>
                          ))}
                        </select>

                        {/* Value input */}
                        <FilterValueInput
                          fieldMeta={fieldMeta}
                          value={row.value}
                          onChange={(v) => setFilterValue(row.id, v)}
                          relationMap={relationMap}
                        />

                        {/* Remove */}
                        <button
                          aria-label="Remove filter"
                          type="button"
                          onClick={() => removeFilter(row.id)}
                          className="flex-shrink-0 rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── Sort ── */}
          {collectionMeta.sortFields.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium leading-none">Sort</label>
              <div className="flex items-center gap-2">
                <select
                  aria-label="Sort"
                  className={cls}
                  value={sortField}
                  onChange={(e) => handleSortField(e.target.value)}
                >
                  <option value="">— none —</option>
                  {collectionMeta.sortFields.map((f) => (
                    <option key={f.name} value={f.name}>
                      {f.label}
                    </option>
                  ))}
                </select>

                {sortField && (
                  <select
                    aria-label="Sort direction"
                    className={cls + ' max-w-[140px]'}
                    value={sortDir}
                    onChange={(e) => handleSortDir(e.target.value as 'asc' | 'desc')}
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
