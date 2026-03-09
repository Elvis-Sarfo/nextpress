'use client';

import type { BlockField } from '@/core/blocks/types';
import { cn } from '@/lib/utils';
import { MediaSelector } from '@/components/admin/MediaSelector';
import { RichtextEditor } from '@/components/admin/RichtextEditor';

interface BlockFieldInputProps {
  field: BlockField;
  value: unknown;
  onChange: (value: unknown) => void;
  id?: string;
}

const baseInput =
  'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

export function BlockFieldInput({ field, value, onChange, id }: BlockFieldInputProps) {
  const inputId = id ?? field.name;
  const strVal = value != null ? String(value) : '';

  switch (field.type) {
    case 'image':
      return (
        <MediaSelector
          value={strVal ? { url: strVal } : null}
          onChange={(m) => onChange(m?.url ?? null)}
          compact
        />
      );

    case 'text':
    case 'icon':
      return (
        <input
          id={inputId}
          type="text"
          value={strVal}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
          placeholder={field.type === 'icon' ? 'Icon name' : undefined}
          className={cn(baseInput, 'h-10')}
        />
      );

    case 'textarea':
      return (
        <textarea
          id={inputId}
          title={field.label ?? field.name}
          value={strVal}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
          rows={4}
          className={cn(baseInput, 'min-h-[80px]')}
        />
      );

    case 'richtext':
      return <RichtextEditor value={strVal} onChange={(html) => onChange(html)} />;

    case 'number':
      return (
        <input
          id={inputId}
          type="number"
          title={field.label ?? field.name}
          value={strVal}
          onChange={(e) => onChange(e.target.valueAsNumber)}
          required={field.required}
          className={cn(baseInput, 'h-10')}
        />
      );

    case 'toggle': {
      const isChecked = Boolean(value === true || value === 'true' || value === 1);
      const toggleId = `${inputId}-toggle`;
      const toggleLabel = field.label ?? field.name;
      // Map to consistent boolean value for storage
      const toggleValue = !isChecked;
      return (
        <div className="flex items-center gap-3">
          <button
            id={toggleId}
            type="button"
            role="switch"
            aria-checked={isChecked}
            aria-label={`${toggleLabel} toggle`}
            aria-describedby={`${toggleId}-status`}
            onClick={() => onChange(toggleValue)}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              isChecked ? 'bg-primary' : 'bg-input'
            )}
          >
            <span
              className={cn(
                'inline-block h-4 w-4 rounded-full bg-white shadow-md transition-transform',
                isChecked ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
          <span id={`${toggleId}-status`} className="text-sm text-muted-foreground">
            {isChecked ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      );
    }

    case 'radio': {
      const opts = field.options ?? [];
      return (
        <div className="flex flex-wrap gap-4">
          {opts.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={inputId}
                value={opt.value}
                checked={value === opt.value}
                onChange={() => onChange(opt.value)}
                className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
              />
              <span className="text-sm">{opt.label}</span>
            </label>
          ))}
        </div>
      );
    }

    case 'select': {
      const opts = field.options ?? [];
      return (
        <select
          id={inputId}
          title={field.label ?? field.name}
          value={strVal}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
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

    default:
      return (
        <input
          id={inputId}
          type="text"
          title={field.label ?? field.name}
          value={strVal}
          onChange={(e) => onChange(e.target.value)}
          className={cn(baseInput, 'h-10')}
        />
      );
  }
}

export function getFieldLabel(field: BlockField): string {
  return (
    field.label ??
    field.name.charAt(0).toUpperCase() + field.name.slice(1).replace(/_([a-z])/g, (_, c: string) => ` ${c.toUpperCase()}`)
  );
}
