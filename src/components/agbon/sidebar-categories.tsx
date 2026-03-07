'use client'

import Image from 'next/image'
import { Search } from 'lucide-react'
import { ProductCategoryRecord } from '@/lib/cms'
import { t as agbonT } from '@/lib/agbon-translations'
import { useAgbonProductNav } from '@/contexts/agbon-product-nav-context'

function getLocalized(field: unknown, locale: string): string {
  if (!field) return ''
  if (typeof field === 'string') return field
  if (typeof field === 'object') {
    const obj = field as Record<string, string>
    return obj[locale] || obj.en || obj.fr || obj.zh || Object.values(obj)[0] || ''
  }
  return ''
}

interface SidebarCategoriesProps {
  categories: ProductCategoryRecord[]
  locale?: string
  onSearchButtonClick?: () => void
  showSearchButton?: boolean
}

export function AgbonSidebarCategories({
  categories,
  locale = 'en',
  onSearchButtonClick,
  showSearchButton = false,
}: SidebarCategoriesProps) {
  const { selectedCategory, searchQuery, setCategory, setSearch, resetFilters } = useAgbonProductNav()

  const sorted = [...categories].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  return (
    <aside className="bg-[#1a1a1a] text-white rounded-lg overflow-hidden h-fit">
      <div className="p-2 md:p-6">
        {/* Search */}
        {showSearchButton ? (
          <div className="mb-3 md:mb-4">
            <button
              onClick={onSearchButtonClick}
              className="w-full flex items-center gap-2 px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 hover:border-orange-500 transition"
            >
              <Search size={16} className="text-gray-600" />
              <span className="text-xs md:text-sm text-gray-600">
                {agbonT('search.openSearch', locale)}
              </span>
            </button>
          </div>
        ) : (
          <div className="mb-3 md:mb-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
              <input
                type="text"
                placeholder={agbonT('header.searchPlaceholder', locale)}
                value={searchQuery}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white text-gray-900 text-xs md:text-sm rounded border border-gray-300 focus:border-orange-500 focus:outline-none transition placeholder:text-gray-500"
              />
            </div>
          </div>
        )}

        {/* All Products */}
        <button
          type="button"
          onClick={() => resetFilters()}
          className={`w-full flex items-center gap-2 md:gap-3 p-2 md:p-3 mb-2 md:mb-4 transition text-left rounded ${
            selectedCategory === null ? 'bg-[#1a1a1a] text-white' : 'bg-gray-800 hover:bg-gray-700 text-white'
          }`}
        >
          <span className="text-base md:text-xl shrink-0">🏠</span>
          <span className="text-xs md:text-sm font-semibold">
            {agbonT('common.allProducts', locale)}
          </span>
        </button>

        <h3 className="font-bold text-xs md:text-lg mb-2 md:mb-4">
          {agbonT('common.categories', locale)}
        </h3>

        <div className="space-y-0">
          {sorted.map((cat) => {
            const name = getLocalized(cat.name, locale) || 'Category'
            const imageUrl = cat.imageUrl || null

            return (
              <button
                type="button"
                key={cat.id}
                onClick={() => setCategory(selectedCategory === cat.id ? null : cat.id)}
                className={`w-full flex items-center gap-2 md:gap-3 p-2 md:p-3 transition text-left border-b border-gray-800 last:border-b-0 ${
                  selectedCategory === cat.id
                    ? 'bg-[#1a1a1a] text-white'
                    : 'hover:bg-gray-900 text-white'
                }`}
              >
                {imageUrl ? (
                  <div className="relative w-5 h-5 md:w-6 md:h-6 shrink-0">
                    <Image src={imageUrl} alt={name} fill className="object-contain" unoptimized />
                  </div>
                ) : (
                  <span className="text-base md:text-xl shrink-0">{cat.icon || '📦'}</span>
                )}
                <span className="text-xs md:text-sm whitespace-normal flex-1">{name}</span>
              </button>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
