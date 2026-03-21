import { notFound, redirect } from 'next/navigation';
import { buildPostItemPath, buildPostsListingPath } from '@/lib/agbon-routes';
import { getPublishedNewsItem, localeEngine } from '@/lib/cms';
import { getCategorySlugForLocale, getLocale } from '@/lib/locale-utils';

interface LegacyNewsDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function LegacyNewsDetailPage({ params }: LegacyNewsDetailPageProps) {
  const { locale, slug } = await params;

  if (!localeEngine.isSupported(locale)) {
    notFound();
  }

  const news = await getPublishedNewsItem(locale, slug);
  if (!news) {
    notFound();
  }

  const nextSlug = getLocale(news.slug as Record<string, string> | null, locale) ?? slug;
  const categorySlug = getCategorySlugForLocale(news.category, locale);
  redirect(categorySlug ? buildPostItemPath(locale, categorySlug, nextSlug) : buildPostsListingPath(locale));
}
