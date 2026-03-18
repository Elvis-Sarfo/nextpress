import Image from 'next/image'
import Link from 'next/link'
import { t as agbonT } from '@/lib/agbon-translations'
import { resolveItems } from '@/components/blocks/content-helpers'

interface HomeFeatureCard {
  id: string
  image?: string | null
  title: string
  description?: string
  ctaText?: string
  ctaLink?: string
}

interface HomeFeatureCardsProps {
  locale?: string
  className?: string
  cards?: HomeFeatureCard[]
}

export function AgbonHomeFeatureCards({
  locale = 'en',
  className = '',
  cards = [],
}: HomeFeatureCardsProps) {
  const defaultCards: HomeFeatureCard[] = [
    {
      id: '1',
      image: '/images/section/wood.png',
      title: agbonT('homeFeatures.1.title', locale),
      description: agbonT('homeFeatures.1.desc', locale),
      ctaText: agbonT('homeFeatures.1.cta', locale),
      ctaLink: '#',
    },
    {
      id: '2',
      image: '/images/section/home.png',
      title: agbonT('homeFeatures.2.title', locale),
      description: agbonT('homeFeatures.2.desc', locale),
      ctaText: agbonT('homeFeatures.2.cta', locale),
      ctaLink: '#',
    },
    {
      id: '3',
      image: '/images/section/construction.png',
      title: agbonT('homeFeatures.3.title', locale),
      description: agbonT('homeFeatures.3.desc', locale),
      ctaText: agbonT('homeFeatures.3.cta', locale),
      ctaLink: '#',
    },
  ]
  const resolvedCards = resolveItems(cards.filter((card) => card.title), defaultCards)

  return (
    <section className={`w-full max-w-[90rem] mx-auto flex flex-col md:flex-row gap-6 md:gap-8 ${className}`}>
      {resolvedCards.map((card, idx) => (
        <div
          key={card.id || idx}
          className="flex-1 flex flex-col justify-end items-center bg-white/80 rounded-3xl overflow-hidden shadow-md relative min-h-80 md:min-h-[26rem] max-w-xl mx-auto"
        >
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={card.image || '/images/section/wood.png'}
              alt={card.title}
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#114420cc] to-transparent" />
          </div>
          <div className="relative z-10 flex flex-col items-center justify-end h-full w-full p-6 pt-20">
            <h4 className="text-lg font-bold text-white mb-2 text-center drop-shadow-lg">
              {card.title}
            </h4>
            <p className="text-sm text-white mb-4 text-center drop-shadow-lg">{card.description}</p>
            <Link
              href={card.ctaLink || '#'}
              className="inline-flex items-center px-6 py-2 rounded-full bg-[#FF6B35] text-white font-semibold shadow hover:bg-[#FFC72C] hover:text-[#114420] transition-all text-sm"
            >
              {card.ctaText || agbonT('common.learnMore', locale)}
            </Link>
          </div>
        </div>
      ))}
    </section>
  )
}
