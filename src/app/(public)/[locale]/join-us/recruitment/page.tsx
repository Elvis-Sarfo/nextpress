import { notFound } from 'next/navigation'
import { localeEngine } from '@/lib/cms'
import { AgbonPageBanner } from '@/components/agbon/page-banner'
import { t as agbonT } from '@/lib/agbon-translations'
import Link from 'next/link'
import { MapPin, Clock } from 'lucide-react'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ locale: string }>
}

const jobOpenings = [
  {
    title: 'Agricultural Machinery Sales Representative',
    location: 'Accra, Ghana',
    type: 'Full-time',
    description: 'We are seeking an experienced sales representative to promote and sell AGBON agricultural machinery to farmers and distributors.',
    requirements: [
      '3+ years of sales experience in agricultural sector',
      'Strong communication and negotiation skills',
      "Valid driver's license",
      'Knowledge of agricultural machinery is a plus',
    ],
  },
  {
    title: 'Field Service Technician',
    location: 'Lagos, Nigeria',
    type: 'Full-time',
    description: 'Join our technical team to provide on-site maintenance, repairs, and technical support for AGBON machinery.',
    requirements: [
      'Diploma or degree in Mechanical Engineering',
      '2+ years experience in machinery maintenance',
      'Willingness to travel to rural areas',
      'Problem-solving skills and attention to detail',
    ],
  },
  {
    title: 'Marketing Manager',
    location: 'Nairobi, Kenya',
    type: 'Full-time',
    description: 'Lead our marketing efforts across East Africa, developing strategies to increase brand awareness and drive sales.',
    requirements: [
      "Bachelor's degree in Marketing or related field",
      '5+ years of marketing experience',
      'Strong digital marketing skills',
      'Experience in agricultural sector preferred',
    ],
  },
  {
    title: 'Supply Chain Coordinator',
    location: 'Abidjan, Ivory Coast',
    type: 'Full-time',
    description: 'Manage the distribution and logistics of agricultural machinery across West Africa, ensuring timely delivery.',
    requirements: [
      "Bachelor's degree in Supply Chain Management or related field",
      '3+ years of logistics experience',
      'Fluent in French and English',
      'Strong organizational skills',
    ],
  },
  {
    title: 'Customer Service Representative',
    location: 'Remote (Africa)',
    type: 'Full-time',
    description: 'Provide excellent customer support via phone, email, and chat to AGBON customers across Africa.',
    requirements: [
      'Excellent communication skills',
      'Customer service experience',
      'Fluent in English (additional languages a plus)',
      'Basic technical knowledge of agricultural machinery',
    ],
  },
]

export default async function RecruitmentPage({ params }: Props) {
  const { locale } = await params

  if (!localeEngine.isSupported(locale)) notFound()

  return (
    <div className="bg-white">
      <AgbonPageBanner
        title="Open Positions"
        subTitle="Recruitment"
        breadcrumbs={[
          { label: agbonT('nav.home', locale), href: `/${locale}` },
          { label: 'Join Us', href: `/${locale}/join-us` },
          { label: 'Recruitment' },
        ]}
        backgroundImage="/images/section/light_gen.png"
      />

      <div className="max-w-[90rem] mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4 text-[#1a1a1a]">Current Openings</h2>
          <p className="text-gray-600">
            Find your next opportunity at AGBON. We offer competitive salaries, growth opportunities, and the chance to make a real impact in African agriculture.
          </p>
        </div>

        <div className="space-y-6">
          {jobOpenings.map((job, i) => (
            <div key={i} className="border border-gray-200 rounded-2xl p-6 md:p-8 hover:border-[#FF6B35]/40 hover:shadow-md transition-all">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">{job.title}</h3>
                  <div className="flex flex-wrap gap-3">
                    <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                      <MapPin size={14} className="text-[#FF6B35]" />
                      {job.location}
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                      <Clock size={14} className="text-[#FF6B35]" />
                      {job.type}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/${locale}/contact?subject=recruitment&position=${encodeURIComponent(job.title)}`}
                  className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-[#FF6B35] hover:bg-[#E55A24] text-white font-semibold rounded-full text-sm transition-all shadow"
                >
                  Apply Now
                </Link>
              </div>
              <p className="text-gray-600 mb-4">{job.description}</p>
              <div>
                <h4 className="font-semibold text-[#1a1a1a] mb-2 text-sm">Requirements:</h4>
                <ul className="space-y-1">
                  {job.requirements.map((req, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-[#FF6B35] mt-0.5">✓</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 p-8 bg-[#f9f5f0] rounded-2xl">
          <h3 className="text-xl font-bold mb-2 text-[#1a1a1a]">Don&apos;t see the right fit?</h3>
          <p className="text-gray-600 mb-4">
            Send us your CV and we&apos;ll keep you in mind for future opportunities.
          </p>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] hover:bg-[#333] text-white font-semibold rounded-full text-sm transition-all"
          >
            Send Your CV
          </Link>
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: 'Recruitment' }
}

export async function generateStaticParams() {
  return localeEngine.getSupportedLocales().map((locale) => ({ locale }))
}
