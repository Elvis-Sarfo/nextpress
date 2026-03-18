'use client';

import { AgbonTestimonialsSection } from '@/components/agbon/testimonials-section';
import type { BlockContent } from '@/core/blocks/types';
import { asElements, asNumber, asOptionalString, parseJsonArray } from './content-helpers';

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

function buildTestimonials(content: BlockContent): Testimonial[] | undefined {
  const items = asElements(content._elements).map((item, index) => ({
    id: `testimonial-${index}`,
    name: asOptionalString(item.name) ?? '',
    role: asOptionalString(item.role) ?? '',
    company: asOptionalString(item.company) ?? '',
    image: asOptionalString(item.image) ?? '/placeholder-user.jpg',
    rating: asNumber(item.rating, 5),
    quote: asOptionalString(item.quote) ?? '',
    country: asOptionalString(item.country),
  }));

  if (items.length > 0) return items;

  return parseJsonArray<Testimonial>(content.testimonials);
}

export function AgbonTestimonialsSectionBlock({ content }: { content: BlockContent }) {
  return (
    <AgbonTestimonialsSection
      title={asOptionalString(content.title)}
      subtitle={asOptionalString(content.subtitle)}
      footerText={asOptionalString(content.footerText)}
      footerCtaText={asOptionalString(content.footerCtaText)}
      footerCtaLink={asOptionalString(content.footerCtaLink)}
      testimonials={buildTestimonials(content)}
    />
  );
}
