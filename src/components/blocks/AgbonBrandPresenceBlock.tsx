import { AgbonBrandPresenceSection } from '@/components/agbon/brand-presence-section';
import type { BlockContent } from '@/core/blocks/types';
import { asElements, asOptionalString } from './content-helpers';

export function AgbonBrandPresenceBlock({ content }: { content: BlockContent }) {
  const stats = asElements(content._elements).map((item) => ({
    value: asOptionalString(item.value) ?? '',
    label: asOptionalString(item.label) ?? '',
    icon: asOptionalString(item.icon),
  }));

  const regions = [
    asOptionalString(content.regionOne),
    asOptionalString(content.regionTwo),
    asOptionalString(content.regionThree),
    asOptionalString(content.regionFour),
    asOptionalString(content.regionFive),
    asOptionalString(content.regionSix),
  ].filter((value): value is string => Boolean(value));

  return (
    <AgbonBrandPresenceSection
      badge={asOptionalString(content.badge)}
      title={asOptionalString(content.title)}
      description={asOptionalString(content.description)}
      watermarkImage={asOptionalString(content.watermarkImage)}
      regionsTitle={asOptionalString(content.regionsTitle)}
      regions={regions}
      stats={stats}
    />
  );
}
