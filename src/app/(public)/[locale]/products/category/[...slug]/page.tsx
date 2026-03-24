import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { AgbonProductList, DEFAULT_AGBON_PRODUCT_GRID_COLUMNS } from '@/components/agbon/product-list';
import { ProductPageShell } from '@/components/agbon/product-page-shell';
import { buildProductCategoryPath } from '@/lib/agbon-routes';
import { getProductCategories, getProducts, localeEngine } from '@/lib/cms';
import { getLocale } from '@/lib/locale-utils';
import { getSiteConfig } from '@/lib/site-config';

interface Props {
  params: Promise<{ locale: string; slug: string[] }>;
  searchParams: Promise<{ search?: string; featured?: string; page?: string }>;
}

function parsePageNumber(value: string | undefined): number {
  const parsed = Number.parseInt(value ?? '1', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function normalizeSlugPath(slug: string[]): string[] {
  return slug.filter(Boolean);
}

function findCategoryByPath(
  categories: Awaited<ReturnType<typeof getProductCategories>>,
  slugPath: string[],
) {
  const pathKey = slugPath.join('/');
  return categories.find((category) => category.path.join('/') === pathKey) ?? null;
}

export default async function ProductCategoryPage({ params, searchParams }: Props) {
  const { locale, slug } = await params;
  const { search, featured, page } = await searchParams;

  if (!localeEngine.isSupported(locale)) {
    notFound();
  }

  const slugPath = normalizeSlugPath(slug);
  if (slugPath.length === 0) {
    notFound();
  }

  const categories = await getProductCategories();
  const category = findCategoryByPath(categories, slugPath);
  if (!category) {
    const fallback = categories.find((entry) => entry.slug === slugPath[slugPath.length - 1]) ?? null;
    if (!fallback) {
      notFound();
    }

    const target = buildProductCategoryPath(locale, fallback.path);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (featured) params.set('featured', featured);
    if (page) params.set('page', page);
    const queryString = params.toString();
    redirect(queryString ? `${target}?${queryString}` : target);
  }

  const currentPage = parsePageNumber(page);
  const productsResult = await getProducts({
    categoryId: category.id,
    search: search || undefined,
    featured: featured === 'true' ? true : undefined,
    limit: 24,
    page: currentPage,
  });

  return (
    <ProductPageShell
      locale={locale}
      categories={categories}
      sidebarMode="filter"
      syncWithUrl
      activeCategoryId={category.id}
    >
      <AgbonProductList
        products={productsResult.products}
        categories={categories}
        locale={locale}
        itemsPerPage={24}
        showHeader={true}
        showPagination={true}
        gridColumns={DEFAULT_AGBON_PRODUCT_GRID_COLUMNS}
      />
    </ProductPageShell>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!localeEngine.isSupported(locale)) {
    return {};
  }

  const slugPath = normalizeSlugPath(slug);
  const [siteConfig, categories] = await Promise.all([
    getSiteConfig(locale),
    getProductCategories(),
  ]);

  const category =
    findCategoryByPath(categories, slugPath) ??
    categories.find((entry) => entry.slug === slugPath[slugPath.length - 1]) ??
    null;

  if (!category) {
    return {
      title: siteConfig.seo.defaultTitle,
      description: siteConfig.seo.description,
    };
  }

  const title = getLocale(category.name, locale) ?? getLocale(category.name, 'en') ?? 'Products';
  const description = getLocale(category.description, locale) ?? siteConfig.seo.description;
  const languages = Object.fromEntries(
    localeEngine
      .getSupportedLocales()
      .map((altLocale) => [altLocale, buildProductCategoryPath(altLocale, category.path)]),
  );

  return {
    title,
    description,
    alternates: {
      canonical: buildProductCategoryPath(locale, category.path),
      languages,
    },
  };
}

export async function generateStaticParams() {
  const [categories, locales] = await Promise.all([
    getProductCategories(),
    Promise.resolve(localeEngine.getSupportedLocales()),
  ]);

  return locales.flatMap((locale) =>
    categories.map((category) => ({
      locale,
      slug: category.path,
    })),
  );
}
