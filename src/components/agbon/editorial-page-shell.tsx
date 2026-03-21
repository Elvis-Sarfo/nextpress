import { EditorialPageSidebar, type EditorialSidebarCategory } from './editorial-page-sidebar';
import type { ProductCategoryRecord } from '@/lib/cms';

interface EditorialPageShellProps {
  locale: string;
  categories: EditorialSidebarCategory[];
  productCategories?: ProductCategoryRecord[];
  activeCategorySlug?: string | null;
  stickySidebar?: boolean;
  children: React.ReactNode;
}

export function EditorialPageShell({
  locale,
  categories,
  productCategories = [],
  activeCategorySlug = null,
  stickySidebar = true,
  children,
}: EditorialPageShellProps) {
  return (
    <div className="mx-auto flex max-w-[90rem] items-start gap-3 px-2 py-6 md:gap-4 md:px-4">
      <div
        className={[
          'w-16 shrink-0 md:w-64 lg:w-72',
          stickySidebar ? 'sticky top-5 self-start md:top-6' : '',
        ].join(' ').trim()}
      >
        <EditorialPageSidebar
          locale={locale}
          categories={categories}
          productCategories={productCategories}
          activeCategorySlug={activeCategorySlug}
        />
      </div>

      <div className="min-w-0 flex-1">
        {children}
      </div>
    </div>
  );
}
