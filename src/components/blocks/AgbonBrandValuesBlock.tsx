import { AgbonBrandValuesSection } from '@/components/agbon/brand-values-section';
import type { BlockContent } from '@/core/blocks/types';
import { asElements, asOptionalString } from './content-helpers';

export function AgbonBrandValuesBlock({ content }: { content: BlockContent }) {
  const values = asElements(content._elements).map((item) => ({
    title: asOptionalString(item.title) ?? '',
    description: asOptionalString(item.description) ?? '',
    icon: asOptionalString(item.icon),
    backgroundImage: asOptionalString(item.backgroundImage),
    gradientFrom: asOptionalString(item.gradientFrom),
    gradientTo: asOptionalString(item.gradientTo),
    overlayFrom: asOptionalString(item.overlayFrom),
    textAccentColor: asOptionalString(item.textAccentColor),
  }));

  return (
    <AgbonBrandValuesSection
      sectionSubtitle={asOptionalString(content.sectionSubtitle)}
      sectionTitle={asOptionalString(content.sectionTitle)}
      description={asOptionalString(content.description)}
      iconSrc={asOptionalString(content.iconSrc)}
      values={values}
    />
  );
}
