import { contentStore, localeEngine } from '@/lib/cms';
import Link from 'next/link';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function LocaleHomePage({ params }: Props) {
  const { locale } = await params;

  // Validate locale
  if (!localeEngine.isLocaleEnabled(locale)) {
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

  // Fetch published content
  const content = await contentStore.query({
    filter: { status: 'PUBLISHED' },
    pageSize: 10,
    sort: { field: 'createdAt', direction: 'desc' },
  });

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-4">Welcome</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Current locale: {locale}
      </p>

      {/* Locale switcher */}
      <div className="mb-8">
        <span className="text-sm text-muted-foreground mr-2">Languages:</span>
        {localeEngine.getEnabledLocales().map((loc) => (
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
      {content.items.length === 0 ? (
        <p className="text-muted-foreground">No published content yet.</p>
      ) : (
        <div className="grid gap-4">
          {content.items.map((item) => {
            const localeData = item.currentVersion?.data.find(
              (d) => d.locale === locale
            );
            const slug = localeData?.slug ?? item.id;

            return (
              <Link
                key={item.id}
                href={`/${locale}/${slug}`}
                className="block p-6 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <h3 className="font-semibold">{slug}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Published{' '}
                  {new Date(
                    item.currentVersion?.publishedAt ?? item.createdAt
                  ).toLocaleDateString()}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export async function generateStaticParams() {
  const locales = localeEngine.getEnabledLocales();
  return locales.map((locale) => ({ locale }));
}
