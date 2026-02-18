/**
 * Collection metadata for admin UI
 * This is generated from the collection configs
 */

import type { CollectionConfig } from '@/core/collection/types';

// ============================================================================
// TYPES
// ============================================================================

export interface CollectionGroup {
  /** Group key (used as identifier) */
  key: string;
  /** Display label for the group */
  label: string;
  /** Sort order (lower numbers appear first) */
  order: number;
}

export interface CollectionFieldMeta {
  name: string;
  type: string;
  required?: boolean;
  label?: string;
  /** For select fields: available options */
  options?: { label: string; value: string }[];
  /** For relationship fields: target collection slug */
  relationTo?: string;
  /** For relationship fields: true = many-to-many */
  hasMany?: boolean;
  /** Whether this field is hidden in the admin UI */
  hidden?: boolean;
}

export interface CollectionMeta {
  slug: string;
  labels: {
    singular: string;
    plural: string;
  };
  admin: {
    useAsTitle?: string;
    defaultColumns?: string[];
    /** Group can be a string (group key) or an object with key, label, and order */
    group?: string | { key: string; label: string; order?: number };
    hidden?: boolean;
  };
  fields: CollectionFieldMeta[];
}

// Default groups configuration
const defaultGroups: CollectionGroup[] = [
  { key: 'user-management', label: 'User Management', order: 1 },
  { key: 'content', label: 'Content', order: 2 },
  { key: 'media', label: 'Media', order: 3 },
  { key: 'system', label: 'System', order: 4 },
];

// Get group by key
function getGroupInfo(groupKey: string | undefined): CollectionGroup {
  if (!groupKey) {
    return { key: 'content', label: 'Content', order: 2 };
  }
  
  const found = defaultGroups.find(g => g.key === groupKey.toLowerCase());
  if (found) {
    return found;
  }
  
  // If group not found in defaults, create one with high order
  return { key: groupKey, label: groupKey, order: 99 };
}

// Extract metadata from a collection config
function extractMeta(config: CollectionConfig): CollectionMeta {
  const group = config.admin?.group;
  
  let typedGroup: CollectionMeta['admin']['group'];
  if (typeof group === 'object' && group !== null) {
    typedGroup = {
      key: String(group.key || ''),
      label: String(group.label || ''),
      order: typeof group.order === 'number' ? group.order : undefined,
    };
  } else if (typeof group === 'string') {
    typedGroup = group;
  } else {
    typedGroup = undefined;
  }
  
  return {
    slug: config.slug,
    labels: {
      singular: config.labels?.singular || config.slug,
      plural: config.labels?.plural || config.slug + 's',
    },
    admin: {
      useAsTitle: config.admin?.useAsTitle,
      defaultColumns: config.admin?.defaultColumns,
      group: typedGroup,
      hidden: typeof config.admin?.hidden === 'function' ? false : config.admin?.hidden,
    },
    fields: config.fields.map((f) => {
      const meta: CollectionFieldMeta = {
        name: f.name,
        type: f.type,
        required: f.required,
        label: f.label,
        hidden: typeof f.admin?.hidden === 'boolean' ? f.admin.hidden : false,
      };

      if (f.type === 'select') {
        const sf = f as { options?: { label: string; value: string }[] };
        if (sf.options) meta.options = sf.options;
      }

      if (f.type === 'relationship') {
        const rf = f as { relationTo?: string | string[]; hasMany?: boolean };
        if (rf.relationTo) {
          meta.relationTo = Array.isArray(rf.relationTo) ? rf.relationTo[0] : rf.relationTo;
        }
        meta.hasMany = rf.hasMany ?? false;
      }

      return meta;
    }),
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

// Get grouped collections with ordering
export function getGroupedCollections(): CollectionGroup[] {
  const groupMap = new Map<string, CollectionMeta[]>();
  
  for (const collection of collectionsMeta) {
    let groupKey: string;
    let groupLabel: string;
    let groupOrder: number;
    
    if (typeof collection.admin.group === 'object' && collection.admin.group !== null) {
      groupKey = collection.admin.group.key;
      groupLabel = collection.admin.group.label || groupKey;
      groupOrder = collection.admin.group.order ?? 99;
    } else if (typeof collection.admin.group === 'string') {
      const groupInfo = getGroupInfo(collection.admin.group);
      groupKey = groupInfo.key;
      groupLabel = groupInfo.label;
      groupOrder = groupInfo.order;
    } else {
      // No group specified - use default
      const groupInfo = getGroupInfo(undefined);
      groupKey = groupInfo.key;
      groupLabel = groupInfo.label;
      groupOrder = groupInfo.order;
    }
    
    if (!groupMap.has(groupKey)) {
      groupMap.set(groupKey, []);
    }
    groupMap.get(groupKey)!.push(collection);
  }
  
  // Convert to array with order info
  const result: CollectionGroup[] = [];
  
  // Add groups that exist in the map
  for (const [key, _collections] of groupMap) {
    const groupInfo = getGroupInfo(key);
    result.push({
      key,
      label: groupInfo.label,
      order: groupInfo.order,
    });
  }
  
  // Sort by order
  result.sort((a, b) => a.order - b.order);
  
  return result;
}

// Get collections grouped by their group key
export function getCollectionsByGroup(): Map<string, CollectionMeta[]> {
  const groupMap = new Map<string, CollectionMeta[]>();
  
  for (const collection of collectionsMeta) {
    let groupKey: string;
    
    if (typeof collection.admin.group === 'object' && collection.admin.group !== null) {
      groupKey = collection.admin.group.key;
    } else if (typeof collection.admin.group === 'string') {
      groupKey = collection.admin.group.toLowerCase();
    } else {
      groupKey = 'content';
    }
    
    if (!groupMap.has(groupKey)) {
      groupMap.set(groupKey, []);
    }
    groupMap.get(groupKey)!.push(collection);
  }
  
  return groupMap;
}

// Get collection slugs
export function getCollectionSlugs(): string[] {
  return collectionsMeta.map((c) => c.slug);
}
