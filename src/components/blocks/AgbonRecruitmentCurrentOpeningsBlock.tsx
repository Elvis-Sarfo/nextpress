'use client';

import { RecruitmentCurrentOpeningsSection } from '@/components/agbon/recruitment-current-openings-section';
import type { BlockContent } from '@/core/blocks/types';
import { asOptionalString } from './content-helpers';

type JobRecord = {
  id?: string;
  title?: string;
  location?: string;
  flag?: string | null;
  employmentType?: string;
  salary?: string | null;
  description?: string | null;
  requirements?: Array<{ value?: string | null }> | null;
  applyLabel?: string | null;
  applyLink?: string | null;
};

export function AgbonRecruitmentCurrentOpeningsBlock({
  content,
  data,
}: {
  content: BlockContent;
  data?: unknown[];
}) {
  const jobs = Array.isArray(data)
    ? (data as JobRecord[]).map((job, index) => ({
        id: job.id ?? `job-${index}`,
        title: job.title ?? `Job ${index + 1}`,
        location: job.location ?? '',
        flag: job.flag ?? undefined,
        employmentType: job.employmentType ?? 'Full-time',
        salary: job.salary ?? undefined,
        description: job.description ?? undefined,
        requirements: Array.isArray(job.requirements)
          ? job.requirements
              .map((requirement) => requirement.value?.trim())
              .filter((requirement): requirement is string => Boolean(requirement))
          : [],
        applyLabel: job.applyLabel ?? undefined,
        applyLink: job.applyLink ?? undefined,
      }))
    : [];

  return (
    <RecruitmentCurrentOpeningsSection
      subTitle={asOptionalString(content.subTitle)}
      title={asOptionalString(content.title)}
      iconSrc={asOptionalString(content.iconSrc)}
      requirementsHeading={asOptionalString(content.requirementsHeading)}
      applyButtonLabel={asOptionalString(content.applyButtonLabel)}
      applyButtonLink={asOptionalString(content.applyButtonLink)}
      emptyMessage={asOptionalString(content.emptyMessage)}
      jobs={jobs}
    />
  );
}
