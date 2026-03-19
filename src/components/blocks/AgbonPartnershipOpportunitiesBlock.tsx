import { AgbonPartnershipOpportunitiesSection } from '@/components/agbon/partnership-opportunities-section';
import type { BlockContent } from '@/core/blocks/types';
import { asElements, asOptionalString } from './content-helpers';

export function AgbonPartnershipOpportunitiesBlock({ content }: { content: BlockContent }) {
  const cards = asElements(content._elements).map((item) => ({
    title: asOptionalString(item.title) ?? '',
    description: asOptionalString(item.description) ?? '',
    image: asOptionalString(item.image) ?? '/placeholder.jpg',
    fromColor: asOptionalString(item.fromColor),
    toColor: asOptionalString(item.toColor),
  }));

  return (
    <AgbonPartnershipOpportunitiesSection
      sectionSubtitle={asOptionalString(content.sectionSubtitle)}
      sectionTitle={asOptionalString(content.sectionTitle)}
      description={asOptionalString(content.description)}
      cards={cards}
    />
  );
}
