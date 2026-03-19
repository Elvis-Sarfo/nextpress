'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AgbonSectionTitle } from '@/components/agbon/section-title';

interface StorySlide {
  image: string;
  alt: string;
}

interface StoryHighlight {
  label: string;
  value: string;
}

interface AgbonBrandStorySectionProps {
  sectionSubtitle?: string;
  sectionTitle?: string;
  iconSrc?: string;
  paragraphOne?: string;
  paragraphTwo?: string;
  slides?: StorySlide[];
  highlights?: StoryHighlight[];
  autoPlayMs?: number;
}

const defaultSlides: StorySlide[] = [
  { image: '/images/section/about/office.png', alt: 'AGBON office' },
  { image: '/images/section/about/workshop.png', alt: 'AGBON workshop' },
  { image: '/images/section/farmer_field.png', alt: 'AGBON machinery in the field' },
];

const defaultHighlights: StoryHighlight[] = [
  { label: 'Founded', value: '2001' },
  { label: 'Headquarters', value: 'China' },
];

export function AgbonBrandStorySection({
  sectionSubtitle = 'Our Story',
  sectionTitle = 'Who We Are',
  iconSrc = '/icons/agric.png',
  paragraphOne,
  paragraphTwo,
  slides = defaultSlides,
  highlights = defaultHighlights,
  autoPlayMs = 4000,
}: AgbonBrandStorySectionProps) {
  const resolvedSlides = slides.length > 0 ? slides : defaultSlides;
  const resolvedHighlights = highlights.length > 0 ? highlights : defaultHighlights;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (resolvedSlides.length <= 1) return undefined;

    const interval = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % resolvedSlides.length);
    }, autoPlayMs);

    return () => window.clearInterval(interval);
  }, [autoPlayMs, resolvedSlides.length]);

  return (
    <section className="max-w-[90rem] mx-auto">
      <div className="space-y-8">
        <AgbonSectionTitle
          subTitle={sectionSubtitle}
          title={sectionTitle}
          iconSrc={iconSrc}
          iconAlt="Brand story icon"
          subtitleTextColor="text-[#7A5C00]"
        />

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-5 md:space-y-6">
            {paragraphOne ? (
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">{paragraphOne}</p>
            ) : null}
            {paragraphTwo ? (
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">{paragraphTwo}</p>
            ) : null}

            {resolvedHighlights.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 pt-2">
                {resolvedHighlights.map((item, index) => (
                  <div
                    key={`${item.label}-${index}`}
                    className="bg-gradient-to-br from-[#FF6B35]/10 to-transparent border-l-4 border-[#FF6B35] p-4 rounded-lg"
                  >
                    <div className="text-xs md:text-sm text-gray-600 font-semibold mb-1">
                      {item.label}
                    </div>
                    <div className="text-xl md:text-2xl font-black text-[#1a1a1a]">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="relative group">
            <div className="relative h-80 md:h-[32rem] rounded-3xl overflow-hidden shadow-2xl">
              {resolvedSlides.map((slide, index) => (
                <div
                  key={`${slide.image}-${index}`}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              ))}

              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/50 via-transparent to-transparent z-20 pointer-events-none" />

              {resolvedSlides.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentIndex((prev) => (prev - 1 + resolvedSlides.length) % resolvedSlides.length)
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/35 backdrop-blur-md border border-white/30 rounded-full p-3 transition-all"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentIndex((prev) => (prev + 1) % resolvedSlides.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/35 backdrop-blur-md border border-white/30 rounded-full p-3 transition-all"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                    {resolvedSlides.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setCurrentIndex(index)}
                        className={`h-2 rounded-full transition-all ${
                          index === currentIndex ? 'bg-[#FF6B35] w-6' : 'bg-white/70 hover:bg-white w-2'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
