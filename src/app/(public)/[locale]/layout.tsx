import { notFound } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import type { Metadata } from 'next'
import { AgbonHeader, HeaderConfig, type HeaderNavItem } from '@/components/agbon/header'
import { AgbonFooter, FooterConfig } from '@/components/agbon/footer'
import { AgbonFloatingQuickInquiry } from '@/components/agbon/floating-quick-inquiry'
import { AgbonProductNavProvider } from '@/contexts/agbon-product-nav-context'
import { SiteConfigProvider } from '@/contexts/site-config-context'
import { getActiveCountries, getMenuByLocation, localeEngine, type MenuItem } from '@/lib/cms'
import { buildLocalizedPath } from '@/lib/agbon-routes'
import { getSiteConfig } from '@/lib/site-config'

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
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

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params
  const siteConfig = await getSiteConfig(locale)

  return {
    title: {
      default: siteConfig.seo.defaultTitle,
      template: `%s | ${siteConfig.seo.titleSuffix || siteConfig.siteName}`,
    },
    description: siteConfig.seo.description,
  }
}

export default async function LocalePublicLayout({ children, params }: LocaleLayoutProps) {
  noStore()

  const { locale } = await params

  if (!localeEngine.isSupported(locale)) {
    notFound()
  }

  const [siteConfig, primaryMenu, countries] = await Promise.all([
    getSiteConfig(locale),
    getMenuByLocation('primary'),
    getActiveCountries(),
  ])

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
    logo: siteConfig.logo,
    navigation: dynamicNavigation.length > 0 ? dynamicNavigation : fallbackNavigation,
    features: {
      showSearch: siteConfig.features.showSearch,
      showLanguageSwitcher: siteConfig.features.showLanguageSwitcher,
    },
  }

  const footerConfig: FooterConfig = {
    companyName: siteConfig.footer.companyName,
    description: siteConfig.footer.description,
    logo: headerConfig.logo,
    quickLinks: siteConfig.footer.quickLinks,
    contact: siteConfig.contact,
    socialMedia: {
      facebook: siteConfig.socialMedia.facebook,
      linkedin: siteConfig.socialMedia.linkedin,
      twitter: siteConfig.socialMedia.twitter,
      instagram: siteConfig.socialMedia.instagram,
      youtube: siteConfig.socialMedia.youtube,
    },
    newsletter: siteConfig.newsletter,
    legal: siteConfig.legal,
    copyright: siteConfig.footer.copyright,
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AgbonHeader config={headerConfig} locale={locale} />
      <SiteConfigProvider value={siteConfig}>
        <AgbonProductNavProvider>
          <main className="flex-1">{children}</main>
        </AgbonProductNavProvider>
      </SiteConfigProvider>
      {siteConfig.features.showQuickInquiry ? <AgbonFloatingQuickInquiry countries={countries} /> : null}
      <AgbonFooter config={footerConfig} locale={locale} />
    </div>
  )
}
