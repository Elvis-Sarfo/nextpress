'use client';

import { RecruitmentCurrentOpeningsSection } from '@/components/agbon/recruitment-current-openings-section';
import type { BlockContent } from '@/core/blocks/types';
import { asOptionalString } from './content-helpers';

function getLocalizedString(value: unknown): string | undefined {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed || undefined;
  }

  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const localized = value as Record<string, unknown>;
    const candidate =
      localized.en ??
      localized.fr ??
      Object.values(localized).find((entry) => typeof entry === 'string');

    if (typeof candidate === 'string') {
      const trimmed = candidate.trim();
      return trimmed || undefined;
    }
  }

  return undefined;
}

type JobRecord = {
  id?: string;
  title?: string | Record<string, string>;
  location?: string | Record<string, string>;
  flag?: string | null;
  employmentType?: string;
  salary?: string | Record<string, string> | null;
  description?: string | Record<string, string> | null;
  requirements?: Array<{ value?: string | Record<string, string> | null }> | null;
  applyLabel?: string | Record<string, string> | null;
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
        title: getLocalizedString(job.title) ?? `Job ${index + 1}`,
        location: getLocalizedString(job.location) ?? '',
        flag: job.flag ?? undefined,
        employmentType: job.employmentType ?? 'Full-time',
        salary: getLocalizedString(job.salary),
        description: getLocalizedString(job.description),
        requirements: Array.isArray(job.requirements)
          ? job.requirements
              .map((requirement) => getLocalizedString(requirement.value))
              .filter((requirement): requirement is string => Boolean(requirement))
          : [],
        applyLabel: getLocalizedString(job.applyLabel),
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
