'use client';

import { RecruitmentWhyJoinSection } from '@/components/agbon/recruitment-why-join-section';
import type { BlockContent } from '@/core/blocks/types';
import { asOptionalString } from './content-helpers';

export function AgbonRecruitmentWhyJoinBlock({ content }: { content: BlockContent }) {
  return (
    <RecruitmentWhyJoinSection
      subTitle={asOptionalString(content.subTitle)}
      title={asOptionalString(content.title)}
      leadText={asOptionalString(content.leadText)}
      bodyHtml={asOptionalString(content.bodyHtml)}
      imageSrc={asOptionalString(content.imageSrc)}
      imageAlt={asOptionalString(content.imageAlt)}
      badgeOne={asOptionalString(content.badgeOne)}
      badgeTwo={asOptionalString(content.badgeTwo)}
      iconSrc={asOptionalString(content.iconSrc)}
    />
  );
}
