/**
 * NextPress CollectionConfig Type System
 * 
 * Inspired by Payload CMS CollectionConfig but adapted for NextPress architecture.
 * Provides type-safe collection definitions with localization, RBAC, versioning, and admin UI support.
 */

import type { PrincipalId, RoleId, Locale, DocumentId } from '../core/types';
import type { Permission, Action, ResourceType } from '../permissions/types';

// ============================================================================
// COLLECTION SLUGS
// ============================================================================

export type CollectionSlug = string;

// ============================================================================
// FIELD TYPES
// ============================================================================

/** Base field configuration */
export interface BaseField {
  name: string;
  type: string;
  label?: string;
  required?: boolean;
  localized?: boolean;
  default?: unknown;
  defaultValue?: unknown;
  admin?: FieldAdminConfig;
  hooks?: FieldHooks;
  validate?: FieldValidator;
  unique?: boolean;
}

/** Text field */
export interface CollectionTextField extends BaseField {
  type: 'text';
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  defaultValue?: string;
  admin?: FieldAdminConfig & {
    placeholder?: string;
    description?: string;
    condition?: FieldCondition;
  };
}

/** Textarea field */
export interface CollectionTextareaField extends BaseField {
  type: 'textarea';
  rows?: number;
  defaultValue?: string;
  admin?: FieldAdminConfig & {
    placeholder?: string;
    description?: string;
  };
}

/** Number field */
export interface CollectionNumberField extends BaseField {
  type: 'number';
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  admin?: FieldAdminConfig & {
    placeholder?: string;
    description?: string;
  };
}

/** Email field */
export interface EmailField extends BaseField {
  type: 'email';
  defaultValue?: string;
  admin?: FieldAdminConfig & {
    placeholder?: string;
    description?: string;
  };
}

/** Checkbox/Toggle field */
export interface CheckboxField extends BaseField {
  type: 'checkbox';
  defaultValue?: boolean;
  admin?: FieldAdminConfig & {
    description?: string;
  };
}

/** Date field */
export interface DateField extends BaseField {
  type: 'date';
  defaultValue?: string | Date;
  admin?: FieldAdminConfig & {
    placeholder?: string;
    description?: string;
  };
}

/** JSON field */
export interface JSONField extends BaseField {
  type: 'json';
  defaultValue?: Record<string, unknown> | unknown[];
  admin?: FieldAdminConfig & {
    description?: string;
  };
}

/** Select/Dropdown field */
export interface SelectField extends BaseField {
  type: 'select';
  options: SelectOption[];
  hasMany?: boolean;
  defaultValue?: string | string[];
  admin?: FieldAdminConfig & {
    isClearable?: boolean;
    description?: string;
  };
}

export interface SelectOption {
  label: string;
  value: string;
}

/** Upload/Media field */
export interface UploadField extends BaseField {
  type: 'upload';
  relationTo: CollectionSlug;
  defaultValue?: string;
  admin?: FieldAdminConfig & {
    description?: string;
  };
}

/** Relationship field */
export interface RelationshipField extends BaseField {
  type: 'relationship';
  relationTo: CollectionSlug | CollectionSlug[];
  hasMany?: boolean;
  defaultValue?: string | string[];
  admin?: FieldAdminConfig & {
    description?: string;
    condition?: FieldCondition;
    filterOptions?: FilterOptions;
  };
}

/** Array field (repeatable list) */
export interface ArrayField extends BaseField {
  type: 'array';
  fields: Field[];
  minRows?: number;
  maxRows?: number;
  defaultValue?: unknown[];
  admin?: FieldAdminConfig & {
    description?: string;
  };
}

/** Group field (nested object) */
export interface GroupField extends BaseField {
  type: 'group';
  fields: Field[];
  defaultValue?: Record<string, unknown>;
  admin?: FieldAdminConfig & {
    description?: string;
  };
}

/** Rich text field */
export interface CollectionRichTextField extends BaseField {
  type: 'richText';
  defaultValue?: unknown;
  admin?: FieldAdminConfig & {
    description?: string;
  };
}

/** All field types */
export type Field = 
  | CollectionTextField 
  | CollectionTextareaField 
  | CollectionNumberField 
  | EmailField 
  | CheckboxField 
  | DateField 
  | JSONField 
  | SelectField 
  | UploadField 
  | RelationshipField 
  | ArrayField 
  | GroupField 
  | CollectionRichTextField;

// ============================================================================
// FIELD ADMIN CONFIG
// ============================================================================

export interface FieldAdminConfig {
  hidden?: boolean | ((data: unknown, siblingData: unknown, { user }: { user?: unknown }) => boolean);
  readOnly?: boolean;
  disabled?: boolean;
  width?: string;
  style?: Record<string, string>;
  className?: string;
  /** For localized fields: controls the input type rendered inside each locale tab */
  localizedAs?: 'text' | 'textarea' | 'json';
  /** Custom admin component name to render for this field instead of the default input */
  component?: string;
}

// ============================================================================
// FIELD CONDITION & VALIDATION
// ============================================================================

export type FieldCondition = (
  data: unknown,
  siblingData: unknown,
  { user }: { user?: unknown }
) => boolean;

export type FieldValidator = (value: unknown, options: {
  req: unknown;
  data: unknown;
  siblingData: unknown;
  id?: string;
}) => boolean | string | Promise<boolean | string>;

// ============================================================================
// FIELD HOOKS
// ============================================================================

export interface FieldHooks {
  beforeValidate?: FieldHook[];
  beforeChange?: FieldHook[];
  afterChange?: FieldHook[];
  afterRead?: FieldHook[];
}

export type FieldHook = (args: {
  value: unknown;
  data: unknown;
  siblingData: unknown;
  req: unknown;
  operation: 'create' | 'update';
  originalDoc?: unknown;
}) => unknown;

// ============================================================================
// FILTER OPTIONS (for relationships)
// ============================================================================

export interface FilterOptions {
  [key: string]: unknown;
}

// ============================================================================
// ACCESS CONTROL
// ============================================================================

export type AccessCondition = (args: {
  req: CollectionRequest;
  id?: string;
  data?: unknown;
}) => boolean | WhereClause | Promise<boolean | WhereClause>;

export interface WhereClause {
  [key: string]: unknown;
}

export interface CollectionAccess {
  /** Allow access to admin panel */
  admin?: AccessCondition;
  /** Allow creating documents */
  create?: AccessCondition;
  /** Allow reading documents */
  read?: AccessCondition;
  /** Allow updating documents */
  update?: AccessCondition;
  /** Allow deleting documents */
  delete?: AccessCondition;
  /** Allow reading document versions */
  readVersions?: AccessCondition;
}

// ============================================================================
// HOOKS
// ============================================================================

export interface CollectionHooks {
  beforeValidate?: CollectionBeforeValidateHook[];
  beforeChange?: CollectionBeforeChangeHook[];
  afterChange?: CollectionAfterChangeHook[];
  beforeRead?: CollectionBeforeReadHook[];
  afterRead?: CollectionAfterReadHook[];
  beforeDelete?: CollectionBeforeDeleteHook[];
  afterDelete?: CollectionAfterDeleteHook[];
}

export type CollectionBeforeValidateHook = (args: {
  req: CollectionRequest;
  data?: unknown;
  operation: 'create' | 'update';
  originalDoc?: unknown;
}) => unknown;

export type CollectionBeforeChangeHook = (args: {
  req: CollectionRequest;
  data: unknown;
  operation: 'create' | 'update';
  originalDoc?: unknown;
}) => unknown;

export type CollectionAfterChangeHook = (args: {
  req: CollectionRequest;
  doc: unknown;
  previousDoc: unknown;
  operation: 'create' | 'update';
}) => unknown;

export type CollectionBeforeReadHook = (args: {
  req: CollectionRequest;
  doc: unknown;
  query: Record<string, unknown>;
}) => unknown;

export type CollectionAfterReadHook = (args: {
  req: CollectionRequest;
  doc: unknown;
  findMany?: boolean;
  query?: Record<string, unknown>;
}) => unknown;

export type CollectionBeforeDeleteHook = (args: {
  req: CollectionRequest;
  id: string;
}) => unknown;

export type CollectionAfterDeleteHook = (args: {
  req: CollectionRequest;
  doc: unknown;
  id: string;
}) => unknown;

// ============================================================================
// REQUEST CONTEXT
// ============================================================================

export interface CollectionRequest {
  user?: CollectionUser;
  locale?: string;
  fallbackLocale?: string;
  payload?: unknown;
}

export interface CollectionUser {
  id: string;
  email: string;
  role: string;
  [key: string]: unknown;
}

// ============================================================================
// ADMIN CONFIGURATION
// ============================================================================

export interface CollectionAdmin {
  /** Field to use as title */
  useAsTitle?: string;
  /** Default columns in list view */
  defaultColumns?: string[];
  /** Custom description */
  description?: string;
  /** Hide from admin sidebar */
  hidden?: boolean | ((user: CollectionUser) => boolean);
  /** Navigation group - can be a string (group key) or object with key, label, and order */
  group?: string | { key: string; label: string; order?: number };
  /** Pagination defaults */
  pagination?: {
    defaultLimit?: number;
    limits?: number[];
  };
  /** Live preview config */
  preview?: {
    url: string;
    endpoint?: string;
  };
  /** Custom components */
  components?: {
    beforeList?: unknown[];
    afterList?: unknown[];
    beforeListTable?: unknown[];
    afterListTable?: unknown[];
    Description?: unknown;
    edit?: {
      beforeDocumentControls?: unknown[];
      PreviewButton?: unknown;
      PublishButton?: unknown;
      SaveButton?: unknown;
      SaveDraftButton?: unknown;
    };
  };
}

// ============================================================================
// AUTH CONFIGURATION
// ============================================================================

export interface CollectionAuth {
  tokenExpiration?: number; // seconds
  verify?: boolean;
  maxLoginAttempts?: number;
  lockTime?: number; // milliseconds
  cookies?: {
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
  };
}

// ============================================================================
// VERSIONING CONFIG
// ============================================================================

export interface CollectionVersions {
  /** Enable versioning for this collection */
  enabled?: boolean;
  /** Number of versions to keep */
  maxPerDoc?: number;
}

// ============================================================================
// LOCALIZATION CONFIG
// ============================================================================

export interface CollectionLocalization {
  /** Enable localization */
  enabled?: boolean;
  /** Default locale */
  defaultLocale?: string;
  /** Available locales */
  locales?: string[];
  /** Fallback to default locale */
  fallback?: boolean | string;
}

// ============================================================================
// ENDPOINTS
// ============================================================================

export interface CollectionEndpoint {
  path: string;
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  handler: (req: CollectionRequest) => Promise<unknown>;
}

// ============================================================================
// MAIN COLLECTION CONFIG
// ============================================================================

/**
 * Main collection configuration type
 * Inspired by Payload CMS CollectionConfig
 */
export interface CollectionConfig<
  TSlug extends CollectionSlug = CollectionSlug,
  TFields extends Field[] = Field[],
  TDoc = unknown,
  TGlobalData = unknown
> {
  /** Unique slug for the collection */
  slug: TSlug;
  
  /** Collection labels */
  labels?: {
    singular?: string;
    plural?: string;
  };
  
  /** Field definitions */
  fields: TFields;
  
  /** Access control */
  access?: CollectionAccess;
  
  /** Admin panel configuration */
  admin?: CollectionAdmin;
  
  /** Authentication configuration */
  auth?: boolean | CollectionAuth;
  
  /** Versioning configuration */
  versions?: boolean | CollectionVersions;
  
  /** Localization configuration */
  localization?: boolean | CollectionLocalization;
  
  /** Lifecycle hooks */
  hooks?: CollectionHooks;
  
  /** Custom API endpoints */
  endpoints?: CollectionEndpoint[];
  
  /** Custom data (extension point) */
  custom?: Record<string, unknown>;
  
  /** Indexes */
  indexes?: CollectionIndex[];
  
  /** GraphQL configuration */
  graphQL?: {
    singularName?: string;
    pluralName?: string;
  } | false;
}

export interface CollectionIndex {
  fields: string[];
  unique?: boolean;
  name?: string;
}

// ============================================================================
// SANITIZED COLLECTION CONFIG
// ============================================================================

/**
 * Runtime representation of a collection
 */
export interface SanitizedCollectionConfig {
  slug: CollectionSlug;
  fields: Field[];
  access: CollectionAccess;
  admin: CollectionAdmin;
  auth: CollectionAuth | false;
  versions: CollectionVersions | false;
  localization: CollectionLocalization | false;
  hooks: CollectionHooks;
  endpoints: CollectionEndpoint[];
  custom: Record<string, unknown>;
  indexes: CollectionIndex[];
}

// ============================================================================
// COLLECTION REGISTRY
// ============================================================================

/**
 * Registry of all collections in the system
 */
export interface CollectionRegistry {
  [slug: string]: CollectionConfig;
}

/**
 * Get all slugs from a registry
 */
export type CollectionSlugs<T extends CollectionRegistry> = keyof T & CollectionSlug;

// ============================================================================
// TYPE HELPERS
// ============================================================================

/** Extract document type from collection config */
export type CollectionDoc<T extends CollectionConfig> = T extends CollectionConfig<any, infer Fields> 
  ? FieldsToDoc<Fields>
  : never;

/** Convert fields array to document type */
type FieldsToDoc<Fields extends Field[]> = {
  [K in Fields[number] as K['name'] & string]: K extends { fields: infer F } 
    ? F extends Field[] 
      ? K['name'] extends 'array'
        ? FieldsToDoc<F>[]
        : K['name'] extends 'group'
          ? FieldsToDoc<F>
          : unknown
    : unknown
    : K extends BaseField 
      ? K['default'] extends infer Default 
        ? Default 
        : string 
      : never
} & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

/** Extract field by name */
export type FieldByName<Fields extends Field[], Name extends string> = 
  Fields[number] extends { name: Name } ? Fields[number] : never;

/** Check if collection has auth enabled */
export type CollectionHasAuth<T extends CollectionConfig> = 
  T['auth'] extends boolean ? T['auth'] : never;

/** Check if collection has versioning enabled */
export type CollectionHasVersions<T extends CollectionConfig> = 
  T['versions'] extends boolean ? T['versions'] : never;

/** Check if collection has localization enabled */
export type CollectionHasLocalization<T extends CollectionConfig> = 
  T['localization'] extends boolean ? T['localization'] : never;

// ============================================================================
// EXAMPLE USAGE
// ============================================================================

/*
// Example: Defining a Product collection
export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'inStock', 'featured'],
  },
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
    {
      name: 'inStock',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
  versions: {
    enabled: true,
    maxPerDoc: 10,
  },
  localization: {
    enabled: true,
    defaultLocale: 'en',
    locales: ['en', 'fr', 'de'],
  },
};
*/
