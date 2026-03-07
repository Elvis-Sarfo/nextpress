'use client'

import { useState, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AgbonNewsCard, type AgbonNewsItem } from './news-card'
import { AgbonSectionTitle } from './section-title'

interface NewsSectionProps {
  title?: string
  subtitle?: string
  newsItems: AgbonNewsItem[]
  itemsPerPage?: number
  className?: string
}

export function AgbonNewsSection({
  title = 'Latest News & Articles',
  subtitle = 'From The Blog Post',
  newsItems,
  itemsPerPage = 3,
  className = '',
}: NewsSectionProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)

  const totalPages = Math.ceil(newsItems.length / itemsPerPage)
  const canGoPrev = currentPage > 0
  const canGoNext = currentPage < totalPages - 1

  const scroll = () => sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const currentItems = newsItems.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)

  return (
    <section ref={sectionRef} className={`py-4 md:py-8 bg-[#f5f5f5] ${className}`}>
      <div className="container mx-auto px-4">
        <AgbonSectionTitle
          subTitle={subtitle}
          title={title}
          iconSrc="/icons/agric.png"
          align="center"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8 mt-8">
          {currentItems.map((item) => (
            <AgbonNewsCard key={item.id} item={item} />
          ))}
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => { if (canGoPrev) { setCurrentPage((p) => p - 1); scroll() } }}
              disabled={!canGoPrev}
              className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                canGoPrev
                  ? 'border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white'
                  : 'border-gray-300 text-gray-300 cursor-not-allowed'
              }`}
              aria-label="Previous page"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrentPage(i); scroll() }}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    i === currentPage ? 'bg-[#FF6B35] w-8' : 'w-3 bg-gray-300 hover:bg-[#FF6B35]'
                  }`}
                  aria-label={`Go to page ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => { if (canGoNext) { setCurrentPage((p) => p + 1); scroll() } }}
              disabled={!canGoNext}
              className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                canGoNext
                  ? 'border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white'
                  : 'border-gray-300 text-gray-300 cursor-not-allowed'
              }`}
              aria-label="Next page"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
