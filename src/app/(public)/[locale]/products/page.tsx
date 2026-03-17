import { notFound } from 'next/navigation';
import {
  localeEngine,
  getProducts,
  getProductCategories,
} from '@/lib/cms';
import { AgbonProductList, DEFAULT_AGBON_PRODUCT_GRID_COLUMNS } from '@/components/agbon/product-list';
import { ProductPageShell } from '@/components/agbon/product-page-shell';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; search?: string; page?: string }>;
}

export default async function ProductsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { category, search, page } = await searchParams;

  if (!localeEngine.isSupported(locale)) {
    notFound();
  }

  const currentPage = parseInt(page || '1', 10);

  const [productsResult, categories] = await Promise.all([
    getProducts({
      categoryId: category || undefined,
      search: search || undefined,
      limit: 24,
      page: currentPage,
    }),
    getProductCategories(),
  ]);

  return (
    <ProductPageShell locale={locale} categories={categories} sidebarMode="filter" syncWithUrl>
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
  const { locale } = await params;
  return { title: locale === 'fr' ? 'Produits' : locale === 'zh' ? '产品' : 'Products' };
}

export async function generateStaticParams() {
  return localeEngine.getSupportedLocales().map((locale) => ({ locale }));
}
