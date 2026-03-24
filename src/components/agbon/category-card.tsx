'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'
import { ProductCategoryRecord } from '@/lib/cms'
import { buildProductCategoryPath } from '@/lib/agbon-routes'

interface CategoryCardProps {
  category: ProductCategoryRecord
  locale?: string
  showProductCount?: boolean
  className?: string
  onClick?: () => void
  theme?: 'light' | 'dark'
}

function getLocalized(field: Record<string, string> | null | undefined, locale: string): string {
  if (!field) return ''
  return field[locale] || field.en || field.fr || Object.values(field)[0] || ''
}

export function AgbonCategoryCard({
  category,
  locale = 'en',
  showProductCount = false,
  className = '',
  onClick,
  theme = 'light',
}: CategoryCardProps) {
  const name = getLocalized(category.name, locale) || 'Category'
  const description = category.description ? getLocalized(category.description, locale) : undefined
  const imageUrl = category.imageUrl || null

  const isDark = theme === 'dark'

  const cardContent = (
    <div
      className={`relative overflow-hidden rounded-lg border-2 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full cursor-pointer group ${
        isDark ? 'bg-gradient-to-br from-gray-900 to-black border-gray-700' : 'bg-white border-gray-200'
      } ${className}`}
      onClick={onClick}
    >
      {/* Image area */}
      <div className={`relative pt-2 pb-1 px-1 flex items-center justify-center ${
        isDark ? 'bg-gradient-to-b from-gray-800 via-gray-900 to-black' : 'bg-gradient-to-b from-orange-50/40 via-white to-white/50'
      }`}>
        <div className="relative w-full aspect-square max-w-[180px] flex items-center justify-center">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-contain transition-all duration-300 ease-out group-hover:scale-110 drop-shadow-lg"
              unoptimized
            />
          ) : category.icon ? (
            <span className="text-[5rem] md:text-[6rem] transition-all duration-300 ease-out group-hover:scale-110">
              {category.icon}
            </span>
          ) : (
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF8C35] flex items-center justify-center">
              <span className="text-[2.5rem] md:text-[3rem] font-bold text-white">
                {name.charAt(0)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Text area */}
      <div className="relative p-3 text-center bg-white">
        <h3 className={`font-bold text-[0.875rem] sm:text-[0.95rem] md:text-[1rem] lg:text-[1.1rem] leading-tight group-hover:text-[#FF6B35] transition-colors duration-300 mb-2 line-clamp-2 min-h-10 md:min-h-11 flex items-center justify-center ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          {name}
        </h3>
        {description && (
          <p className={`text-[0.75rem] md:text-[0.8rem] line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {description}
          </p>
        )}
        <div className="mt-3 mx-auto w-12 h-0.5 bg-[#FF6B35] group-hover:w-20 transition-all duration-300 rounded-full" />
      </div>
    </div>
  )

  if (onClick) {
    return <button type="button" className="w-full text-left">{cardContent}</button>
  }

  return (
    <Link href={buildProductCategoryPath(locale, category.path)} className="block">
      {cardContent}
    </Link>
  )
}
