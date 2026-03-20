'use client';

import Image from 'next/image';

interface RecruitmentCtaSectionProps {
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
  backgroundImageAlt?: string;
}

export function RecruitmentCtaSection({
  title = "Don't See the Right Role?",
  description = "We are always looking for talented individuals to join our team.<br />Send us your CV and we'll keep you in mind for future opportunities.",
  ctaText = 'Send Your CV',
  ctaLink = '/contact',
  backgroundImage = '/images/section/recruitment/cta-bg.png',
  backgroundImageAlt = 'Join our team',
}: RecruitmentCtaSectionProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl text-center p-10 md:p-16 shadow-2xl mt-12">
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt={backgroundImageAlt}
          fill
          sizes="100vw"
          className="object-cover object-center opacity-30 scale-110 blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35]/80 via-[#FF6B35]/60 to-[#E55A24]/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center">
        <h2 className="text-hero text-white drop-shadow-lg mb-4">{title}</h2>
        <div
          className="text-body text-white/90 mb-8 max-w-2xl mx-auto drop-shadow"
          dangerouslySetInnerHTML={{ __html: description }}
        />
        <a
          href={ctaLink}
          className="bg-white text-[#FF6B35] hover:bg-[#FFF3ED] hover:text-[#E55A24] px-10 py-4 rounded-xl text-button font-bold shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/30 inline-flex items-center justify-center"
        >
          {ctaText}
        </a>
      </div>
      <div className="pointer-events-none select-none">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#FF6B35]/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#E55A24]/30 rounded-full blur-3xl animate-pulse animation-delay-2000" />
      </div>
    </section>
  );
}
