/**
 * Collection metadata for admin UI
 * This is generated from the collection configs
 */

import type { CollectionConfig } from '@/core/collection/types';

// ============================================================================
// COLLECTION METADATA
// ============================================================================

export interface CollectionMeta {
  slug: string;
  labels: {
    singular: string;
    plural: string;
  };
  admin: {
    useAsTitle?: string;
    defaultColumns?: string[];
    group?: string | Record<string, string>;
    hidden?: boolean;
  };
  fields: {
    name: string;
    type: string;
    required?: boolean;
    label?: string;
  }[];
}

// Extract metadata from a collection config
function extractMeta(config: CollectionConfig): CollectionMeta {
  return {
    slug: config.slug,
    labels: {
      singular: config.labels?.singular || config.slug,
      plural: config.labels?.plural || config.slug + 's',
    },
    admin: {
      useAsTitle: config.admin?.useAsTitle,
      defaultColumns: config.admin?.defaultColumns,
      group: config.admin?.group,
      hidden: typeof config.admin?.hidden === 'function' ? false : config.admin?.hidden,
    },
    fields: config.fields.map((f) => ({
      name: f.name,
      type: f.type,
      required: f.required,
      label: f.label,
    })),
  };
}

// ============================================================================
// COLLECTIONS DATA
// ============================================================================

// This will be populated from the actual collection configs
// In production, this would be generated at build time or fetched from an API

import { Users } from '@/collections/Users';
import { Roles } from '@/collections/Roles';
import { Permissions } from '@/collections/Permissions';
import { Media } from '@/collections/Media';
import { Pages } from '@/collections/Pages';
import { Settings } from '@/collections/Settings';

export const collectionsMeta: CollectionMeta[] = [
  extractMeta(Users),
  extractMeta(Roles),
  extractMeta(Permissions),
  extractMeta(Media),
  extractMeta(Pages),
  extractMeta(Settings),
].filter((c) => !c.admin.hidden);

// Get all collections
export function getCollections(): CollectionMeta[] {
  return collectionsMeta;
}

// Get collection by slug
export function getCollection(slug: string): CollectionMeta | undefined {
  return collectionsMeta.find((c) => c.slug === slug);
}

// Get grouped collections
export function getGroupedCollections(): Map<string, CollectionMeta[]> {
  const groups = new Map<string, CollectionMeta[]>();
  
  for (const collection of collectionsMeta) {
    const group = typeof collection.admin.group === 'string' 
      ? collection.admin.group 
      : 'Content';
    
    if (!groups.has(group)) {
      groups.set(group, []);
    }
    groups.get(group)!.push(collection);
  }
  
  return groups;
}

// Get collection slugs
export function getCollectionSlugs(): string[] {
  return collectionsMeta.map((c) => c.slug);
}
