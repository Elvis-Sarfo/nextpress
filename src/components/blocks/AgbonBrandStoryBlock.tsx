'use client';

import { AgbonBrandStorySection } from '@/components/agbon/brand-story-section';
import type { BlockContent } from '@/core/blocks/types';
import { asElements, asNumber, asOptionalString } from './content-helpers';

export function AgbonBrandStoryBlock({ content }: { content: BlockContent }) {
  const slides = asElements(content._elements)
    .filter((item) => asOptionalString(item.kind) !== 'highlight')
    .map((item) => ({
      image: asOptionalString(item.image) ?? '/placeholder.jpg',
      alt: asOptionalString(item.alt) ?? 'Brand story image',
    }));

  const highlights = asElements(content._elements)
    .filter((item) => asOptionalString(item.kind) === 'highlight')
    .map((item) => ({
      label: asOptionalString(item.label) ?? '',
      value: asOptionalString(item.value) ?? '',
    }))
    .filter((item) => item.label && item.value);

  return (
    <AgbonBrandStorySection
      sectionSubtitle={asOptionalString(content.sectionSubtitle)}
      sectionTitle={asOptionalString(content.sectionTitle)}
      iconSrc={asOptionalString(content.iconSrc)}
      paragraphOne={asOptionalString(content.paragraphOne)}
      paragraphTwo={asOptionalString(content.paragraphTwo)}
      autoPlayMs={asNumber(content.autoPlayMs, 4000)}
      slides={slides}
      highlights={highlights}
    />
  );
}
