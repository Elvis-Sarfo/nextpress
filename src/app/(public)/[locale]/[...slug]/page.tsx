import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getPublishedPageByPath,
  getPublishedPost,
  getPublishedNewsItem,
  localeEngine,
  type PageWithLocales,
  type PostWithLocales,
  type NewsWithLocales,
} from '@/lib/cms';
import { getLocale } from '@/lib/locale-utils';
import { buildPageBlockContext } from '@/lib/page-block-context';
import { PageRenderer } from '@/components/blocks/PageRenderer';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ locale: string; slug: string[] }>;
}

type ContentItem =
  | { type: 'page'; data: PageWithLocales; pathByLocale: Record<string, string> }
  | { type: 'post'; data: PostWithLocales; pathByLocale: Record<string, string> }
  | { type: 'news'; data: NewsWithLocales; pathByLocale: Record<string, string> };

async function findContent(locale: string, slugParts: string[]): Promise<ContentItem | null> {
  const pageMatch = await getPublishedPageByPath(locale, slugParts);
  if (pageMatch) {
    return { type: 'page', data: pageMatch.page, pathByLocale: pageMatch.pathByLocale };
  }

  if (slugParts.length !== 1) return null;

  const slug = slugParts[0];
  const [post, news] = await Promise.all([
    getPublishedPost(locale, slug),
    getPublishedNewsItem(locale, slug),
  ]);

  if (post) return { type: 'post', data: post, pathByLocale: post.slug as Record<string, string> };
  if (news) return { type: 'news', data: news, pathByLocale: news.slug as Record<string, string> };

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
  const currentPath = content.pathByLocale[locale] ?? slug.join('/');

  const title = getLocale(page.title as Record<string, string> | null, locale);
  const excerpt = getLocale(page.excerpt as Record<string, string> | null, locale);
  const alternates = Object.entries(content.pathByLocale)
    .filter(([altLocale]) => altLocale !== locale)
    .map(([altLocale, altSlug]) => ({ locale: altLocale, slug: altSlug }));

  const typeLabel =
    content.type === 'page' ? 'Page' : content.type === 'post' ? 'Post' : 'News';

  const hasSections = Array.isArray(page.sections) && page.sections.length > 0;
  const pageContext = buildPageBlockContext(page, locale);

  return (
    <article>
      {hasSections ? (
        <PageRenderer sections={page.sections} locale={locale} page={pageContext} />
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
            <h1 className="text-4xl font-bold">{title ?? currentPath}</h1>
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
  if (!content) return { title: slug.join('/') };

  const page = content.data;
  const title = getLocale(page.title as Record<string, string> | null, locale);
  const excerpt = getLocale(page.excerpt as Record<string, string> | null, locale);

  return {
    title: title ?? slug.join('/'),
    description: excerpt,
    alternates: {
      languages: Object.fromEntries(
        Object.entries(content.pathByLocale).map(([altLocale, altSlug]) => [
          altLocale,
          `/${altLocale}/${altSlug}`,
        ]),
      ),
    },
  };
}
