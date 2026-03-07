import { notFound } from 'next/navigation'
import { localeEngine, getSettings } from '@/lib/cms'
import { AgbonPageBanner } from '@/components/agbon/page-banner'
import { AgbonContactForm } from '@/components/agbon/contact-form'
import { t as agbonT } from '@/lib/agbon-translations'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params

  if (!localeEngine.isSupported(locale)) notFound()

  const settings = await getSettings() as Record<string, unknown>

  return (
    <div className="bg-white">
      <AgbonPageBanner
        title={agbonT('contact.heading', locale)}
        subTitle={agbonT('contact.subtitle', locale)}
        breadcrumbs={[
          { label: agbonT('nav.home', locale), href: `/${locale}` },
          { label: agbonT('nav.contact', locale) },
        ]}
        backgroundImage="/images/section/light_gen.png"
      />
      <div className="max-w-[90rem] mx-auto px-4 md:px-8 py-12 md:py-20">
        <AgbonContactForm
          locale={locale}
          email={(settings.email as string | null) || 'info@agbon.com'}
          phone={(settings.phone as string | null) || '+1 (555) 123-4567'}
          address={(settings.address as string | null) || 'Industrial Park, Zone A'}
        />
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return { title: agbonT('nav.contact', locale) }
}

export async function generateStaticParams() {
  return localeEngine.getSupportedLocales().map((locale) => ({ locale }))
}
