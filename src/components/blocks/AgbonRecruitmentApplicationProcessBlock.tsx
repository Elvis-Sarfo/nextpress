'use client';

import { RecruitmentApplicationProcessSection } from '@/components/agbon/recruitment-application-process-section';
import type { BlockContent } from '@/core/blocks/types';
import { asElements, asOptionalString } from './content-helpers';

export function AgbonRecruitmentApplicationProcessBlock({ content }: { content: BlockContent }) {
  const steps = asElements(content._elements).map((item, index) => ({
    id: `application-step-${index}`,
    title: asOptionalString(item.title) ?? `Step ${index + 1}`,
    description: asOptionalString(item.description) ?? '',
  }));

  return (
    <RecruitmentApplicationProcessSection
      subTitle={asOptionalString(content.subTitle)}
      title={asOptionalString(content.title)}
      steps={steps}
    />
  );
}
