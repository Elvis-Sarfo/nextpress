'use client';

import { useParams } from 'next/navigation';
import { AgbonCommitmentSection } from '@/components/agbon/commitment-section';
import { AgbonContactForm } from '@/components/agbon/contact-form';
import { AgbonHappyFarmingBanner } from '@/components/agbon/happy-farming-banner';
import { AgbonHomeFeatureCards } from '@/components/agbon/home-feature-cards';
import { AgbonPageBanner } from '@/components/agbon/page-banner';
import { AgbonServiceAreasSection } from '@/components/agbon/service-areas-section';
import { AgbonStatsBar } from '@/components/agbon/stats-bar';
import { AgbonTestimonialStatsSection } from '@/components/agbon/testimonial-stats-section';
import type { BlockContent } from '@/core/blocks/types';

function useBlockLocale(): string {
  const params = useParams<{ locale?: string }>();
  return typeof params?.locale === 'string' ? params.locale : 'en';
}

function getString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined;
}

export function AgbonPageBannerBlock({ content }: { content: BlockContent }) {
  return (
    <AgbonPageBanner
      title={getString(content.title)}
      subTitle={getString(content.subTitle)}
      backgroundImage={getString(content.backgroundImage)}
    />
  );
}

export function AgbonContactFormBlock({ content }: { content: BlockContent }) {
  const locale = useBlockLocale();

  return (
    <AgbonContactForm
      locale={locale}
      email={getString(content.email)}
      phone={getString(content.phone)}
      address={getString(content.address)}
    />
  );
}

export function AgbonCommitmentSectionBlock() {
  const locale = useBlockLocale();
  return <AgbonCommitmentSection locale={locale} />;
}

export function AgbonServiceAreasSectionBlock({ content }: { content: BlockContent }) {
  return (
    <AgbonServiceAreasSection
      title={getString(content.title)}
      subtitle={getString(content.subtitle)}
    />
  );
}

export function AgbonHappyFarmingBannerBlock() {
  const locale = useBlockLocale();
  return <AgbonHappyFarmingBanner locale={locale} />;
}

export function AgbonHomeFeatureCardsBlock() {
  const locale = useBlockLocale();
  return <AgbonHomeFeatureCards locale={locale} />;
}

export function AgbonStatsBarBlock({ content }: { content: BlockContent }) {
  const locale = useBlockLocale();

  return (
    <AgbonStatsBar
      locale={locale}
      backgroundImage={getString(content.backgroundImage)}
    />
  );
}

export function AgbonTestimonialStatsSectionBlock() {
  return <AgbonTestimonialStatsSection />;
}
