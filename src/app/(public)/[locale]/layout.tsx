import { notFound } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import { AgbonHeader, HeaderConfig, type HeaderNavItem } from '@/components/agbon/header'
import { AgbonFooter, FooterConfig } from '@/components/agbon/footer'
import { AgbonFloatingQuickInquiry } from '@/components/agbon/floating-quick-inquiry'
import { AgbonProductNavProvider } from '@/contexts/agbon-product-nav-context'
import { getActiveCountries, getMenuByLocation, getSettings, localeEngine, type MenuItem } from '@/lib/cms'
import { buildLocalizedPath } from '@/lib/agbon-routes'
import { getLocale } from '@/lib/locale-utils'

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

function localizeConfiguredPath(locale: string, path: string, fallback: string) {
  if (!path) return buildLocalizedPath(locale, fallback)
  if (/^https?:\/\//.test(path)) return path
  return buildLocalizedPath(locale, path)
}

function resolveMenuHref(locale: string, item: MenuItem): string | undefined {
  if (item.type === 'page') {
    const slug = item.slugsByLocale?.[locale] ?? item.slugsByLocale?.en ?? Object.values(item.slugsByLocale ?? {})[0]
    return typeof slug === 'string' && slug.length > 0 ? buildLocalizedPath(locale, slug) : undefined
  }

  if (item.type === 'custom' && item.url) {
    if (/^https?:\/\//.test(item.url)) return item.url
    return buildLocalizedPath(locale, item.url)
  }

  return undefined
}

function mapMenuItemsToHeaderNavigation(locale: string, items: MenuItem[]): HeaderNavItem[] {
  return items
    .map((item) => {
      const href = resolveMenuHref(locale, item)
      const childItems = (item.children ?? [])
        .map((child) => {
          const childHref = resolveMenuHref(locale, child)
          if (!childHref) return null
          return {
            label: child.label,
            href: childHref,
            target: child.target,
          }
        })
        .filter((child): child is NonNullable<typeof child> => child !== null)

      if (!href && childItems.length === 0) return null

      return {
        label: item.label,
        href,
        target: item.target,
        items: childItems.length > 0 ? childItems : undefined,
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
}

export default async function LocalePublicLayout({ children, params }: LocaleLayoutProps) {
  noStore()

  const { locale } = await params

  if (!localeEngine.isSupported(locale)) {
    notFound()
  }

  const [settings, primaryMenu, countries] = await Promise.all([
    getSettings() as Promise<Record<string, unknown>>,
    getMenuByLocation('primary'),
    getActiveCountries(),
  ])
  const legal = (settings.legal as Record<string, string> | null) || {}
  const newsletter = (settings.newsletter as Record<string, unknown> | null) || {}
  const features = (settings.features as Record<string, unknown> | null) || {}
  const footer = (settings.footer as Record<string, unknown> | null) || {}
  const contact = (settings.contact as Record<string, unknown> | null) || {}
  const socialMedia = (settings.socialMedia as Record<string, unknown> | null) || {}
  const logo = (settings.logo as Record<string, unknown> | null) || {}

  const logoImage = (logo.image as { url?: string } | null) || (settings.logo as { url?: string } | null)
  const logoUrl = logoImage?.url || '/logo.png'
  const siteName = (settings.siteName as string | null) || 'Agbon'
  const footerDescription =
    getLocale(footer.description as Record<string, string> | null | undefined, locale) ||
    (settings.siteDescription as string | null) ||
    'Leading agricultural machinery manufacturer since 2018. Providing quality equipment to farmers worldwide.'
  const footerQuickLinks = Array.isArray(footer.quickLinks)
    ? footer.quickLinks
        .filter(
          (item): item is { label: string; href: string } =>
            typeof item === 'object' &&
            item !== null &&
            typeof (item as { label?: unknown }).label === 'string' &&
            typeof (item as { href?: unknown }).href === 'string',
        )
        .map((item) => ({
          label: item.label,
          href: localizeConfiguredPath(locale, item.href, item.href),
        }))
    : [
        { label: 'About', href: buildLocalizedPath(locale, '/about') },
        { label: 'Products', href: buildLocalizedPath(locale, '/products') },
        { label: 'After Sales', href: buildLocalizedPath(locale, '/after-sales-service') },
        { label: 'Contact', href: buildLocalizedPath(locale, '/contact') },
      ]

  const fallbackNavigation: HeaderNavItem[] = [
    {
      label: 'About AGBON',
      items: [
        { label: 'Brand Introduction', href: buildLocalizedPath(locale, '/about') },
        { label: 'Business Map', href: buildLocalizedPath(locale, '/about#business-map') },
      ],
    },
    { label: 'Service', href: buildLocalizedPath(locale, '/after-sales-service') },
    {
      label: 'Join Us',
      items: [
        { label: 'Recruitment', href: buildLocalizedPath(locale, '/join-us/recruitment') },
        { label: 'Contact', href: buildLocalizedPath(locale, '/contact') },
      ],
    },
  ]

  const dynamicNavigation = primaryMenu ? mapMenuItemsToHeaderNavigation(locale, primaryMenu.items) : []

  const headerConfig: HeaderConfig = {
    logo: {
      src: logoUrl,
      alt: (logo.alt as string | null) || siteName,
      width: (logo.width as number | null) || 120,
      height: (logo.height as number | null) || 40,
      className: 'h-8 md:h-10 w-auto',
    },
    navigation: dynamicNavigation.length > 0 ? dynamicNavigation : fallbackNavigation,
  }

  const footerConfig: FooterConfig = {
    companyName: (footer.companyName as string | null) || siteName,
    description: footerDescription,
    logo: headerConfig.logo,
    quickLinks: footerQuickLinks,
    contact: {
      phone: (contact.phone as string | null) || '+1 (555) 123-4567',
      email: (contact.email as string | null) || 'info@agbon.com',
      address: (contact.address as string | null) || 'Industrial Park, Zone A',
    },
    socialMedia: {
      facebook: (socialMedia.facebook as string | null) || undefined,
      linkedin: (socialMedia.linkedin as string | null) || undefined,
      twitter: (socialMedia.twitter as string | null) || undefined,
    },
    newsletter: {
      enabled: (newsletter.enabled as boolean | undefined) ?? true,
      placeholder:
        getLocale(newsletter.placeholder as Record<string, string> | null | undefined, locale) ||
        'Your email',
    },
    legal: {
      privacy: localizeConfiguredPath(locale, legal.privacyPolicy || '', '/privacy-policy'),
      terms: localizeConfiguredPath(locale, legal.termsOfService || '', '/terms-of-service'),
    },
    copyright:
      (footer.copyright as string | null) || `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`,
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AgbonHeader config={headerConfig} locale={locale} />
      <AgbonProductNavProvider>
        <main className="flex-1">{children}</main>
      </AgbonProductNavProvider>
      {features.showQuickInquiry !== false ? <AgbonFloatingQuickInquiry countries={countries} /> : null}
      <AgbonFooter config={footerConfig} locale={locale} />
    </div>
  )
}
