'use client';

import { useParams } from 'next/navigation';
import { AgbonCommitmentSection } from '@/components/agbon/commitment-section';
import { AgbonContactInfo } from '@/components/agbon/contact-info';
import { AgbonContactForm } from '@/components/agbon/contact-form';
import { AgbonHappyFarmingBanner } from '@/components/agbon/happy-farming-banner';
import { AgbonHomeFeatureCards } from '@/components/agbon/home-feature-cards';
import { AgbonPageBanner } from '@/components/agbon/page-banner';
import { AgbonServiceAreasSection } from '@/components/agbon/service-areas-section';
import { AgbonStatsBar } from '@/components/agbon/stats-bar';
import { AgbonTestimonialStatsSection } from '@/components/agbon/testimonial-stats-section';
import type { BlockContent, BlockPageContext } from '@/core/blocks/types';
import { asElements, asNumber, asOptionalString } from './content-helpers';

function useBlockLocale(): string {
  const params = useParams<{ locale?: string }>();
  return typeof params?.locale === 'string' ? params.locale : 'en';
}

export function AgbonPageBannerBlock({
  content,
  page,
}: {
  content: BlockContent;
  page?: BlockPageContext;
}) {
  return (
    <AgbonPageBanner
      title={page?.title ?? asOptionalString(content.title)}
      subTitle={page?.subTitle ?? asOptionalString(content.subTitle)}
      backgroundImage={page?.featuredImage ?? asOptionalString(content.backgroundImage)}
    />
  );
}

export function AgbonContactFormBlock({ content }: { content: BlockContent }) {
  const locale = useBlockLocale();
  const subjectOptions = asElements(content._elements).map((item, index) => ({
    label: asOptionalString(item.label) ?? `Subject ${index + 1}`,
    value: asOptionalString(item.value) ?? `subject-${index + 1}`,
  }));

  return (
    <AgbonContactForm
      locale={locale}
      formTitle={asOptionalString(content.formTitle)}
      successTitle={asOptionalString(content.successTitle)}
      successMessage={asOptionalString(content.successMessage)}
      errorTitle={asOptionalString(content.errorTitle)}
      submitLabel={asOptionalString(content.submitLabel)}
      submittingLabel={asOptionalString(content.submittingLabel)}
      subjectOptions={subjectOptions}
      showContactInfo={false}
    />
  );
}

export function AgbonContactInfoBlock({ content }: { content: BlockContent }) {
  const locale = useBlockLocale();

  return (
    <AgbonContactInfo
      locale={locale}
      badge={asOptionalString(content.badge)}
      title={asOptionalString(content.title)}
      subtitle={asOptionalString(content.subtitle)}
      description={asOptionalString(content.description)}
      email={asOptionalString(content.email)}
      phone={asOptionalString(content.phone)}
      address={asOptionalString(content.address)}
    />
  );
}

export function AgbonCommitmentSectionBlock({ content }: { content: BlockContent }) {
  const locale = useBlockLocale();
  const features = asElements(content._elements).map((item) => ({
    icon: asOptionalString(item.icon),
    label: asOptionalString(item.label) ?? '',
  }));

  return (
    <AgbonCommitmentSection
      locale={locale}
      subtitle={asOptionalString(content.subtitle)}
      heading={asOptionalString(content.heading)}
      description={asOptionalString(content.description)}
      ctaText={asOptionalString(content.ctaText)}
      ctaLink={asOptionalString(content.ctaLink)}
      image={asOptionalString(content.image)}
      features={features}
    />
  );
}

export function AgbonServiceAreasSectionBlock({ content }: { content: BlockContent }) {
  const areas = asElements(content._elements).map((item, index) => ({
    id: `service-area-${index}`,
    name: asOptionalString(item.name) ?? `Country ${index + 1}`,
    flag: asOptionalString(item.flag),
    officesCount: asNumber(item.officesCount, 0),
  }));

  return (
    <AgbonServiceAreasSection
      title={asOptionalString(content.title)}
      subtitle={asOptionalString(content.subtitle)}
      backgroundImage={asOptionalString(content.backgroundImage)}
      mapImage={asOptionalString(content.mapImage)}
      statLabel={asOptionalString(content.statLabel)}
      emptyMessage={asOptionalString(content.emptyMessage)}
      footerText={asOptionalString(content.footerText)}
      footerCtaText={asOptionalString(content.footerCtaText)}
      footerCtaLink={asOptionalString(content.footerCtaLink)}
      countries={areas}
    />
  );
}

export function AgbonHappyFarmingBannerBlock({ content }: { content: BlockContent }) {
  const locale = useBlockLocale();
  return (
    <AgbonHappyFarmingBanner
      locale={locale}
      tagline={asOptionalString(content.tagline)}
      heading={asOptionalString(content.heading)}
      subtext={asOptionalString(content.subtext)}
      ctaText={asOptionalString(content.ctaText)}
      ctaLink={asOptionalString(content.ctaLink)}
      image={asOptionalString(content.image)}
    />
  );
}

export function AgbonHomeFeatureCardsBlock({ content }: { content: BlockContent }) {
  const locale = useBlockLocale();
  const cards = asElements(content._elements).map((item, index) => ({
    id: `feature-card-${index}`,
    image: asOptionalString(item.image),
    title: asOptionalString(item.title) ?? '',
    description: asOptionalString(item.description),
    ctaText: asOptionalString(item.ctaText),
    ctaLink: asOptionalString(item.ctaLink),
  }));

  return <AgbonHomeFeatureCards locale={locale} cards={cards} />;
}

export function AgbonStatsBarBlock({ content }: { content: BlockContent }) {
  const locale = useBlockLocale();
  const stats = asElements(content._elements).map((item, index) => ({
    id: `stat-${index}`,
    icon: asOptionalString(item.icon),
    value: asOptionalString(item.value) ?? '',
    label: asOptionalString(item.label) ?? '',
  }));

  return (
    <AgbonStatsBar
      locale={locale}
      backgroundImage={asOptionalString(content.backgroundImage)}
      stats={stats}
    />
  );
}

export function AgbonTestimonialStatsSectionBlock({ content }: { content: BlockContent }) {
  return (
    <AgbonTestimonialStatsSection
      badge={asOptionalString(content.badge)}
      title={asOptionalString(content.title)}
      quote={asOptionalString(content.quote)}
      name={asOptionalString(content.name)}
      position={asOptionalString(content.position)}
      rating={asNumber(content.rating, 5)}
      mainImage={asOptionalString(content.mainImage)}
    />
  );
}
