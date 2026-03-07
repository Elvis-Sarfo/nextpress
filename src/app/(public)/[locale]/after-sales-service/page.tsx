import { notFound } from 'next/navigation'
import { localeEngine } from '@/lib/cms'
import { AgbonPageBanner } from '@/components/agbon/page-banner'
import { AgbonServiceAreasSection } from '@/components/agbon/service-areas-section'
import { t as agbonT } from '@/lib/agbon-translations'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function AfterSalesServicePage({ params }: Props) {
  const { locale } = await params

  if (!localeEngine.isSupported(locale)) notFound()

  return (
    <div className="bg-white">
      <AgbonPageBanner
        title={agbonT('aftersales.heading', locale)}
        subTitle={agbonT('aftersales.subtitle', locale)}
        breadcrumbs={[
          { label: agbonT('nav.home', locale), href: `/${locale}` },
          { label: agbonT('nav.afterSales', locale) },
        ]}
        backgroundImage="/images/section/light_gen.png"
      />

      {/* Service overview */}
      <div className="max-w-[90rem] mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: '🔧',
              title: agbonT('aftersales.service1.title', locale),
              desc: agbonT('aftersales.service1.desc', locale),
            },
            {
              icon: '📞',
              title: agbonT('aftersales.service2.title', locale),
              desc: agbonT('aftersales.service2.desc', locale),
            },
            {
              icon: '🚜',
              title: agbonT('aftersales.service3.title', locale),
              desc: agbonT('aftersales.service3.desc', locale),
            },
          ].map((item) => (
            <div key={item.title} className="text-center p-6 bg-gray-50 rounded-2xl">
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-lg font-bold mb-2 text-[#1a1a1a]">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Service areas */}
      <AgbonServiceAreasSection
        title={agbonT('aftersales.areasTitle', locale)}
        subtitle={agbonT('aftersales.areasSubtitle', locale)}
      />
    </div>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return { title: agbonT('nav.afterSales', locale) }
}

export async function generateStaticParams() {
  return localeEngine.getSupportedLocales().map((locale) => ({ locale }))
}
