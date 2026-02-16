/**
 * Collection Registry
 * 
 * Manages all collections in the system and provides utilities
 * for working with collections.
 */

import type { CollectionConfig, CollectionSlug, Field, SanitizedCollectionConfig } from './types';

// ============================================================================
// REGISTRY
// ============================================================================

/**
 * Global collection registry
 */
class CollectionRegistryClass {
  private collections: Map<CollectionSlug, CollectionConfig> = new Map();
  
  /**
   * Register a collection
   */
  register<T extends CollectionSlug>(config: CollectionConfig<T>): void {
    if (this.collections.has(config.slug)) {
      console.warn(`Collection "${config.slug}" is already registered. Overwriting.`);
    }
    this.collections.set(config.slug, config);
  }
  
  /**
   * Register multiple collections at once
   */
  registerMany(configs: CollectionConfig[]): void {
    for (const config of configs) {
      this.register(config);
    }
  }
  
  /**
   * Initialize collections from NextPress config
   */
  initFromConfig(config: { collections: CollectionConfig[] }): void {
    this.clear();
    this.registerMany(config.collections);
  }
  
  /**
   * Get a collection by slug
   */
  get<T extends CollectionSlug>(slug: T): CollectionConfig<T> | undefined {
    return this.collections.get(slug) as CollectionConfig<T> | undefined;
  }
  
  /**
   * Get all registered collections
   */
  getAll(): CollectionConfig[] {
    return Array.from(this.collections.values());
  }
  
  /**
   * Get all collection slugs
   */
  getSlugs(): CollectionSlug[] {
    return Array.from(this.collections.keys()) as CollectionSlug[];
  }
  
  /**
   * Check if a collection is registered
   */
  has(slug: CollectionSlug): boolean {
    return this.collections.has(slug);
  }
  
  /**
   * Remove a collection
   */
  unregister(slug: CollectionSlug): boolean {
    return this.collections.delete(slug);
  }
  
  /**
   * Clear all collections
   */
  clear(): void {
    this.collections.clear();
  }
  
  /**
   * Get the count of registered collections
   */
  count(): number {
    return this.collections.size;
  }
}

/**
 * Global collection registry instance
 */
export const Collections = new CollectionRegistryClass();

// ============================================================================
// COLLECTION WALKER
// ============================================================================

/**
 * Walk through all fields in a collection
 */
export function walkFields(
  fields: Field[],
  callback: (field: Field, path: string[]) => void,
  path: string[] = []
): void {
  for (const field of fields) {
    const fieldPath = [...path, field.name];
    callback(field, fieldPath);
    
    // Walk nested fields
    if ('fields' in field && Array.isArray(field.fields)) {
      walkFields(field.fields, callback, fieldPath);
    }
  }
}

/**
 * Find a field by name in a collection
 */
export function findField(fields: Field[], name: string): Field | undefined {
  for (const field of fields) {
    if (field.name === name) {
      return field;
    }
    
    // Search in nested fields
    if ('fields' in field && Array.isArray(field.fields)) {
      const found = findField(field.fields, name);
      if (found) return found;
    }
  }
  
  return undefined;
}

/**
 * Get all field names in a collection
 */
export function getFieldNames(fields: Field[]): string[] {
  const names: string[] = [];
  
  walkFields(fields, (field) => {
    names.push(field.name);
  });
  
  return names;
}

/**
 * Get localized fields in a collection
 */
export function getLocalizedFields(fields: Field[]): Field[] {
  const localized: Field[] = [];
  
  walkFields(fields, (field) => {
    if (field.localized) {
      localized.push(field);
    }
  });
  
  return localized;
}

/**
 * Get required fields in a collection
 */
export function getRequiredFields(fields: Field[]): Field[] {
  const required: Field[] = [];
  
  walkFields(fields, (field) => {
    if (field.required) {
      required.push(field);
    }
  });
  
  return required;
}

/**
 * Get unique fields in a collection
 */
export function getUniqueFields(fields: Field[]): Field[] {
  const unique: Field[] = [];
  
  walkFields(fields, (field) => {
    if (field.unique) {
      unique.push(field);
    }
  });
  
  return unique;
}

// ============================================================================
// COLLECTION HELPERS
// ============================================================================

/**
 * Check if a collection has authentication enabled
 */
export function hasAuth(config: CollectionConfig): boolean {
  return !!config.auth;
}

/**
 * Check if a collection has versioning enabled
 */
export function hasVersions(config: CollectionConfig): boolean {
  if (!config.versions) return false;
  if (typeof config.versions === 'boolean') return config.versions;
  return !!config.versions.enabled;
}

/**
 * Check if a collection has localization enabled
 */
export function hasLocalization(config: CollectionConfig): boolean {
  if (!config.localization) return false;
  if (typeof config.localization === 'boolean') return config.localization;
  return !!config.localization.enabled;
}

/**
 * Get the default locale for a collection
 */
export function getDefaultLocale(config: CollectionConfig): string {
  if (!config.localization) return 'en';
  if (typeof config.localization === 'boolean') return 'en';
  return config.localization.defaultLocale || 'en';
}

/**
 * Get available locales for a collection
 */
export function getLocales(config: CollectionConfig): string[] {
  if (!config.localization) return ['en'];
  if (typeof config.localization === 'boolean') return ['en'];
  return config.localization.locales || ['en'];
}

// ============================================================================
// SANITIZATION
// ============================================================================

/**
 * Sanitize a collection config (convert to runtime representation)
 */
export function sanitizeCollection(config: CollectionConfig): SanitizedCollectionConfig {
  return {
    slug: config.slug,
    fields: config.fields,
    access: config.access || {
      admin: () => false,
      create: () => false,
      read: () => false,
      update: () => false,
      delete: () => false,
    },
    admin: config.admin || {},
    auth: config.auth === true ? {} : config.auth || false,
    versions: config.versions === true ? { enabled: true } : config.versions || false,
    localization: config.localization === true 
      ? { enabled: true, defaultLocale: 'en', locales: ['en'] } 
      : config.localization || false,
    hooks: config.hooks || {},
    endpoints: config.endpoints || [],
    custom: config.custom || {},
    indexes: config.indexes || [],
  };
}

// ============================================================================
// REGISTRATION DECORATOR
// ============================================================================

/**
 * Decorator to register a collection
 */
export function registerCollection<T extends CollectionSlug>(
  slug: T
): (config: CollectionConfig<T>) => CollectionConfig<T> {
  return (config: CollectionConfig<T>): CollectionConfig<T> => {
    Collections.register({ ...config, slug });
    return config;
  };
}
