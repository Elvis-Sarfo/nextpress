'use client';

import { useParams } from 'next/navigation';
import { AgbonHeroSection } from '@/components/agbon/hero-section';
import type { BlockContent } from '@/core/blocks/types';
import { asElements, asNumber, asOptionalString } from './content-helpers';

type HeroSlideRecord = {
  title: string;
  subtitle: string;
  imageUrl?: string | null;
  mobileImageUrl: string | null;
  videoUrl: string | null;
  ctaText: string;
  ctaLink: string | null;
  textPosition: Record<string, string> | null;
  textColor: string;
  overlayOpacity: number;
};

function buildSlide(element: Record<string, unknown>): HeroSlideRecord {
  return {
    title: asOptionalString(element.title) ?? '',
    subtitle: asOptionalString(element.subtitle) ?? '',
    imageUrl: asOptionalString(element.imageUrl) ?? null,
    mobileImageUrl: asOptionalString(element.mobileImageUrl) ?? null,
    videoUrl: asOptionalString(element.videoUrl) ?? null,
    ctaText: asOptionalString(element.ctaText) ?? '',
    ctaLink: asOptionalString(element.ctaLink) ?? null,
    textPosition: {
      desktopAlignment: asOptionalString(element.desktopAlignment) ?? 'center',
      desktopVerticalPosition: asOptionalString(element.desktopVerticalPosition) ?? 'center',
      mobileAlignment: asOptionalString(element.mobileAlignment) ?? 'center',
      mobileVerticalPosition: asOptionalString(element.mobileVerticalPosition) ?? 'center',
    },
    textColor: asOptionalString(element.textColor) ?? 'white',
    overlayOpacity: asNumber(element.overlayOpacity, 30),
  };
}

export function PrimaryHeroSectionBlock({ content }: { content: BlockContent }) {
  const params = useParams<{ locale?: string }>();
  const locale = typeof params?.locale === 'string' ? params.locale : 'en';
  const slides = asElements(content._elements).map(buildSlide);

  return (
    <AgbonHeroSection
      locale={locale}
      slides={slides}
    />
  );
}
