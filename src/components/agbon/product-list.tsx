'use client'

import { useState, useEffect, useRef } from 'react'
import { ProductRecord, ProductCategoryRecord } from '@/lib/cms'
import { AgbonProductCard } from './product-card'
import { t as agbonT } from '@/lib/agbon-translations'
import { useAgbonProductNav } from '@/contexts/agbon-product-nav-context'

export const DEFAULT_AGBON_PRODUCT_GRID_COLUMNS = 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'

interface AgbonProductListProps {
  products: ProductRecord[]
  categories?: ProductCategoryRecord[]
  locale?: string
  itemsPerPage?: number
  gridColumns?: string
  showHeader?: boolean
  title?: string
  showPagination?: boolean
  featuredProducts?: ProductRecord[]
  showFeatured?: boolean
  featuredTitle?: string
}

function getLocalized(field: unknown, locale: string): string {
  if (!field) return ''
  if (typeof field === 'string') return field
  if (typeof field === 'object') {
    const obj = field as Record<string, string>
    return obj[locale] || obj.en || obj.fr || Object.values(obj)[0] || ''
  }
  return ''
}

function getDescendantCategoryIds(categories: ProductCategoryRecord[], rootId: string): Set<string> {
  const ids = new Set<string>([rootId])
  let changed = true

  while (changed) {
    changed = false
    for (const category of categories) {
      if (!category.parentCategoryId || ids.has(category.id)) continue
      if (ids.has(category.parentCategoryId)) {
        ids.add(category.id)
        changed = true
      }
    }
  }

  return ids
}

function findCategoryName(categories: ProductCategoryRecord[], categoryId: string, locale: string): string {
  const category = categories.find((entry) => entry.id === categoryId)
  return getLocalized(category?.name, locale)
}

function getVisiblePages(page: number, totalPages: number): Array<number | 'ellipsis'> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (page <= 4) return [1, 2, 3, 4, 5, 'ellipsis', totalPages]
  if (page >= totalPages - 3) {
    return [1, 'ellipsis', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  }

  return [1, 'ellipsis', page - 1, page, page + 1, 'ellipsis', totalPages]
}

export function AgbonProductList({
  products,
  categories = [],
  locale = 'en',
  itemsPerPage = 12,
  gridColumns = DEFAULT_AGBON_PRODUCT_GRID_COLUMNS,
  showHeader = true,
  title,
  showPagination = true,
  featuredProducts = [],
  showFeatured = false,
  featuredTitle,
}: AgbonProductListProps) {
  const { selectedCategory, searchQuery, featuredOnly } = useAgbonProductNav()
  const [currentPage, setCurrentPage] = useState(1)
  const listRef = useRef<HTMLDivElement>(null)

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, searchQuery, featuredOnly])

  // Filter products
  let filtered = products

  if (featuredOnly) {
    filtered = filtered.filter((p) => p.featured)
  }

  if (selectedCategory) {
    const matchingCategoryIds = getDescendantCategoryIds(categories, selectedCategory)
    filtered = filtered.filter((p) => {
      const catId = typeof p.category === 'string' ? p.category : (p.category as any)?.id
      return catId ? matchingCategoryIds.has(catId) : false
    })
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase()
    filtered = filtered.filter((p) => {
      const name = getLocalized(p.name, locale).toLowerCase()
      const model = getLocalized(p.model, locale).toLowerCase()
      const desc = getLocalized(p.description, locale).toLowerCase()
      return name.includes(q) || model.includes(q) || desc.includes(q)
    })
  }

  // Sort by order
  filtered = [...filtered].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentProducts = filtered.slice(startIndex, startIndex + itemsPerPage)
  const visiblePages = getVisiblePages(currentPage, totalPages)

  const goToPage = (page: number) => {
    setCurrentPage(page)
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Category name for header
  const categoryName = selectedCategory
    ? findCategoryName(categories, selectedCategory, locale)
    : featuredOnly
      ? agbonT('home.hotSellingProducts', locale)
      : agbonT('common.allProducts', locale)

  return (
    <div ref={listRef} className="space-y-6">
      {/* Featured / Hot Selling */}
      {showFeatured && featuredProducts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-[#1a1a1a]">
            {featuredTitle || agbonT('home.hotSellingProducts', locale)}
          </h2>
          <div className={`grid ${gridColumns} gap-2`}>
            {featuredProducts.map((p) => (
              <AgbonProductCard key={p.id} product={p} locale={locale} />
            ))}
          </div>
        </div>
      )}

      {/* Header */}
      {showHeader && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#1a1a1a]">{categoryName || title || agbonT('common.allProducts', locale)}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {agbonT('home.showing', locale)} {filtered.length > 0 ? startIndex + 1 : 0}–
              {Math.min(startIndex + itemsPerPage, filtered.length)} {agbonT('home.of', locale)}{' '}
              {filtered.length} {agbonT('home.products', locale)}
            </p>
          </div>
        </div>
      )}

      {/* Grid */}
      {currentProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">{agbonT('home.noProducts', locale)}</p>
        </div>
      ) : (
        <div className={`grid ${gridColumns} gap-2`}>
          {currentProducts.map((product) => (
            <AgbonProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => goToPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="min-w-24 rounded-xl border border-[#d0d5dd] bg-white px-4 py-2 text-sm font-medium text-[#344054] transition hover:border-[#FF6B35] hover:text-[#FF6B35] disabled:cursor-not-allowed disabled:border-[#eaecf0] disabled:text-[#98a2b3]"
          >
            {agbonT('home.previous', locale)}
          </button>

          {visiblePages.map((page, index) =>
            page === 'ellipsis' ? (
              <span key={`ellipsis-${index}`} className="px-2 text-sm font-medium text-[#98a2b3]">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => goToPage(page)}
                aria-current={currentPage === page ? 'page' : undefined}
                className={`min-w-12 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                  currentPage === page
                    ? 'border-[#FF6B35] bg-[#FF6B35] text-white shadow-[0_8px_20px_rgba(255,107,53,0.18)]'
                    : 'border-[#d0d5dd] bg-white text-[#344054] hover:border-[#FF6B35] hover:text-[#FF6B35]'
                }`}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="min-w-24 rounded-xl border border-[#d0d5dd] bg-white px-4 py-2 text-sm font-medium text-[#344054] transition hover:border-[#FF6B35] hover:text-[#FF6B35] disabled:cursor-not-allowed disabled:border-[#eaecf0] disabled:text-[#98a2b3]"
          >
            {agbonT('home.next', locale)}
          </button>
        </div>
      )}
    </div>
  )
}
