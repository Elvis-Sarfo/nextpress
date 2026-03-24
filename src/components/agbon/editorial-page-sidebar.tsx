import Link from 'next/link';
import type { ProductCategoryRecord } from '@/lib/cms';
import { AgbonProductNavProvider } from '@/contexts/agbon-product-nav-context';
import { buildPostCategoryPath, buildPostsListingPath, buildProductCategoryPath } from '@/lib/agbon-routes';
import { ProductPageSidebar } from './product-page-sidebar';

export interface EditorialSidebarCategory {
  id: string;
  name: string;
  slug: string;
}

interface EditorialPageSidebarProps {
  locale: string;
  categories: EditorialSidebarCategory[];
  activeCategorySlug?: string | null;
  productCategories?: ProductCategoryRecord[];
}

export function EditorialPageSidebar({
  locale,
  categories,
  activeCategorySlug = null,
  productCategories = [],
}: EditorialPageSidebarProps) {
  const productCategoryPaths = Object.fromEntries(
    productCategories.map((category) => [category.id, buildProductCategoryPath(locale, category.path)]),
  );

  return (
    <div className="space-y-4">
      <aside className="overflow-hidden rounded-[.3rem] border border-[#eadfca] bg-white shadow-sm md:rounded-lg">
        <div className="border-b border-[#f1e6d3] bg-[#fcf8f1] px-2 py-3 md:px-5 md:py-4">
          <p className="hidden text-xs font-semibold uppercase tracking-[0.24em] text-[#7A5C00] md:block">
            Editorial
          </p>
          <h2 className="text-center text-[0.65rem] font-black uppercase tracking-[0.24em] text-[#1a1a1a] md:mt-2 md:text-left md:text-lg md:normal-case md:tracking-normal">
            <span className="md:hidden">Posts</span>
            <span className="hidden md:inline">Post Categories</span>
          </h2>
        </div>

        <nav className="p-1 md:p-3">
          <Link
            href={buildPostsListingPath(locale)}
            className={`mb-1 flex min-h-14 items-center justify-center rounded-[0.35rem] px-1 py-2 text-center text-[0.62rem] font-semibold uppercase tracking-[0.18em] transition md:mb-2 md:min-h-0 md:justify-between md:rounded-2xl md:px-4 md:py-3 md:text-sm md:normal-case md:tracking-normal ${
              !activeCategorySlug
                ? 'bg-[#FF6B35] text-white'
                : 'text-[#1a1a1a] hover:bg-[#fff2ec] hover:text-[#FF6B35]'
            }`}
          >
            <span className="text-[0.5rem] leading-tight tracking-[0.12em] whitespace-normal break-words md:hidden">
              All Posts
            </span>
            <span className="hidden md:inline">All Posts</span>
            <span className="hidden text-xs uppercase tracking-[0.2em] md:inline">View</span>
          </Link>

          <div className="space-y-1 md:space-y-2">
            {categories.map((category) => {
              const isActive = category.slug === activeCategorySlug;

              return (
                <Link
                  key={category.id}
                  href={buildPostCategoryPath(locale, category.slug)}
                  className={`flex min-h-14 items-center justify-center rounded-[0.35rem] px-1 py-2 text-center text-[0.62rem] font-semibold uppercase tracking-[0.18em] transition md:min-h-0 md:justify-between md:rounded-2xl md:px-4 md:py-3 md:text-sm md:normal-case md:tracking-normal ${
                    isActive
                      ? 'bg-[#FF6B35] text-white'
                      : 'text-[#1a1a1a] hover:bg-[#fff2ec] hover:text-[#FF6B35]'
                  }`}
                >
                  <span className="text-[0.5rem] leading-tight tracking-[0.08em] whitespace-normal break-words md:hidden">
                    {category.name}
                  </span>
                  <span className="hidden md:inline">{category.name}</span>
                  <span className="hidden text-xs uppercase tracking-[0.2em] md:inline">Open</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>

      {productCategories.length > 0 ? (
        <div className="w-16 md:w-64 lg:w-72 shrink-0 sticky top-5 self-start">
          <AgbonProductNavProvider
            mode="navigation"
            syncWithUrl={false}
            locale={locale}
            categoryPaths={productCategoryPaths}
          >
            <ProductPageSidebar locale={locale} categories={productCategories} />
          </AgbonProductNavProvider>
        </div>
      ) : null}
    </div>
  );
}
