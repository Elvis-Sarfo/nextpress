'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAdminLocale } from '@/components/providers/AdminLocaleProvider';
import { BlockContentEditor } from '@/components/admin/BlockContentEditor';
import { DataSourceBuilder, type DataSourceValue } from '@/components/admin/DataSourceBuilder/DataSourceBuilder';
import { getBlockDefinition, getBlockManifest } from '@/core/blocks/registry';
import type { BlockManifest } from '@/core/blocks/types';

type LocalizedContent = Record<string, Record<string, unknown>>;

interface BlockDoc {
  id: string;
  name: string;
  label?: string;
  content?: unknown;
  contentDefinition?: unknown;
  dataSource?: unknown;
}

interface BlockContentPageProps {
  blockId: string;
}

const FALLBACK_LOCALES = ['en', 'fr', 'de', 'es'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function BlockContentPage({ blockId }: BlockContentPageProps) {
  const { locale: adminLocale } = useAdminLocale();
  const [activeLocale, setActiveLocale] = useState(adminLocale);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [blockName, setBlockName] = useState('');
  const [blockLabel, setBlockLabel] = useState('');
  const [definition, setDefinition] = useState<unknown>(null);
  const [content, setContent] = useState<LocalizedContent>({});
  const [blockManifest, setBlockManifest] = useState<BlockManifest | null>(null);
  const [dataSource, setDataSource] = useState<DataSourceValue>({});

  useEffect(() => {
    setActiveLocale(adminLocale);
  }, [adminLocale]);

  useEffect(() => {
    async function loadBlock() {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/admin/collections/blocks/${blockId}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error ?? 'Failed to load block');
          return;
        }

        const doc = data.doc as BlockDoc;
        setBlockName(doc.name || 'Block');
        setBlockLabel(doc.label || '');

        // Resolve manifest for this block contract.
        const manifest = doc.name ? getBlockManifest(doc.name) ?? null : null;
        setBlockManifest(manifest);

        // Use DB contentDefinition if present, otherwise seed from static registry
        if (doc.contentDefinition != null) {
          setDefinition(doc.contentDefinition);
        } else if (doc.name) {
          setDefinition(getBlockDefinition(doc.name) ?? null);
        } else {
          setDefinition(null);
        }

        // Load content
        if (isRecord(doc.content)) {
          const normalized: LocalizedContent = {};
          for (const [locale, localeValue] of Object.entries(doc.content)) {
            normalized[locale] = isRecord(localeValue) ? localeValue : {};
          }
          setContent(normalized);
        } else {
          setContent({});
        }

        // Load data source
        // Priority: DB-stored (with collection key) → migrate from manifest spec → empty
        if (isRecord(doc.dataSource) && typeof (doc.dataSource as Record<string, unknown>).collection === 'string') {
          // Already in builder format
          setDataSource(doc.dataSource as DataSourceValue);
        } else if (isRecord(doc.dataSource)) {
          // Old format (from BlockDataSourceEditor — no collection key).
          // Migrate: inject collection from manifest if available.
          const legacyParams = doc.dataSource as Record<string, unknown>;
          const manifestCollection = manifest?.definition.dataSource?.collection;
          if (manifestCollection) {
            const migrated: DataSourceValue = {
              collection: manifestCollection,
              ...(typeof legacyParams.limit === 'number' ? { limit: legacyParams.limit } : {}),
              ...(isRecord(legacyParams.where) ? { where: legacyParams.where } : {}),
              ...(isRecord(legacyParams.orderBy)
                ? { orderBy: legacyParams.orderBy as Record<string, 'asc' | 'desc'> }
                : {}),
            };
            setDataSource(migrated);
          } else {
            setDataSource({});
          }
        } else if (manifest?.definition.dataSource) {
          // No stored params yet — pre-populate from manifest defaults
          const spec = manifest.definition.dataSource;
          const initial: DataSourceValue = { collection: spec.collection };
          if (spec.defaultParams) {
            Object.assign(initial, spec.defaultParams);
          }
          for (const f of spec.fields) {
            if (f.default === undefined) continue;
            if (f.scope === 'root' || !f.scope) {
              (initial as Record<string, unknown>)[f.name] = f.default;
            } else if (f.scope === 'where') {
              initial.where = { ...(initial.where ?? {}), [f.name]: f.default };
            }
          }
          setDataSource(initial);
        } else {
          setDataSource({});
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Network error');
      } finally {
        setIsLoading(false);
      }
    }

    loadBlock();
  }, [blockId]);

  const locales = useMemo(() => {
    const fromContent = Object.keys(content);
    const merged = new Set<string>([...FALLBACK_LOCALES, ...fromContent]);
    return Array.from(merged);
  }, [content]);

  const localeContent = content[activeLocale] ?? {};

  const updateLocaleContent = (next: Record<string, unknown>) => {
    setContent((prev) => ({ ...prev, [activeLocale]: next }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const payload: Record<string, unknown> = { content };
      if (definition !== null) {
        payload.contentDefinition = definition;
      }
      // Always persist dataSource (even when collection is unset, to clear old values)
      payload.dataSource = Object.keys(dataSource).length > 0 ? dataSource : null;

      const res = await fetch(`/api/admin/collections/blocks/${blockId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Save failed');
        return;
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Network error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/admin/blocks/${blockId}`}>
            <Button variant="ghost" size="icon" type="button">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Block Content</h1>
            <p className="text-muted-foreground mt-1">
              {blockLabel || blockName}{blockLabel && blockName ? ` (${blockName})` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Locale switcher */}
          <div className="flex items-center gap-1.5 rounded-md border border-input px-2 py-1">
            <span className="text-xs text-muted-foreground">Locale:</span>
            {locales.map((loc) => {
              const hasAnyContent = !!content[loc] && Object.keys(content[loc]).length > 0;
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

          {success && <span className="text-sm text-green-600 font-medium">Saved</span>}
          {error && <span className="text-sm text-red-600">{error}</span>}

          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isSaving ? 'Saving…' : 'Save Content'}
          </Button>
        </div>
      </div>

      {/* ── Content editor ── */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Content</h2>
        <BlockContentEditor
          content={localeContent}
          definition={definition}
          locale={activeLocale}
          onChange={updateLocaleContent}
        />
      </div>

      {/* ── Data Source builder — shown for all blocks ── */}
      <div className="rounded-lg border bg-card p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Data Source</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Optionally fetch live data from a collection and inject it into this block at render time.
            {dataSource.collection && (
              <span className="ml-1 font-medium text-foreground">
                Currently querying <code className="text-xs bg-muted px-1 py-0.5 rounded">{dataSource.collection}</code>.
              </span>
            )}
          </p>
        </div>
        <DataSourceBuilder
          key={blockId}
          value={dataSource}
          onChange={setDataSource}
        />
      </div>
    </div>
  );
}
