'use client';

import { RecruitmentCtaSection } from '@/components/agbon/recruitment-cta-section';
import type { BlockContent } from '@/core/blocks/types';
import { asOptionalString } from './content-helpers';

export function AgbonRecruitmentCtaBlock({ content }: { content: BlockContent }) {
  return (
    <RecruitmentCtaSection
      title={asOptionalString(content.title)}
      description={asOptionalString(content.description)}
      ctaText={asOptionalString(content.ctaText)}
      ctaLink={asOptionalString(content.ctaLink)}
      backgroundImage={asOptionalString(content.backgroundImage)}
      backgroundImageAlt={asOptionalString(content.backgroundImageAlt)}
    />
  );
}
