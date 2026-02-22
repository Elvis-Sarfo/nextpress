/**
 * Unified Block Registry
 *
 * Single source of truth that maps a block `type` string (stored in the DB) to both
 * the admin editor schema (definition) and the public React component (component).
 *
 * To add a new block type:
 *   1. Create `src/blocks/manifests/<your-type>.ts` exporting a `BlockManifest`
 *   2. Import it here and add it to the `BUILT_IN_MANIFESTS` array
 */

import type { BlockManifest, BlockComponent, BlockTypeDefinition } from './types';

import { heroManifest }          from './manifests/hero';
import { bannerManifest }        from './manifests/banner';
import { aboutManifest }         from './manifests/about';
import { faqManifest }           from './manifests/faq';
import { galleryManifest }       from './manifests/gallery';
import { serviceManifest }       from './manifests/service';
import { testimonialManifest }   from './manifests/testimonial';
import { contactManifest }       from './manifests/contact';
import { subscribeManifest }     from './manifests/subscribe';
import { featuredRoomsManifest } from './manifests/featured-rooms';
import { showcaseManifest }      from './manifests/showcase';

const BUILT_IN_MANIFESTS: BlockManifest[] = [
  heroManifest,
  bannerManifest,
  aboutManifest,
  faqManifest,
  galleryManifest,
  serviceManifest,
  testimonialManifest,
  contactManifest,
  subscribeManifest,
  featuredRoomsManifest,
  showcaseManifest,
];

const registry = new Map<string, BlockManifest>();

BUILT_IN_MANIFESTS.forEach((manifest) => registry.set(manifest.type, manifest));

/** Register a custom block manifest at runtime (for project-specific blocks). */
export function registerManifest(manifest: BlockManifest): void {
  registry.set(manifest.type, manifest);
}

/** Returns the full manifest for a given block type, or undefined if not registered. */
export function getBlockManifest(type: string): BlockManifest | undefined {
  return registry.get(type);
}

/**
 * Returns the React component for a given block type.
 * Used by PageRenderer for public page rendering.
 */
export function getBlockComponent(type: string): BlockComponent | null {
  return registry.get(type)?.component ?? null;
}

/**
 * Returns the admin editor definition for a given block type.
 * Used by BlockContentPage to seed the editor when DB has no contentDefinition.
 */
export function getBlockType(type: string): BlockTypeDefinition | undefined {
  const m = registry.get(type);
  if (!m) return undefined;
  return {
    type: m.type,
    label: m.label,
    icon: m.icon,
    content: m.definition.content,
    elements: m.definition.elements,
  };
}

/** Returns all registered block types — used by the admin block picker UI. */
export function getAllBlockTypes(): BlockTypeDefinition[] {
  return Array.from(registry.values()).map((m) => ({
    type: m.type,
    label: m.label,
    icon: m.icon,
    content: m.definition.content,
    elements: m.definition.elements,
  }));
}

export type { BlockManifest, BlockComponent };
