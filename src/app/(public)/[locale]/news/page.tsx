import { redirect } from 'next/navigation';
import { buildPostCategoryPath, buildPostsListingPath } from '@/lib/agbon-routes';
import { getCategories } from '@/lib/cms';
import { getCategorySlugForLocale } from '@/lib/locale-utils';

interface LegacyNewsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function LegacyNewsPage({ params }: LegacyNewsPageProps) {
  const { locale } = await params;
  const categories = await getCategories();
  const newsCategory = categories.find((category) => category.name.trim().toLowerCase() === 'news');
  const categorySlug = getCategorySlugForLocale(newsCategory, locale);
  redirect(categorySlug ? buildPostCategoryPath(locale, categorySlug) : buildPostsListingPath(locale));
}
