'use client';

import { Clock, DollarSign, MapPin } from 'lucide-react';
import { AgbonSectionTitle } from '@/components/agbon/section-title';

export interface RecruitmentJobItem {
  id: string;
  title: string;
  location: string;
  flag?: string;
  employmentType: string;
  salary?: string;
  description?: string;
  requirements: string[];
  applyLabel?: string;
  applyLink?: string;
}

interface RecruitmentCurrentOpeningsSectionProps {
  subTitle?: string;
  title?: string;
  iconSrc?: string;
  requirementsHeading?: string;
  applyButtonLabel?: string;
  applyButtonLink?: string;
  emptyMessage?: string;
  jobs?: RecruitmentJobItem[];
}

function getCountryFlag(location: string): string {
  if (location.includes('Ghana')) return '🇬🇭';
  if (location.includes('Nigeria')) return '🇳🇬';
  if (location.includes('Kenya')) return '🇰🇪';
  if (location.includes('Ivory Coast') || location.includes("Côte d'Ivoire")) return '🇨🇮';
  if (location.includes('Tanzania')) return '🇹🇿';
  if (location.includes('Uganda')) return '🇺🇬';
  if (location.includes('Remote') || location.includes('Africa')) return '🌍';
  return '🌍';
}

export function RecruitmentCurrentOpeningsSection({
  subTitle = 'Find a job that suits you',
  title = 'Current Job Openings',
  iconSrc = '/icons/agric.png',
  requirementsHeading = 'Requirements:',
  applyButtonLabel = 'Apply Now',
  applyButtonLink = '/contact',
  emptyMessage = 'There are no open roles at the moment.',
  jobs = [],
}: RecruitmentCurrentOpeningsSectionProps) {
  return (
    <section className="space-y-6 mb-8 md:mb-12">
      <AgbonSectionTitle
        subTitle={subTitle}
        iconSrc={iconSrc}
        title={title}
        className="mb-4"
      />
      {jobs.length > 0 ? (
        <div className="space-y-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="group relative bg-white p-2 rounded-2xl shadow-lg border border-l-8 border-l-[#FF6B35] hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 overflow-hidden"
              style={{
                boxShadow:
                  '-4px 0 0 0 rgba(255, 107, 53, 0.1), 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              }}
            >
              <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 10px,
                    #FF6B35 10px,
                    #FF6B35 11px
                  )`,
                }}
              />

              <div className="absolute bottom-1 right-1 md:bottom-4 md:right-4 z-20">
                <div className="text-8xl md:text-8xl lg:text-10xl opacity-20 transition-opacity duration-300">
                  {job.flag || getCountryFlag(job.location)}
                </div>
              </div>

              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-section-title text-[#1a1a1a] mb-2">{job.title}</h3>
                    <div className="flex flex-wrap gap-3 text-caption text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-[#FF6B35]" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-[#FF6B35]" />
                        <span>{job.employmentType}</span>
                      </div>
                      {job.salary ? (
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-[#FF6B35]" />
                          <span>{job.salary}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <a
                    href={job.applyLink || applyButtonLink}
                    className="bg-[#FF6B35] hover:bg-[#ff5722] text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 whitespace-nowrap shadow-md hover:shadow-lg inline-flex items-center justify-center"
                  >
                    {job.applyLabel || applyButtonLabel}
                  </a>
                </div>

                {job.description ? (
                  <p className="text-body text-gray-700 mb-0">{job.description}</p>
                ) : null}

                {job.requirements.length > 0 ? (
                  <div className="bg-gray-50/50 -mx-6 -mb-6 p-6 rounded-b-2xl">
                    <h4 className="text-subheading font-semibold text-[#1a1a1a] mb-2">
                      {requirementsHeading}
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-caption text-gray-700">
                      {job.requirements.map((requirement, index) => (
                        <li key={`${job.id}-requirement-${index}`}>{requirement}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-12 text-center text-gray-500">
          {emptyMessage}
        </div>
      )}
    </section>
  );
}
