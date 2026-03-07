'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { AgbonSectionTitle } from './section-title'
import { t as agbonT } from '@/lib/agbon-translations'

function Counter({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !isVisible) setIsVisible(true) },
      { threshold: 0.1 },
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return
    let startTime: number | null = null
    const animate = (now: number) => {
      if (!startTime) startTime = now
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = progress * (2 - progress) // ease-out quad
      setCount(Math.floor(end * eased))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [isVisible, end, duration])

  return (
    <div ref={ref}>
      <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#4A7C3B]">
        {count.toLocaleString()}{suffix}
      </span>
    </div>
  )
}

interface AboutIntroSectionProps {
  locale?: string
}

export function AgbonAboutIntroSection({ locale = 'en' }: AboutIntroSectionProps) {
  return (
    <section className="relative w-full pt-6 md:pt-10 bg-[#F5F5F5] overflow-visible">
      <div className="max-w-[1290px] mx-auto px-4 overflow-visible">
        <div className="flex flex-row items-center justify-between gap-4 md:gap-8 lg:gap-12 overflow-visible">
          {/* Left image */}
          <div
            className="relative w-[80px] sm:w-[120px] md:w-[160px] lg:w-[220px] xl:w-[260px] flex-shrink-0"
            style={{ transform: 'rotate(-8deg)', transformOrigin: 'center' }}
          >
            <div className="rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden shadow-lg sm:shadow-xl md:shadow-2xl relative h-[110px] sm:h-[160px] md:h-[220px] lg:h-[300px] xl:h-[350px] transition-transform duration-300 hover:scale-105">
              <Image
                src="/images/section/home_2.png"
                alt="Farm worker with livestock"
                width={320}
                height={380}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>

          {/* Center content */}
          <div className="flex-1 min-w-0 text-center px-2 sm:px-4 md:px-6">
            <div className="flex justify-center mb-4">
              <Image src="/icons/agric.png" alt="Wheat icon" width={81} height={15} className="h-[15px] w-auto" />
            </div>
            <AgbonSectionTitle
              align="center"
              subTitle={agbonT('about.subtitle', locale)}
              title={agbonT('about.heading', locale)}
            />
            <p className="text-gray-700 mb-4 max-w-2xl mx-auto text-base">
              {agbonT('about.description1', locale)}
            </p>
            <p className="text-gray-700 mb-8 max-w-2xl mx-auto text-sm md:text-base">
              {agbonT('about.description2', locale)}
            </p>
          </div>

          {/* Right image */}
          <div
            className="relative w-[80px] sm:w-[120px] md:w-[160px] lg:w-[220px] xl:w-[260px] flex-shrink-0"
            style={{ transform: 'rotate(8deg)', transformOrigin: 'center' }}
          >
            <div className="rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden shadow-lg sm:shadow-xl md:shadow-2xl relative h-[110px] sm:h-[160px] md:h-[220px] lg:h-[300px] xl:h-[350px] transition-transform duration-300 hover:scale-105">
              <Image
                src="/images/section/wood.png"
                alt="Person working in garden"
                width={320}
                height={380}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
