'use client';

import { AgbonTestimonialsSection } from '@/components/agbon/testimonials-section';
import type { BlockContent } from '@/core/blocks/types';

type Testimonial = {
  id: string;
  name: string;
  role: string;
  company: string;
  image: string;
  rating: number;
  quote: string;
  country?: string;
};

function parseTestimonials(value: unknown): Testimonial[] | undefined {
  if (Array.isArray(value)) {
    return value as Testimonial[];
  }

  if (typeof value !== 'string' || !value.trim()) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as Testimonial[]) : undefined;
  } catch {
    return undefined;
  }
}

export function AgbonTestimonialsSectionBlock({ content }: { content: BlockContent }) {
  return (
    <AgbonTestimonialsSection
      title={typeof content.title === 'string' ? content.title : undefined}
      subtitle={typeof content.subtitle === 'string' ? content.subtitle : undefined}
      testimonials={parseTestimonials(content.testimonials)}
    />
  );
}
