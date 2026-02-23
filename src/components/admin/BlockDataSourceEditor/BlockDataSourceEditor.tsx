'use client';

import { useEffect, useState } from 'react';
import type { BlockDataSourceSpec } from '@/blocks/types';

interface BlockDataSourceEditorProps {
  spec: BlockDataSourceSpec;
  value: Record<string, unknown>;
  onChange: (newParams: Record<string, unknown>) => void;
}

interface RelationOption {
  id: string;
  label: string;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/**
 * Get the current value for a field from the structured params object.
 * Respects the field's scope ('root', 'where', 'orderBy').
 */
function getFieldValue(
  value: Record<string, unknown>,
  name: string,
  scope: 'root' | 'where' | 'orderBy',
  defaultVal: unknown,
): unknown {
  if (scope === 'root') {
    return value[name] ?? defaultVal;
  }
  if (scope === 'where') {
    const whereObj = isRecord(value.where) ? value.where : {};
    return whereObj[name] ?? defaultVal ?? '';
  }
  if (scope === 'orderBy') {
    const orderByObj = isRecord(value.orderBy) ? value.orderBy : {};
    return orderByObj[name] ?? defaultVal ?? '';
  }
  return defaultVal;
}

/**
 * Returns a new params object with the field value updated according to its scope.
 */
function setFieldValue(
  prev: Record<string, unknown>,
  name: string,
  scope: 'root' | 'where' | 'orderBy',
  newVal: unknown,
): Record<string, unknown> {
  if (scope === 'root') {
    return { ...prev, [name]: newVal };
  }
  if (scope === 'where') {
    const whereObj = isRecord(prev.where) ? prev.where : {};
    const updated = { ...whereObj, [name]: newVal };
    // Remove empty values to keep the JSON clean
    if (newVal === '' || newVal === null || newVal === undefined) {
      delete updated[name];
    }
    return { ...prev, where: Object.keys(updated).length > 0 ? updated : undefined };
  }
  if (scope === 'orderBy') {
    const orderByObj = isRecord(prev.orderBy) ? prev.orderBy : {};
    const updated = { ...orderByObj, [name]: newVal };
    if (newVal === '' || newVal === null || newVal === undefined) {
      delete updated[name];
    }
    return { ...prev, orderBy: Object.keys(updated).length > 0 ? updated : undefined };
  }
  return prev;
}

export function BlockDataSourceEditor({ spec, value, onChange }: BlockDataSourceEditorProps) {
  const [relationOptions, setRelationOptions] = useState<Record<string, RelationOption[]>>({});

  // Fetch relationship options for all relationship fields
  useEffect(() => {
    const relationFields = spec.fields.filter((f) => f.type === 'relationship' && f.relationTo);
    if (relationFields.length === 0) return;

    const pending: Record<string, boolean> = {};
    for (const field of relationFields) {
      if (!field.relationTo || pending[field.relationTo]) continue;
      pending[field.relationTo] = true;

      fetch(`/api/admin/collections/${field.relationTo}?limit=200`)
        .then((r) => r.json())
        .then((data: { docs?: Array<Record<string, unknown>> }) => {
          const docs = data.docs ?? [];
          const options: RelationOption[] = docs.map((doc) => ({
            id: String(doc.id ?? ''),
            label: String(doc.name ?? doc.title ?? doc.displayName ?? doc.id ?? ''),
          }));
          setRelationOptions((prev) => ({ ...prev, [field.relationTo!]: options }));
        })
        .catch(() => {
          // ignore fetch errors — field just won't have options
        });
    }
  }, [spec]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Collection: <code className="text-xs bg-muted px-1 py-0.5 rounded">{spec.collection}</code>
      </p>

      {spec.fields.map((field) => {
        const scope = field.scope ?? (field.type === 'number' || field.type === 'toggle' ? 'root' : 'where');
        const currentValue = getFieldValue(value, field.name, scope, field.default);

        const handleChange = (newVal: unknown) => {
          onChange(setFieldValue(value, field.name, scope, newVal));
        };

        return (
          <div key={field.name} className="space-y-1">
            {field.label && (
              <label className="text-sm font-medium leading-none" htmlFor={`ds-${field.name}`}>
                {field.label}
              </label>
            )}

            {field.type === 'number' && (
              <input
                id={`ds-${field.name}`}
                type="number"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={typeof currentValue === 'number' ? currentValue : ''}
                onChange={(e) => handleChange(e.target.value === '' ? undefined : Number(e.target.value))}
              />
            )}

            {field.type === 'toggle' && (
              <div className="flex items-center gap-2">
                <input
                  id={`ds-${field.name}`}
                  type="checkbox"
                  className="h-4 w-4 rounded border-input"
                  checked={!!currentValue}
                  onChange={(e) => handleChange(e.target.checked)}
                />
              </div>
            )}

            {field.type === 'select' && field.options && (
              <select
                id={`ds-${field.name}`}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={String(currentValue ?? '')}
                onChange={(e) => handleChange(e.target.value || undefined)}
              >
                <option value="">— any —</option>
                {field.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}

            {field.type === 'relationship' && (
              <select
                id={`ds-${field.name}`}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={String(currentValue ?? '')}
                onChange={(e) => handleChange(e.target.value || undefined)}
              >
                <option value="">— any —</option>
                {(relationOptions[field.relationTo ?? ''] ?? []).map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        );
      })}
    </div>
  );
}
