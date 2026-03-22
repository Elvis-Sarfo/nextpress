'use client';

/**
 * Collection Edit Form — loads existing data, handles all field types
 * (including relationship multi-select and localized fields), and saves via the admin API.
 */

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Clock,
  Eye,
  Globe,
  GlobeLock,
  PencilLine,
  Save,
  Trash2,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { slugify } from '@/lib/utils';
import { useAdminLocale } from '@/components/providers/AdminLocaleProvider';
import type { CollectionMeta, CollectionFieldMeta } from '@/lib/collections-data';
import { BlockContentEditor } from '@/components/admin/BlockContentEditor';
import { JsonCodeEditor } from '@/components/admin/JsonCodeEditor';
import { MediaSelector } from '@/components/admin/MediaSelector';
import { PageSectionsEditor } from '@/components/admin/PageSectionsEditor';
import { MenuItemsEditor, type MenuItem } from '@/components/admin/MenuItemsEditor/MenuItemsEditor';
import { DataSourceBuilder, type DataSourceValue } from '@/components/admin/DataSourceBuilder/DataSourceBuilder';
import { RichtextEditor } from '@/components/admin/RichtextEditor';
import { ArrayFieldEditor, GroupFieldEditor } from '@/components/admin/GroupFieldEditor/GroupFieldEditor';
import { ProductMediaEditor } from '@/components/admin/ProductMediaEditor';

interface CollectionEditProps {
  collection: CollectionMeta;
  documentId?: string;
  mode?: 'page' | 'modal' | 'slider';
  onSaved?: (doc: Record<string, unknown>) => void;
  onDeleted?: (id: string) => void;
  onCancel?: () => void;
}

type FieldValue = string | number | boolean | string[] | Record<string, unknown> | null;

function getOptionLabel(
  doc: Record<string, unknown>,
  locale: string
): string {
  const candidates = [doc.displayName, doc.name, doc.email, doc.id];

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate;
    }
    if (candidate && typeof candidate === 'object' && !Array.isArray(candidate)) {
      const localized = candidate as Record<string, unknown>;
      const value = localized[locale] ?? localized.en ?? Object.values(localized).find((item) => typeof item === 'string');
      if (typeof value === 'string' && value.trim()) {
        return value;
      }
    }
  }

  return String(doc.id ?? 'Untitled');
}

export function CollectionEdit({
  collection,
  documentId,
  mode = 'page',
  onSaved,
  onDeleted,
  onCancel,
}: CollectionEditProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, FieldValue>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(!!documentId);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const isPageCollection = collection.slug === 'pages';
  const isPostCollection = collection.slug === 'posts';
  const isProductCollection = collection.slug === 'products';
  const isProductCategoryCollection = collection.slug === 'product-categories';
  const isCountryCollection = collection.slug === 'countries';
  const isJobCollection = collection.slug === 'jobs';
  const isPageMode = mode === 'page';


  // Options for relationship fields: slug → list of {id, name/displayName/email}
  const [relationOptions, setRelationOptions] = useState<
    Record<string, { id: string; label: string }[]>
  >({});

  // ── Locale state ────────────────────────────────────────────────────────────
  const { locale: adminLocale } = useAdminLocale();
  const collectionLocales = collection.localization?.locales ?? ['en', 'fr'];
  const [activeLocale, setActiveLocale] = useState(() => adminLocale);
  const hasLocalizedFields = collection.fields.some((f) => f.localized);

  // Sync active locale when global admin locale changes
  useEffect(() => {
    setActiveLocale(adminLocale);
  }, [adminLocale]);

  // ── Load existing document ──────────────────────────────────────────────────
  useEffect(() => {
    if (!documentId) {
      // Set default values for new document
      const defaults: Record<string, FieldValue> = {};
      for (const field of collection.fields) {
        if ('defaultValue' in field) {
          defaults[field.name] = (field as { defaultValue?: FieldValue }).defaultValue ?? null;
        } else if (field.type === 'relationship' && field.hasMany) {
          defaults[field.name] = [];
        } else {
          defaults[field.name] = null;
        }
      }
      setFormData(defaults);
      return;
    }

    setIsLoading(true);
    fetch(`/api/admin/collections/${collection.slug}/${documentId}`)
      .then((r) => r.json())
      .then((data) => {
        const doc: Record<string, FieldValue> = {};
        const raw = data.doc as Record<string, unknown>;
        for (const field of collection.fields) {
          const val = raw[field.name];
          if (field.type === 'relationship' && field.hasMany && Array.isArray(val)) {
            // Store as array of IDs
            doc[field.name] = (val as Array<{ id: string }>).map((v) => v.id);
          } else {
            doc[field.name] = (val ?? null) as FieldValue;
          }
        }
        setFormData(doc);
      })
      .catch((e) => console.error('Failed to load document', e))
      .finally(() => setIsLoading(false));
  }, [collection.fields, collection.slug, documentId]);

  // ── Load relationship options ───────────────────────────────────────────────
  useEffect(() => {
    const relFields = collection.fields.filter(
      (f) => f.type === 'relationship' && f.relationTo
    );
    if (relFields.length === 0) return;

    for (const field of relFields) {
      const target = field.relationTo!;
      fetch(`/api/admin/collections/${target}?limit=200`)
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`${r.status}`))))
        .then((data) => {
          const options = ((data.docs as Array<Record<string, unknown>>) ?? []).map((doc) => ({
            id: doc.id as string,
            label: getOptionLabel(doc, activeLocale),
          }));
          setRelationOptions((prev) => ({ ...prev, [field.name]: options }));
        })
        .catch((e) => console.error(`Failed to load options for ${target}`, e));
    }
  }, [activeLocale, collection.fields]);

  // ── Save ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    const url = documentId
      ? `/api/admin/collections/${collection.slug}/${documentId}`
      : `/api/admin/collections/${collection.slug}`;
    const method = documentId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setSaveError(data.error ?? 'Save failed');
        return;
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      onSaved?.((data.doc as Record<string, unknown>) ?? {});

      if (!documentId) {
        if (isPageMode) {
          // Redirect to edit page after creation in full-page mode.
          const newId = (data.doc as Record<string, unknown>).id as string;
          router.push(`/admin/${collection.slug}/${newId}`);
        }
      }
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setIsSaving(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!documentId) return;
    if (!confirm('Delete this document? This cannot be undone.')) return;

    const res = await fetch(`/api/admin/collections/${collection.slug}/${documentId}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      onDeleted?.(documentId);
      if (isPageMode) {
        router.push(`/admin/${collection.slug}`);
      }
    } else {
      const data = await res.json();
      alert(data.error ?? 'Delete failed');
    }
  };

  // ── Publish / Unpublish ────────────────────────────────────────────────────
  const hasStatusField = collection.fields.some(
    (f) => f.name === 'status' && f.type === 'select'
  );
  const currentStatus = (formData.status as string) ?? 'draft';
  const isPublished = currentStatus === 'published';

  const handlePublish = async (targetStatus: 'published' | 'draft') => {
    if (!documentId) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      const res = await fetch(
        `/api/admin/collections/${collection.slug}/${documentId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: targetStatus }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setSaveError(data.error ?? 'Status update failed');
        return;
      }
      updateField('status', targetStatus);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setIsSaving(false);
    }
  };

  // Collections that store version history
  const VERSIONED_COLLECTIONS = ['pages', 'media'];
  const hasVersions = VERSIONED_COLLECTIONS.includes(collection.slug);

  const updateField = (fieldName: string, value: FieldValue) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  // ── Update a single locale within a localized field ────────────────────────
  const updateLocalizedField = useCallback((fieldName: string, locale: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: {
        ...((prev[fieldName] as Record<string, unknown>) ?? {}),
        [locale]: value,
      },
    }));
  }, []);

  // ── Toggle a relationship ID in a multi-select ─────────────────────────────
  const toggleRelationId = (fieldName: string, id: string) => {
    const current = (formData[fieldName] as string[]) ?? [];
    const next = current.includes(id)
      ? current.filter((v) => v !== id)
      : [...current, id];
    updateField(fieldName, next);
  };

  // ── Localized field input (single input for the active locale) ─────────────
  const renderLocalizedInput = (field: CollectionFieldMeta) => {
    const localeMap = (formData[field.name] as Record<string, unknown>) ?? {};
    const localeValue = localeMap[activeLocale] ?? '';
    const localizedAs = field.localizedAs ?? 'text';
    const baseInput = 'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

    // ── Block content editor (replaces JSON textarea for blocks collection) ──
    if (collection.slug === 'blocks' && field.name === 'content') {
      const localeContent = (typeof localeValue === 'object' && localeValue !== null
        ? localeValue
        : {}) as Record<string, unknown>;

      return (
        <BlockContentEditor
          content={localeContent}
          definition={formData['contentDefinition']}
          locale={activeLocale}
          onChange={(newContent) => updateLocalizedField(field.name, activeLocale, newContent)}
        />
      );
    }

    if (field.type === 'json' && field.adminComponent === 'menu-items') {
      const menuItemsValue = Array.isArray(localeValue)
        ? localeValue
        : Array.isArray(formData[field.name])
          ? formData[field.name]
          : [];

      return (
        <MenuItemsEditor
          value={menuItemsValue as unknown as MenuItem[]}
          onChange={(items) => updateLocalizedField(field.name, activeLocale, items as unknown as FieldValue)}
        />
      );
    }

    // ── Rich text editor for localized richText fields ──────────────────────
    if (field.type === 'richText') {
      return (
        <RichtextEditor
          value={typeof localeValue === 'string' ? localeValue : ''}
          onChange={(html) => updateLocalizedField(field.name, activeLocale, html)}
          placeholder="Start writing your content..."
        />
      );
    }

    const inputId = `${field.name}-${activeLocale}`;
    const ariaLabel = `${getFieldLabel(field)} (${activeLocale.toUpperCase()})`;

    if (localizedAs === 'text') {
      const isPostSlugField = isPostCollection && field.name === 'slug';
      const titleMap = (formData.title as Record<string, unknown>) ?? {};
      const titleValue = titleMap[activeLocale];
      const generatedSlug =
        typeof titleValue === 'string' && titleValue.trim() ? slugify(titleValue) : '';

      return (
        <div className="flex items-center gap-2">
          <input
            id={inputId}
            type="text"
            aria-label={ariaLabel}
            value={String(localeValue)}
            onChange={(e) => updateLocalizedField(field.name, activeLocale, e.target.value)}
            required={field.required && activeLocale === collectionLocales[0]}
            placeholder={isPostSlugField ? 'Leave empty to auto-generate from title' : undefined}
            className={cn(baseInput, 'h-10')}
          />
          {isPostSlugField && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!generatedSlug}
              onClick={() => updateLocalizedField(field.name, activeLocale, generatedSlug)}
              className="shrink-0"
            >
              Generate
            </Button>
          )}
        </div>
      );
    }

    if (localizedAs === 'textarea') {
      return (
        <textarea
          id={inputId}
          aria-label={ariaLabel}
          value={String(localeValue)}
          onChange={(e) => updateLocalizedField(field.name, activeLocale, e.target.value)}
          rows={4}
          className={cn(baseInput, 'min-h-[80px]')}
        />
      );
    }

    if (localizedAs === 'richText') {
      return (
        <RichtextEditor
          value={typeof localeValue === 'string' ? localeValue : ''}
          onChange={(html) => updateLocalizedField(field.name, activeLocale, html)}
          placeholder="Start writing..."
        />
      );
    }

    // localizedAs === 'json'
    return (
      <JsonCodeEditor
        id={inputId}
        value={typeof localeValue === 'object' ? localeValue : null}
        onChange={(next) => updateLocalizedField(field.name, activeLocale, next)}
        rows={10}
      />
    );
  };

  // ── Field renderers ────────────────────────────────────────────────────────
  const renderField = (field: CollectionFieldMeta) => {
    if (field.hidden) return null;

    // Localized fields: render a single input for the active locale
    if (field.localized) {
      return renderLocalizedInput(field);
    }

    const value = formData[field.name] ?? null;
    const baseInput =
      'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';
    const isReadOnly = Boolean(field.readOnly);
    const isDisabled = Boolean(field.disabled);

    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <input
            type={field.type}
            id={field.name}
            value={(value as string) || ''}
            onChange={(e) => updateField(field.name, e.target.value)}
            required={field.required}
            readOnly={isReadOnly}
            disabled={isDisabled}
            className={baseInput}
          />
        );

      case 'textarea':
        return (
          <textarea
            id={field.name}
            value={(value as string) || ''}
            onChange={(e) => updateField(field.name, e.target.value)}
            required={field.required}
            readOnly={isReadOnly}
            disabled={isDisabled}
            rows={4}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        );

      case 'number':
        return (
          <input
            type="number"
            id={field.name}
            value={(value as number) ?? ''}
            onChange={(e) => {
              const nextValue = e.target.value === '' ? null : e.target.valueAsNumber;
              updateField(field.name, Number.isNaN(nextValue) ? null : nextValue);
            }}
            required={field.required}
            readOnly={isReadOnly}
            disabled={isDisabled}
            className={baseInput}
          />
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={field.name}
              checked={(value as boolean) || false}
              onChange={(e) => updateField(field.name, e.target.checked)}
              disabled={isDisabled || isReadOnly}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor={field.name} className="text-sm text-muted-foreground">
              Enabled
            </label>
          </div>
        );

      case 'select': {
        const opts = field.options ?? [];
        return (
          <select
            id={field.name}
            value={(value as string) || ''}
            onChange={(e) => updateField(field.name, e.target.value)}
            required={field.required}
            disabled={isDisabled || isReadOnly}
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

      case 'relationship': {
        if (!field.hasMany) {
          // Single relationship — simple select
          const opts = relationOptions[field.name] ?? [];
          return (
            <select
              id={field.name}
              value={(value as string) || ''}
              onChange={(e) => updateField(field.name, e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">— None —</option>
              {opts.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          );
        }

        // Many-to-many — checkbox list
        const opts = relationOptions[field.name] ?? [];
        const selected = (value as string[]) ?? [];
        return (
          <div className="rounded-md border bg-background p-3 space-y-2 max-h-56 overflow-y-auto">
            {opts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No {field.relationTo} available
              </p>
            ) : (
              opts.map((opt) => (
                <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selected.includes(opt.id)}
                    onChange={() => toggleRelationId(field.name, opt.id)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm">{opt.label}</span>
                </label>
              ))
            )}
          </div>
        );
      }

      case 'date':
        return (
          <input
            type="date"
            id={field.name}
            value={(value as string) || ''}
            onChange={(e) => updateField(field.name, e.target.value)}
            className={baseInput}
          />
        );

      case 'json':
        if (field.adminComponent === 'menu-items') {
          return (
            <MenuItemsEditor
              value={(value ?? []) as unknown as MenuItem[]}
              onChange={(items) => updateField(field.name, items as unknown as FieldValue)}
            />
          );
        }

        if (collection.slug === 'pages' && field.name === 'sections') {
          return (
            <PageSectionsEditor
              value={value}
              onChange={(sections) => updateField(field.name, sections as unknown as FieldValue)}
            />
          );
        }

        if (collection.slug === 'blocks' && field.name === 'dataSource') {
          return (
            <DataSourceBuilder
              key={documentId ?? 'new'}
              value={(value as DataSourceValue) ?? {}}
              onChange={(v) => updateField(field.name, v as FieldValue)}
            />
          );
        }

        if (collection.slug === 'products' && field.name === 'media') {
          return (
            <ProductMediaEditor
              value={value}
              onChange={(items) => updateField(field.name, items as unknown as FieldValue)}
            />
          );
        }

        if (collection.slug === 'blocks' && field.name === 'contentDefinition') {
          return (
            <details className="group rounded-md border border-input bg-muted/30">
              <summary className="flex cursor-pointer select-none items-center justify-between px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground list-none">
                <span>Content Definition (schema)</span>
                <span className="text-xs group-open:hidden">▶ expand</span>
                <span className="text-xs hidden group-open:inline">▼ collapse</span>
              </summary>
              <div className="border-t px-3 py-3">
                <JsonCodeEditor
                  id={field.name}
                  value={value}
                  onChange={(next) => updateField(field.name, next as FieldValue)}
                  rows={10}
                />
              </div>
            </details>
          );
        }

        return (
          <JsonCodeEditor
            id={field.name}
            value={value}
            onChange={(next) => updateField(field.name, next as FieldValue)}
            rows={10}
          />
        );

      case 'richText':
        // For Posts collection, use the full-featured WYSIWYG editor
        if (isPostCollection) {
          return (
            <RichtextEditor
              value={(value as string) || ''}
              onChange={(html) => updateField(field.name, html)}
              placeholder="Start writing your post content..."
            />
          );
        }
        // Fallback to textarea for other collections
        return (
          <textarea
            id={field.name}
            value={(value as string) || ''}
            onChange={(e) => updateField(field.name, e.target.value)}
            required={field.required}
            rows={8}
            className="flex min-h-[160px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        );

      case 'group':
        // If sub-field metadata is available, render each sub-field natively
        if (field.fields && field.fields.length > 0) {
          return (
            <GroupFieldEditor
              field={field}
              value={(value as Record<string, unknown>) ?? {}}
              onChange={(updated) => updateField(field.name, updated as FieldValue)}
              activeLocale={activeLocale}
              locales={collectionLocales}
            />
          );
        }
        // Fallback: JSON editor when no sub-field metadata is available
        return (
          <JsonCodeEditor
            id={field.name}
            value={value}
            onChange={(next) => updateField(field.name, next as FieldValue)}
            rows={6}
          />
        );

      case 'upload':
        return (
          <MediaSelector
            value={value as { id: string; url: string } | null}
            onChange={(m) => updateField(field.name, m)}
          />
        );

      case 'array': {
        if (field.fields && field.fields.length > 0) {
          return (
            <ArrayFieldEditor
              field={field}
              value={((value as unknown) as Record<string, unknown>[]) ?? []}
              onChange={(updated) => updateField(field.name, updated as FieldValue)}
              activeLocale={activeLocale}
            />
          );
        }

        // For tags field in Posts, render as tag inputs
        if (isPostCollection && field.name === 'tags') {
          const items = (value as Array<{ tag?: string }>) ?? [];
          const tags = items.map((item) => item.tag).filter(Boolean) as string[];
          
          const addTag = (tag: string) => {
            if (tag.trim()) {
              const newItems = [...items, { tag: tag.trim() }];
              updateField(field.name, newItems as unknown as FieldValue);
            }
          };
          
          const removeTag = (index: number) => {
            const newItems = items.filter((_, i) => i !== index);
            updateField(field.name, newItems as unknown as FieldValue);
          };
          
          return (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1.5 min-h-[32px]">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="hover:text-destructive"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Add tag..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag((e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value.trim()) {
                    addTag(e.target.value);
                    e.target.value = '';
                  }
                }}
                className={baseInput}
              />
            </div>
          );
        }
        
        // Default array rendering for other collections
        const items = (value as unknown as Array<Record<string, unknown>>) ?? [];
        return (
          <div className="rounded-md border bg-muted/30 p-3 space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-sm flex-1">{JSON.stringify(item)}</span>
                <button
                  type="button"
                  onClick={() => {
                    const newItems = items.filter((_, i) => i !== index);
                    updateField(field.name, newItems as unknown as FieldValue);
                  }}
                  className="text-destructive text-sm hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newItems = [...items, {}];
                updateField(field.name, newItems as unknown as FieldValue);
              }}
              className="text-sm text-primary hover:underline"
            >
              + Add item
            </button>
          </div>
        );
      }

      default:
        return (
          <input
            type="text"
            id={field.name}
            value={String(value || '')}
            onChange={(e) => updateField(field.name, e.target.value)}
            className={baseInput}
          />
        );
    }
  };

  const getFieldLabel = (field: CollectionFieldMeta) =>
    field.label || field.name.charAt(0).toUpperCase() + field.name.slice(1).replace(/([A-Z])/g, ' $1');

  const visibleFields = collection.fields.filter((f) => {
    if (f.hidden) return false;
    // Block content is edited on its own dedicated page (/admin/blocks/[id]/content)
    if (collection.slug === 'blocks' && f.name === 'content') return false;
    return true;
  });

  // For pages, these fields go in the right sidebar (in order)
  const PAGE_SIDEBAR_FIELDS = ['status', 'parentId', 'order', 'featuredImage', 'seo', 'config'];

  // For posts, these metadata fields go in the right sidebar (WordPress-style)
  const POST_SIDEBAR_FIELDS = [
    'status',
    'category',
    'featuredImage',
    'author',
    'tags',
    'publishedAt',
    'seo',
  ];

  const PRODUCT_SIDEBAR_FIELDS = ['category', 'featured', 'order'];
  const PRODUCT_CATEGORY_SIDEBAR_FIELDS = ['slug', 'image', 'icon', 'parentCategoryId', 'order'];
  const COUNTRY_SIDEBAR_FIELDS = ['code', 'flag', 'color', 'backgroundImage', 'order'];
  const JOB_SIDEBAR_FIELDS = ['employmentType', 'flag', 'applyLink', 'order'];

  const mainFields = isPageCollection
    ? visibleFields.filter((f) => !PAGE_SIDEBAR_FIELDS.includes(f.name))
    : isPostCollection
    ? visibleFields.filter((f) => !POST_SIDEBAR_FIELDS.includes(f.name))
    : isProductCollection
    ? visibleFields.filter((f) => !PRODUCT_SIDEBAR_FIELDS.includes(f.name))
    : isProductCategoryCollection
    ? visibleFields.filter((f) => !PRODUCT_CATEGORY_SIDEBAR_FIELDS.includes(f.name))
    : isCountryCollection
    ? visibleFields.filter((f) => !COUNTRY_SIDEBAR_FIELDS.includes(f.name))
    : isJobCollection
    ? visibleFields.filter((f) => !JOB_SIDEBAR_FIELDS.includes(f.name))
    : visibleFields;

  const sidebarFields = isPageCollection
    ? PAGE_SIDEBAR_FIELDS.map((name) => visibleFields.find((f) => f.name === name)).filter(Boolean) as typeof visibleFields
    : isPostCollection
    ? POST_SIDEBAR_FIELDS.map((name) => visibleFields.find((f) => f.name === name)).filter(Boolean) as typeof visibleFields
    : isProductCollection
    ? PRODUCT_SIDEBAR_FIELDS.map((name) => visibleFields.find((f) => f.name === name)).filter(Boolean) as typeof visibleFields
    : isProductCategoryCollection
    ? PRODUCT_CATEGORY_SIDEBAR_FIELDS.map((name) => visibleFields.find((f) => f.name === name)).filter(Boolean) as typeof visibleFields
    : isCountryCollection
    ? COUNTRY_SIDEBAR_FIELDS.map((name) => visibleFields.find((f) => f.name === name)).filter(Boolean) as typeof visibleFields
    : isJobCollection
    ? JOB_SIDEBAR_FIELDS.map((name) => visibleFields.find((f) => f.name === name)).filter(Boolean) as typeof visibleFields
    : [];

  // ── Preview URL (pages only) ─────────────────────────────────────────────
  const previewSlug = isPageCollection
    ? ((formData.slug as Record<string, string> | null)?.[activeLocale] ?? '')
    : '';
  const previewUrl =
    isPageCollection && documentId && previewSlug
      ? `/api/preview?id=${encodeURIComponent(documentId)}&type=page&locale=${encodeURIComponent(activeLocale)}`
      : '';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const formBody = (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {isPageMode ? (
            <Link href={`/admin/${collection.slug}`}>
              <Button variant="ghost" size="icon" type="button">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Button variant="ghost" size="sm" type="button" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <div>
            <h1 className={cn(isPageMode ? 'text-3xl' : 'text-2xl', 'font-bold tracking-tight')}>
              {documentId ? 'Edit' : 'Create'} {collection.labels.singular}
            </h1>
            <p className="text-muted-foreground mt-1">
              {documentId
                ? `Editing ${collection.labels.singular.toLowerCase()}`
                : `Creating a new ${collection.labels.singular.toLowerCase()}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {collection.slug === 'blocks' && documentId && (
            <Link href={`/admin/blocks/${documentId}/content`}>
              <Button type="button" variant="outline">
                <PencilLine className="mr-2 h-4 w-4" />
                Edit Content
              </Button>
            </Link>
          )}

          {isPageCollection && documentId && previewUrl && (
            <a href={previewUrl} target="_blank" rel="noreferrer">
              <Button type="button" variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
            </a>
          )}

          {hasVersions && documentId && (
            <Link href={`/admin/${collection.slug}/${documentId}/history`}>
              <Button type="button" variant="outline">
                <Clock className="mr-2 h-4 w-4" />
                History
              </Button>
            </Link>
          )}

          {/* Locale switcher — only shown for collections with localized fields */}
          {hasLocalizedFields && (
            <div className="flex items-center gap-1.5 rounded-md border border-input px-2 py-1">
              <span className="text-xs text-muted-foreground">Locale:</span>
              {collectionLocales.map((loc) => {
                const localeMap = formData as Record<string, Record<string, unknown>>;
                const hasAnyContent = collection.fields
                  .filter((f) => f.localized)
                  .some((f) => {
                    const v = localeMap[f.name];
                    return v && typeof v === 'object' && (v as Record<string, unknown>)[loc];
                  });
                return (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setActiveLocale(loc)}
                    className={cn(
                      'px-2 py-0.5 rounded text-xs font-medium transition-colors',
                      loc === activeLocale
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground',
                      hasAnyContent && loc !== activeLocale && 'underline decoration-dotted'
                    )}
                    title={hasAnyContent ? `${loc.toUpperCase()} — has content` : loc.toUpperCase()}
                  >
                    {loc.toUpperCase()}
                  </button>
                );
              })}
            </div>
          )}

          {saveSuccess && (
            <span className="text-sm text-green-600 font-medium">Saved</span>
          )}
          {saveError && (
            <span className="text-sm text-red-600">{saveError}</span>
          )}
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isSaving ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Fields */}
      <div className={isPostCollection || isProductCollection ? 'flex gap-8' : sidebarFields.length > 0 ? 'grid gap-8 lg:grid-cols-3' : 'grid gap-8 lg:grid-cols-3'}>
        {/* Main Content Area */}
        <div className={isPostCollection || isProductCollection ? 'flex-1 min-w-0' : 'lg:col-span-2 space-y-6'}>
          {isPostCollection ? (
            // WordPress-style layout for Posts: stacked with larger rich text editor
            <div className="space-y-6">
              {mainFields.map((field) => (
                <div key={field.name} className={field.name === 'content' ? 'space-y-2' : 'space-y-2'}>
                  <label
                    htmlFor={field.localized ? undefined : field.name}
                    className="text-sm font-medium leading-none"
                  >
                    {getFieldLabel(field)}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                    {field.localized && (
                      <span className="ml-2 text-xs text-muted-foreground font-normal">
                        — {activeLocale.toUpperCase()}
                      </span>
                    )}
                  </label>
                  {/* Make content field larger for posts */}
                  {field.name === 'content' ? (
                    <div className="[&_.ProseMirror]:min-h-[400px]">
                      {renderField(field)}
                    </div>
                  ) : (
                    renderField(field)
                  )}
                </div>
              ))}
            </div>
          ) : isProductCollection ? (
            <div className="space-y-6">
              {mainFields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <label
                    htmlFor={field.localized ? undefined : field.name}
                    className="text-sm font-medium leading-none"
                  >
                    {getFieldLabel(field)}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                    {field.localized && (
                      <span className="ml-2 text-xs text-muted-foreground font-normal">
                        — {activeLocale.toUpperCase()}
                      </span>
                    )}
                  </label>
                  {renderField(field)}
                </div>
              ))}
            </div>
          ) : (
            // Default layout for other collections
            <div className="space-y-6">
              {mainFields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <label
                    htmlFor={field.localized ? undefined : field.name}
                    className="text-sm font-medium leading-none"
                  >
                    {getFieldLabel(field)}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                    {field.localized && (
                      <span className="ml-2 text-xs text-muted-foreground font-normal">
                        — {activeLocale.toUpperCase()}
                      </span>
                    )}
                  </label>
                  {renderField(field)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className={isPostCollection || isProductCollection ? 'w-80 flex-shrink-0 space-y-4' : 'space-y-4'}>
          {/* Post metadata sidebar - organized in collapsible sections */}
          {sidebarFields.length > 0 && (
            <div className="rounded-lg border bg-card divide-y">
              {isProductCollection && (
                <>
                  {sidebarFields.find((f) => f.name === 'category') && (
                    <div className="p-4 space-y-3">
                      <h3 className="font-semibold text-sm">Category</h3>
                      {renderField(sidebarFields.find((f) => f.name === 'category')!)}
                    </div>
                  )}

                  {(sidebarFields.find((f) => f.name === 'featured') || sidebarFields.find((f) => f.name === 'order')) && (
                    <div className="p-4 space-y-3">
                      <h3 className="font-semibold text-sm">Display</h3>
                      {sidebarFields.find((f) => f.name === 'featured') && (
                        <div className="space-y-1.5">
                          <label className="text-xs text-muted-foreground">Featured</label>
                          {renderField(sidebarFields.find((f) => f.name === 'featured')!)}
                        </div>
                      )}
                      {sidebarFields.find((f) => f.name === 'order') && (
                        <div className="space-y-1.5">
                          <label className="text-xs text-muted-foreground">Order</label>
                          {renderField(sidebarFields.find((f) => f.name === 'order')!)}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {isProductCategoryCollection && (
                <>
                  {(sidebarFields.find((f) => f.name === 'slug') || sidebarFields.find((f) => f.name === 'order')) && (
                    <div className="p-4 space-y-3">
                      <h3 className="font-semibold text-sm">Structure</h3>
                      {sidebarFields.find((f) => f.name === 'slug') && (
                        <div className="space-y-1.5">
                          <label className="text-xs text-muted-foreground">Slug</label>
                          {renderField(sidebarFields.find((f) => f.name === 'slug')!)}
                        </div>
                      )}
                      {sidebarFields.find((f) => f.name === 'parentCategoryId') && (
                        <div className="space-y-1.5">
                          <label className="text-xs text-muted-foreground">Parent Category ID</label>
                          {renderField(sidebarFields.find((f) => f.name === 'parentCategoryId')!)}
                        </div>
                      )}
                      {sidebarFields.find((f) => f.name === 'order') && (
                        <div className="space-y-1.5">
                          <label className="text-xs text-muted-foreground">Order</label>
                          {renderField(sidebarFields.find((f) => f.name === 'order')!)}
                        </div>
                      )}
                    </div>
                  )}

                  {(sidebarFields.find((f) => f.name === 'image') || sidebarFields.find((f) => f.name === 'icon')) && (
                    <div className="p-4 space-y-3">
                      <h3 className="font-semibold text-sm">Display</h3>
                      {sidebarFields.find((f) => f.name === 'image') && (
                        <div className="space-y-1.5">
                          <label className="text-xs text-muted-foreground">Image</label>
                          {renderField(sidebarFields.find((f) => f.name === 'image')!)}
                        </div>
                      )}
                      {sidebarFields.find((f) => f.name === 'icon') && (
                        <div className="space-y-1.5">
                          <label className="text-xs text-muted-foreground">Icon</label>
                          {renderField(sidebarFields.find((f) => f.name === 'icon')!)}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {isCountryCollection && (
                <>
                  {(sidebarFields.find((f) => f.name === 'code') || sidebarFields.find((f) => f.name === 'flag')) && (
                    <div className="p-4 space-y-3">
                      <h3 className="font-semibold text-sm">Identity</h3>
                      {sidebarFields.find((f) => f.name === 'code') && (
                        <div className="space-y-1.5">
                          <label className="text-xs text-muted-foreground">Code</label>
                          {renderField(sidebarFields.find((f) => f.name === 'code')!)}
                        </div>
                      )}
                      {sidebarFields.find((f) => f.name === 'flag') && (
                        <div className="space-y-1.5">
                          <label className="text-xs text-muted-foreground">Flag</label>
                          {renderField(sidebarFields.find((f) => f.name === 'flag')!)}
                        </div>
                      )}
                    </div>
                  )}

                  {(sidebarFields.find((f) => f.name === 'color') || sidebarFields.find((f) => f.name === 'backgroundImage') || sidebarFields.find((f) => f.name === 'order')) && (
                    <div className="p-4 space-y-3">
                      <h3 className="font-semibold text-sm">Display</h3>
                      {sidebarFields.find((f) => f.name === 'color') && (
                        <div className="space-y-1.5">
                          <label className="text-xs text-muted-foreground">Accent Color</label>
                          {renderField(sidebarFields.find((f) => f.name === 'color')!)}
                        </div>
                      )}
                      {sidebarFields.find((f) => f.name === 'backgroundImage') && (
                        <div className="space-y-1.5">
                          <label className="text-xs text-muted-foreground">Background Image</label>
                          {renderField(sidebarFields.find((f) => f.name === 'backgroundImage')!)}
                        </div>
                      )}
                      {sidebarFields.find((f) => f.name === 'order') && (
                        <div className="space-y-1.5">
                          <label className="text-xs text-muted-foreground">Order</label>
                          {renderField(sidebarFields.find((f) => f.name === 'order')!)}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {isJobCollection && (
                <>
                  {(sidebarFields.find((f) => f.name === 'employmentType') || sidebarFields.find((f) => f.name === 'flag')) && (
                    <div className="p-4 space-y-3">
                      <h3 className="font-semibold text-sm">Job Meta</h3>
                      {sidebarFields.find((f) => f.name === 'employmentType') && (
                        <div className="space-y-1.5">
                          <label className="text-xs text-muted-foreground">Employment Type</label>
                          {renderField(sidebarFields.find((f) => f.name === 'employmentType')!)}
                        </div>
                      )}
                      {sidebarFields.find((f) => f.name === 'flag') && (
                        <div className="space-y-1.5">
                          <label className="text-xs text-muted-foreground">Flag</label>
                          {renderField(sidebarFields.find((f) => f.name === 'flag')!)}
                        </div>
                      )}
                    </div>
                  )}

                  {(sidebarFields.find((f) => f.name === 'applyLink') || sidebarFields.find((f) => f.name === 'order')) && (
                    <div className="p-4 space-y-3">
                      <h3 className="font-semibold text-sm">Apply & Order</h3>
                      {sidebarFields.find((f) => f.name === 'applyLink') && (
                        <div className="space-y-1.5">
                          <label className="text-xs text-muted-foreground">Apply Link</label>
                          {renderField(sidebarFields.find((f) => f.name === 'applyLink')!)}
                        </div>
                      )}
                      {sidebarFields.find((f) => f.name === 'order') && (
                        <div className="space-y-1.5">
                          <label className="text-xs text-muted-foreground">Order</label>
                          {renderField(sidebarFields.find((f) => f.name === 'order')!)}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {!isProductCollection && !isProductCategoryCollection && !isCountryCollection && !isJobCollection && (
                <>
              {/* Status Section */}
              {sidebarFields.find((f) => f.name === 'status') && (
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    Status
                  </h3>
                  {renderField(sidebarFields.find((f) => f.name === 'status')!)}
                </div>
              )}

              {/* Publication Section */}
              {(sidebarFields.find((f) => f.name === 'publishedAt') || sidebarFields.find((f) => f.name === 'category')) && (
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-sm">Publication</h3>
                  {sidebarFields.find((f) => f.name === 'category') && (
                    <div className="space-y-1.5">
                      <label className="text-xs text-muted-foreground">Category</label>
                      {renderField(sidebarFields.find((f) => f.name === 'category')!)}
                    </div>
                  )}
                  {sidebarFields.find((f) => f.name === 'publishedAt') && (
                    <div className="space-y-1.5">
                      <label className="text-xs text-muted-foreground">Publish Date</label>
                      {renderField(sidebarFields.find((f) => f.name === 'publishedAt')!)}
                    </div>
                  )}
                </div>
              )}

              {/* Media Section */}
              {sidebarFields.find((f) => f.name === 'featuredImage') && (
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-sm">Featured Image</h3>
                  {renderField(sidebarFields.find((f) => f.name === 'featuredImage')!)}
                </div>
              )}

              {/* Author Section */}
              {sidebarFields.find((f) => f.name === 'author') && (
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-sm">Author</h3>
                  {renderField(sidebarFields.find((f) => f.name === 'author')!)}
                </div>
              )}

              {/* Tags Section */}
              {sidebarFields.find((f) => f.name === 'tags') && (
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-sm">Tags</h3>
                  {renderField(sidebarFields.find((f) => f.name === 'tags')!)}
                </div>
              )}

              {/* SEO Section */}
              {sidebarFields.find((f) => f.name === 'seo') && (
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <span className="text-lg">🔍</span>
                    SEO
                  </h3>
                  {renderField(sidebarFields.find((f) => f.name === 'seo')!)}
                </div>
              )}
                </>
              )}
            </div>
          )}

          {/* Password field for users */}
          {collection.slug === 'users' && (
            <div className="rounded-lg border bg-card p-4 space-y-4">
              {sidebarFields.map((field) => (
                <div key={field.name} className="space-y-1.5">
                  <label
                    htmlFor={field.localized ? undefined : field.name}
                    className="text-sm font-medium leading-none"
                  >
                    {getFieldLabel(field)}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {renderField(field)}
                </div>
              ))}
            </div>
          )}

          {/* Password field for users */}
          {collection.slug === 'users' && (
            <div className="rounded-lg border bg-card p-4 space-y-3">
              <h3 className="font-semibold text-sm">
                {documentId ? 'Change Password' : 'Password'}
              </h3>
              <input
                type="password"
                placeholder={documentId ? 'Leave blank to keep current' : 'Set password'}
                onChange={(e) => updateField('password', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          )}

          {/* Actions */}
          {documentId && (
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <h3 className="font-semibold text-sm">Actions</h3>

              {/* Publish / Unpublish */}
              {hasStatusField && (
                isPublished ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handlePublish('draft')}
                    disabled={isSaving}
                  >
                    <GlobeLock className="mr-2 h-4 w-4" />
                    Unpublish
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-green-700 hover:text-green-700 hover:bg-green-50"
                    onClick={() => handlePublish('published')}
                    disabled={isSaving}
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    Publish
                  </Button>
                )
              )}

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50"
                onClick={handleDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete {collection.labels.singular}
              </Button>
            </div>
          )}
        </div>
      </div>
    </form>
  );

  return formBody;
}
