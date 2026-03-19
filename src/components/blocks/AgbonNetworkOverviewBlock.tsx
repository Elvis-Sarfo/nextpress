import { AgbonNetworkOverviewSection } from '@/components/agbon/network-overview-section';
import type { BlockContent } from '@/core/blocks/types';
import { asElements, asOptionalString } from './content-helpers';

export function AgbonNetworkOverviewBlock({ content }: { content: BlockContent }) {
  const stats = asElements(content._elements).map((item) => ({
    value: asOptionalString(item.value) ?? '',
    label: asOptionalString(item.label) ?? '',
    caption: asOptionalString(item.caption),
  }));

  return (
    <AgbonNetworkOverviewSection
      sectionSubtitle={asOptionalString(content.sectionSubtitle)}
      sectionTitle={asOptionalString(content.sectionTitle)}
      description={asOptionalString(content.description)}
      backgroundImage={asOptionalString(content.backgroundImage)}
      stats={stats}
    />
  );
}
