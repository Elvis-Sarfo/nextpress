'use client';

import { AgbonSectionTitle } from '@/components/agbon/section-title';

export interface RecruitmentApplicationStep {
  id: string;
  title: string;
  description: string;
}

interface RecruitmentApplicationProcessSectionProps {
  subTitle?: string;
  title?: string;
  steps?: RecruitmentApplicationStep[];
}

export function RecruitmentApplicationProcessSection({
  subTitle,
  title = 'Application Process',
  steps = [],
}: RecruitmentApplicationProcessSectionProps) {
  return (
    <section className="relative px-2 md:px-4 py-2 md:py-16 bg-linear-to-br from-[#FFF3ED] via-[#F5F5F5] to-[#E5F9F6] rounded-2xl shadow-xl overflow-visible">
      <AgbonSectionTitle subTitle={subTitle} title={title} className="mb-2 mx-0 md:mx-4" />
      <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 max-w-5xl mx-auto px-0 md:px-4">
        <svg
          className="hidden md:block absolute left-0 right-0 top-1/2 -translate-y-1/2 w-full h-40 pointer-events-none z-0"
          viewBox="0 0 900 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ top: '20px', left: '-50px' }}
        >
          <path
            d="M90 110 Q180 80 270 110 Q360 140 450 110 Q540 80 630 110 Q720 140 810 110"
            stroke="#FF6B35"
            strokeWidth="4"
            fill="none"
            strokeDasharray="8 8"
            markerEnd="url(#arrowhead)"
          />
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="5"
              refY="5"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L10,5 L0,10 L3,5 Z" fill="#FF6B35" />
            </marker>
          </defs>
        </svg>
        {steps.map((step, index) => (
          <div key={step.id} className="relative z-10 flex-1 flex flex-col items-center text-center group">
            <div className="bg-[#FF6B35] text-white w-14 h-14 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-4 shadow-lg group-hover:scale-105 transition-transform duration-300">
              {index + 1}
            </div>
            <h3 className="text-subheading font-bold text-[#1a1a1a] mb-2">{step.title}</h3>
            <p className="text-caption text-gray-700 max-w-xs">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
