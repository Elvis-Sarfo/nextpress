/**
 * Admin utilities for accessing collections on the client side
 */

import type { CollectionConfig, Field } from '@/core/collection/types';

// Collection icons map - can be extended with custom icons
export const collectionIcons: Record<string, string> = {
  users: 'users',
  roles: 'shield',
  permissions: 'key',
  media: 'image',
  pages: 'file-text',
  settings: 'settings',
  default: 'database',
};

// Get icon name for a collection
export function getCollectionIcon(slug: string): string {
  return collectionIcons[slug] || collectionIcons.default;
}

// Get group name for a collection
export function getCollectionGroup(admin?: CollectionConfig['admin']): string {
  if (!admin?.group) return 'Content';
  if (typeof admin.group === 'string') return admin.group;
  // Handle localized groups
  return admin.group['en'] || 'Content';
}

// Group collections by their admin group
export function groupCollections(collections: CollectionConfig[]): Map<string, CollectionConfig[]> {
  const groups = new Map<string, CollectionConfig[]>();
  
  for (const collection of collections) {
    // Skip hidden collections
    if (collection.admin?.hidden) continue;
    
    const group = getCollectionGroup(collection.admin);
    if (!groups.has(group)) {
      groups.set(group, []);
    }
    groups.get(group)!.push(collection);
  }
  
  return groups;
}

// Get default columns for list view
export function getDefaultColumns(collection: CollectionConfig): string[] {
  return collection.admin?.defaultColumns || ['id', 'createdAt', 'updatedAt'];
}

// Get title field for a collection
export function getTitleField(collection: CollectionConfig): string {
  return collection.admin?.useAsTitle || 'id';
}

// Get field type icon
export function getFieldTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    text: 'type',
    textarea: 'align-left',
    number: 'hash',
    email: 'mail',
    checkbox: 'check-square',
    date: 'calendar',
    json: 'braces',
    select: 'chevron-down',
    upload: 'upload',
    relationship: 'link',
    array: 'list',
    group: 'folder',
    richText: 'file-text',
  };
  return icons[type] || 'circle';
}

// Format field value for display
export function formatFieldValue(value: unknown, type: string): string {
  if (value === null || value === undefined) return '-';
  
  if (type === 'checkbox') {
    return value ? 'Yes' : 'No';
  }
  
  if (type === 'date') {
    try {
      return new Date(value as string).toLocaleDateString();
    } catch {
      return String(value);
    }
  }
  
  if (type === 'number') {
    return Number(value).toLocaleString();
  }
  
  if (type === 'select') {
    if (typeof value === 'object' && 'label' in (value as Record<string, unknown>)) {
      return (value as { label: string }).label;
    }
    return String(value);
  }
  
  if (type === 'json') {
    try {
      return JSON.stringify(value, null, 2).slice(0, 100);
    } catch {
      return String(value);
    }
  }
  
  if (type === 'array') {
    if (Array.isArray(value)) {
      return `${value.length} items`;
    }
    return '-';
  }
  
  if (type === 'relationship' || type === 'upload') {
    if (typeof value === 'object' && value !== null) {
      return String(value);
    }
    return String(value);
  }
  
  return String(value);
}

// Check if field is required
export function isFieldRequired(field: Field): boolean {
  return field.required || false;
}

// Get field label
export function getFieldLabel(field: Field): string {
  return field.label || field.name.charAt(0).toUpperCase() + field.name.slice(1);
}

// Check if field type supports multiple values
export function isMultiValueField(type: string): boolean {
  return ['array', 'relationship'].includes(type);
}
