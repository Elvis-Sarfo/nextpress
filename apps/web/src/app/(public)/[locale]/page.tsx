import { getContentTypes, getPublishedList, localeEngine } from '@/lib/cms';
import Link from 'next/link';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function LocaleHomePage({ params }: Props) {
  const { locale } = await params;

  // Validate locale
  if (!localeEngine.isSupported(locale)) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Locale Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The locale &quot;{locale}&quot; is not available.
        </p>
        <Link
          href={`/${localeEngine.getDefaultLocale()}`}
          className="text-primary hover:underline"
        >
          Go to default locale
        </Link>
      </div>
    );
  }

  // Fetch all content types
  const schemas = await getContentTypes();

  // Gather all published content across types
  const allPublished: Array<{
    id: string;
    typeId: string;
    typeName: string;
    slug: string;
    publishedAt: Date;
  }> = [];

  for (const schema of schemas) {
    const published = await getPublishedList(schema.id, locale, { limit: 20 });

    for (const { entry, version } of published) {
      // Extract slug from version data
      const versionData = version.data as {
        locales?: Record<string, { slug?: string }>;
      };
      const slug = versionData?.locales?.[locale]?.slug ?? entry.id;

      allPublished.push({
        id: entry.id,
        typeId: entry.typeId,
        typeName: schema.displayName ?? schema.name,
        slug,
        publishedAt: version.publishedAt ?? version.createdAt,
      });
    }
  }

  // Sort by publishedAt desc
  allPublished.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-4">Welcome</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Current locale: {locale}
      </p>

      {/* Locale switcher */}
      <div className="mb-8">
        <span className="text-sm text-muted-foreground mr-2">Languages:</span>
        {localeEngine.getSupportedLocales().map((loc) => (
          <Link
            key={loc}
            href={`/${loc}`}
            className={`inline-block px-3 py-1 mr-2 rounded ${
              loc === locale
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary hover:bg-secondary/80'
            }`}
          >
            {loc.toUpperCase()}
          </Link>
        ))}
      </div>

      {/* Published content */}
      <h2 className="text-2xl font-semibold mb-4">Published Content</h2>
      {allPublished.length === 0 ? (
        <p className="text-muted-foreground">No published content yet.</p>
      ) : (
        <div className="grid gap-4">
          {allPublished.map((item) => (
            <Link
              key={item.id}
              href={`/${locale}/${item.slug}`}
              className="block p-6 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <p className="text-xs text-muted-foreground mb-1">{item.typeName}</p>
              <h3 className="font-semibold">{item.slug}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Published {new Date(item.publishedAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export async function generateStaticParams() {
  const locales = localeEngine.getSupportedLocales();
  return locales.map((locale) => ({ locale }));
}
