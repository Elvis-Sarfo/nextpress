'use client'

import { useState } from 'react'
import { ProductCategoryRecord } from '@/lib/cms'
import { AgbonSidebarCategories } from './sidebar-categories'
import { HeaderSearchDialog } from './header-search-dialog'

interface ProductPageSidebarProps {
  locale: string
  categories: ProductCategoryRecord[]
}

export function ProductPageSidebar({ locale, categories }: ProductPageSidebarProps) {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <>
      <AgbonSidebarCategories
        categories={categories}
        locale={locale}
        compactOnMobile
        showSearchButton
        onSearchButtonClick={() => setSearchOpen(true)}
      />
      <HeaderSearchDialog
        locale={locale}
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  )
}
