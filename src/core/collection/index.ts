/**
 * NextPress Collection Module
 * 
 * Provides collection configuration types, registry, and utilities
 * for managing content collections in the CMS.
 * 
 * @module core/collection
 */

// Main config
export * from './types';

// Registry
export { 
  Collections, 
  walkFields, 
  findField, 
  getFieldNames, 
  getLocalizedFields, 
  getRequiredFields, 
  getUniqueFields,
  hasAuth,
  hasVersions,
  hasLocalization,
  getDefaultLocale,
  getLocales,
  sanitizeCollection,
  registerCollection,
} from './registry';

// Re-export field types for convenience
export type { 
  Field, 
  BaseField,
  CollectionConfig, 
  SanitizedCollectionConfig,
  CollectionTextField,
  CollectionTextareaField,
  CollectionNumberField,
  EmailField,
  CheckboxField,
  DateField,
  JSONField,
  SelectField,
  UploadField,
  RelationshipField,
  ArrayField,
  GroupField,
  CollectionRichTextField,
  CollectionAdmin,
  CollectionAccess,
  CollectionAuth,
  CollectionVersions,
  CollectionLocalization,
  CollectionHooks,
} from './types';
