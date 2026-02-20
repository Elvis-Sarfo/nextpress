import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getPublishedPage,
  getPublishedPost,
  getPublishedNewsItem,
  localeEngine,
  type PageWithLocales,
  type PostWithLocales,
  type NewsWithLocales,
} from '@/lib/cms';
import { getLocale, getLocaleAlternates } from '@/lib/locale-utils';
import { PageRenderer } from '@/components/blocks/PageRenderer';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

type ContentItem =
  | { type: 'page'; data: PageWithLocales }
  | { type: 'post'; data: PostWithLocales }
  | { type: 'news'; data: NewsWithLocales };

async function findContent(locale: string, slug: string): Promise<ContentItem | null> {
  const [page, post, news] = await Promise.all([
    getPublishedPage(locale, slug),
    getPublishedPost(locale, slug),
    getPublishedNewsItem(locale, slug),
  ]);

  if (page) return { type: 'page', data: page };
  if (post) return { type: 'post', data: post };
  if (news) return { type: 'news', data: news };

  return null;
}

export default async function ContentPage({ params }: PageProps) {
  const { locale, slug } = await params;

  if (!localeEngine.isSupported(locale)) {
    notFound();
  }

  const content = await findContent(locale, slug);
  if (!content) notFound();

  const page = content.data;

  // Extract locale-first fields
  const title   = getLocale(page.title   as Record<string, string> | null, locale);
  const excerpt = getLocale(page.excerpt as Record<string, string> | null, locale);
  const slugMap = page.slug as Record<string, string> | null;

  // Locale alternates for language switcher (exclude current locale)
  const alternates = getLocaleAlternates(slugMap).filter((a) => a.locale !== locale);

  const typeLabel =
    content.type === 'page' ? 'Page' : content.type === 'post' ? 'Post' : 'News';

  // Sections-based render (block page builder)
  const hasSections =
    Array.isArray(page.sections) && page.sections.length > 0;

  return (
    <article>
      {hasSections ? (
        <PageRenderer sections={page.sections} locale={locale} />
      ) : (
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <header className="mb-8">
            <p className="text-sm text-muted-foreground mb-2">{typeLabel}</p>
            <h1 className="text-4xl font-bold">{title ?? slug}</h1>
            {excerpt && (
              <p className="text-xl text-muted-foreground mt-4">{excerpt}</p>
            )}
            <div className="mt-4 text-sm text-muted-foreground">
              Published{' '}
              {new Date(page.createdAt ?? Date.now()).toLocaleDateString()}
            </div>
          </header>

          <div className="prose prose-lg dark:prose-invert">
            <p className="text-muted-foreground italic">No content yet — add sections via the admin.</p>
          </div>
        </div>
      )}

      {/* Locale alternates */}
      {alternates.length > 0 && (
        <div className="container mx-auto px-4 pb-8">
          <div className="pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-2">Available in other languages:</p>
            <div className="flex gap-2">
              {alternates.map((alt) => (
                <Link
                  key={alt.locale}
                  href={`/${alt.locale}/${alt.slug}`}
                  className="px-3 py-1 bg-secondary rounded hover:bg-secondary/80 text-sm"
                >
                  {alt.locale.toUpperCase()}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  const content = await findContent(locale, slug);
  if (!content) return { title: slug };

  const page = content.data;
  const title   = getLocale(page.title   as Record<string, string> | null, locale);
  const excerpt = getLocale(page.excerpt as Record<string, string> | null, locale);
  const slugMap = page.slug as Record<string, string> | null;

  const alternates = getLocaleAlternates(slugMap);

  return {
    title:       title ?? slug,
    description: excerpt,
    alternates: {
      languages: Object.fromEntries(
        alternates.map(({ locale: l, slug: s }) => [l, `/${l}/${s}`])
      ),
    },
  };
}
