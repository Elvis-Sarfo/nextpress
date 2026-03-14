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
  compactOnMobile?: boolean
}

export function AgbonSidebarCategories({
  categories,
  locale = 'en',
  onSearchButtonClick,
  showSearchButton = false,
  compactOnMobile = false,
}: SidebarCategoriesProps) {
  const { selectedCategory, searchQuery, setCategory, setSearch, resetFilters } = useAgbonProductNav()

  const sorted = [...categories].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  const renderCompactSearchCard = compactOnMobile
  const compactItemBase =
    'relative flex w-full flex-col items-center justify-center gap-1 px-1 py-1 text-center text-white transition md:flex-row md:items-center md:justify-start md:gap-3 md:px-1 md:py-1 md:text-left';
  const compactInactive = 'bg-transparent hover:bg-white/[0.04]';
  const compactActive = 'bg-black md:bg-[#1a1a1a]';
  const compactLabel = 'text-[0.62rem] leading-tight font-semibold tracking-[0.01em]';

  const searchCardClass = compactOnMobile
    ? `${compactItemBase} ${compactInactive} rounded-none md:rounded md:border md:border-gray-300 md:bg-white md:text-gray-900 md:hover:border-orange-500`
    : 'w-full flex items-center gap-2 px-1 py-1 bg-white text-gray-900 border border-gray-300 hover:border-orange-500 transition';

  return (
    <aside className="h-fit overflow-hidden rounded-[.3rem] bg-[#2b2d35] text-white md:rounded-lg md:bg-[#1a1a1a]">
      <div className="py-2 px-0 md:p-6">
        {/* Search */}
        {showSearchButton || renderCompactSearchCard ? (
          <div className="mb-2 md:mb-4">
            <button
              onClick={onSearchButtonClick}
              className={searchCardClass}
            >
              <Search size={compactOnMobile ? 29 : 16} className={`${compactOnMobile ? 'text-white md:text-gray-600' : 'text-gray-600 md:h-4 md:w-4'}`} />
              <span className={`${compactOnMobile ? `${compactLabel} md:text-sm md:font-medium md:text-gray-600` : 'font-medium text-gray-600 text-xs md:text-sm'}`}>
                {compactOnMobile ? 'Search Products' : agbonT('search.openSearch', locale)}
              </span>
            </button>
            {compactOnMobile && <div className="mx-4 h-px bg-[#14315f] md:hidden" />}
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
                className="w-full pl-9 pr-3 py-2 bg-white text-gray-900 text-xs md:text-sm border border-gray-300 focus:border-orange-500 focus:outline-none transition placeholder:text-gray-500"
              />
            </div>
          </div>
        )}

        {/* All Products */}
        <button
          type="button"
          onClick={() => resetFilters()}
          className={
            compactOnMobile
              ? `${compactItemBase} ${selectedCategory === null ? compactActive : compactInactive}`
              : `w-full transition rounded ${
                  selectedCategory === null ? 'bg-[#1a1a1a] text-white' : 'bg-gray-800 hover:bg-gray-700 text-white'
                } flex items-center gap-2 md:gap-3 p-2 md:p-3 text-left`
          }
        >
          {compactOnMobile && selectedCategory === null && (
            <span className="absolute inset-y-0 left-0 w-1 bg-[#ff8a2a] md:hidden" />
          )}
          <span className={`shrink-0 ${compactOnMobile ? 'text-xl md:text-base lg:text-xl' : 'text-base md:text-xl'}`}>🏠</span>
          <span className={compactOnMobile ? `${compactLabel} md:text-sm` : 'text-xs md:text-sm font-semibold'}>
            {agbonT('common.allProducts', locale)}
          </span>
        </button>

        <h3 className={`font-bold text-xs md:text-lg mb-2 md:mb-4 ${compactOnMobile ? 'hidden md:block' : ''}`}>
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
                className={
                  compactOnMobile
                    ? `${compactItemBase} ${selectedCategory === cat.id ? compactActive : compactInactive}`
                    : `w-full transition border-b border-gray-800 last:border-b-0 ${
                        selectedCategory === cat.id
                          ? 'bg-[#1a1a1a] text-white'
                          : 'hover:bg-gray-900 text-white'
                      } flex items-center gap-2 md:gap-3 p-2 md:p-3 text-left`
                }
              >
                {compactOnMobile && selectedCategory === cat.id && (
                  <span className="absolute inset-y-0 left-0 w-1 bg-[#ff8a2a] md:hidden" />
                )}
                {imageUrl ? (
                  <div className="relative w-5 h-5 md:w-6 md:h-6 shrink-0">
                    <Image src={imageUrl} alt={name} fill className="object-contain" unoptimized />
                  </div>
                ) : (
                  <span className={`shrink-0 ${compactOnMobile ? 'text-2xl md:text-base lg:text-xl' : 'text-base md:text-xl'}`}>{cat.icon || '📦'}</span>
                )}
                <span className={`whitespace-normal ${compactOnMobile ? `${compactLabel} md:text-sm md:flex-1` : 'text-xs md:text-sm flex-1'}`}>
                  {name}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
