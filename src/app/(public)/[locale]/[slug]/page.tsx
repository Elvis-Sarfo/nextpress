import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getPublishedPage,
  getPublishedPost,
  getPublishedNewsItem,
  getLocalizedField,
  localeEngine,
} from '@/lib/cms';
import { ArrowLeft } from 'lucide-react';
import type { PageWithLocales, PostWithLocales, NewsWithLocales } from '@/kernel';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

type ContentItem =
  | { type: 'page'; data: PageWithLocales }
  | { type: 'post'; data: PostWithLocales }
  | { type: 'news'; data: NewsWithLocales };

async function findContent(locale: string, slug: string): Promise<ContentItem | null> {
  // Try to find content by slug across all content types
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

export default async function ContentPage({ params }: Props) {
  const { locale, slug } = await params;

  // Validate locale
  if (!localeEngine.isSupported(locale)) {
    notFound();
  }

  const content = await findContent(locale, slug);

  if (!content) {
    notFound();
  }

  const localeData = getLocalizedField(content.data, locale);

  if (!localeData) {
    notFound();
  }

  // Get available locales for language switcher
  const availableLocales = content.data.locales
    .filter((l) => l.locale !== locale)
    .map((l) => ({ locale: l.locale, slug: l.slug }));

  const typeLabel =
    content.type === 'page' ? 'Page' : content.type === 'post' ? 'Post' : 'News';

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
        <p className="text-sm text-muted-foreground mb-2">{typeLabel}</p>
        <h1 className="text-4xl font-bold">{localeData.title}</h1>
        {localeData.excerpt && (
          <p className="text-xl text-muted-foreground mt-4">{localeData.excerpt}</p>
        )}
        <div className="mt-4 text-sm text-muted-foreground">
          Published{' '}
          {new Date(content.data.publishedAt ?? content.data.createdAt).toLocaleDateString()}
        </div>
      </header>

      {/* Render content */}
      <div className="prose prose-lg dark:prose-invert">
        {localeData.content.startsWith('<') && localeData.content.includes('>') ? (
          <div dangerouslySetInnerHTML={{ __html: localeData.content }} />
        ) : (
          <div className="whitespace-pre-wrap">{localeData.content}</div>
        )}
      </div>

      {/* Locale alternates */}
      {availableLocales.length > 0 && (
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-2">Available in other languages:</p>
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

  const content = await findContent(locale, slug);

  if (!content) {
    return { title: slug };
  }

  const localeData = getLocalizedField(content.data, locale);

  return {
    title: localeData?.title ?? slug,
    description: localeData?.excerpt,
  };
}
