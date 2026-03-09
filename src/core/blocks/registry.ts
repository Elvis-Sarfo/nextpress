/**
 * Unified Block Registry
 *
 * Single source of truth that maps a block `name` string (stored in the DB) to both
 * the admin editor schema (definition) and the public React component (component).
 *
 * To add a new block type:
 *   1. Create `src/blocks/<your-type>.ts` exporting a block definition
 *   2. Register it in `src/blocks/index.ts`
 */

import type { BlockManifest, BlockComponent, BlockTypeDefinition } from '@/core/blocks/types';
import { blocks } from '@/blocks';

const registry = new Map<string, BlockManifest>();

blocks.forEach((manifest) => registry.set(manifest.name, manifest));

/** Register a custom block manifest at runtime (for project-specific blocks). */
export function registerManifest(manifest: BlockManifest): void {
  registry.set(manifest.name, manifest);
}

/** Returns the full manifest for a given block name, or undefined if not registered. */
export function getBlockManifest(name: string): BlockManifest | undefined {
  return registry.get(name);
}

/**
 * Returns the React component for a given block type.
 * Used by PageRenderer for public page rendering.
 */
export function getBlockComponent(name: string): BlockComponent | null {
  return registry.get(name)?.component ?? null;
}

/**
 * Returns the admin editor definition for a given block name.
 * Used by BlockContentPage to seed the editor when DB has no contentDefinition.
 */
export function getBlockDefinition(name: string): BlockTypeDefinition | undefined {
  const m = registry.get(name);
  if (!m) return undefined;
  return {
    name: m.name,
    label: m.label,
    icon: m.icon,
    content: m.definition.content,
    elements: m.definition.elements,
  };
}

/** @deprecated Use getBlockDefinition instead. */
export const getBlockType = getBlockDefinition;

/** Returns all registered block definitions — used by the admin block picker UI. */
export function getAllBlockDefinitions(): BlockTypeDefinition[] {
  return Array.from(registry.values()).map((m) => ({
    name: m.name,
    label: m.label,
    icon: m.icon,
    content: m.definition.content,
    elements: m.definition.elements,
  }));
}

/** @deprecated Use getAllBlockDefinitions instead. */
export const getAllBlockTypes = getAllBlockDefinitions;

export type { BlockManifest, BlockComponent };
