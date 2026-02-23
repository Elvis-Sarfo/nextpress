import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getPublishedPage,
  getPublishedPosts,
  localeEngine,
} from '@/lib/cms';
import { getLocale } from '@/lib/locale-utils';
import { PageRenderer } from '@/components/blocks/PageRenderer';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function LocaleHomePage({ params }: Props) {
  const { locale } = await params;

  if (!localeEngine.isSupported(locale)) {
    notFound();
  }

  // Try to find a published page with slug "home" in this locale
  const homePage = await getPublishedPage(locale, 'home');

  if (homePage) {
    const hasSections = Array.isArray(homePage.sections) && homePage.sections.length > 0;
    const title = getLocale(homePage.title as Record<string, string> | null, locale);
    const excerpt = getLocale(homePage.excerpt as Record<string, string> | null, locale);
    return (
      <article>
        {hasSections ? (
          <PageRenderer sections={homePage.sections} locale={locale} />
        ) : (
          <div className="container mx-auto px-4 py-16 max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">{title ?? 'Home'}</h1>
            {excerpt && <p className="text-xl text-muted-foreground mt-4">{excerpt}</p>}
            <p className="text-muted-foreground italic mt-8">
              No sections yet — add sections via the admin.
            </p>
          </div>
        )}
      </article>
    );
  }

  // Fallback: posts listing
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

      <h2 className="text-2xl font-semibold mb-4">Latest Posts</h2>
      {posts.length === 0 ? (
        <p className="text-muted-foreground">No published posts yet.</p>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => {
            const title = getLocale(post.title as Record<string, string> | null, locale);
            const slug = getLocale(post.slug as Record<string, string> | null, locale);
            const excerpt = getLocale(post.excerpt as Record<string, string> | null, locale);
            if (!slug) return null;

            return (
              <Link
                key={post.id}
                href={`/${locale}/${slug}`}
                className="block p-6 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <p className="text-xs text-muted-foreground mb-1">Post</p>
                <h3 className="font-semibold">{title}</h3>
                {excerpt && (
                  <p className="text-sm text-muted-foreground mt-2">{excerpt}</p>
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  if (!localeEngine.isSupported(locale)) return {};

  const homePage = await getPublishedPage(locale, 'home');
  if (!homePage) return { title: 'Home' };

  const title = getLocale(homePage.title as Record<string, string> | null, locale);
  const excerpt = getLocale(homePage.excerpt as Record<string, string> | null, locale);

  return {
    title: title ?? 'Home',
    description: excerpt ?? undefined,
  };
}

export async function generateStaticParams() {
  return localeEngine.getSupportedLocales().map((locale) => ({ locale }));
}
