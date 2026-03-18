import Image from 'next/image'
import Link from 'next/link'
import { Wrench } from 'lucide-react'
import { t as agbonT } from '@/lib/agbon-translations'
import { getNamedIcon, resolveItems, resolveLink } from '@/components/blocks/content-helpers'

interface CommitmentSectionProps {
  locale?: string
  subtitle?: string
  heading?: string
  description?: string
  ctaText?: string
  ctaLink?: string
  image?: string
  features?: Array<{ icon?: string; label: string }>
}

export function AgbonCommitmentSection({
  locale = 'en',
  subtitle,
  heading,
  description,
  ctaText,
  ctaLink,
  image,
  features = [],
}: CommitmentSectionProps) {
  const defaultFeatures = [
    { icon: 'bolt', label: agbonT('commitment.feature1', locale) },
    { icon: 'cog', label: agbonT('commitment.feature2', locale) },
    { icon: 'wrench', label: agbonT('commitment.feature3', locale) },
    { icon: 'handshake', label: agbonT('commitment.feature4', locale) },
  ]
  const resolvedFeatures = resolveItems(features.filter((item) => item.label), defaultFeatures)
  const cta = resolveLink(
    ctaText,
    ctaLink,
    agbonT('commitment.button', locale),
    '/after-sales-service',
  )

  return (
    <section className="w-full max-w-[1440px] mx-auto px-2 md:px-8 py-8 md:py-16 flex flex-col md:flex-row md:gap-12 items-stretch justify-between">
      <div className="flex-1 w-full max-w-2xl">
        <div className="flex items-center gap-2 mb-2">
          <Wrench className="text-[#2E7D32] w-6 h-6" />
          <span className="text-[#2E7D32] text-lg font-semibold">
            {subtitle || agbonT('commitment.subtitle', locale)}
          </span>
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#114420] mb-4 leading-tight">
          {heading || agbonT('commitment.heading', locale)}
        </h2>
        <p className="text-gray-500 text-base md:text-lg mb-8 max-w-2xl">
          {description || agbonT('commitment.description', locale)}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {resolvedFeatures.map((feature, index) => {
            const Icon = getNamedIcon(feature.icon)
            return (
              <div key={`${feature.label}-${index}`} className="flex flex-col items-center text-center">
                <span className="mb-2">
                  <Icon className="text-[#114420] w-16 h-16 mx-auto" />
                </span>
                <span className="font-semibold text-[#114420]">{feature.label}</span>
              </div>
            )
          })}
        </div>
        {cta && (
          <Link
            href={cta.href}
            className="inline-flex items-center px-3 py-3 rounded-full bg-[#114420] text-white font-semibold text-base shadow-md hover:bg-[#388e3c] transition-all group"
          >
            {cta.label}
            <span className="ml-2 flex items-center justify-center w-7 h-7 rounded-full bg-[#FFC72C] group-hover:bg-[#FF6B35] transition-all">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M6 13l4-4-4-4" stroke="#114420" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>
        )}
      </div>
      <div className="flex-1 w-full flex flex-col items-center relative max-w-xl mt-8 md:mt-0">
        <div className="relative w-full rounded-2xl overflow-hidden">
          <Image
            src={image || '/images/section/generator1.png'}
            alt={agbonT('commitment.imageAlt', locale)}
            width={746}
            height={631}
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </section>
  )
}
