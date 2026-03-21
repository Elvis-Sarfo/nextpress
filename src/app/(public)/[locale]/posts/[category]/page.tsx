import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { EditorialPageShell } from '@/components/agbon/editorial-page-shell';
import { AgbonPageBanner } from '@/components/agbon/page-banner';
import { AgbonNewsCard, type AgbonNewsItem } from '@/components/agbon/news-card';
import { AgbonSectionTitle } from '@/components/agbon/section-title';
import { buildLocalizedPath, buildPostCategoryPath, buildPostsListingPath, buildPostItemPath } from '@/lib/agbon-routes';
import { getCategories, getCategoryBySlug, getPostsByCategory, getProductCategories, localeEngine, type PostWithLocales } from '@/lib/cms';
import { getCategorySlugForLocale, getLocale } from '@/lib/locale-utils';

const POSTS_PAGE_SIZE = 9;

interface CategoryPostsPageProps {
  params: Promise<{ locale: string; category: string }>;
  searchParams: Promise<{ page?: string }>;
}

function buildMonth(date: Date): string {
  return date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
}

function parsePageNumber(value: string | undefined): number {
  const parsed = Number.parseInt(value ?? '1', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function toPostCardItem(post: PostWithLocales, locale: string): AgbonNewsItem {
  const publishedAt = post.publishedAt ? new Date(post.publishedAt) : new Date(post.createdAt);
  const title = getLocale(post.title as Record<string, string> | null, locale) ?? 'Untitled';
  const excerpt = getLocale(post.excerpt as Record<string, string> | null, locale) ?? '';
  const slug = getLocale(post.slug as Record<string, string> | null, locale) ?? '';
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
}

export default async function CategoryPostsPage({ params, searchParams }: CategoryPostsPageProps) {
  const { locale, category: categorySlug } = await params;
  const { page } = await searchParams;

  if (!localeEngine.isSupported(locale)) {
    notFound();
  }

  const currentPage = parsePageNumber(page);
  const offset = (currentPage - 1) * POSTS_PAGE_SIZE;
  const [category, allPosts, categories, productCategories] = await Promise.all([
    getCategoryBySlug(locale, categorySlug),
    getPostsByCategory(locale, categorySlug),
    getCategories(),
    getProductCategories(),
  ]);

  if (!category) {
    notFound();
  }

  const totalPages = Math.max(1, Math.ceil(allPosts.length / POSTS_PAGE_SIZE));
  const items = allPosts.slice(offset, offset + POSTS_PAGE_SIZE).map((item) => toPostCardItem(item, locale));
  const categoryLinks = categories
    .map((entry) => {
      const slug = getCategorySlugForLocale(entry, locale);
      return slug ? { id: entry.id, name: entry.name, slug } : null;
    })
    .filter((entry): entry is { id: string; name: string; slug: string } => entry !== null);

  if (currentPage > totalPages && allPosts.length > 0) {
    notFound();
  }

  return (
    <article className="min-h-screen">
      <AgbonPageBanner
        title={category.name}
        subTitle="Category archive"
        backgroundImage="/images/section/light_gen.png"
        breadcrumbs={[
          { label: 'Home', href: buildLocalizedPath(locale) },
          { label: 'Posts', href: buildPostsListingPath(locale) },
          { label: category.name },
        ]}
      />

      <EditorialPageShell
        locale={locale}
        categories={categoryLinks}
        productCategories={productCategories}
        activeCategorySlug={categorySlug}
      >
        <section className="">
          <AgbonSectionTitle
            subTitle="Editorial"
            title={category.name}
            iconSrc="/icons/agric.png"
            align="left"
            className="mb-4"
          />

          {items.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                {items.map((item) => (
                  <AgbonNewsCard key={item.id} item={item} />
                ))}
              </div>

              {totalPages > 1 ? (
                <div className="mt-10 flex items-center justify-center gap-3">
                  <Link
                    href={buildPostCategoryPath(locale, categorySlug, currentPage - 1)}
                    aria-disabled={currentPage <= 1}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      currentPage <= 1
                        ? 'pointer-events-none border-gray-300 text-gray-300'
                        : 'border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white'
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Link>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }).map((_, index) => {
                      const pageNumber = index + 1;
                      const isCurrent = pageNumber === currentPage;

                      return (
                        <Link
                          key={pageNumber}
                          href={buildPostCategoryPath(locale, categorySlug, pageNumber)}
                          className={`flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-semibold transition ${
                            isCurrent
                              ? 'bg-[#FF6B35] text-white'
                              : 'bg-white text-[#1a1a1a] hover:bg-[#FF6B35] hover:text-white'
                          }`}
                        >
                          {pageNumber}
                        </Link>
                      );
                    })}
                  </div>

                  <Link
                    href={buildPostCategoryPath(locale, categorySlug, currentPage + 1)}
                    aria-disabled={currentPage >= totalPages}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      currentPage >= totalPages
                        ? 'pointer-events-none border-gray-300 text-gray-300'
                        : 'border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white'
                    }`}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : null}
            </>
          ) : (
            <div className="mx-auto max-w-2xl rounded-3xl border border-[#e8dcc5] bg-white px-8 py-16 text-center shadow-sm">
              <h2 className="text-2xl font-bold text-[#1a1a1a]">No posts in this category yet</h2>
              <p className="mt-3 text-sm text-gray-600">
                Publish a post in {category.name} and it will appear here automatically.
              </p>
            </div>
          )}
        </section>
      </EditorialPageShell>
    </article>
  );
}

export async function generateMetadata({ params }: CategoryPostsPageProps): Promise<Metadata> {
  const { locale, category: categorySlug } = await params;

  if (!localeEngine.isSupported(locale)) {
    return {};
  }

  const category = await getCategoryBySlug(locale, categorySlug);
  if (!category) {
    return {};
  }

  return {
    title: category.name,
    description: `${category.name} posts and updates.`,
    alternates: {
      canonical: buildPostCategoryPath(locale, categorySlug),
      languages:
        category.slug && typeof category.slug === 'object'
          ? Object.fromEntries(
              Object.entries(category.slug)
                .filter(([, slug]) => typeof slug === 'string' && slug)
                .map(([altLocale, slug]) => [altLocale, buildPostCategoryPath(altLocale, slug)]),
            )
          : undefined,
    },
  };
}
