/**
 * Block Type Registry
 *
 * Central registry mapping block type strings to their schema definitions.
 * All definitions are imported and auto-registered at module load time.
 */

import type { BlockTypeDefinition } from './types';

// Import all block type definitions
import { heroDef } from './definitions/hero';
import { bannerDef } from './definitions/banner';
import { aboutDef } from './definitions/about';
import { faqDef } from './definitions/faq';
import { galleryDef } from './definitions/gallery';
import { serviceDef } from './definitions/service';
import { testimonialDef } from './definitions/testimonial';
import { contactDef } from './definitions/contact';
import { subscribeDef } from './definitions/subscribe';
import { featuredRoomsDef } from './definitions/featured-rooms';
import { showcaseDef } from './definitions/showcase';

const registry = new Map<string, BlockTypeDefinition>();

function registerBlockType(def: BlockTypeDefinition): void {
  registry.set(def.type, def);
}

// Register all built-in block types
[
  heroDef,
  bannerDef,
  aboutDef,
  faqDef,
  galleryDef,
  serviceDef,
  testimonialDef,
  contactDef,
  subscribeDef,
  featuredRoomsDef,
  showcaseDef,
].forEach(registerBlockType);

export function getBlockType(type: string): BlockTypeDefinition | undefined {
  return registry.get(type);
}

export function getAllBlockTypes(): BlockTypeDefinition[] {
  return Array.from(registry.values());
}

/**
 * Register a custom block type at runtime.
 * Call this to extend the registry with project-specific blocks.
 */
export { registerBlockType };
