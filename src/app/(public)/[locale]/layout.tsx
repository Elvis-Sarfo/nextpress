import { notFound } from 'next/navigation'
import { AgbonHeader, HeaderConfig } from '@/components/agbon/header'
import { AgbonFooter, FooterConfig } from '@/components/agbon/footer'
import { AgbonProductNavProvider } from '@/contexts/agbon-product-nav-context'
import { getSettings, localeEngine } from '@/lib/cms'
import { buildLocalizedPath } from '@/lib/agbon-routes'

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

function localizeConfiguredPath(locale: string, path: string, fallback: string) {
  if (!path) return buildLocalizedPath(locale, fallback)
  if (/^https?:\/\//.test(path)) return path
  return buildLocalizedPath(locale, path)
}

export default async function LocalePublicLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params

  if (!localeEngine.isSupported(locale)) {
    notFound()
  }

  const settings = (await getSettings()) as Record<string, unknown>
  const legal = (settings.legal as Record<string, string> | null) || {}
  const newsletter = (settings.newsletter as Record<string, unknown> | null) || {}

  const logoUrl = (settings.logo as { url?: string } | null)?.url || '/logo.png'
  const siteName = (settings.siteName as string | null) || 'Agbon'

  const headerConfig: HeaderConfig = {
    logo: {
      src: logoUrl,
      alt: siteName,
      width: 120,
      height: 40,
      className: 'h-8 md:h-10 w-auto',
    },
    navigation: {
      about: {
        label: 'About AGBON',
        items: [
          { label: 'Brand Introduction', href: buildLocalizedPath(locale, '/about') },
          { label: 'Business Map', href: buildLocalizedPath(locale, '/about#business-map') },
        ],
      },
      afterSales: { label: 'Service', href: buildLocalizedPath(locale, '/after-sales-service') },
      joinUs: {
        label: 'Join Us',
        items: [
          { label: 'Recruitment', href: buildLocalizedPath(locale, '/join-us/recruitment') },
          { label: 'Contact', href: buildLocalizedPath(locale, '/contact') },
        ],
      },
    },
  }

  const footerConfig: FooterConfig = {
    companyName: siteName,
    description:
      (settings.siteDescription as string | null) ||
      'Leading agricultural machinery manufacturer since 2018. Providing quality equipment to farmers worldwide.',
    logo: headerConfig.logo,
    quickLinks: [
      { label: 'About', href: buildLocalizedPath(locale, '/about') },
      { label: 'Products', href: buildLocalizedPath(locale, '/products') },
      { label: 'After Sales', href: buildLocalizedPath(locale, '/after-sales-service') },
      { label: 'Contact', href: buildLocalizedPath(locale, '/contact') },
    ],
    contact: {
      phone: (settings.phone as string | null) || '+1 (555) 123-4567',
      email: (settings.email as string | null) || 'info@agbon.com',
      address: (settings.address as string | null) || 'Industrial Park, Zone A',
    },
    socialMedia: {
      facebook: (settings.facebook as string | null) || undefined,
      linkedin: (settings.linkedin as string | null) || undefined,
      twitter: (settings.twitter as string | null) || undefined,
    },
    newsletter: {
      enabled: (newsletter.enabled as boolean | undefined) ?? true,
      placeholder: (newsletter.placeholder as string | null) || 'Your email',
    },
    legal: {
      privacy: localizeConfiguredPath(locale, legal.privacyPolicy || '', '/privacy-policy'),
      terms: localizeConfiguredPath(locale, legal.termsOfService || '', '/terms-of-service'),
    },
    copyright: `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`,
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AgbonHeader config={headerConfig} locale={locale} />
      <AgbonProductNavProvider>
        <main className="flex-1">{children}</main>
      </AgbonProductNavProvider>
      <AgbonFooter config={footerConfig} locale={locale} />
    </div>
  )
}
