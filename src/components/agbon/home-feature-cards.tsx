import Image from 'next/image'
import Link from 'next/link'
import { t as agbonT } from '@/lib/agbon-translations'

const cardData = [
  { image: '/images/section/wood.png', title: 'homeFeatures.1.title', desc: 'homeFeatures.1.desc', cta: 'homeFeatures.1.cta', link: '#' },
  { image: '/images/section/home.png', title: 'homeFeatures.2.title', desc: 'homeFeatures.2.desc', cta: 'homeFeatures.2.cta', link: '#' },
  { image: '/images/section/construction.png', title: 'homeFeatures.3.title', desc: 'homeFeatures.3.desc', cta: 'homeFeatures.3.cta', link: '#' },
]

interface HomeFeatureCardsProps {
  locale?: string
  className?: string
}

export function AgbonHomeFeatureCards({ locale = 'en', className = '' }: HomeFeatureCardsProps) {
  return (
    <section className={`w-full max-w-[90rem] mx-auto flex flex-col md:flex-row gap-6 md:gap-8 ${className}`}>
      {cardData.map((card, idx) => (
        <div
          key={idx}
          className="flex-1 flex flex-col justify-end items-center bg-white/80 rounded-3xl overflow-hidden shadow-md relative min-h-80 md:min-h-[26rem] max-w-xl mx-auto"
        >
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={card.image}
              alt={agbonT(card.title, locale)}
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#114420cc] to-transparent" />
          </div>
          <div className="relative z-10 flex flex-col items-center justify-end h-full w-full p-6 pt-20">
            <h4 className="text-lg font-bold text-white mb-2 text-center drop-shadow-lg">
              {agbonT(card.title, locale)}
            </h4>
            <p className="text-sm text-white mb-4 text-center drop-shadow-lg">{agbonT(card.desc, locale)}</p>
            <Link
              href={card.link}
              className="inline-flex items-center px-6 py-2 rounded-full bg-[#FF6B35] text-white font-semibold shadow hover:bg-[#FFC72C] hover:text-[#114420] transition-all text-sm"
            >
              {agbonT(card.cta, locale)}
            </Link>
          </div>
        </div>
      ))}
    </section>
  )
}
