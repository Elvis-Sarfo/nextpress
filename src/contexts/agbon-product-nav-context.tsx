'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { buildLocalizedPath } from '@/lib/agbon-routes'

interface ProductNavContextValue {
  selectedCategory: string | null
  searchQuery: string
  featuredOnly: boolean
  setCategory: (categoryId: string | null) => void
  setSearch: (query: string) => void
  setFeaturedOnly: (featuredOnly: boolean) => void
  resetFilters: () => void
  navigateToProducts: (params?: { category?: string; search?: string; featured?: boolean }, locale?: string) => void
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
  activeCategoryId?: string | null
  categoryPaths?: Record<string, string>
}

export function AgbonProductNavProvider({
  children,
  mode = 'filter',
  syncWithUrl = false,
  locale = 'en',
  activeCategoryId = null,
  categoryPaths,
}: ProductNavProviderProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const initialCategory = activeCategoryId ?? (syncWithUrl ? searchParams.get('category') || null : null)
  const initialSearch = syncWithUrl ? searchParams.get('search') || '' : ''
  const initialFeatured = syncWithUrl ? searchParams.get('featured') === 'true' : false

  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory)
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [featuredOnly, setFeaturedOnlyState] = useState(initialFeatured)

  useEffect(() => {
    if (activeCategoryId !== null) {
      setSelectedCategory(activeCategoryId)
      setSearchQuery(searchParams.get('search') || '')
      setFeaturedOnlyState(searchParams.get('featured') === 'true')
    } else if (syncWithUrl) {
      setSelectedCategory(searchParams.get('category') || null)
      setSearchQuery(searchParams.get('search') || '')
      setFeaturedOnlyState(searchParams.get('featured') === 'true')
    }
  }, [activeCategoryId, searchParams, syncWithUrl])

  const getCategoryUrl = useCallback(
    (categoryId: string) => {
      const categoryPath = categoryPaths?.[categoryId]
      if (!categoryPath) return null

      if (!syncWithUrl) {
        return categoryPath
      }

      const params = new URLSearchParams(searchParams.toString())
      params.delete('category')
      params.delete('featured')
      params.delete('page')
      const queryString = params.toString()
      return queryString ? `${categoryPath}?${queryString}` : categoryPath
    },
    [categoryPaths, searchParams, syncWithUrl],
  )

  const setCategory = useCallback(
    (categoryId: string | null) => {
      setSelectedCategory(categoryId)
      if (activeCategoryId === null) {
        setFeaturedOnlyState(false)
      }

      if (categoryId) {
        const categoryUrl = getCategoryUrl(categoryId)
        if (categoryUrl) {
          router.push(categoryUrl, { scroll: false })
          return
        }
      }

      if (mode === 'navigation' && categoryId) {
        router.push(`/${locale}/products?category=${categoryId}`)
      } else if (syncWithUrl) {
        const params = new URLSearchParams(searchParams.toString())
        if (categoryId) {
          params.set('category', categoryId)
        } else {
          params.delete('category')
        }
        params.delete('featured')
        params.delete('page')
        router.push(`?${params.toString()}`, { scroll: false })
      }
    },
    [activeCategoryId, getCategoryUrl, mode, syncWithUrl, router, searchParams, locale],
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

  const setFeaturedOnly = useCallback(
    (nextFeaturedOnly: boolean) => {
      setFeaturedOnlyState(nextFeaturedOnly)
      if (activeCategoryId === null) {
        setSelectedCategory(null)
      }

      if (activeCategoryId !== null) {
        const params = new URLSearchParams(searchParams.toString())
        if (nextFeaturedOnly) {
          params.set('featured', 'true')
        } else {
          params.delete('featured')
        }
        params.delete('page')

        const categoryPath = categoryPaths?.[activeCategoryId]
        if (categoryPath) {
          const queryString = params.toString()
          router.push(queryString ? `${categoryPath}?${queryString}` : categoryPath, { scroll: false })
          return
        }
      }

      if (mode === 'navigation' && nextFeaturedOnly) {
        router.push(`/${locale}/products?featured=true`)
      } else if (mode === 'navigation') {
        router.push(`/${locale}/products`)
      } else if (syncWithUrl) {
        const params = new URLSearchParams(searchParams.toString())
        if (nextFeaturedOnly) {
          params.set('featured', 'true')
        } else {
          params.delete('featured')
        }
        params.delete('category')
        params.delete('page')
        router.push(`?${params.toString()}`, { scroll: false })
      }
    },
    [activeCategoryId, categoryPaths, mode, syncWithUrl, router, searchParams, locale],
  )

  const resetFilters = useCallback(() => {
    setSelectedCategory(null)
    setSearchQuery('')
    setFeaturedOnlyState(false)

    const productsPath = buildLocalizedPath(locale, '/products')

    if (mode === 'navigation') {
      router.push(productsPath)
    } else if (syncWithUrl) {
      const params = new URLSearchParams(searchParams.toString())
      params.delete('category')
      params.delete('search')
      params.delete('featured')
      params.delete('page')
      const queryString = params.toString()
      router.push(queryString ? `${productsPath}?${queryString}` : productsPath, { scroll: false })
    }
  }, [mode, syncWithUrl, router, searchParams, locale])

  const navigateToProducts = useCallback(
    (params?: { category?: string; search?: string; featured?: boolean }, navLocale?: string) => {
      const target = navLocale || locale

      if (params?.category) {
        const categoryPath = categoryPaths?.[params.category]
        if (categoryPath) {
          const queryParams = new URLSearchParams()
          if (params.search) queryParams.set('search', params.search)
          if (params.featured) queryParams.set('featured', 'true')
          const queryString = queryParams.toString()
          router.push(queryString ? `${categoryPath}?${queryString}` : categoryPath)
          return
        }
      }

      const queryParams = new URLSearchParams()
      if (params?.category) queryParams.set('category', params.category)
      if (params?.search) queryParams.set('search', params.search)
      if (params?.featured) queryParams.set('featured', 'true')
      const queryString = queryParams.toString()
      router.push(queryString ? `/${target}/products?${queryString}` : `/${target}/products`)
    },
    [categoryPaths, router, locale],
  )

  return (
    <ProductNavContext.Provider
      value={{
        selectedCategory,
        searchQuery,
        featuredOnly,
        setCategory,
        setSearch,
        setFeaturedOnly,
        resetFilters,
        navigateToProducts,
      }}
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
