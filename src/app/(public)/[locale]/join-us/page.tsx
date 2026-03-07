import { notFound } from 'next/navigation'
import { localeEngine } from '@/lib/cms'
import { AgbonPageBanner } from '@/components/agbon/page-banner'
import { t as agbonT } from '@/lib/agbon-translations'
import Link from 'next/link'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ locale: string }>
}

const values = [
  { icon: '🌱', title: 'Growth', desc: 'We invest in your professional development and career growth.' },
  { icon: '🤝', title: 'Collaboration', desc: 'Work alongside passionate teams across Africa.' },
  { icon: '💡', title: 'Innovation', desc: 'Help shape the future of African agriculture.' },
  { icon: '🌍', title: 'Impact', desc: 'Make a real difference in the lives of African farmers.' },
]

export default async function JoinUsPage({ params }: Props) {
  const { locale } = await params

  if (!localeEngine.isSupported(locale)) notFound()

  return (
    <div className="bg-white">
      <AgbonPageBanner
        title="Join Our Team"
        subTitle="Careers at AGBON"
        breadcrumbs={[
          { label: agbonT('nav.home', locale), href: `/${locale}` },
          { label: 'Join Us' },
        ]}
        backgroundImage="/images/section/light_gen.png"
      />

      <div className="max-w-[90rem] mx-auto px-4 md:px-8 py-12 md:py-20">
        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1a1a1a]">Build the Future of African Agriculture</h2>
          <p className="text-gray-600 text-lg">
            At AGBON, we believe that the right equipment can transform lives. Join a team dedicated to bringing quality agricultural machinery to farmers across Africa.
          </p>
        </div>

        {/* Values grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {values.map((v) => (
            <div key={v.title} className="text-center p-6 bg-[#f9f5f0] rounded-2xl">
              <div className="text-4xl mb-3">{v.icon}</div>
              <h3 className="font-bold text-[#1a1a1a] mb-2">{v.title}</h3>
              <p className="text-gray-600 text-sm">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-gray-600 mb-6">Ready to make an impact? View our open positions.</p>
          <Link
            href={`/${locale}/join-us/recruitment`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF6B35] hover:bg-[#E55A24] text-white font-semibold rounded-full shadow-lg transition-all"
          >
            View Open Positions
          </Link>
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return { title: 'Join Us' }
}

export async function generateStaticParams() {
  return localeEngine.getSupportedLocales().map((locale) => ({ locale }))
}
