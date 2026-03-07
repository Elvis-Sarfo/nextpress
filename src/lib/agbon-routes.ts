export function buildLocalizedPath(locale: string, path: string = ''): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  if (normalizedPath === '/') {
    return `/${locale}`
  }

  return `/${locale}${normalizedPath}`
}

export function replaceLocaleInPath(pathname: string, locale: string): string {
  const nextPath = pathname.replace(/^\/(en|fr|zh)(?=\/|$)/, `/${locale}`)
  return nextPath === pathname ? buildLocalizedPath(locale, pathname) : nextPath
}
