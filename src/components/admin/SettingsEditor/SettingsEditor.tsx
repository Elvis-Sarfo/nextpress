'use client';

/**
 * SettingsEditor — tabbed settings UI driven entirely by the collection schema.
 *
 * Layout:
 *   Left sidebar: one tab per group field + a "General" tab for top-level scalar fields.
 *   Right content: GroupFieldEditor for the active group, or native inputs for General.
 *
 * Data flow:
 *   formData (local state) → PUT /api/admin/collections/settings/{id}
 *   All group values are JSON objects stored in the DB.
 */

import { useState, useEffect, useCallback } from 'react';
import { Save, Loader2, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminLocale } from '@/components/providers/AdminLocaleProvider';
import { GroupFieldEditor } from '@/components/admin/GroupFieldEditor/GroupFieldEditor';
import { MediaSelector } from '@/components/admin/MediaSelector';
import type { CollectionMeta, CollectionFieldMeta } from '@/lib/collections-data';

// ── Types ──────────────────────────────────────────────────────────────────

interface SettingsEditorProps {
  meta: CollectionMeta;
  documentId: string;
}

type FieldValue = string | number | boolean | Record<string, unknown> | null;

// ── Helpers ────────────────────────────────────────────────────────────────

function toLabel(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1');
}

const baseInput =
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

// ── Scalar field input (for top-level / General tab) ──────────────────────

interface ScalarFieldInputProps {
  field: CollectionFieldMeta;
  value: FieldValue;
  onChange: (val: FieldValue) => void;
  activeLocale: string;
  locales: string[];
}

function ScalarFieldInput({ field, value, onChange, activeLocale, locales: _locales }: ScalarFieldInputProps) {
  const ariaLabel = field.label ?? toLabel(field.name);

  // Localized scalar: value stored as { en: '...', fr: '...' }
  if (field.localized) {
    const localeMap = (typeof value === 'object' && value !== null
      ? (value as Record<string, unknown>)
      : {});
    const localeValue = localeMap[activeLocale] ?? '';
    const localizedAs = field.localizedAs ?? 'text';

    if (localizedAs === 'textarea') {
      return (
        <textarea
          aria-label={`${ariaLabel} (${activeLocale.toUpperCase()})`}
          value={String(localeValue)}
          onChange={(e) => onChange({ ...localeMap, [activeLocale]: e.target.value })}
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
        onChange={(e) => onChange({ ...localeMap, [activeLocale]: e.target.value })}
        className={baseInput}
      />
    );
  }

  switch (field.type) {
    case 'text':
    case 'email':
      return (
        <input
          type={field.type}
          aria-label={ariaLabel}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
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
          className={baseInput}
        />
      );

    case 'checkbox':
      return (
        <div className="flex items-center gap-2 h-10">
          <input
            type="checkbox"
            aria-label={ariaLabel}
            checked={(value as boolean) ?? false}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span className="text-sm text-muted-foreground">Enabled</span>
        </div>
      );

    case 'select': {
      const opts = field.options ?? [];
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
          onChange={(m) => onChange(m as FieldValue)}
        />
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

// ── SettingsEditor ─────────────────────────────────────────────────────────

export function SettingsEditor({ meta, documentId }: SettingsEditorProps) {
  const { locale: adminLocale } = useAdminLocale();
  const [activeLocale, setActiveLocale] = useState(() => adminLocale);
  const locales = meta.localization?.locales ?? ['en', 'fr'];

  // Sync active locale when global admin locale changes
  useEffect(() => {
    setActiveLocale(adminLocale);
  }, [adminLocale]);

  const [formData, setFormData] = useState<Record<string, FieldValue>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Separate group fields from top-level scalar fields
  const groupFields = meta.fields.filter((f) => f.type === 'group' && !f.hidden);
  const generalFields = meta.fields.filter(
    (f) => f.type !== 'group' && !f.hidden && f.name !== 'status'
  );

  // Build tab list: General (if any scalar fields) + one per group
  type Tab = { id: string; label: string; field?: CollectionFieldMeta };
  const tabs: Tab[] = [
    ...(generalFields.length > 0 ? [{ id: '__general__', label: 'General' }] : []),
    ...groupFields.map((f) => ({
      id: f.name,
      label: f.label ?? toLabel(f.name),
      field: f,
    })),
  ];

  const [activeTab, setActiveTab] = useState<string>(tabs[0]?.id ?? '__general__');

  // Track which tabs have unsaved changes
  const [dirtyTabs, setDirtyTabs] = useState<Set<string>>(new Set());

  // ── Load document ──────────────────────────────────────────────────────
  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/admin/collections/${meta.slug}/${documentId}`)
      .then((r) => r.json())
      .then((data) => {
        const raw = (data.doc ?? {}) as Record<string, unknown>;
        const loaded: Record<string, FieldValue> = {};
        for (const field of meta.fields) {
          loaded[field.name] = (raw[field.name] ?? null) as FieldValue;
        }
        setFormData(loaded);
      })
      .catch((e) => console.error('Failed to load settings', e))
      .finally(() => setIsLoading(false));
  }, [documentId, meta.fields, meta.slug]);

  // ── Update helpers ─────────────────────────────────────────────────────
  const updateField = useCallback((name: string, value: FieldValue, tabId?: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (tabId) {
      setDirtyTabs((prev) => new Set(prev).add(tabId));
    }
  }, []);

  // ── Save ───────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      const res = await fetch(`/api/admin/collections/${meta.slug}/${documentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setSaveError(data.error ?? 'Save failed');
        return;
      }
      setSaveSuccess(true);
      setDirtyTabs(new Set());
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setIsSaving(false);
    }
  };

  // ── Active tab content ─────────────────────────────────────────────────
  const renderTabContent = () => {
    if (activeTab === '__general__') {
      return (
        <div className="space-y-6">
          {generalFields.map((field) => {
            const label = field.label ?? toLabel(field.name);
            const hasLocale = field.localized && locales.length > 1;
            return (
              <div key={field.name} className="space-y-1.5">
                <label className="text-sm font-medium leading-none flex items-center gap-2">
                  {label}
                  {field.required && <span className="text-red-500">*</span>}
                  {hasLocale && (
                    <span className="text-xs text-muted-foreground font-normal">
                      — {activeLocale.toUpperCase()}
                    </span>
                  )}
                </label>
                {field.description && (
                  <p className="text-xs text-muted-foreground">{field.description}</p>
                )}
                <ScalarFieldInput
                  field={field}
                  value={formData[field.name] ?? null}
                  onChange={(val) => updateField(field.name, val, '__general__')}
                  activeLocale={activeLocale}
                  locales={locales}
                />
              </div>
            );
          })}
        </div>
      );
    }

    const tab = tabs.find((t) => t.id === activeTab);
    if (!tab?.field) return null;
    const groupValue = (formData[tab.field.name] as Record<string, unknown>) ?? {};

    return (
      <GroupFieldEditor
        field={tab.field}
        value={groupValue}
        onChange={(updated) => updateField(tab.field!.name, updated as FieldValue, activeTab)}
        activeLocale={activeLocale}
        locales={locales}
      />
    );
  };

  // ── Check if collection has any localized fields (including group sub-fields) ──
  const hasLocalizedFields = meta.fields.some((f) => {
    if (f.localized) return true;
    if (f.fields) return f.fields.some((sf) => sf.localized);
    return false;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {/* Page header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Global site configuration
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Locale switcher */}
          {hasLocalizedFields && (
            <div className="flex items-center gap-1.5 rounded-md border border-input px-2 py-1">
              <span className="text-xs text-muted-foreground">Locale:</span>
              {locales.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setActiveLocale(loc)}
                  className={cn(
                    'px-2 py-0.5 rounded text-xs font-medium transition-colors',
                    loc === activeLocale
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {loc.toUpperCase()}
                </button>
              ))}
            </div>
          )}

          {saveSuccess && (
            <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
              <Check className="h-4 w-4" /> Saved
            </span>
          )}
          {saveError && (
            <span className="flex items-center gap-1 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" /> {saveError}
            </span>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isSaving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Two-panel layout */}
      <div className="flex min-h-[calc(100vh-10rem)]">
        {/* Left sidebar: tabs */}
        <nav className="w-52 flex-shrink-0 border-r bg-muted/30 p-3 space-y-1">
          {tabs.map((tab) => {
            const isDirty = dirtyTabs.has(tab.id);
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'w-full flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors text-left',
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                <span>{tab.label}</span>
                {isDirty && (
                  <span
                    className={cn(
                      'h-1.5 w-1.5 rounded-full flex-shrink-0',
                      activeTab === tab.id ? 'bg-primary-foreground/70' : 'bg-orange-400'
                    )}
                    title="Unsaved changes"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-2xl">
            {/* Tab heading */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold">
                {tabs.find((t) => t.id === activeTab)?.label ?? 'Settings'}
              </h2>
            </div>

            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
