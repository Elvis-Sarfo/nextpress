import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getPublishedPage,
  getPublishedIndexPage,
  localeEngine,
  getProducts,
  getProductCategories,
  getFeaturedProducts,
} from '@/lib/cms';
import { getLocale } from '@/lib/locale-utils';
import { buildLocalizedPath } from '@/lib/agbon-routes';
import { PageRenderer } from '@/components/blocks/PageRenderer';
import { AgbonProductList, DEFAULT_AGBON_PRODUCT_GRID_COLUMNS } from '@/components/agbon/product-list';
import { AgbonFeaturedProducts } from '@/components/agbon/featured-products';
import { AgbonHappyFarmingBanner } from '@/components/agbon/happy-farming-banner';
import { AgbonHomeFeatureCards } from '@/components/agbon/home-feature-cards';
import { AgbonStatsBar } from '@/components/agbon/stats-bar';
import { AgbonTestimonialStatsSection } from '@/components/agbon/testimonial-stats-section';
import { ProductPageShell } from '@/components/agbon/product-page-shell';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function LocaleHomePage({ params }: Props) {
  const { locale } = await params;

  if (!localeEngine.isSupported(locale)) {
    notFound();
  }

  // Prefer an explicit index page, then fall back to the historical "home" slug.
  const homePage = (await getPublishedIndexPage()) ?? (await getPublishedPage(locale, 'home'));

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

  // Fallback: AGBON home page (catalogue)
  const [productsResult, categories, featuredProducts] = await Promise.all([
    getProducts({ limit: 24 }),
    getProductCategories(),
    getFeaturedProducts(4),
  ]);

  return (
    <ProductPageShell locale={locale} categories={categories} sidebarMode="filter" syncWithUrl={false} stickySidebar={false}>
      <AgbonHappyFarmingBanner locale={locale} className="pt-0 pb-6" />
      <AgbonFeaturedProducts
        products={featuredProducts}
        locale={locale}
        title="Hot Selling Products"
        showViewAllButton
        viewAllLabel="View All"
        viewAllHref={buildLocalizedPath(locale, '/products')}
        gridColumns={DEFAULT_AGBON_PRODUCT_GRID_COLUMNS}
      />
      <AgbonProductList
        products={productsResult.products}
        categories={categories}
        locale={locale}
        itemsPerPage={8}
        showHeader={true}
        showPagination={true}
        gridColumns={DEFAULT_AGBON_PRODUCT_GRID_COLUMNS}
      />
      <AgbonStatsBar locale={locale} className="my-10" backgroundImage="/images/section/light_gen.png" />
      <AgbonHomeFeatureCards locale={locale} />
      <AgbonTestimonialStatsSection />
    </ProductPageShell>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  if (!localeEngine.isSupported(locale)) return {};

  const homePage = (await getPublishedIndexPage()) ?? (await getPublishedPage(locale, 'home'));
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
