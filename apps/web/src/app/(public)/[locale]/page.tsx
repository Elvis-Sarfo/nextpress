import { getPublishedPosts, getLocalizedField, localeEngine } from '@/lib/cms';
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

  // Fetch published posts
  const posts = await getPublishedPosts(locale, { limit: 20 });

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-4">Welcome</h1>
      <p className="text-xl text-muted-foreground mb-8">Current locale: {locale}</p>

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

      {/* Published posts */}
      <h2 className="text-2xl font-semibold mb-4">Latest Posts</h2>
      {posts.length === 0 ? (
        <p className="text-muted-foreground">No published posts yet.</p>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => {
            const localeData = getLocalizedField(post, locale);
            if (!localeData) return null;

            return (
              <Link
                key={post.id}
                href={`/${locale}/${localeData.slug}`}
                className="block p-6 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <p className="text-xs text-muted-foreground mb-1">Post</p>
                <h3 className="font-semibold">{localeData.title}</h3>
                {localeData.excerpt && (
                  <p className="text-sm text-muted-foreground mt-2">{localeData.excerpt}</p>
                )}
                <p className="text-sm text-muted-foreground mt-2">
                  Published{' '}
                  {new Date(post.publishedAt ?? post.createdAt).toLocaleDateString()}
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
  const locales = localeEngine.getSupportedLocales();
  return locales.map((locale) => ({ locale }));
}
