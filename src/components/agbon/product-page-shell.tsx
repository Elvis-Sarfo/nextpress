import { ProductCategoryRecord } from '@/lib/cms'
import { AgbonSidebarCategories } from './sidebar-categories'
import { AgbonProductNavProvider } from '@/contexts/agbon-product-nav-context'

interface ProductPageShellProps {
  locale: string
  categories: ProductCategoryRecord[]
  sidebarMode: 'filter' | 'navigation'
  syncWithUrl?: boolean
  stickySidebar?: boolean
  children: React.ReactNode
}

export function ProductPageShell({
  locale,
  categories,
  sidebarMode,
  syncWithUrl = true,
  stickySidebar = true,
  children,
}: ProductPageShellProps) {
  return (
    <div className="flex max-w-[90rem] mx-auto items-start gap-3 px-2 py-6 md:gap-4 md:px-4">
      <div
        className={[
          'w-20 md:w-64 lg:w-72 shrink-0 sticky top-5 self-start',
          stickySidebar ? 'sticky top-6 self-start' : '',
        ].join(' ').trim()}
      >
        <AgbonProductNavProvider mode={sidebarMode} syncWithUrl={syncWithUrl} locale={locale}>
          <AgbonSidebarCategories categories={categories} locale={locale} compactOnMobile />
        </AgbonProductNavProvider>
      </div>

      <div className="min-w-0 flex-1">
        <AgbonProductNavProvider mode={sidebarMode} syncWithUrl={syncWithUrl} locale={locale}>
          {children}
        </AgbonProductNavProvider>
      </div>
    </div>
  )
}
