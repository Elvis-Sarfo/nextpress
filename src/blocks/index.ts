import type { BlockManifest } from '@/core/blocks/types';

import { agbonCommitmentSectionBlock } from './agbon-commitment-section';
import { agbonContactFormBlock } from './agbon-contact-form';
import { agbonHappyFarmingBannerBlock } from './agbon-happy-farming-banner';
import { agbonHomeFeatureCardsBlock } from './agbon-home-feature-cards';
import { agbonPageBannerBlock } from './agbon-page-banner';
import { agbonServiceAreasSectionBlock } from './agbon-service-areas-section';
import { agbonStatsBarBlock } from './agbon-stats-bar';
import { agbonTestimonialStatsSectionBlock } from './agbon-testimonial-stats-section';
import { primaryHeroSectionBlock } from './primary-hero-section';
import { agbonTestimonialsSectionBlock } from './agbon-testimonials-section';
import { productCategorySidebarBlock } from './product-category-sidebar';

export const blocks: BlockManifest[] = [
  agbonPageBannerBlock,
  agbonContactFormBlock,
  agbonCommitmentSectionBlock,
  agbonServiceAreasSectionBlock,
  agbonHappyFarmingBannerBlock,
  agbonHomeFeatureCardsBlock,
  agbonStatsBarBlock,
  agbonTestimonialStatsSectionBlock,
  primaryHeroSectionBlock,
  agbonTestimonialsSectionBlock,
  productCategorySidebarBlock,
];
