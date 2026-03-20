import Link from 'next/link';

interface BenefitItem {
  label: string;
}

interface AgbonSupportCtaSectionProps {
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
  benefits?: BenefitItem[];
}

const defaultBenefits: BenefitItem[] = [
  { label: 'Quick Response' },
  { label: 'Tailored Solutions' },
  { label: 'Proven Track Record' },
];

export function AgbonSupportCtaSection({
  title = 'Interested in Partnering with AGBON?',
  description = "We are always looking for strategic partners to expand our reach and better serve farmers across Africa. Let's grow together.",
  ctaText = 'Contact Us',
  ctaLink = '/contact',
  backgroundImage = '/images/section/partnership/plant.png',
  benefits = defaultBenefits,
}: AgbonSupportCtaSectionProps) {
  const resolvedBenefits = benefits.length > 0 ? benefits : defaultBenefits;

  return (
    <section className="px">
      <div className="relative bg-gradient-to-br from-[#FF6B35] via-[#E55A24] to-[#CC4A1A] p-4 md:p-16 rounded-2xl shadow-2xl text-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: `url("${backgroundImage}")` }}
        />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-white rounded-full blur-2xl" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative">
          <div className="inline-flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full backdrop-blur-sm">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">{title}</h2>
          <p className="text-base md:text-xl text-white/95 mb-8 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
          <Link
            href={ctaLink}
            className="inline-flex items-center gap-2 bg-white text-[#FF6B35] hover:bg-gray-50 px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            {ctaText}
          </Link>

          <div className="mt-8 flex flex-wrap justify-center gap-6 text-white/80 text-sm">
            {resolvedBenefits.map((benefit, index) => (
              <div key={`${benefit.label}-${index}`} className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{benefit.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
