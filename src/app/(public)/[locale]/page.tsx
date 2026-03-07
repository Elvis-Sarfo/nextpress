import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getPublishedPage,
  getPublishedPosts,
  localeEngine,
  getActiveHeroSlides,
  getProducts,
  getProductCategories,
  getFeaturedProducts,
} from '@/lib/cms';
import { getLocale } from '@/lib/locale-utils';
import { PageRenderer } from '@/components/blocks/PageRenderer';
import { AgbonHeroSection } from '@/components/agbon/hero-section';
import { AgbonProductList } from '@/components/agbon/product-list';
import { AgbonSidebarCategories } from '@/components/agbon/sidebar-categories';
import { AgbonHappyFarmingBanner } from '@/components/agbon/happy-farming-banner';
import { AgbonHomeFeatureCards } from '@/components/agbon/home-feature-cards';
import { AgbonStatsBar } from '@/components/agbon/stats-bar';
import { AgbonTestimonialStatsSection } from '@/components/agbon/testimonial-stats-section';
import { AgbonProductNavProvider } from '@/contexts/agbon-product-nav-context';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function LocaleHomePage({ params }: Props) {
  const { locale } = await params;

  if (!localeEngine.isSupported(locale)) {
    notFound();
  }

  // Try to find a published page with slug "home" in this locale
  const homePage = await getPublishedPage(locale, 'home');

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

  // Fallback: AGBON home page (catalogue + hero)
  const [heroSlides, productsResult, categories, featuredProducts] = await Promise.all([
    getActiveHeroSlides(),
    getProducts({ limit: 24 }),
    getProductCategories(),
    getFeaturedProducts(4),
  ]);

  return (
    <>
      <AgbonHeroSection slides={heroSlides} />
      <div className="flex flex-col md:flex-row max-w-[90rem] mx-auto px-2 md:px-4 py-6 gap-4">
        {/* Sidebar */}
        <div className="w-full md:w-56 lg:w-64 shrink-0">
          <AgbonProductNavProvider mode="filter" syncWithUrl={false} locale={locale}>
            <AgbonSidebarCategories categories={categories} locale={locale} />
          </AgbonProductNavProvider>
        </div>
        {/* Main content */}
        <div className="flex-1 min-w-0">
          <AgbonProductNavProvider mode="filter" syncWithUrl={false} locale={locale}>
            <AgbonHappyFarmingBanner locale={locale} className="pt-0 pb-6" />
            <AgbonProductList
              products={productsResult.products}
              categories={categories}
              locale={locale}
              itemsPerPage={8}
              showHeader={true}
              showFeatured={true}
              featuredProducts={featuredProducts}
              featuredTitle="Hot Selling Products"
              gridColumns="grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            />
            <AgbonStatsBar locale={locale} className="my-10" backgroundImage="/images/section/light_gen.png" />
            <AgbonHomeFeatureCards locale={locale} />
            <AgbonTestimonialStatsSection />
          </AgbonProductNavProvider>
        </div>
      </div>
    </>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  if (!localeEngine.isSupported(locale)) return {};

  const homePage = await getPublishedPage(locale, 'home');
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
