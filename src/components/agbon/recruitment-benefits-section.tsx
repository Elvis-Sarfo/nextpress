'use client';

import type { LucideIcon } from 'lucide-react';
import { AgbonSectionTitle } from '@/components/agbon/section-title';
import { AgbonValueCard } from '@/components/agbon/value-card';

export interface RecruitmentBenefitItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  backgroundImage?: string;
  gradientFrom?: string;
  gradientTo?: string;
  overlayFrom?: string;
  textAccentColor?: string;
}

interface RecruitmentBenefitsSectionProps {
  subTitle?: string;
  title?: string;
  description?: string;
  iconSrc?: string;
  benefits?: RecruitmentBenefitItem[];
}

export function RecruitmentBenefitsSection({
  subTitle = 'What is in it for you?',
  title = 'Employee Benefits',
  description = 'Join AGBON and enjoy a comprehensive package designed to support your growth and well-being',
  iconSrc = '/icons/agric.png',
  benefits = [],
}: RecruitmentBenefitsSectionProps) {
  return (
    <section className="space-y-6 mb-8 md:mb-12">
      <div className="max-w-3xl">
        <AgbonSectionTitle
          subTitle={subTitle}
          iconSrc={iconSrc}
          title={title}
          className="mb-0"
        />
        <p className="text-body text-gray-600">{description}</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.map((benefit) => {
          const Icon = benefit.icon;

          return (
            <AgbonValueCard
              key={benefit.id}
              title={benefit.title}
              description={benefit.description}
              backgroundImage={benefit.backgroundImage}
              gradientFrom={benefit.gradientFrom}
              gradientTo={benefit.gradientTo}
              overlayFrom={benefit.overlayFrom}
              textAccentColor={benefit.textAccentColor}
              height="h-auto sm:h-auto md:h-40 lg:h-48"
              icon={<Icon className="w-10 h-10" />}
            />
          );
        })}
      </div>
    </section>
  );
}
