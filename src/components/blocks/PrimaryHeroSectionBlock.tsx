'use client';

import { AgbonHeroSection } from '@/components/agbon/hero-section';
import type { BlockContent } from '@/core/blocks/types';

type HeroSlideRecord = {
  title: Record<string, string> | null;
  subtitle: Record<string, string> | null;
  imageUrl?: string | null;
  mobileImageUrl: string | null;
  videoUrl: string | null;
  ctaText: Record<string, string> | null;
  ctaLink: string | null;
  textPosition: Record<string, string> | null;
  textColor: string;
  overlayOpacity: number;
};

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value : null;
}

function asNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function asTextMap(value: unknown): Record<string, string> | null {
  const text = asString(value);
  return text ? { en: text } : null;
}

function buildSlide(element: Record<string, unknown>): HeroSlideRecord {
  return {
    title: asTextMap(element.title),
    subtitle: asTextMap(element.subtitle),
    imageUrl: asString(element.imageUrl),
    mobileImageUrl: asString(element.mobileImageUrl),
    videoUrl: asString(element.videoUrl),
    ctaText: asTextMap(element.ctaText),
    ctaLink: asString(element.ctaLink),
    textPosition: {
      desktopAlignment: asString(element.desktopAlignment) ?? 'center',
      desktopVerticalPosition: asString(element.desktopVerticalPosition) ?? 'center',
      mobileAlignment: asString(element.mobileAlignment) ?? 'center',
      mobileVerticalPosition: asString(element.mobileVerticalPosition) ?? 'center',
    },
    textColor: asString(element.textColor) ?? 'white',
    overlayOpacity: asNumber(element.overlayOpacity, 30),
  };
}

export function PrimaryHeroSectionBlock({ content }: { content: BlockContent }) {
  const elements = Array.isArray(content._elements)
    ? content._elements.filter(
        (element): element is Record<string, unknown> =>
          typeof element === 'object' && element !== null && !Array.isArray(element),
      )
    : [];

  const slides = elements.map(buildSlide);

  return <AgbonHeroSection slides={slides} locale="en" />;
}
