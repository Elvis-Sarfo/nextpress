import type { ContentTypeId, RoleId, Locale } from '../core/types';

// ============================================================================
// FIELD TYPES
// ============================================================================

export interface TextField {
  kind: 'text';
  maxLength?: number;
  minLength?: number;
  pattern?: string;
}

export interface RichTextField {
  kind: 'richtext';
  allowedBlocks?: string[];
}

export interface SlugField {
  kind: 'slug';
  sourceField?: string; // Auto-generate from this field
}

export interface DateTimeField {
  kind: 'datetime';
  includeTime?: boolean;
}

export interface ReferenceField {
  kind: 'reference';
  targetType: string; // ContentType name
  cardinality: 'one' | 'many';
}

export interface MediaField {
  kind: 'media';
  allowedTypes?: string[]; // MIME types
  maxSize?: number; // bytes
}

export interface EnumField {
  kind: 'enum';
  values: string[];
}

export interface BooleanField {
  kind: 'boolean';
  defaultValue?: boolean;
}

export interface NumberField {
  kind: 'number';
  min?: number;
  max?: number;
  integer?: boolean;
}

export interface JsonField {
  kind: 'json';
  schema?: object; // Optional JSON Schema
}

export type FieldType =
  | TextField
  | RichTextField
  | SlugField
  | DateTimeField
  | ReferenceField
  | MediaField
  | EnumField
  | BooleanField
  | NumberField
  | JsonField;

// ============================================================================
// FIELD DEFINITION
// ============================================================================

export interface FieldPermissions {
  read: RoleId[]; // Empty = everyone can read
  write: RoleId[]; // Empty = everyone can write
}

export interface ValidationRule {
  type: 'required' | 'pattern' | 'custom';
  value?: string | boolean;
  message: string;
}

export interface FieldDefinition {
  name: string;
  type: FieldType;
  displayName?: string;
  description?: string;
  required: boolean;
  localizable: boolean;
  permissions: FieldPermissions;
  validation: ValidationRule[];
  defaultValue?: unknown;
}

// ============================================================================
// POLICIES
// ============================================================================

export interface SlugPolicy {
  maxLength: number;
  lowercase: boolean;
  reservedSlugs: string[];
  pattern?: string;
}

export interface MetaDescriptionPolicy {
  required: boolean;
  minLength: number;
  maxLength: number;
}

export interface CanonicalPolicy {
  strategy: 'self' | 'explicit' | 'computed';
}

export interface SEOPolicy {
  slugPolicy: SlugPolicy;
  metaDescriptionPolicy: MetaDescriptionPolicy;
  canonicalPolicy: CanonicalPolicy;
}

export interface LocalizationPolicy {
  enabled: boolean;
  requiredLocales: Locale[];
  optionalLocales: Locale[];
}

// ============================================================================
// CONTENT TYPE SCHEMA
// ============================================================================

export interface ContentTypeSchema {
  id: ContentTypeId;
  name: string; // Machine name: 'article', 'page'
  displayName: string; // Human readable: 'Blog Article'
  description?: string;
  version: number; // Schema version for migrations
  fields: FieldDefinition[];
  localization: LocalizationPolicy;
  seo: SEOPolicy;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// SCHEMA REPOSITORY INTERFACE
// ============================================================================

export interface SchemaRepository {
  findById(id: ContentTypeId): Promise<ContentTypeSchema | null>;
  findByName(name: string): Promise<ContentTypeSchema | null>;
  findAll(): Promise<ContentTypeSchema[]>;
  save(schema: ContentTypeSchema): Promise<void>;
  delete(id: ContentTypeId): Promise<void>;
}
