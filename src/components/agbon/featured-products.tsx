'use client'

import { Flame } from 'lucide-react'
import { AgbonProductCard } from './product-card'
import { AgbonSectionTitle } from './section-title'
import type { ProductRecord } from '@/lib/cms'

interface FeaturedProductsProps {
  products: ProductRecord[]
  locale?: string
  title?: string
  showViewAllButton?: boolean
  onViewAllClick?: () => void
}

export function AgbonFeaturedProducts({
  products,
  locale = 'en',
  title = 'Hot Selling Products',
  showViewAllButton = false,
  onViewAllClick,
}: FeaturedProductsProps) {
  if (products.length === 0) return null

  return (
    <section className="mb-4 md:mb-12 relative overflow-hidden rounded-3xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 md:mb-6 gap-4 relative z-10 px-4 md:px-6 pt-6 md:pt-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#FF6B35]/10 border border-[#FF6B35]/20 flex items-center justify-center">
            <Flame className="text-[#FF6B35]" size={20} />
          </div>
          <div className="relative">
            <AgbonSectionTitle title={title} />
            <div className="h-1 w-[70%] bg-[#FF6B35] rounded-full mt-1" />
          </div>
        </div>
        {showViewAllButton && onViewAllClick && (
          <button
            onClick={onViewAllClick}
            className="text-[#FF6B35] text-sm font-semibold border border-[#FF6B35]/30 px-4 py-2 rounded-lg hover:bg-[#FF6B35]/10 transition"
          >
            View All
          </button>
        )}
        {!showViewAllButton && (
          <div className="flex gap-0.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="text-[#FF6B35] text-xl md:text-3xl">★</span>
            ))}
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="relative z-10 px-4 md:px-6 pb-6 md:pb-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <div key={product.id} className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
              <AgbonProductCard product={product} locale={locale} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
