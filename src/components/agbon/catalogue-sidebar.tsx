'use client'

import { useState } from 'react'
import type { ProductCategoryRecord } from '@/lib/cms'
import { AgbonSidebarCategories, type SidebarLayoutMode, type SidebarSearchMode } from './sidebar-categories'
import { HeaderSearchDialog } from './header-search-dialog'

interface CatalogueSidebarProps {
  locale: string
  categories: ProductCategoryRecord[]
  layoutMode?: SidebarLayoutMode
  searchMode?: SidebarSearchMode
  showSearch?: boolean
  showAllProducts?: boolean
  showHotSelling?: boolean
  showCategoryHeading?: boolean
}

function shouldUseDialogSearch(layoutMode: SidebarLayoutMode, searchMode: SidebarSearchMode) {
  if (searchMode === 'dialog') return true
  if (searchMode === 'inline') return false
  return layoutMode !== 'standard'
}

export function CatalogueSidebar({
  locale,
  categories,
  layoutMode = 'responsive',
  searchMode = 'auto',
  showSearch = true,
  showAllProducts = true,
  showHotSelling = true,
  showCategoryHeading = false,
}: CatalogueSidebarProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const useDialogSearch = showSearch && shouldUseDialogSearch(layoutMode, searchMode)

  return (
    <>
      <AgbonSidebarCategories
        categories={categories}
        locale={locale}
        layoutMode={layoutMode}
        searchMode={searchMode}
        showSearch={showSearch}
        showAllProducts={showAllProducts}
        showHotSelling={showHotSelling}
        showCategoryHeading={showCategoryHeading}
        onSearchButtonClick={useDialogSearch ? () => setSearchOpen(true) : undefined}
      />
      {useDialogSearch && (
        <HeaderSearchDialog
          locale={locale}
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
        />
      )}
    </>
  )
}
