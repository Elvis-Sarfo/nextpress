'use client'

import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { Loader2, Search, Tag, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { t as agbonT } from '@/lib/agbon-translations'

interface HeaderSearchDialogProps {
  locale: string
  isOpen: boolean
  onClose: () => void
}

interface CatalogueSearchResult {
  id: string
  type: 'product' | 'product-category'
  title: string
  subtitle: string
  description?: string
  href: string
}

export function HeaderSearchDialog({ locale, isOpen, onClose }: HeaderSearchDialogProps) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<CatalogueSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (!isOpen) {
      setQuery('')
      setResults([])
      setIsLoading(false)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const trimmed = query.trim()
    if (trimmed.length < 2) {
      setResults([])
      setIsLoading(false)
      return
    }

    const controller = new AbortController()
    const timeout = setTimeout(async () => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams({ q: trimmed, locale })
        const response = await fetch(`/api/search/catalogue?${params.toString()}`, {
          signal: controller.signal,
        })
        const data = await response.json()
        setResults((data.results ?? []) as CatalogueSearchResult[])
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          setResults([])
        }
      } finally {
        setIsLoading(false)
      }
    }, 180)

    return () => {
      controller.abort()
      clearTimeout(timeout)
    }
  }, [isOpen, locale, query])

  const emptyState = useMemo(() => {
    const trimmed = query.trim()
    if (trimmed.length < 2) {
      return {
        icon: <Search size={60} className="text-gray-300" />,
        title: 'Start typing to search the catalogue...',
      }
    }
    if (isLoading) {
      return {
        icon: <Loader2 size={42} className="animate-spin text-gray-300" />,
        title: 'Searching catalogue...',
      }
    }
    if (results.length === 0) {
      return {
        icon: <Search size={60} className="text-gray-300" />,
        title: 'No catalogue results found.',
      }
    }
    return null
  }, [isLoading, query, results.length])

  if (!isOpen || !mounted) {
    return null
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex items-start justify-center bg-black/60 pt-5 md:pt-20"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={agbonT('search.openSearch', locale)}
        className="relative z-[121] mx-4 w-full max-w-3xl overflow-hidden rounded-[28px] bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-5 md:px-8 md:py-6">
          <h2 className="text-2xl font-semibold text-black md:text-3xl">Search Catalogue</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="text-black transition hover:opacity-70"
          >
            <X size={28} />
          </button>
        </div>

        <div className="border-y border-gray-200 px-4 py-5 md:px-7 md:py-7">
          <div className="flex items-center gap-3 rounded-[22px] border-4 border-[#ff6b35] px-4 py-4 md:gap-4 md:px-6 md:py-5">
            <Search size={32} className="shrink-0 text-gray-400 md:h-11 md:w-11" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products, categories, model numbers, or descriptions"
              className="w-full text-lg text-gray-700 outline-none placeholder:text-gray-400 md:text-2xl"
              onKeyDown={(event) => {
                if (event.key === 'Escape') onClose()
                if (event.key === 'Enter' && results[0]) {
                  router.push(results[0].href)
                  onClose()
                }
              }}
            />
          </div>
        </div>

        <div className="max-h-[55vh] overflow-y-auto">
          {emptyState ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center gap-5 px-6 py-12 text-center text-gray-500 md:min-h-[360px] md:gap-6 md:px-8 md:py-16">
              {emptyState.icon}
              <p className="text-xl md:text-3xl">{emptyState.title}</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {results.map((result) => (
                <li key={`${result.type}-${result.id}`}>
                  <button
                    type="button"
                    className="flex w-full items-start gap-4 px-8 py-5 text-left transition hover:bg-[#fff4ee]"
                    onClick={() => {
                      router.push(result.href)
                      onClose()
                    }}
                  >
                    <div className="mt-1 rounded-full bg-[#fff1ea] p-3 text-[#ff6b35]">
                      {result.type === 'product' ? <Search size={18} /> : <Tag size={18} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-semibold text-black">{result.title}</h3>
                        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                          {result.type === 'product' ? agbonT('nav.products', locale) : agbonT('common.categories', locale)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{result.subtitle}</p>
                      {result.description && (
                        <p className="mt-2 line-clamp-2 text-sm text-gray-600">{result.description}</p>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
