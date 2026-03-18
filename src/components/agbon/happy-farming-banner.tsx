import Image from 'next/image'
import Link from 'next/link'
import { t as agbonT } from '@/lib/agbon-translations'

interface HappyFarmingBannerProps {
  locale?: string
  className?: string
  tagline?: string
  heading?: string
  subtext?: string
  ctaText?: string
  ctaLink?: string
  image?: string
}

export function AgbonHappyFarmingBanner({
  locale = 'en',
  className = '',
  tagline,
  heading,
  subtext,
  ctaText,
  ctaLink,
  image,
}: HappyFarmingBannerProps) {
  return (
    <section className={`w-full max-w-[90rem] mx-auto flex flex-col md:flex-row gap-8 md:gap-12 ${className}`}>
      <div className="relative w-full rounded-3xl overflow-hidden bg-white flex flex-col-reverse md:flex-row items-stretch min-h-[220px] md:min-h-[260px] lg:min-h-[320px]">
        {/* Left: text card */}
        <div className="relative z-10 flex flex-col justify-center px-4 md:px-8 py-6 md:py-10 bg-[#5C3A00] w-full md:w-2/3 lg:w-1/2 rounded-b-3xl md:rounded-3xl md:rounded-r-none">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[#FFC72C] text-2xl font-bold">
              {tagline || agbonT('happyFarmingBanner.tagline', locale)}
            </span>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 4v8M16 20v8M4 16h8M20 16h8" stroke="#FFC72C" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="text-white text-2xl md:text-3xl font-extrabold mb-3 leading-tight">
            {heading || agbonT('happyFarmingBanner.heading', locale)}
          </h2>
          <p className="text-[#F5F5F5] text-sm mb-6 max-w-xl">
            {subtext || agbonT('happyFarmingBanner.subtext', locale)}
          </p>
          <Link
            href={ctaLink || '/contact'}
            className="inline-flex items-center py-2 px-4 md:py-2.5 md:px-6 whitespace-nowrap rounded-full bg-[#FF6B35] text-white font-semibold shadow-md hover:bg-[#FFC72C] hover:text-[#5C3A00] transition-all border-2 border-[#FF6B35] group w-fit text-sm"
          >
            {ctaText || agbonT('happyFarmingBanner.cta', locale)}
            <span className="ml-2 flex items-center justify-center w-6 h-6 rounded-full bg-[#FFC72C] group-hover:bg-white transition-all">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M4 9l4-3-4-3" stroke="#5C3A00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>
        </div>

        {/* Right: image */}
        <div className="relative w-full md:flex-1 flex items-center justify-center md:justify-end min-h-[180px] md:min-h-0">
          <div className="relative w-full h-[180px] md:h-[220px] lg:h-full">
            <Image
              src={image || '/images/section/light_gen.png'}
              alt={agbonT('happyFarmingBanner.imageAlt', locale)}
              fill
              className="object-cover object-center"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
