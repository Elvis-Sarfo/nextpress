/**
 * Canonical Schema Types
 * 
 * This module defines the canonical schema representation for the CMS.
 * Used for schema introspection and code generation.
 * 
 * @deprecated This module is not currently used. Content types are defined
 * using content-schema/schema-engine.ts instead.
 */

// ============================================================================
// MODEL SCHEMA
// ============================================================================

export interface ModelSchema {
  name: string;
  tableName?: string;
  auth?: AuthSchema;
  fields: Record<string, FieldSchema>;
  indexes?: IndexSchema[];
}

export interface AuthSchema {
  ownerField?: string;
  permissions?: Record<string, string[]>;
}

export type FieldSchema =
  | ScalarField
  | RelationField
  | EnumField;

export interface ScalarField {
  kind: 'scalar';
  type: 'string' | 'int' | 'boolean' | 'date' | 'json';
  required?: boolean;
  unique?: boolean;
  default?: unknown;
}

export interface RelationField {
  kind: 'relation';
  target: string;
  relation: 'one' | 'many';
  required?: boolean;
}

export interface EnumField {
  kind: 'enum';
  values: string[];
  default?: string;
}

export interface IndexSchema {
  name?: string;
  fields: string[];
  unique?: boolean;
  type?: 'btree' | 'hash' | 'gin' | 'gist';
}

// ============================================================================
// ENUM SCHEMA
// ============================================================================

export interface EnumSchema {
  name: string;
  values: string[];
}

// ============================================================================
// CANONICAL SCHEMA
// ============================================================================

export type CanonicalSchema = {
  models: Record<string, ModelSchema>;
  enums?: Record<string, EnumSchema>;
  version?: number;
};
