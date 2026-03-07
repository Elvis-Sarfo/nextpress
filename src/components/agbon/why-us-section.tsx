'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Star, Wrench, HandCoins, ChevronLeft, ChevronRight } from 'lucide-react'
import { AgbonSectionTitle } from './section-title'
import { t as agbonT } from '@/lib/agbon-translations'

const SLIDER_IMAGES = [
  { src: '/images/section/hand_tractor.png', alt: 'Hand Tractor' },
  { src: '/images/section/home_2.png', alt: 'Agricultural Machinery' },
  { src: '/images/section/wood.png', alt: 'Farm Equipment' },
  { src: '/images/section/wood.png', alt: 'Tree Cutting Machine' },
]

interface WhyUsSectionProps {
  locale?: string
}

export function AgbonWhyUsSection({ locale = 'en' }: WhyUsSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return
    const id = setInterval(() => setCurrentSlide((p) => (p + 1) % SLIDER_IMAGES.length), 5000)
    return () => clearInterval(id)
  }, [isAutoPlaying])

  const next = () => { setCurrentSlide((p) => (p + 1) % SLIDER_IMAGES.length); setIsAutoPlaying(false) }
  const prev = () => { setCurrentSlide((p) => (p - 1 + SLIDER_IMAGES.length) % SLIDER_IMAGES.length); setIsAutoPlaying(false) }
  const goTo = (i: number) => { setCurrentSlide(i); setIsAutoPlaying(false) }

  return (
    <section className="relative w-full py-12 md:py-20 bg-white">
      <div className="max-w-[1290px] mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
          {/* Slider */}
          <div className="relative w-full md:w-[480px] lg:w-[520px] shrink-0 group">
            <div className="rounded-2xl overflow-hidden shadow-lg relative h-[260px] md:h-[540px]">
              {SLIDER_IMAGES.map((img, i) => (
                <div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                  <Image src={img.src} alt={img.alt} width={520} height={540} className="w-full h-full object-cover" priority={i === 0} />
                </div>
              ))}
              <a
                href="https://www.youtube.com/watch?v=MLpWrANjFbI"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Play video"
                className="absolute top-6 left-6 bg-[#FFC72C] rounded-xl shadow-lg flex items-center justify-center w-16 h-16 border-4 border-[#FFE28A] z-20 hover:scale-110 transition-transform"
              >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-[#7A5C00]">
                  <circle cx="16" cy="16" r="16" fill="currentColor" opacity="0.15" />
                  <polygon points="13,10 24,16 13,22" fill="#7A5C00" />
                </svg>
              </a>
              <button type="button" onClick={prev} aria-label="Previous" className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#1a1a1a] rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button type="button" onClick={next} aria-label="Next" className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#1a1a1a] rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <ChevronRight className="w-6 h-6" />
              </button>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {SLIDER_IMAGES.map((_, i) => (
                  <button key={i} type="button" onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`} className={`h-2.5 rounded-full transition-all ${i === currentSlide ? 'bg-[#FF6B35] w-8' : 'w-2.5 bg-white/60 hover:bg-white/80'}`} />
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 w-full xl:mt-16">
            <AgbonSectionTitle
              subTitle={agbonT('whyus.heading1', locale)}
              title={agbonT('whyus.heading2', locale)}
              iconSrc="/icons/agric.png"
              iconAlt="Rice Plant Icon"
              subtitleTextColor="text-[#7A5C00]"
            />
            <p className="text-gray-700 mb-6 max-w-2xl">{agbonT('whyus.description', locale)}</p>
            <Link
              href={`/${locale}/about`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF6B35] hover:bg-[#E55A24] text-white font-semibold shadow-md transition-all"
            >
              {agbonT('whyus.button', locale)}
              <span className="inline-block bg-[#FFC72C] rounded-full p-2 ml-2">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M7 13l4-4-4-4" stroke="#7A5C00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          </div>
        </div>

        {/* Benefits bar */}
        <div className="relative mt-12">
          <div className="bg-[#5C3A00] rounded-2xl py-8 px-4 md:px-10 flex flex-col md:flex-row gap-6 md:gap-0 justify-between items-center text-white lg:absolute lg:-bottom-12 lg:left-0 lg:right-0 lg:w-[90%] lg:mx-auto lg:shadow-2xl z-50">
            <BenefitItem icon={<Star color="#5C3A00" />} title={agbonT('whyus.benefit1.title', locale)} description={agbonT('whyus.benefit1.desc', locale)} />
            <BenefitItem icon={<Wrench color="#5C3A00" />} title={agbonT('whyus.benefit2.title', locale)} description={agbonT('whyus.benefit2.desc', locale)} />
            <BenefitItem icon={<HandCoins color="#5C3A00" />} title={agbonT('whyus.benefit3.title', locale)} description={agbonT('whyus.benefit3.desc', locale)} />
          </div>
        </div>
      </div>
    </section>
  )
}

function BenefitItem({ title, description, icon }: { title: string; description: string; icon?: React.ReactNode }) {
  return (
    <div className="flex-1 min-w-[220px] flex flex-col items-start gap-2 px-2 md:px-6">
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#FFC72C] mb-2">{icon}</span>
      <h3 className="font-bold text-sm md:text-base lg:text-lg mb-1 text-white">{title}</h3>
      <p className="text-[#FFE28A] text-xs md:text-sm lg:text-base leading-relaxed">{description}</p>
    </div>
  )
}
