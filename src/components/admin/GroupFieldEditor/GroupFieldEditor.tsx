'use client';

/**
 * GroupFieldEditor — renders sub-fields of a group field as native form inputs.
 * Replaces the raw JSON code editor for group types when sub-field metadata is available.
 * Supports nested groups (recursive), all primitive field types, and localized sub-fields.
 */

import { useCallback } from 'react';
import { cn } from '@/lib/utils';
import { MediaSelector } from '@/components/admin/MediaSelector';
import type { CollectionFieldMeta } from '@/lib/collections-data';

interface GroupFieldEditorProps {
  /** The group field definition (must have field.fields populated) */
  field: CollectionFieldMeta;
  /** Current value of the group (JSON object stored in DB) */
  value: Record<string, unknown>;
  /** Called whenever any sub-field changes */
  onChange: (updated: Record<string, unknown>) => void;
  /** Active locale for localized sub-fields */
  activeLocale?: string;
  /** Available locales (for locale switcher within sub-fields) */
  locales?: string[];
  /** Depth for visual nesting (internal use) */
  depth?: number;
}

// Helper: human-readable label from camelCase name
function toLabel(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1');
}

const baseInput =
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

// ── Single sub-field input ──────────────────────────────────────────────────

interface SubFieldInputProps {
  subField: CollectionFieldMeta;
  value: unknown;
  onChange: (val: unknown) => void;
  activeLocale: string;
}

function SubFieldInput({ subField, value, onChange, activeLocale }: SubFieldInputProps) {
  const ariaLabel = subField.label ?? toLabel(subField.name);

  // Localized sub-field: value is { en: '...', fr: '...' }
  if (subField.localized) {
    const localeMap = (typeof value === 'object' && value !== null
      ? (value as Record<string, unknown>)
      : {});
    const localeValue = localeMap[activeLocale] ?? '';
    const localizedAs = subField.localizedAs ?? 'text';

    if (localizedAs === 'textarea') {
      return (
        <textarea
          aria-label={`${ariaLabel} (${activeLocale.toUpperCase()})`}
          value={String(localeValue)}
          onChange={(e) =>
            onChange({ ...localeMap, [activeLocale]: e.target.value })
          }
          rows={3}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[72px]"
        />
      );
    }

    return (
      <input
        type="text"
        aria-label={`${ariaLabel} (${activeLocale.toUpperCase()})`}
        value={String(localeValue)}
        onChange={(e) =>
          onChange({ ...localeMap, [activeLocale]: e.target.value })
        }
        className={baseInput}
      />
    );
  }

  switch (subField.type) {
    case 'text':
    case 'email':
      return (
        <input
          type={subField.type}
          aria-label={ariaLabel}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          required={subField.required}
          className={baseInput}
        />
      );

    case 'textarea':
      return (
        <textarea
          aria-label={ariaLabel}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[72px]"
        />
      );

    case 'number':
      return (
        <input
          type="number"
          aria-label={ariaLabel}
          value={(value as number) ?? ''}
          onChange={(e) => onChange(e.target.valueAsNumber)}
          required={subField.required}
          className={baseInput}
        />
      );

    case 'checkbox':
      return (
        <div className="flex items-center gap-2 h-10">
          <input
            type="checkbox"
            id={subField.name}
            checked={(value as boolean) ?? false}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor={subField.name} className="text-sm text-muted-foreground">
            Enabled
          </label>
        </div>
      );

    case 'select': {
      const opts = subField.options ?? [];
      return (
        <select
          aria-label={ariaLabel}
          title={ariaLabel}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">— Select —</option>
          {opts.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    case 'upload':
      return (
        <MediaSelector
          value={value as { id: string; url: string } | null}
          onChange={(m) => onChange(m)}
        />
      );

    case 'group':
      // Nested group — recurse
      if (subField.fields && subField.fields.length > 0) {
        return (
          <GroupFieldEditor
            field={subField}
            value={(value as Record<string, unknown>) ?? {}}
            onChange={onChange}
            activeLocale={activeLocale}
            depth={1}
          />
        );
      }
      return (
        <pre className="text-xs bg-muted rounded p-2 overflow-auto max-h-32">
          {JSON.stringify(value, null, 2)}
        </pre>
      );

    case 'array':
      // Array with sub-fields — render as repeatable rows
      if (subField.fields && subField.fields.length > 0) {
        return (
          <ArrayFieldEditor
            field={subField}
            value={(value as Record<string, unknown>[]) ?? []}
            onChange={onChange}
            activeLocale={activeLocale}
          />
        );
      }
      return (
        <pre className="text-xs bg-muted rounded p-2 overflow-auto max-h-32">
          {JSON.stringify(value, null, 2)}
        </pre>
      );

    default:
      return (
        <input
          type="text"
          aria-label={ariaLabel}
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          className={baseInput}
        />
      );
  }
}

// ── Array field editor (repeatable rows) ──────────────────────────────────

interface ArrayFieldEditorProps {
  field: CollectionFieldMeta;
  value: Record<string, unknown>[];
  onChange: (val: unknown) => void;
  activeLocale: string;
}

function ArrayFieldEditor({ field, value, onChange, activeLocale }: ArrayFieldEditorProps) {
  const subFields = field.fields ?? [];
  const items = value ?? [];

  const updateItem = (index: number, subName: string, subVal: unknown) => {
    const updated = items.map((item, i) =>
      i === index ? { ...item, [subName]: subVal } : item
    );
    onChange(updated);
  };

  const addItem = () => {
    const blank: Record<string, unknown> = {};
    for (const sf of subFields) blank[sf.name] = sf.type === 'checkbox' ? false : '';
    onChange([...items, blank]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const next = [...items];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="rounded-md border bg-muted/30 p-3 space-y-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-muted-foreground">Item {index + 1}</span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => moveItem(index, 'up')}
                disabled={index === 0}
                className="text-xs px-1.5 py-0.5 rounded border border-input hover:bg-accent disabled:opacity-30"
                title="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveItem(index, 'down')}
                disabled={index === items.length - 1}
                className="text-xs px-1.5 py-0.5 rounded border border-input hover:bg-accent disabled:opacity-30"
                title="Move down"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-xs px-1.5 py-0.5 rounded border border-destructive/50 text-destructive hover:bg-destructive/10"
              >
                Remove
              </button>
            </div>
          </div>
          {subFields.map((sf) => (
            <div key={sf.name} className="space-y-1">
              <label className="text-xs text-muted-foreground">
                {sf.label ?? toLabel(sf.name)}
                {sf.localized && (
                  <span className="ml-1 text-xs text-muted-foreground/70">({activeLocale})</span>
                )}
              </label>
              <SubFieldInput
                subField={sf}
                value={item[sf.name]}
                onChange={(val) => updateItem(index, sf.name, val)}
                activeLocale={activeLocale}
              />
            </div>
          ))}
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="text-sm text-primary hover:underline"
      >
        + Add item
      </button>
    </div>
  );
}

// ── GroupFieldEditor (main export) ─────────────────────────────────────────

export function GroupFieldEditor({
  field,
  value,
  onChange,
  activeLocale = 'en',
  locales,
  depth = 0,
}: GroupFieldEditorProps) {
  const subFields = field.fields ?? [];
  const groupData = value ?? {};

  const updateSubField = useCallback(
    (name: string, newVal: unknown) => {
      onChange({ ...groupData, [name]: newVal });
    },
    [groupData, onChange]
  );

  return (
    <div
      className={cn(
        'space-y-4',
        depth > 0 && 'pl-4 border-l-2 border-muted mt-1'
      )}
    >
      {subFields.map((subField) => {
        if (subField.hidden) return null;
        const label = subField.label ?? toLabel(subField.name);
        const hasLocaleIndicator = subField.localized && locales && locales.length > 1;

        return (
          <div key={subField.name} className="space-y-1.5">
            <label className="text-sm font-medium leading-none flex items-center gap-2">
              {label}
              {subField.required && <span className="text-red-500">*</span>}
              {hasLocaleIndicator && (
                <span className="text-xs text-muted-foreground font-normal">
                  — {activeLocale.toUpperCase()}
                </span>
              )}
            </label>
            {subField.description && (
              <p className="text-xs text-muted-foreground">{subField.description}</p>
            )}
            <SubFieldInput
              subField={subField}
              value={groupData[subField.name]}
              onChange={(val) => updateSubField(subField.name, val)}
              activeLocale={activeLocale}
            />
          </div>
        );
      })}
    </div>
  );
}
