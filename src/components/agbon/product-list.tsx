'use client'

import { useState, useEffect } from 'react'
import { ProductRecord, ProductCategoryRecord } from '@/lib/cms'
import { AgbonProductCard } from './product-card'
import { t as agbonT } from '@/lib/agbon-translations'
import { useAgbonProductNav } from '@/contexts/agbon-product-nav-context'

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
    return obj[locale] || obj.en || obj.fr || obj.zh || Object.values(obj)[0] || ''
  }
  return ''
}

export function AgbonProductList({
  products,
  categories = [],
  locale = 'en',
  itemsPerPage = 12,
  gridColumns = 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  showHeader = true,
  title,
  showPagination = true,
  featuredProducts = [],
  showFeatured = false,
  featuredTitle,
}: AgbonProductListProps) {
  const { selectedCategory, searchQuery } = useAgbonProductNav()
  const [currentPage, setCurrentPage] = useState(1)

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, searchQuery])

  // Filter products
  let filtered = products

  if (selectedCategory) {
    filtered = filtered.filter((p) => {
      const catId = typeof p.category === 'string' ? p.category : (p.category as any)?.id
      return catId === selectedCategory
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

  // Category name for header
  const categoryName = selectedCategory
    ? getLocalized(categories.find((c) => c.id === selectedCategory)?.name, locale)
    : agbonT('common.allProducts', locale)

  return (
    <div className="space-y-6">
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
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm rounded border border-gray-300 hover:border-[#FF6B35] disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {agbonT('home.previous', locale)}
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 text-sm rounded border transition ${
                currentPage === page
                  ? 'bg-[#FF6B35] text-white border-[#FF6B35]'
                  : 'border-gray-300 hover:border-[#FF6B35]'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm rounded border border-gray-300 hover:border-[#FF6B35] disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {agbonT('home.next', locale)}
          </button>
        </div>
      )}
    </div>
  )
}
