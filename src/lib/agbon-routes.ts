export function buildLocalizedPath(locale: string, path: string = ''): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  if (normalizedPath === '/') {
    return `/${locale}`
  }

  return `/${locale}${normalizedPath}`
}

export function buildProductPath(locale: string, slug: string): string {
  return buildLocalizedPath(locale, `/products/${slug}`)
}

export function buildProductCategoryPath(locale: string, categoryId: string): string {
  return `${buildLocalizedPath(locale, '/products')}?category=${encodeURIComponent(categoryId)}`
}

export function buildPostsListingPath(locale: string, page?: number): string {
  const basePath = buildLocalizedPath(locale, '/posts')
  return page && page > 1 ? `${basePath}?page=${page}` : basePath
}

export function buildPostCategoryPath(locale: string, categorySlug: string, page?: number): string {
  const basePath = buildLocalizedPath(locale, `/posts/${categorySlug}`)
  return page && page > 1 ? `${basePath}?page=${page}` : basePath
}

export function buildPostItemPath(locale: string, categorySlug: string, slug: string): string {
  return buildLocalizedPath(locale, `/posts/${categorySlug}/${slug}`)
}

export function buildNewsListingPath(locale: string, page?: number): string {
  return buildPostCategoryPath(locale, 'news', page)
}

export function buildNewsItemPath(locale: string, slug: string): string {
  return buildPostItemPath(locale, 'news', slug)
}

export function replaceLocaleInPath(pathname: string, locale: string): string {
  const nextPath = pathname.replace(/^\/(en|fr|zh)(?=\/|$)/, `/${locale}`)
  return nextPath === pathname ? buildLocalizedPath(locale, pathname) : nextPath
}
