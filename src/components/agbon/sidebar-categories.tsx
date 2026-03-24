'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { ChevronDown, ChevronRight, Search } from 'lucide-react'
import { ProductCategoryRecord } from '@/lib/cms'
import { t as agbonT } from '@/lib/agbon-translations'
import { useAgbonProductNav } from '@/contexts/agbon-product-nav-context'

export type SidebarLayoutMode = 'standard' | 'compact' | 'responsive'
export type SidebarSearchMode = 'inline' | 'dialog' | 'auto'

function getLocalized(field: unknown, locale: string): string {
  if (!field) return ''
  if (typeof field === 'string') return field
  if (typeof field === 'object') {
    const obj = field as Record<string, string>
    return obj[locale] || obj.en || obj.fr || Object.values(obj)[0] || ''
  }
  return ''
}

interface SidebarCategoriesProps {
  categories: ProductCategoryRecord[]
  locale?: string
  onSearchButtonClick?: () => void
  layoutMode?: SidebarLayoutMode
  searchMode?: SidebarSearchMode
  showSearch?: boolean
  showAllProducts?: boolean
  showHotSelling?: boolean
  showCategoryHeading?: boolean
}

function buildCategoryTree(categories: ProductCategoryRecord[]): ProductCategoryRecord[] {
  const sorted = [...categories].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  const byParent = new Map<string | null, ProductCategoryRecord[]>()

  for (const category of sorted) {
    const parentId = category.parentCategoryId ?? null
    const group = byParent.get(parentId) ?? []
    group.push({ ...category, children: [] })
    byParent.set(parentId, group)
  }

  const attach = (parentId: string | null): ProductCategoryRecord[] => {
    const nodes = byParent.get(parentId) ?? []
    return nodes.map((node) => ({
      ...node,
      children: attach(node.id),
    }))
  }

  return attach(null)
}

function getCategoryPathIds(
  categoryId: string,
  categories: ProductCategoryRecord[],
): string[] {
  const byId = new Map(categories.map((category) => [category.id, category]))
  const path: string[] = []
  const seen = new Set<string>()
  let current = byId.get(categoryId)

  while (current && !seen.has(current.id)) {
    seen.add(current.id)
    path.unshift(current.id)
    current = current.parentCategoryId ? byId.get(current.parentCategoryId) : undefined
  }

  return path
}

export function AgbonSidebarCategories({
  categories,
  locale = 'en',
  onSearchButtonClick,
  layoutMode = 'responsive',
  searchMode = 'auto',
  showSearch = true,
  showAllProducts = true,
  showHotSelling = true,
  showCategoryHeading = true,
}: SidebarCategoriesProps) {
  const {
    selectedCategory,
    searchQuery,
    featuredOnly,
    setCategory,
    setSearch,
    setFeaturedOnly,
    resetFilters,
    navigateToProducts,
  } = useAgbonProductNav()

  const categoryTree = useMemo(() => buildCategoryTree(categories), [categories])
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const isCompact = layoutMode === 'compact'
  const isResponsive = layoutMode === 'responsive'
  const usesCompactLayout = isCompact || isResponsive
  const compactItemBase = isResponsive
    ? 'relative flex w-full flex-col items-center justify-center gap-1 px-1 py-1 text-center text-white transition md:flex-row md:items-center md:justify-start md:gap-3 md:px-1 md:py-1 md:text-left'
    : 'relative flex w-full flex-col items-center justify-center gap-1 px-1 py-1 text-center text-white transition'
  const compactInactive = 'bg-transparent hover:bg-white/[0.04]'
  const compactActive = isResponsive ? 'bg-black md:bg-[#1a1a1a]' : 'bg-black'
  const compactLabel = 'text-[0.62rem] leading-tight font-semibold tracking-[0.01em]'

  const searchCardClass = usesCompactLayout
    ? `${compactItemBase} ${compactInactive} ${isResponsive ? 'rounded-none md:rounded md:border md:border-gray-300 md:bg-white md:text-gray-900 md:hover:border-orange-500' : 'rounded-none'}`
    : 'w-full flex items-center gap-2 px-1 py-1 bg-white text-gray-900 border border-gray-300 hover:border-orange-500 transition'

  const submitSearch = () => {
    if (onSearchButtonClick) {
      onSearchButtonClick()
      return
    }
    navigateToProducts(searchQuery ? { search: searchQuery } : undefined, locale)
  }

  const searchInput = (
    <div className="relative">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
      <input
        type="text"
        placeholder={agbonT('header.searchPlaceholder', locale)}
        value={searchQuery}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            submitSearch()
          }
        }}
        className="w-full pl-9 pr-3 py-2 bg-white text-gray-900 text-xs md:text-sm border border-gray-300 focus:border-orange-500 focus:outline-none transition placeholder:text-gray-500"
      />
    </div>
  )

  const renderSearchButton =
    showSearch && (searchMode === 'dialog' || searchMode === 'auto' && layoutMode === 'compact')
  const renderResponsiveSearch =
    showSearch && searchMode === 'auto' && layoutMode === 'responsive'
  const renderSearchInput = showSearch && (searchMode === 'inline' || searchMode === 'auto' && layoutMode === 'standard')

  useEffect(() => {
    if (!selectedCategory) {
      setExpandedCategories((prev) => (prev.size === 0 ? prev : new Set()))
      return
    }

    const pathIds = getCategoryPathIds(selectedCategory, categories)
    if (pathIds.length === 0) {
      setExpandedCategories((prev) => (prev.size === 0 ? prev : new Set()))
      return
    }

    setExpandedCategories((prev) => {
      const next = new Set(pathIds)
      if (prev.size === next.size && [...prev].every((id) => next.has(id))) {
        return prev
      }
      return next
    })
  }, [categories, selectedCategory])

  const toggleExpanded = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(categoryId)) {
        next.delete(categoryId)
      } else {
        next.add(categoryId)
      }
      return next
    })
  }

  return (
    <aside className="h-fit overflow-hidden rounded-[.3rem] bg-[#2b2d35] text-white md:rounded-lg md:bg-[#1a1a1a]">
      <div className="py-2 px-0 md:p-6">
        {/* Search */}
        {renderResponsiveSearch ? (
          <div className="mb-2 md:mb-4">
            <button
              onClick={onSearchButtonClick}
              className={`${searchCardClass} md:hidden`}
            >
              <Search size={29} className="text-white md:text-gray-600" />
              <span className={`${compactLabel} md:text-sm md:font-medium md:text-gray-600`}>
                Search Products
              </span>
            </button>
            <div className="mx-4 h-px bg-[#14315f] md:hidden" />
            <div className="hidden md:block">{searchInput}</div>
          </div>
        ) : renderSearchButton ? (
          <div className="mb-2 md:mb-4">
            <button
              onClick={onSearchButtonClick}
              className={searchCardClass}
            >
              <Search size={usesCompactLayout ? 29 : 16} className={`${usesCompactLayout ? 'text-white md:text-gray-600' : 'text-gray-600 md:h-4 md:w-4'}`} />
              <span className={`${usesCompactLayout ? `${compactLabel} md:text-sm md:font-medium md:text-gray-600` : 'font-medium text-gray-600 text-xs md:text-sm'}`}>
                {usesCompactLayout ? 'Search Products' : agbonT('search.openSearch', locale)}
              </span>
            </button>
          </div>
        ) : renderSearchInput ? (
          <div className="mb-3 md:mb-4">{searchInput}</div>
        ) : null}

        {showAllProducts && (
          <button
            type="button"
            onClick={() => resetFilters()}
            className={
              usesCompactLayout
                ? `${compactItemBase} ${selectedCategory === null && !featuredOnly ? compactActive : compactInactive}`
                : `w-full transition rounded ${
                    selectedCategory === null && !featuredOnly ? 'bg-[#1a1a1a] text-white' : 'bg-gray-800 hover:bg-gray-700 text-white'
                  } flex items-center gap-2 md:gap-3 p-2 md:p-3 text-left`
            }
          >
            {usesCompactLayout && selectedCategory === null && !featuredOnly && (
              <span className="absolute inset-y-0 left-0 w-1 bg-[#ff8a2a] md:hidden" />
            )}
            <span className={`shrink-0 ${usesCompactLayout ? 'text-xl md:text-base lg:text-xl' : 'text-base md:text-xl'}`}>🏠</span>
            <span className={usesCompactLayout ? `${compactLabel} md:text-sm` : 'text-xs md:text-sm font-semibold'}>
              {agbonT('common.allProducts', locale)}
            </span>
          </button>
        )}

        {showHotSelling && (
          <button
            type="button"
            onClick={() => setFeaturedOnly(!featuredOnly)}
            className={
              usesCompactLayout
                ? `${compactItemBase} ${featuredOnly ? compactActive : compactInactive}`
                : `w-full transition border-b border-gray-800 ${
                    featuredOnly ? 'bg-[#1a1a1a] text-white' : 'hover:bg-gray-900 text-white'
                  } flex items-center gap-2 md:gap-3 p-2 md:p-3 text-left`
            }
          >
            {usesCompactLayout && featuredOnly && (
              <span className="absolute inset-y-0 left-0 w-1 bg-[#ff8a2a] md:hidden" />
            )}
            <span className={`shrink-0 ${usesCompactLayout ? 'text-2xl md:text-base lg:text-xl' : 'text-base md:text-xl'}`}>🔥</span>
            <span className={usesCompactLayout ? `${compactLabel} md:text-sm md:flex-1` : 'text-xs md:text-sm flex-1 font-semibold'}>
              Hot Selling
            </span>
          </button>
        )}

        {showCategoryHeading && (
          <h3 className={`font-bold text-xs md:text-lg mb-2 md:mb-4 ${usesCompactLayout ? 'hidden md:block' : ''}`}>
            {agbonT('common.categories', locale)}
          </h3>
        )}

        <div className="space-y-0">
          {categoryTree.map((cat) => {
            const renderCategory = (category: ProductCategoryRecord, depth = 0): React.ReactNode => {
              const name = getLocalized(category.name, locale) || 'Category'
              const imageUrl = category.imageUrl || null
              const hasChildren = (category.children?.length ?? 0) > 0
              const isSelected = selectedCategory === category.id
              const isExpanded = expandedCategories.has(category.id)
              const indentClass = depth === 0 ? '' : depth === 1 ? 'md:pl-6' : 'md:pl-10'

              const buttonClassName = usesCompactLayout
                ? `${compactItemBase} ${isSelected ? compactActive : isExpanded ? 'bg-white/[0.08]' : compactInactive}`
                : `w-full transition border-b border-gray-800 last:border-b-0 ${
                    isSelected
                      ? 'bg-[#000] text-white font-semibold border-l-4 border-l-[#ff8a2a]'
                      : isExpanded
                        ? 'bg-gray-800/70 text-white hover:bg-gray-700'
                        : 'hover:bg-gray-900 text-white'
                  } flex items-center gap-2 md:gap-3 p-2 md:p-3 text-left ${indentClass}`

              return (
                <div key={category.id}>
                  <button
                    type="button"
                    onClick={() => {
                      if (hasChildren) {
                        toggleExpanded(category.id)
                      }
                      setCategory(isSelected ? null : category.id)
                    }}
                    className={buttonClassName}
                    style={usesCompactLayout && depth > 0 ? { paddingLeft: `${depth * 16 + 8}px` } : undefined}
                    title={name}
                  >
                    {usesCompactLayout && isSelected && (
                      <span className="absolute inset-y-0 left-0 w-1 bg-[#ff8a2a] md:hidden" />
                    )}
                    {hasChildren ? (
                      <span
                        className={`hidden md:inline shrink-0 transition-transform ${
                          isExpanded || isSelected ? 'text-white' : 'text-gray-400'
                        }`}
                      >
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </span>
                    ) : (
                      <span className="hidden h-4 w-4 shrink-0 md:inline" />
                    )}
                    {imageUrl ? (
                      <div className="relative w-5 h-5 md:w-6 md:h-6 shrink-0">
                        <Image src={imageUrl} alt={name} fill className="object-contain" unoptimized />
                      </div>
                    ) : (
                      <span className={`shrink-0 ${usesCompactLayout ? 'text-2xl md:text-base lg:text-xl' : 'text-base md:text-xl'}`}>
                        {category.icon || '📦'}
                      </span>
                    )}
                    <span
                      className={`whitespace-normal ${
                        usesCompactLayout ? `${compactLabel} md:text-sm md:flex-1` : 'text-xs md:text-sm flex-1'
                      } ${isSelected ? 'font-bold' : usesCompactLayout ? 'font-semibold' : 'font-medium'}`}
                    >
                      {name}
                    </span>
                    {hasChildren && !isSelected && !usesCompactLayout && (
                      <span className="hidden rounded bg-gray-700/50 px-1.5 py-0.5 text-[10px] text-gray-300 md:inline">
                        {category.children?.length}
                      </span>
                    )}
                  </button>
                  {hasChildren && isExpanded && (
                    <div className={usesCompactLayout ? 'bg-black/20 md:bg-black md:border-l-2 md:border-[#ff8a2a]/30 md:ml-2' : 'bg-black border-l-2 border-[#ff8a2a]/30 ml-1 md:ml-2'}>
                      {category.children?.map((child) => renderCategory(child, depth + 1))}
                    </div>
                  )}
                </div>
              )
            }

            return renderCategory(cat)
          })}
        </div>
      </div>
    </aside>
  )
}
