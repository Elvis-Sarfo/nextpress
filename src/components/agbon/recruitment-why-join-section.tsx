'use client';

import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';
import { AgbonSectionTitle } from '@/components/agbon/section-title';

interface RecruitmentWhyJoinSectionProps {
  subTitle?: string;
  title?: string;
  leadText?: string;
  bodyHtml?: string;
  imageSrc?: string;
  imageAlt?: string;
  badgeOne?: string;
  badgeTwo?: string;
  iconSrc?: string;
}

export function RecruitmentWhyJoinSection({
  subTitle = 'Work with us',
  title = 'Why Work at AGBON?',
  leadText = "Join a team that's transforming agriculture and creating lasting impact across Africa",
  bodyHtml,
  imageSrc = '/images/section/recruitment/technician.png',
  imageAlt = 'AGBON recruitment visual',
  badgeOne = 'Empowering Farmers',
  badgeTwo = 'Growing Together',
  iconSrc = '/icons/agric.png',
}: RecruitmentWhyJoinSectionProps) {
  return (
    <section className="space-y-12 mb-8 md:mb-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <div className="space-y-6">
          <AgbonSectionTitle
            subTitle={subTitle}
            iconSrc={iconSrc}
            title={title}
            className="mb-0"
          />
          {/* <p className="text-body text-gray-600 mb-2">{leadText}</p> */}
          {bodyHtml ? (
            <div
              className="space-y-2 text-body text-gray-700 leading-relaxed recruitment-richtext"
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />
          ) : null}
        </div>

        <div className="relative h-70 md:h-80 rounded-2xl overflow-hidden shadow-2xl group">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              {[badgeOne, badgeTwo].filter(Boolean).map((badge) => (
                <div key={badge} className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-[#FF6B35]" fill="currentColor" />
                  <span className="text-caption font-semibold">{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
