import type { BlockManifest } from '@/core/blocks/types';

import { agbonBrandPresenceSectionBlock } from './agbon-brand-presence-section';
import { agbonBrandStorySectionBlock } from './agbon-brand-story-section';
import { agbonBrandValuesSectionBlock } from './agbon-brand-values-section';
import { agbonCommitmentSectionBlock } from './agbon-commitment-section';
import { agbonContactFormBlock } from './agbon-contact-form';
import { agbonFeaturedProductsBlock } from './agbon-featured-products';
import { agbonHappyFarmingBannerBlock } from './agbon-happy-farming-banner';
import { agbonHomeFeatureCardsBlock } from './agbon-home-feature-cards';
import { agbonNewsSectionBlock } from './agbon-news-section';
import { agbonPageBannerBlock } from './agbon-page-banner';
import { agbonProductListBlock } from './agbon-product-list';
import { agbonServiceAreasSectionBlock } from './agbon-service-areas-section';
import { agbonStatsBarBlock } from './agbon-stats-bar';
import { agbonTestimonialStatsSectionBlock } from './agbon-testimonial-stats-section';
import { primaryHeroSectionBlock } from './primary-hero-section';
import { agbonTestimonialsSectionBlock } from './agbon-testimonials-section';
import { productCategorySidebarBlock } from './product-category-sidebar';

export const blocks: BlockManifest[] = [
  agbonPageBannerBlock,
  agbonBrandStorySectionBlock,
  agbonBrandValuesSectionBlock,
  agbonBrandPresenceSectionBlock,
  agbonNewsSectionBlock,
  agbonFeaturedProductsBlock,
  agbonProductListBlock,
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
