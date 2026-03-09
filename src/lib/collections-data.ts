/**
 * Collection metadata for admin UI
 * This is generated from the collection configs
 */

import type { CollectionConfig, Field } from '@/core/collection/types';

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
  /** Description/hint text shown below the field */
  description?: string;
  /** For select fields: available options */
  options?: { label: string; value: string }[];
  /** For relationship fields: target collection slug */
  relationTo?: string;
  /** For relationship fields: true = many-to-many */
  hasMany?: boolean;
  /** Whether this field is hidden in the admin UI */
  hidden?: boolean;
  /** Whether this field is visible but not editable in the admin UI */
  readOnly?: boolean;
  /** Whether this field is disabled in the admin UI */
  disabled?: boolean;
  /** Whether this field stores locale-first JSON: { "en": ..., "fr": ... } */
  localized?: boolean;
  /** Input type rendered inside each locale tab (default: 'text') */
  localizedAs?: 'text' | 'textarea' | 'json';
  /** Custom admin component to render for this field (e.g. 'menu-items') */
  adminComponent?: string;
  /** Sub-fields for group and array types — drives recursive UI rendering */
  fields?: CollectionFieldMeta[];
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
    editorView?: 'page' | 'modal' | 'slider';
    hidden?: boolean;
  };
  fields: CollectionFieldMeta[];
  /** Localization config — present when the collection defines supported locales */
  localization?: {
    locales: string[];
    defaultLocale: string;
  };
}

// Default groups configuration
const defaultGroups: CollectionGroup[] = [
  { key: 'user-management', label: 'User Management', order: 1 },
  { key: 'content', label: 'Content', order: 2 },
  { key: 'media', label: 'Media', order: 3 },
  { key: 'system', label: 'System', order: 4 },
  {key: 'data', label: 'Data', order: 5},
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

// Recursively convert a Field definition into CollectionFieldMeta
function mapField(f: Field): CollectionFieldMeta {
  const meta: CollectionFieldMeta = {
    name: f.name,
    type: f.type,
    required: f.required,
    label: f.label,
    hidden: typeof f.admin?.hidden === 'boolean' ? f.admin.hidden : false,
    readOnly: Boolean(f.admin?.readOnly),
    disabled: Boolean(f.admin?.disabled),
    localized: f.localized ?? false,
    localizedAs: (f.admin as { localizedAs?: CollectionFieldMeta['localizedAs'] })?.localizedAs,
    adminComponent: (f.admin as { component?: string })?.component,
    description: (f.admin as { description?: string })?.description,
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
    meta.hasMany = (rf.hasMany ?? false);
  }

  if (f.type === 'upload') {
    const uf = f as { relationTo?: string };
    if (uf.relationTo) meta.relationTo = uf.relationTo;
  }

  if ((f.type === 'group' || f.type === 'array') && 'fields' in f) {
    const nested = f as { fields: Field[] };
    meta.fields = nested.fields.map(mapField);
  }

  return meta;
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

  // Extract localization config
  let localization: CollectionMeta['localization'];
  if (config.localization && typeof config.localization === 'object') {
    const loc = config.localization as { locales?: string[]; defaultLocale?: string };
    if (loc.locales && loc.locales.length > 0) {
      localization = {
        locales: loc.locales,
        defaultLocale: loc.defaultLocale ?? loc.locales[0],
      };
    }
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
      editorView: config.admin?.editorView,
      hidden: typeof config.admin?.hidden === 'function' ? false : config.admin?.hidden,
    },
    localization,
    fields: config.fields.map(mapField),
  };
}

// ============================================================================
// COLLECTIONS DATA
// ============================================================================

// This will be populated from the actual collection configs
// In production, this would be generated at build time or fetched from an API

import { collections } from '@/collections/index';

export const collectionsMeta: CollectionMeta[] = collections
  .map((c) => extractMeta(c))
  .filter((c) => !c.admin.hidden);

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
