import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { AgbonNewsCard, type AgbonNewsItem } from '@/components/agbon/news-card';
import { AgbonPageBanner } from '@/components/agbon/page-banner';
import { ProductPageShell } from '@/components/agbon/product-page-shell';
import { buildLocalizedPath, buildPostCategoryPath, buildPostItemPath, buildPostsListingPath } from '@/lib/agbon-routes';
import {
  getPostsByCategory,
  getProductCategories,
  getPublishedPostByCategoryAndSlug,
  localeEngine,
  type PostWithLocales,
} from '@/lib/cms';
import { getCategorySlugForLocale, getLocale } from '@/lib/locale-utils';

interface PostDetailPageProps {
  params: Promise<{ locale: string; category: string; slug: string }>;
}

function formatDate(value: Date | null | undefined): string {
  return new Date(value ?? Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function buildMonth(date: Date): string {
  return date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
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

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { locale, category: categorySlug, slug } = await params;

  if (!localeEngine.isSupported(locale)) {
    notFound();
  }

  const [post, productCategories, relatedPosts] = await Promise.all([
    getPublishedPostByCategoryAndSlug(locale, categorySlug, slug),
    getProductCategories(),
    getPostsByCategory(locale, categorySlug, { limit: 12 }),
  ]);

  if (!post) {
    notFound();
  }

  const title = getLocale(post.title as Record<string, string> | null, locale) ?? slug;
  const excerpt = getLocale(post.excerpt as Record<string, string> | null, locale);
  const publishedAt = post.publishedAt ? new Date(post.publishedAt) : new Date(post.createdAt);
  const categoryName = post.category?.name ?? categorySlug;
  const relatedItems = relatedPosts
    .filter((item) => item.id !== post.id)
    .slice(0, 3)
    .map((item) => toPostCardItem(item, locale));

  return (
    <article className="min-h-screen">
      <AgbonPageBanner
        title={title}
        subTitle={categoryName}
        backgroundImage={post.featuredImage?.url ?? '/images/section/light_gen.png'}
        breadcrumbs={[
          { label: 'Home', href: buildLocalizedPath(locale) },
          { label: 'Posts', href: buildPostsListingPath(locale) },
          { label: categoryName, href: buildPostCategoryPath(locale, categorySlug) },
          { label: title },
        ]}
      />

      <ProductPageShell locale={locale} categories={productCategories} sidebarMode="navigation" syncWithUrl={false}>
        <section className="py-6 md:py-10">
          <div className="mx-auto max-w-4xl rounded-[2rem] bg-white p-6 shadow-sm md:p-10">
            <Link
              href={buildPostCategoryPath(locale, categorySlug)}
              className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#FF6B35] hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to {categoryName}
            </Link>

            <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-gray-500">
              <span className="rounded-full bg-[#fff1eb] px-3 py-1 font-semibold text-[#FF6B35]">
                {categoryName}
              </span>
              <span>{formatDate(publishedAt)}</span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-[#1a1a1a] md:text-5xl">
              {title}
            </h1>

            {excerpt ? (
              <p className="mt-5 max-w-3xl text-base leading-8 text-gray-600 md:text-lg">
                {excerpt}
              </p>
            ) : null}

            {post.featuredImage?.url ? (
              <div className="relative mt-8 aspect-[16/8] overflow-hidden rounded-[1.5rem]">
                <Image
                  src={post.featuredImage.url}
                  alt={post.featuredImage.altText ?? title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : null}

            <div className="mt-8 rounded-[1.5rem] border border-dashed border-[#e8dcc5] bg-[#fcfaf6] p-6 text-sm leading-7 text-gray-600">
              Full rich text rendering for editorial detail is the next implementation step. The new category-based URL structure is now in place.
            </div>

            {relatedItems.length > 0 ? (
              <section className="mt-12">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7A5C00]">
                      Continue Reading
                    </p>
                    <h2 className="mt-2 text-2xl font-black text-[#1a1a1a]">
                      Related Posts
                    </h2>
                  </div>
                  <Link
                    href={buildPostCategoryPath(locale, categorySlug)}
                    className="text-sm font-semibold text-[#FF6B35] hover:underline"
                  >
                    View all in {categoryName}
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {relatedItems.map((item) => (
                    <AgbonNewsCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </section>
      </ProductPageShell>
    </article>
  );
}

export async function generateMetadata({ params }: PostDetailPageProps): Promise<Metadata> {
  const { locale, category: categorySlug, slug } = await params;

  if (!localeEngine.isSupported(locale)) {
    return {};
  }

  const post = await getPublishedPostByCategoryAndSlug(locale, categorySlug, slug);
  if (!post) {
    return { title: slug };
  }

  const title = getLocale(post.title as Record<string, string> | null, locale) ?? slug;
  const excerpt = getLocale(post.excerpt as Record<string, string> | null, locale);

  return {
    title,
    description: excerpt,
    alternates: {
      canonical: buildPostItemPath(locale, categorySlug, slug),
    },
  };
}
