'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

type HeroSlideRecord = {
  title: string
  subtitle: string
  imageUrl?: string | null
  mobileImageUrl: string | null
  videoUrl: string | null
  ctaText: string
  ctaLink: string | null
  textPosition: Record<string, string> | null
  textColor: string
  overlayOpacity: number
}

interface HeroSectionProps {
  slides?: HeroSlideRecord[]
  locale?: string
}

function getAlignmentClasses(
  alignment: 'left' | 'center' | 'right',
  verticalPosition: 'top' | 'center' | 'bottom',
) {
  const h = { left: 'items-start text-left', center: 'items-center text-center', right: 'items-end text-right' }
  const v = { top: 'justify-start pt-8 md:pt-12', center: 'justify-center', bottom: 'justify-end pb-8 md:pb-12' }
  return `${h[alignment]} ${v[verticalPosition]}`
}

function getTextColorClass(color: 'white' | 'black' | 'orange') {
  return { white: 'text-white', black: 'text-black', orange: 'text-[#FF6B35]' }[color]
}

export function AgbonHeroSection({ slides = [], locale = 'en' }: HeroSectionProps) {
  const fallbackSlides: HeroSlideRecord[] = [
    {
      title: locale === 'fr' ? 'Des machines fiables pour chaque saison.' : 'Reliable machinery for every season.',
      subtitle: locale === 'fr'
        ? 'Équipez votre exploitation avec des solutions conçues pour les réalités africaines.'
        : 'Equip your operation with solutions built for African farming realities.',
      imageUrl: '/images/banner/1.png',
      mobileImageUrl: '/images/banner/1.png',
      videoUrl: null,
      ctaText: locale === 'fr' ? 'Explorer les produits' : 'Explore Products',
      ctaLink: '/products',
      textPosition: {
        desktopAlignment: 'center',
        desktopVerticalPosition: 'center',
        mobileAlignment: 'center',
        mobileVerticalPosition: 'center',
      },
      textColor: 'white',
      overlayOpacity: 30,
    },
  ]
  const resolvedSlides = slides.length > 0 ? slides : fallbackSlides
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => setCurrent((c) => (c + 1) % resolvedSlides.length), [resolvedSlides.length])
  const prev = useCallback(() => setCurrent((c) => (c - 1 + resolvedSlides.length) % resolvedSlides.length), [resolvedSlides.length])

  useEffect(() => {
    if (resolvedSlides.length <= 1) return
    const id = setInterval(next, 5000)
    return () => clearInterval(id)
  }, [resolvedSlides.length, next])

  const slide = resolvedSlides[current]
  const textPos = slide.textPosition as Record<string, string> | null
  const desktopAlignment = (textPos?.desktopAlignment || 'center') as 'left' | 'center' | 'right'
  const desktopVertical = (textPos?.desktopVerticalPosition || 'center') as 'top' | 'center' | 'bottom'
  const mobileAlignment = (textPos?.mobileAlignment || 'center') as 'left' | 'center' | 'right'
  const mobileVertical = (textPos?.mobileVerticalPosition || 'center') as 'top' | 'center' | 'bottom'
  const textColor = (slide.textColor as 'white' | 'black' | 'orange') || 'white'
  const overlayOpacity = slide.overlayOpacity !== undefined ? slide.overlayOpacity : 30

  const title = slide.title
  const subtitle = slide.subtitle
  const ctaText = slide.ctaText
  const imageUrl = slide.imageUrl || null

  return (
    <div className="relative w-full overflow-hidden h-[18rem] sm:h-[22rem] md:h-[26rem] lg:h-[30rem]">
      {/* Background */}
      <div className="absolute inset-0">
        {imageUrl ? (
          <>
            <Image
              src={imageUrl}
              alt={title || 'Hero'}
              fill
              className="object-cover hidden md:block"
              priority
            />
            <Image
              src={slide.mobileImageUrl || imageUrl}
              alt={title || 'Hero'}
              fill
              className="object-cover md:hidden"
              priority
            />
          </>
        ) : slide.videoUrl ? (
          <video src={slide.videoUrl} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" />
        ) : null}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity / 100 }} />

      {/* Text — mobile */}
      <div
        className={`relative h-full flex flex-col px-4 md:hidden ${getAlignmentClasses(mobileAlignment, mobileVertical)}`}
      >
        <div className={`max-w-2xl ${getTextColorClass(textColor)}`}>
          <h1 className="text-xl font-bold mb-2">{title}</h1>
          <p className="text-xs mb-4">{subtitle}</p>
          {ctaText && (
            <a
              href={slide.ctaLink || '#'}
              className="inline-block bg-[#FF6B35] hover:bg-[#E55A24] text-white px-6 py-2 rounded shadow"
            >
              {ctaText}
            </a>
          )}
        </div>
      </div>

      {/* Text — desktop */}
      <div
        className={`relative h-full hidden md:flex flex-col px-8 lg:px-16 ${getAlignmentClasses(desktopAlignment, desktopVertical)}`}
      >
        <div className={`max-w-2xl ${getTextColorClass(textColor)}`}>
          <h1 className="text-3xl lg:text-5xl font-bold mb-4">{title}</h1>
          <p className="text-base lg:text-lg mb-6">{subtitle}</p>
          {ctaText && (
            <a
              href={slide.ctaLink || '#'}
              className="inline-block bg-[#FF6B35] hover:bg-[#E55A24] text-white px-8 py-3 rounded shadow-lg"
            >
              {ctaText}
            </a>
          )}
        </div>
      </div>

      {/* Navigation arrows */}
      {resolvedSlides.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 border border-white/20 text-white hover:bg-white/20 rounded-full p-2 backdrop-blur-sm transition"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 border border-white/20 text-white hover:bg-white/20 rounded-full p-2 backdrop-blur-sm transition"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {resolvedSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === current ? 'w-8 h-2 bg-[#FF6B35]' : 'w-2 h-2 bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
