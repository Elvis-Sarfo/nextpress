'use client';

import { useParams } from 'next/navigation';
import { AgbonNewsSection } from '@/components/agbon/news-section';
import type { BlockContent } from '@/core/blocks/types';
import type { PostWithLocales } from '@/lib/cms';
import { buildPostItemPath, buildPostsListingPath } from '@/lib/agbon-routes';
import { getCategorySlugForLocale, getLocale } from '@/lib/locale-utils';
import { asNumber, asOptionalString } from './content-helpers';

function buildMonth(date: Date): string {
  return date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
}

export function AgbonNewsSectionBlock({
  content,
  data,
}: {
  content: BlockContent;
  data?: unknown[];
}) {
  const params = useParams<{ locale?: string }>();
  const locale = typeof params?.locale === 'string' ? params.locale : 'en';
  const posts = Array.isArray(data) ? (data as PostWithLocales[]) : [];

  const items = posts.map((post) => {
    const publishedAt = post.publishedAt ? new Date(post.publishedAt) : new Date(post.createdAt);
    const title = getLocale(post.title as Record<string, string>, locale) ?? 'Untitled';
    const excerpt = getLocale(post.excerpt as Record<string, string> | null, locale) ?? '';
    const slug = getLocale(post.slug as Record<string, string>, locale) ?? '';
    const categorySlug = getCategorySlugForLocale(post.category, locale);

    return {
      id: post.id,
      title,
      excerpt,
      image: post.featuredImage?.url ?? '/placeholder.jpg',
      date: {
        day: String(publishedAt.getDate()).padStart(2, '0'),
        month: buildMonth(publishedAt),
      },
      url: slug && categorySlug ? buildPostItemPath(locale, categorySlug, slug) : buildPostsListingPath(locale),
    };
  });

  return (
    <AgbonNewsSection
      title={asOptionalString(content.title)}
      subtitle={asOptionalString(content.subtitle)}
      itemsPerPage={asNumber(content.itemsPerPage, 3)}
      newsItems={items}
    />
  );
}
