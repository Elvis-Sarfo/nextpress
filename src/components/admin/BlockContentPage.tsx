'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAdminLocale } from '@/components/providers/AdminLocaleProvider';
import { BlockContentEditor } from '@/components/admin/BlockContentEditor';
import { getBlockType } from '@/blocks/block-type-registry';

type LocalizedContent = Record<string, Record<string, unknown>>;

interface BlockDoc {
  id: string;
  name: string;
  type: string;
  content?: unknown;
  contentDefinition?: unknown;
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
  const [blockType, setBlockType] = useState('');
  const [definition, setDefinition] = useState<unknown>(null);
  const [content, setContent] = useState<LocalizedContent>({});

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
        setBlockType(doc.type || '');

        // Use DB contentDefinition if present, otherwise seed from static registry
        // so existing blocks immediately show proper fields. The definition will be
        // persisted to the DB on first save, making it fully DB-driven after that.
        if (doc.contentDefinition != null) {
          setDefinition(doc.contentDefinition);
        } else if (doc.type) {
          const staticDef = getBlockType(doc.type) ?? null;
          setDefinition(staticDef);
        } else {
          setDefinition(null);
        }

        if (isRecord(doc.content)) {
          const normalized: LocalizedContent = {};
          for (const [locale, localeValue] of Object.entries(doc.content)) {
            normalized[locale] = isRecord(localeValue) ? localeValue : {};
          }
          setContent(normalized);
        } else {
          setContent({});
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
    setContent((prev) => ({
      ...prev,
      [activeLocale]: next,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // Always persist the definition alongside content so the DB becomes the
      // source of truth even if this was the first load (seeded from registry).
      const payload: Record<string, unknown> = { content };
      if (definition !== null) {
        payload.contentDefinition = definition;
      }

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
              {blockName}{blockType ? ` (${blockType})` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
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
      

      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold">Content</h2>
        <BlockContentEditor
          content={localeContent}
          definition={definition}
          locale={activeLocale}
          onChange={updateLocaleContent}
        />
      </div>
    </div>
  );
}
