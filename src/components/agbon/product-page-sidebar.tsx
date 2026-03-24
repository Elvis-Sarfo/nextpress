'use client'

import { ProductCategoryRecord } from '@/lib/cms'
import { CatalogueSidebar } from './catalogue-sidebar'

interface ProductPageSidebarProps {
  locale: string
  categories: ProductCategoryRecord[]
}

export function ProductPageSidebar({ locale, categories }: ProductPageSidebarProps) {
  return (
    <CatalogueSidebar
      locale={locale}
      categories={categories}
      layoutMode="responsive"
      searchMode="auto"
      showSearch
      showAllProducts
      showHotSelling
      showCategoryHeading={false}
    />
  )
}
