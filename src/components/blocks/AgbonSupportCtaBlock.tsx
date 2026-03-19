import { AgbonSupportCtaSection } from '@/components/agbon/support-cta-section';
import type { BlockContent } from '@/core/blocks/types';
import { asElements, asOptionalString } from './content-helpers';

export function AgbonSupportCtaBlock({ content }: { content: BlockContent }) {
  const benefits = asElements(content._elements)
    .map((item) => ({ label: asOptionalString(item.label) ?? '' }))
    .filter((item) => item.label);

  return (
    <AgbonSupportCtaSection
      title={asOptionalString(content.title)}
      description={asOptionalString(content.description)}
      ctaText={asOptionalString(content.ctaText)}
      ctaLink={asOptionalString(content.ctaLink)}
      backgroundImage={asOptionalString(content.backgroundImage)}
      benefits={benefits}
    />
  );
}
