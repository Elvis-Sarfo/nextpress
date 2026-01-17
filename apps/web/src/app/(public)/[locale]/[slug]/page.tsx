import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getContentTypes, getPublishedContent, localeEngine } from '@/lib/cms';
import { ArrowLeft } from 'lucide-react';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function ContentPage({ params }: Props) {
  const { locale, slug } = await params;

  // Validate locale
  if (!localeEngine.isSupported(locale)) {
    notFound();
  }

  // Find content by slug across all content types
  const schemas = await getContentTypes();
  let foundEntry = null;
  let foundVersion = null;
  let foundSchema = null;

  for (const schema of schemas) {
    const result = await getPublishedContent(schema.id, locale, slug);
    if (result) {
      foundEntry = result.entry;
      foundVersion = result.version;
      foundSchema = schema;
      break;
    }
  }

  if (!foundEntry || !foundVersion) {
    notFound();
  }

  // Parse version data
  const versionData = foundVersion.data as {
    locales?: Record<string, { slug?: string; fields?: Record<string, unknown>; meta?: { title?: string; description?: string } }>;
  };
  const localeData = versionData?.locales?.[locale];

  if (!localeData) {
    notFound();
  }

  const fields = localeData.fields ?? {};
  const meta = localeData.meta;

  // Get available locales for language switcher
  const availableLocales = versionData?.locales
    ? Object.entries(versionData.locales)
        .filter(([loc, data]) => loc !== locale && data.slug)
        .map(([loc, data]) => ({ locale: loc, slug: data.slug! }))
    : [];

  return (
    <article className="container mx-auto px-4 py-16 max-w-3xl">
      <Link
        href={`/${locale}`}
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to home
      </Link>

      <header className="mb-8">
        <p className="text-sm text-muted-foreground mb-2">
          {foundSchema?.displayName ?? foundSchema?.name ?? 'Content'}
        </p>
        <h1 className="text-4xl font-bold">{localeData.slug}</h1>
        {meta?.description && (
          <p className="text-xl text-muted-foreground mt-4">
            {meta.description}
          </p>
        )}
        <div className="mt-4 text-sm text-muted-foreground">
          Published{' '}
          {new Date(
            foundVersion.publishedAt ?? foundVersion.createdAt
          ).toLocaleDateString()}
        </div>
      </header>

      {/* Render content fields */}
      <div className="prose prose-lg dark:prose-invert">
        {Object.entries(fields).map(([key, value]) => {
          if (typeof value === 'string') {
            // Check if it looks like HTML
            if (value.startsWith('<') && value.includes('>')) {
              return (
                <div
                  key={key}
                  dangerouslySetInnerHTML={{ __html: value }}
                />
              );
            }
            return <p key={key}>{value}</p>;
          }
          if (typeof value === 'object') {
            return (
              <pre key={key} className="bg-secondary p-4 rounded text-sm overflow-x-auto">
                {JSON.stringify(value, null, 2)}
              </pre>
            );
          }
          return <p key={key}>{String(value)}</p>;
        })}
      </div>

      {/* Locale alternates */}
      {availableLocales.length > 0 && (
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-2">
            Available in other languages:
          </p>
          <div className="flex gap-2">
            {availableLocales.map((alt) => (
              <Link
                key={alt.locale}
                href={`/${alt.locale}/${alt.slug}`}
                className="px-3 py-1 bg-secondary rounded hover:bg-secondary/80"
              >
                {alt.locale.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;

  // Find content by slug
  const schemas = await getContentTypes();

  for (const schema of schemas) {
    const result = await getPublishedContent(schema.id, locale, slug);
    if (result) {
      const versionData = result.version.data as {
        locales?: Record<string, { meta?: { title?: string; description?: string } }>;
      };
      const localeData = versionData?.locales?.[locale];
      return {
        title: localeData?.meta?.title ?? slug,
        description: localeData?.meta?.description,
      };
    }
  }

  return {
    title: slug,
  };
}
