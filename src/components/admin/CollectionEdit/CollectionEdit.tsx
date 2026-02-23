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
import { useAdminLocale } from '@/components/providers/AdminLocaleProvider';
import type { CollectionMeta, CollectionFieldMeta } from '@/lib/collections-data';
import { BlockContentEditor } from '@/components/admin/BlockContentEditor';
import { JsonCodeEditor } from '@/components/admin/JsonCodeEditor';
import { MediaSelector } from '@/components/admin/MediaSelector';
import { PageSectionsEditor } from '@/components/admin/PageSectionsEditor';
import { MenuItemsEditor, type MenuItem } from '@/components/admin/MenuItemsEditor/MenuItemsEditor';
import { DataSourceBuilder, type DataSourceValue } from '@/components/admin/DataSourceBuilder/DataSourceBuilder';

interface CollectionEditProps {
  collection: CollectionMeta;
  documentId?: string;
}

type FieldValue = string | number | boolean | string[] | Record<string, unknown> | null;

export function CollectionEdit({ collection, documentId }: CollectionEditProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, FieldValue>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(!!documentId);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const isPageCollection = collection.slug === 'pages';


  // Options for relationship fields: slug → list of {id, name/displayName/email}
  const [relationOptions, setRelationOptions] = useState<
    Record<string, { id: string; label: string }[]>
  >({});

  // ── Locale state ────────────────────────────────────────────────────────────
  const { locale: adminLocale } = useAdminLocale();
  const collectionLocales = collection.localization?.locales ?? ['en', 'fr', 'de', 'es'];
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
            label: (doc.displayName ?? doc.name ?? doc.email ?? doc.id) as string,
          }));
          setRelationOptions((prev) => ({ ...prev, [field.name]: options }));
        })
        .catch((e) => console.error(`Failed to load options for ${target}`, e));
    }
  }, [collection.fields]);

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

      if (!documentId) {
        // Redirect to edit page after creation
        const newId = (data.doc as Record<string, unknown>).id as string;
        router.push(`/admin/${collection.slug}/${newId}`);
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
      router.push(`/admin/${collection.slug}`);
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

    const inputId = `${field.name}-${activeLocale}`;
    const ariaLabel = `${getFieldLabel(field)} (${activeLocale.toUpperCase()})`;

    if (localizedAs === 'text') {
      return (
        <input
          id={inputId}
          type="text"
          aria-label={ariaLabel}
          value={String(localeValue)}
          onChange={(e) => updateLocalizedField(field.name, activeLocale, e.target.value)}
          required={field.required && activeLocale === collectionLocales[0]}
          className={cn(baseInput, 'h-10')}
        />
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
            onChange={(e) => updateField(field.name, e.target.valueAsNumber)}
            required={field.required}
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

      case 'group':
        // Render seo group as individual sub-fields
        if (collection.slug === 'pages' && field.name === 'seo') {
          const seoVal = (value as Record<string, unknown>) ?? {};
          return (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Meta Title</label>
                <input
                  type="text"
                  value={(seoVal.metaTitle as string) ?? ''}
                  onChange={(e) => updateField(field.name, { ...seoVal, metaTitle: e.target.value })}
                  placeholder="Defaults to page title"
                  className={baseInput}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Meta Description</label>
                <textarea
                  title="Meta Description"
                  value={(seoVal.metaDescription as string) ?? ''}
                  onChange={(e) => updateField(field.name, { ...seoVal, metaDescription: e.target.value })}
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(seoVal.noIndex as boolean) ?? false}
                  onChange={(e) => updateField(field.name, { ...seoVal, noIndex: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="text-xs text-muted-foreground">No index (hide from search engines)</span>
              </label>
            </div>
          );
        }
        // Generic group — JSON editor fallback
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

  const mainFields = isPageCollection
    ? visibleFields.filter((f) => !PAGE_SIDEBAR_FIELDS.includes(f.name))
    : visibleFields;

  const sidebarFields = isPageCollection
    ? PAGE_SIDEBAR_FIELDS.map((name) => visibleFields.find((f) => f.name === name)).filter(Boolean) as typeof visibleFields
    : [];

  // ── Preview URL (pages only) ─────────────────────────────────────────────
  const previewSlug = isPageCollection
    ? ((formData.slug as Record<string, string> | null)?.[activeLocale] ?? '')
    : '';
  const previewUrl = previewSlug ? `/${activeLocale}/${previewSlug}` : '';

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
          <Link href={`/admin/${collection.slug}`}>
            <Button variant="ghost" size="icon" type="button">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
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
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
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

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Page metadata fields */}
          {sidebarFields.length > 0 && (
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
