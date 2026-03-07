import { notFound } from 'next/navigation';
import {
  localeEngine,
  getProducts,
  getProductCategories,
} from '@/lib/cms';
import { AgbonProductList } from '@/components/agbon/product-list';
import { AgbonSidebarCategories } from '@/components/agbon/sidebar-categories';
import { AgbonProductNavProvider } from '@/contexts/agbon-product-nav-context';
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
    <div className="flex flex-col md:flex-row max-w-[90rem] mx-auto px-2 md:px-4 py-6 gap-4">
      {/* Sidebar */}
      <div className="w-full md:w-56 lg:w-64 shrink-0">
        <AgbonProductNavProvider mode="filter" syncWithUrl={true} locale={locale}>
          <AgbonSidebarCategories categories={categories} locale={locale} />
        </AgbonProductNavProvider>
      </div>

      {/* Product listing */}
      <div className="flex-1 min-w-0">
        <AgbonProductNavProvider mode="filter" syncWithUrl={true} locale={locale}>
          <AgbonProductList
            products={productsResult.products}
            categories={categories}
            locale={locale}
            itemsPerPage={24}
            showHeader={true}
            showPagination={true}
            gridColumns="grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          />
        </AgbonProductNavProvider>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === 'fr' ? 'Produits' : locale === 'zh' ? '产品' : 'Products' };
}

export async function generateStaticParams() {
  return localeEngine.getSupportedLocales().map((locale) => ({ locale }));
}
