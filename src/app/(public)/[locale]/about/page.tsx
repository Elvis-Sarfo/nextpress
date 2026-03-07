import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { localeEngine } from '@/lib/cms';
import { t as agbonT } from '@/lib/agbon-translations';
import { AgbonCommitmentSection } from '@/components/agbon/commitment-section';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;

  if (!localeEngine.isSupported(locale)) {
    notFound();
  }

  return (
    <div className="bg-white">
      {/* Hero banner */}
      <div className="relative h-64 md:h-80 bg-[#1a1a1a] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <Image
            src="/images/section/farm_item.png"
            alt="About AGBON"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <p className="text-[#FF6B35] text-sm font-semibold uppercase tracking-wider mb-2">
            {agbonT('about.subtitle', locale)}
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold">{agbonT('about.heading', locale)}</h1>
        </div>
      </div>

      {/* About content */}
      <div className="max-w-[90rem] mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-4">
              {agbonT('about.description1', locale)}
            </p>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6">
              {agbonT('about.description2', locale)}
            </p>
            <p className="text-gray-600 text-base leading-relaxed mb-6">
              {agbonT('story.paragraph1', locale)}
            </p>
            <p className="text-gray-600 text-base leading-relaxed mb-8">
              {agbonT('story.paragraph2', locale)}
            </p>
            <Link
              href={`/${locale}/products`}
              className="inline-flex items-center px-6 py-3 rounded-full bg-[#FF6B35] text-white font-semibold hover:bg-[#e55a2a] transition-all"
            >
              {agbonT('about.button', locale)}
            </Link>
          </div>
          <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden">
            <Image
              src="/images/section/about/workshop.png"
              alt="AGBON Workshop"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 text-center mb-16 p-8 bg-[#f9f5f0] rounded-2xl">
          {[
            { value: '2,500+', label: agbonT('stats.projects', locale) },
            { value: '20,000+', label: agbonT('stats.animals', locale) },
            { value: '15', label: agbonT('stats.harvest', locale) },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl md:text-4xl font-extrabold text-[#FF6B35] mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Commitment section */}
      <AgbonCommitmentSection locale={locale} />
    </div>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { title: agbonT('nav.about', locale) };
}

export async function generateStaticParams() {
  return localeEngine.getSupportedLocales().map((locale) => ({ locale }));
}
