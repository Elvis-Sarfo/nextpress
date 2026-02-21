import type { ComponentType } from 'react';
import { HeroBlock } from './HeroBlock';
import { BannerBlock } from './BannerBlock';
import { AboutBlock } from './AboutBlock';
import { FAQBlock } from './FAQBlock';
import { GalleryBlock } from './GalleryBlock';
import { ServiceBlock } from './ServiceBlock';
import { TestimonialBlock } from './TestimonialBlock';
import { ContactBlock } from './ContactBlock';
import { SubscribeBlock } from './SubscribeBlock';
import { FeaturedRoomsBlock } from './FeaturedRoomsBlock';
import { ShowcaseBlock } from './ShowcaseBlock';

export type BlockContent = Record<string, unknown>;
export type BlockComponent = ComponentType<{ content: BlockContent }>;

const BlockRegistry: Record<string, BlockComponent> = {
  hero: HeroBlock,
  banner: BannerBlock,
  about: AboutBlock,
  faq: FAQBlock,
  gallery: GalleryBlock,
  service: ServiceBlock,
  testimonial: TestimonialBlock,
  contact: ContactBlock,
  subscribe: SubscribeBlock,
  featured_rooms: FeaturedRoomsBlock,
  showcase: ShowcaseBlock,
};

export function getBlockComponent(type: string): BlockComponent | null {
  return BlockRegistry[type] ?? null;
}

/**
 * Register additional block components at runtime.
 * Call this in your app to extend the registry with custom blocks.
 */
export function registerBlock(type: string, component: BlockComponent): void {
  BlockRegistry[type] = component;
}
