'use client';

import { RecruitmentBenefitsSection } from '@/components/agbon/recruitment-benefits-section';
import type { BlockContent } from '@/core/blocks/types';
import { asElements, asOptionalString, getNamedIcon } from './content-helpers';

export function AgbonRecruitmentBenefitsBlock({ content }: { content: BlockContent }) {
  const benefits = asElements(content._elements).map((item, index) => ({
    id: `recruitment-benefit-${index}`,
    title: asOptionalString(item.title) ?? `Benefit ${index + 1}`,
    description: asOptionalString(item.description) ?? '',
    icon: getNamedIcon(item.icon),
    backgroundImage: asOptionalString(item.backgroundImage),
    gradientFrom: asOptionalString(item.gradientFrom),
    gradientTo: asOptionalString(item.gradientTo),
    overlayFrom: asOptionalString(item.overlayFrom),
    textAccentColor: asOptionalString(item.textAccentColor),
  }));

  return (
    <RecruitmentBenefitsSection
      subTitle={asOptionalString(content.subTitle)}
      title={asOptionalString(content.title)}
      description={asOptionalString(content.description)}
      iconSrc={asOptionalString(content.iconSrc)}
      benefits={benefits}
    />
  );
}
