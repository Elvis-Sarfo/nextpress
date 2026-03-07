'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface ProductNavContextValue {
  selectedCategory: string | null
  searchQuery: string
  setCategory: (categoryId: string | null) => void
  setSearch: (query: string) => void
  resetFilters: () => void
  navigateToProducts: (params?: { category?: string; search?: string }, locale?: string) => void
}

const ProductNavContext = createContext<ProductNavContextValue | undefined>(undefined)

interface ProductNavProviderProps {
  children: React.ReactNode
  /**
   * 'navigation': clicks navigate to /{locale}/products (for home page sidebar)
   * 'filter': clicks filter the current view (for products page)
   */
  mode?: 'navigation' | 'filter'
  syncWithUrl?: boolean
  locale?: string
}

export function AgbonProductNavProvider({
  children,
  mode = 'filter',
  syncWithUrl = false,
  locale = 'en',
}: ProductNavProviderProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const initialCategory = syncWithUrl ? searchParams.get('category') || null : null
  const initialSearch = syncWithUrl ? searchParams.get('search') || '' : ''

  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory)
  const [searchQuery, setSearchQuery] = useState(initialSearch)

  useEffect(() => {
    if (syncWithUrl) {
      setSelectedCategory(searchParams.get('category') || null)
      setSearchQuery(searchParams.get('search') || '')
    }
  }, [searchParams, syncWithUrl])

  const setCategory = useCallback(
    (categoryId: string | null) => {
      setSelectedCategory(categoryId)

      if (mode === 'navigation' && categoryId) {
        router.push(`/${locale}/products?category=${categoryId}`)
      } else if (syncWithUrl) {
        const params = new URLSearchParams(searchParams.toString())
        if (categoryId) {
          params.set('category', categoryId)
        } else {
          params.delete('category')
        }
        params.delete('page')
        router.push(`?${params.toString()}`, { scroll: false })
      }
    },
    [mode, syncWithUrl, router, searchParams, locale],
  )

  const setSearch = useCallback(
    (query: string) => {
      setSearchQuery(query)

      if (syncWithUrl) {
        const params = new URLSearchParams(searchParams.toString())
        if (query) {
          params.set('search', query)
        } else {
          params.delete('search')
        }
        params.delete('page')
        router.push(`?${params.toString()}`, { scroll: false })
      }
    },
    [syncWithUrl, router, searchParams],
  )

  const resetFilters = useCallback(() => {
    setSelectedCategory(null)
    setSearchQuery('')

    if (mode === 'navigation') {
      router.push(`/${locale}/products`)
    } else if (syncWithUrl) {
      const params = new URLSearchParams(searchParams.toString())
      params.delete('category')
      params.delete('search')
      params.delete('page')
      router.push(`?${params.toString()}`, { scroll: false })
    }
  }, [mode, syncWithUrl, router, searchParams, locale])

  const navigateToProducts = useCallback(
    (params?: { category?: string; search?: string }, navLocale?: string) => {
      const queryParams = new URLSearchParams()
      if (params?.category) queryParams.set('category', params.category)
      if (params?.search) queryParams.set('search', params.search)
      const queryString = queryParams.toString()
      const target = navLocale || locale
      router.push(queryString ? `/${target}/products?${queryString}` : `/${target}/products`)
    },
    [router, locale],
  )

  return (
    <ProductNavContext.Provider
      value={{ selectedCategory, searchQuery, setCategory, setSearch, resetFilters, navigateToProducts }}
    >
      {children}
    </ProductNavContext.Provider>
  )
}

export function useAgbonProductNav() {
  const context = useContext(ProductNavContext)
  if (!context) {
    throw new Error('useAgbonProductNav must be used within AgbonProductNavProvider')
  }
  return context
}
