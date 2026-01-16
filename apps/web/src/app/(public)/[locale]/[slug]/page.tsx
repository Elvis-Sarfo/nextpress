import { notFound } from 'next/navigation';
import Link from 'next/link';
import { contentStore, schemaEngine, localeEngine } from '@/lib/cms';
import { ArrowLeft } from 'lucide-react';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function ContentPage({ params }: Props) {
  const { locale, slug } = await params;

  // Validate locale
  if (!localeEngine.isLocaleEnabled(locale)) {
    notFound();
  }

  // Find content by slug
  const schemas = await schemaEngine.getAllSchemas();
  let entry = null;

  // Search through all content types for the slug
  for (const schema of schemas) {
    const found = await contentStore.getBySlug(schema.id, slug, locale);
    if (found && found.publishedVersion) {
      entry = found;
      break;
    }
  }

  if (!entry || !entry.publishedVersion) {
    notFound();
  }

  const schema = await schemaEngine.getSchema(entry.typeId);
  const localeData = localeEngine.getLocalizedData(
    entry.publishedVersion.data,
    locale
  );

  if (!localeData) {
    notFound();
  }

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
          {schema?.name ?? 'Content'}
        </p>
        <h1 className="text-4xl font-bold">{localeData.slug}</h1>
        {localeData.meta?.description && (
          <p className="text-xl text-muted-foreground mt-4">
            {localeData.meta.description}
          </p>
        )}
        <div className="mt-4 text-sm text-muted-foreground">
          Published{' '}
          {new Date(
            entry.publishedVersion.publishedAt ?? entry.publishedVersion.createdAt
          ).toLocaleDateString()}
        </div>
      </header>

      {/* Render content fields */}
      <div className="prose prose-lg dark:prose-invert">
        {Object.entries(localeData.fields).map(([key, value]) => {
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
      {entry.publishedVersion.data.length > 1 && (
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-2">
            Available in other languages:
          </p>
          <div className="flex gap-2">
            {entry.publishedVersion.data
              .filter((d) => d.locale !== locale && d.slug)
              .map((d) => (
                <Link
                  key={d.locale}
                  href={`/${d.locale}/${d.slug}`}
                  className="px-3 py-1 bg-secondary rounded hover:bg-secondary/80"
                >
                  {d.locale.toUpperCase()}
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
  const schemas = await schemaEngine.getAllSchemas();

  for (const schema of schemas) {
    const entry = await contentStore.getBySlug(schema.id, slug, locale);
    if (entry?.publishedVersion) {
      const localeData = entry.publishedVersion.data.find(
        (d) => d.locale === locale
      );
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
