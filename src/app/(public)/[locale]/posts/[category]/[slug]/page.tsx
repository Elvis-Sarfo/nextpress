import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { EditorialPageShell } from '@/components/agbon/editorial-page-shell';
import { AgbonNewsCard, type AgbonNewsItem } from '@/components/agbon/news-card';
import { AgbonPageBanner } from '@/components/agbon/page-banner';
import { PostComments } from '@/components/agbon/post-comments';
import { buildLocalizedPath, buildPostCategoryPath, buildPostItemPath, buildPostsListingPath } from '@/lib/agbon-routes';
import {
  getCategories,
  getPostComments,
  getPosts,
  getProductCategories,
  getPublishedPostByCategoryAndSlug,
  localeEngine,
  type PostWithLocales,
} from '@/lib/cms';
import { buildArticleStructuredData, scoreRelatedPost } from '@/lib/editorial';
import { getCategorySlugForLocale, getLocale, getLocalizedRichTextHtml } from '@/lib/locale-utils';
import { getSiteConfig } from '@/lib/site-config';

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

  const [post, allPostsResult, categories, productCategories] = await Promise.all([
    getPublishedPostByCategoryAndSlug(locale, categorySlug, slug),
    getPosts({ status: 'published', limit: 50 }),
    getCategories(),
    getProductCategories(),
  ]);

  if (!post) {
    notFound();
  }

  const title = getLocale(post.title as Record<string, string> | null, locale) ?? slug;
  const excerpt = getLocale(post.excerpt as Record<string, string> | null, locale);
  const contentHtml = getLocalizedRichTextHtml(post.content as Record<string, unknown> | null, locale);
  const publishedAt = post.publishedAt ? new Date(post.publishedAt) : new Date(post.createdAt);
  const updatedAt = new Date(post.updatedAt);
  const categoryName = post.category?.name ?? categorySlug;
  const authorName = post.author?.name?.trim() || 'Editorial Team';
  const seo = post.seo && typeof post.seo === 'object' ? (post.seo as Record<string, unknown>) : null;
  const articleStructuredData = buildArticleStructuredData({
    locale,
    categorySlug,
    title,
    description: excerpt,
    authorName,
    categoryName,
    publishedAt,
    updatedAt,
    slug,
    imageUrl: post.featuredImage?.url ?? null,
  });
  const relatedItems = allPostsResult.posts
    .filter((item) => item.id !== post.id)
    .sort((a, b) => scoreRelatedPost(b, post) - scoreRelatedPost(a, post))
    .slice(0, 3)
    .map((item) => toPostCardItem(item, locale));
  const comments = await getPostComments(post.id);
  const categoryLinks = categories
    .map((entry) => {
      const slugValue = getCategorySlugForLocale(entry, locale);
      return slugValue ? { id: entry.id, name: entry.name, slug: slugValue } : null;
    })
    .filter((entry): entry is { id: string; name: string; slug: string } => entry !== null);

  return (
    <article className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
      />

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

      <EditorialPageShell
        locale={locale}
        categories={categoryLinks}
        productCategories={productCategories}
        activeCategorySlug={categorySlug}
      >
        <section className="">
          <div className="max-w-4xl rounded-[2rem] bg-white md:px-6 md:py-5">
            <Link
              href={buildPostCategoryPath(locale, categorySlug)}
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[#FF6B35] hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to {categoryName}
            </Link>

            <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-gray-500">
              <Link
                href={buildPostCategoryPath(locale, categorySlug)}
                className="rounded-full bg-[#fff1eb] px-3 py-1 font-semibold text-[#FF6B35] transition hover:bg-[#FF6B35] hover:text-white"
              >
                {categoryName}
              </Link>
              <span>{formatDate(publishedAt)}</span>
              <span>By {authorName}</span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-[#1a1a1a] md:text-5xl">
              {title}
            </h1>

            {excerpt ? (
              <p className="mt-3 max-w-3xl text-base leading-7 text-gray-600 md:text-lg">
                {excerpt}
              </p>
            ) : null}

            {post.featuredImage?.url ? (
              <div className="relative mt-3 aspect-[16/8] overflow-hidden rounded-[.2rem]">
                <Image
                  src={post.featuredImage.url}
                  alt={post.featuredImage.altText ?? title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : null}

            {contentHtml ? (
              <div
                className="prose prose-lg mt-3 max-w-none text-gray-700 prose-headings:my-3 prose-headings:text-[#1a1a1a] prose-p:my-2 prose-a:text-[#FF6B35] prose-strong:text-[#1a1a1a] prose-li:my-1 prose-li:text-gray-700 prose-ul:my-3 prose-ol:my-3"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            ) : (
              <div className="mt-5 rounded-[1.5rem] border border-dashed border-[#e8dcc5] bg-[#fcfaf6] p-5 text-sm leading-7 text-gray-600">
                No article body has been added yet.
              </div>
            )}

            {relatedItems.length > 0 ? (
              <section className="mt-8">
                <div className="mb-4 flex items-center justify-between gap-4">
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

            <PostComments postId={post.id} comments={comments} />
          </div>
        </section>
      </EditorialPageShell>
    </article>
  );
}

export async function generateMetadata({ params }: PostDetailPageProps): Promise<Metadata> {
  const { locale, category: categorySlug, slug } = await params;

  if (!localeEngine.isSupported(locale)) {
    return {};
  }

  const siteConfig = await getSiteConfig(locale);

  const post = await getPublishedPostByCategoryAndSlug(locale, categorySlug, slug);
  if (!post) {
    return {
      title: slug,
      description: siteConfig.seo.description,
    };
  }

  const title = getLocale(post.title as Record<string, string> | null, locale) ?? slug;
  const excerpt = getLocale(post.excerpt as Record<string, string> | null, locale);
  const seo = post.seo && typeof post.seo === 'object' ? (post.seo as Record<string, unknown>) : null;
  const metaTitle = typeof seo?.metaTitle === 'string' && seo.metaTitle.trim() ? seo.metaTitle : title;
  const metaDescription =
    typeof seo?.metaDescription === 'string' && seo.metaDescription.trim()
      ? seo.metaDescription
      : (excerpt ?? siteConfig.seo.description);
  const noIndex = seo?.noIndex === true;
  const categorySlugMap =
    post.category?.slug && typeof post.category.slug === 'object'
      ? (post.category.slug as Record<string, string>)
      : null;
  const postSlugMap =
    post.slug && typeof post.slug === 'object'
      ? (post.slug as Record<string, string>)
      : null;
  const languageAlternates =
    categorySlugMap && postSlugMap
      ? Object.fromEntries(
          Object.entries(postSlugMap)
            .map(([altLocale, altSlug]) => {
              const altCategorySlug = categorySlugMap[altLocale];
              return typeof altSlug === 'string' && altSlug && typeof altCategorySlug === 'string' && altCategorySlug
                ? [altLocale, buildPostItemPath(altLocale, altCategorySlug, altSlug)]
                : null;
            })
            .filter((entry): entry is [string, string] => entry !== null),
        )
      : undefined;

  return {
    title: metaTitle,
    description: metaDescription,
    robots: noIndex ? { index: false, follow: false } : undefined,
    alternates: {
      canonical: buildPostItemPath(locale, categorySlug, slug),
      languages: languageAlternates,
    },
  };
}
