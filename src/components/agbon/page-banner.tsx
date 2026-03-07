import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageBannerProps {
  breadcrumbs?: BreadcrumbItem[]
  title?: string
  subTitle?: string
  backgroundImage?: string
}

export function AgbonPageBanner({
  breadcrumbs = [],
  title = 'Page Title',
  subTitle = 'Page Subtitle',
  backgroundImage = '/images/section/light_gen.png',
}: PageBannerProps) {
  return (
    <section className="relative w-full min-h-50 md:min-h-65 lg:min-h-75 flex items-center overflow-hidden">
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src={backgroundImage}
          alt="Banner background"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
      </div>
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-10 flex flex-col items-start">
        <span className="text-[#FFC72C] text-base sm:text-lg md:text-xl font-bold mb-2 drop-shadow-lg">
          {subTitle}
        </span>
        <h1 className="text-white text-2xl sm:text-4xl md:text-6xl font-extrabold mb-0 drop-shadow-lg">
          {title}
        </h1>
        <div className="h-1 w-40 bg-[#FFC72C] rounded-full mb-8" />
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-2 text-white/90 text-[0.75rem] md:text-base lg:text-[15px]">
            {breadcrumbs.map((item, idx) => (
              <React.Fragment key={idx}>
                {item.href ? (
                  <Link href={item.href} className="hover:underline">
                    {item.label}
                  </Link>
                ) : (
                  <span className="font-semibold">{item.label}</span>
                )}
                {idx < breadcrumbs.length - 1 && <span className="mx-1">→</span>}
              </React.Fragment>
            ))}
          </nav>
        )}
      </div>
    </section>
  )
}
