/**
 * Schema Engine: Converts CollectionConfig to Prisma Schema
 * 
 * Generates Prisma schema from NextPress collection definitions.
 * 
 * Output:
 * - Main table per collection
 * - Locale table per collection (if localization enabled)
 * - Version table per collection (if versioning enabled)
 */

import type { 
  CollectionConfig, 
  Field 
} from '../collection/types';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface PrismaField {
  name: string;
  type: string;
  isOptional: boolean;
  isList: boolean;
  defaultValue?: string;
  attributes: string[];
  relation?: PrismaRelation;
}

export interface PrismaRelation {
  name: string;
  model: string;
  fields: string[];
  references: string[];
  onDelete?: 'Cascade' | 'SetNull' | 'Restrict';
}

export interface PrismaModel {
  name: string;
  fields: PrismaField[];
  indexes: string[];
  uniqueConstraints: string[];
  map: string;
}

export interface SchemaEngineOptions {
  /** Provider: postgresql, mysql, sqlite */
  provider?: 'postgresql' | 'mysql' | 'sqlite';
  /** Enable localization tables */
  localization?: boolean;
  /** Enable version tables */
  versioning?: boolean;
  /** Custom table prefix */
  tablePrefix?: string;
}

// ============================================================================
// FIELD TYPE MAPPING
// ============================================================================

function mapFieldToPrisma(field: Field, options: SchemaEngineOptions): PrismaField {
  const isOptional = !field.required;
  
  let type: string;
  let attributes: string[] = [];
  
  switch (field.type) {
    case 'text':
    case 'textarea':
    case 'email':
      type = 'String';
      if (field.type === 'textarea') {
        attributes.push('@db.Text');
      } else {
        const maxLength = (field as any).maxLength || 255;
        attributes.push(`@db.VarChar(${maxLength})`);
      }
      break;
      
    case 'number':
      type = 'Int';
      break;
      
    case 'checkbox':
      type = 'Boolean';
      break;
      
    case 'date':
      type = 'DateTime';
      break;
      
    case 'json':
      type = 'Json';
      break;
      
    case 'select':
      type = 'String';
      const selectMaxLength = (field as any).maxLength || 100;
      attributes.push(`@db.VarChar(${selectMaxLength})`);
      break;
      
    case 'upload':
    case 'relationship':
      // These become String foreign keys
      type = 'String';
      const maxLen = field.type === 'upload' ? 255 : 100;
      attributes.push(`@db.VarChar(${maxLen})`);
      break;
      
    case 'array':
    case 'group':
    case 'richText':
      // Complex types stored as JSON
      type = 'Json';
      break;
      
    default:
      type = 'String';
  }
  
  // Handle default values
  if (field.defaultValue !== undefined) {
    if (type === 'Boolean') {
      attributes.push(`@default(${field.defaultValue})`);
    } else if (type === 'Int') {
      attributes.push(`@default(${field.defaultValue})`);
    } else if (type === 'String' && typeof field.defaultValue === 'string') {
      attributes.push(`@default("${field.defaultValue}")`);
    }
  }
  
  // Handle unique constraint
  if (field.unique) {
    attributes.push('@unique');
  }
  
  return {
    name: field.name,
    type,
    isOptional,
    isList: false,
    defaultValue: field.defaultValue !== undefined ? String(field.defaultValue) : undefined,
    attributes,
  };
}

// ============================================================================
// HELPERS
// ============================================================================

/** Check if versioning is enabled for a collection */
function isVersioningEnabled(config: CollectionConfig): boolean {
  if (!config.versions) return false;
  if (typeof config.versions === 'boolean') return config.versions;
  return !!config.versions.enabled;
}

function formatModelName(slug: string): string {
  return slug
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function formatTableName(slug: string, prefix?: string): string {
  const tableName = slug.replace(/-/g, '_');
  return prefix ? `${prefix}_${tableName}` : tableName;
}

// ============================================================================
// MAIN MODEL GENERATOR
// ============================================================================

function generateMainModel(config: CollectionConfig, options: SchemaEngineOptions): PrismaModel {
  const fields: PrismaField[] = [];
  const indexes: string[] = [];
  const collectionFieldNames = new Set(config.fields.map(f => f.name));
  
  // ID field
  fields.push({
    name: 'id',
    type: 'String',
    isOptional: false,
    isList: false,
    attributes: ['@id', '@default(uuid())'],
  });
  
  // Document ID for versioning
  if (options.versioning !== false && isVersioningEnabled(config)) {
    fields.push({
      name: 'documentId',
      type: 'String',
      isOptional: false,
      isList: false,
      attributes: [],
    });
  }
  
  // Status field (skip if collection defines its own status field)
  if (!collectionFieldNames.has('status')) {
    fields.push({
      name: 'status',
      type: 'String',
      isOptional: false,
      isList: false,
      attributes: ['@db.VarChar(20)'],
    });
  }
  
  // Process collection fields
  const relationshipFields: PrismaField[] = [];
  
  for (const field of config.fields) {
    if (field.type === 'relationship' || field.type === 'upload') {
      // Handle relationships separately
      const targetCollection = field.type === 'upload' 
        ? 'media' 
        : (field as any).relationTo;

      // Foreign key field (e.g., featuredImageId)
      const foreignKeyField = mapFieldToPrisma(field, options);
      foreignKeyField.name = `${field.name}Id`;
      fields.push(foreignKeyField);

      // Relation field (e.g., featuredImage)
      const relation: PrismaRelation = {
        name: field.name,
        model: formatModelName(targetCollection),
        fields: [foreignKeyField.name],
        references: ['id'],
        onDelete: 'SetNull',
      };

      const relationField: PrismaField = {
        name: field.name,
        type: formatModelName(targetCollection),
        isOptional: foreignKeyField.isOptional,
        isList: false,
        attributes: [],
        relation,
      };

      relationshipFields.push(relationField);
    } else {
      fields.push(mapFieldToPrisma(field, options));
    }
  }
  
  // Add relationship fields
  fields.push(...relationshipFields);
  
  // Add metadata field (skip if collection defines its own metadata field)
  if (!collectionFieldNames.has('metadata')) {
    fields.push({
      name: 'metadata',
      type: 'Json',
      isOptional: true,
      isList: false,
      attributes: [],
    });
  }
  
  // Add timestamps
  fields.push({
    name: 'createdAt',
    type: 'DateTime',
    isOptional: false,
    isList: false,
    attributes: ['@default(now())'],
  });
  
  fields.push({
    name: 'updatedAt',
    type: 'DateTime',
    isOptional: false,
    isList: false,
    attributes: ['@updatedAt'],
  });
  
  fields.push({
    name: 'createdBy',
    type: 'String',
    isOptional: true,
    isList: false,
    attributes: ['@db.VarChar(255)'],
  });
  
  // Add indexes
  indexes.push('@@index([status])');
  if (options.versioning !== false && isVersioningEnabled(config)) {
    indexes.push('@@unique([documentId, status])');
    indexes.push('@@index([documentId])');
  }
  
  return {
    name: formatModelName(config.slug),
    fields,
    indexes,
    uniqueConstraints: [],
    map: formatTableName(config.slug, options.tablePrefix),
  };
}

// ============================================================================
// LOCALE MODEL GENERATOR
// ============================================================================

function generateLocaleModel(config: CollectionConfig, options: SchemaEngineOptions): PrismaModel | null {
  // Check if any fields are localized
  const localizedFields = config.fields.filter(f => f.localized);
  if (localizedFields.length === 0) {
    return null;
  }
  
  const fields: PrismaField[] = [];
  const indexes: string[] = [];
  
  const modelName = formatModelName(config.slug) + 'Locale';
  const tableName = formatTableName(config.slug, options.tablePrefix) + '_locale';
  
  // ID
  fields.push({
    name: 'id',
    type: 'String',
    isOptional: false,
    isList: false,
    attributes: ['@id', '@default(uuid())'],
  });
  
  // Parent ID
  const parentIdName = formatModelName(config.slug).charAt(0).toLowerCase() + formatModelName(config.slug).slice(1) + 'Id';
  fields.push({
    name: parentIdName,
    type: 'String',
    isOptional: false,
    isList: false,
    attributes: [],
  });
  
  // Locale code
  fields.push({
    name: 'locale',
    type: 'String',
    isOptional: false,
    isList: false,
    attributes: ['@db.VarChar(10)'],
  });
  
  // Add localized fields
  for (const field of localizedFields) {
    const prismaField = mapFieldToPrisma(field, options);
    // Make all localized fields optional in locale table
    prismaField.isOptional = true;
    fields.push(prismaField);
  }
  
  // Relation back to main model
  fields.push({
    name: formatModelName(config.slug),
    type: formatModelName(config.slug),
    isOptional: false,
    isList: false,
    attributes: [],
    relation: {
      name: formatModelName(config.slug),
      model: formatModelName(config.slug),
      fields: [parentIdName],
      references: ['id'],
      onDelete: 'Cascade',
    },
  });
  
  // Indexes
  indexes.push(`@@unique([${parentIdName}, locale])`);
  
  // Check for slug field and add unique constraint
  const slugField = localizedFields.find(f => f.name === 'slug');
  if (slugField) {
    indexes.push('@@unique([locale, slug])');
  }
  
  indexes.push('@@index([locale])');
  
  return {
    name: modelName,
    fields,
    indexes,
    uniqueConstraints: [],
    map: tableName,
  };
}

// ============================================================================
// VERSION MODEL GENERATOR
// ============================================================================

function generateVersionModel(config: CollectionConfig, options: SchemaEngineOptions): PrismaModel | null {
  if (options.versioning === false || !isVersioningEnabled(config)) {
    return null;
  }
  
  const fields: PrismaField[] = [];
  const indexes: string[] = [];
  
  const modelName = formatModelName(config.slug) + 'Version';
  const tableName = formatTableName(config.slug, options.tablePrefix) + '_version';
  
  // ID
  fields.push({
    name: 'id',
    type: 'String',
    isOptional: false,
    isList: false,
    attributes: ['@id', '@default(uuid())'],
  });
  
  // Document ID
  fields.push({
    name: 'documentId',
    type: 'String',
    isOptional: false,
    isList: false,
    attributes: [],
  });
  
  // Version number
  fields.push({
    name: 'version',
    type: 'Int',
    isOptional: false,
    isList: false,
    attributes: [],
  });
  
  // Data snapshot
  fields.push({
    name: 'data',
    type: 'Json',
    isOptional: false,
    isList: false,
    attributes: [],
  });
  
  // Timestamps
  fields.push({
    name: 'createdAt',
    type: 'DateTime',
    isOptional: false,
    isList: false,
    attributes: ['@default(now())'],
  });
  
  fields.push({
    name: 'createdBy',
    type: 'String',
    isOptional: false,
    isList: false,
    attributes: ['@db.VarChar(255)'],
  });
  
  // Indexes
  indexes.push('@@unique([documentId, version])');
  indexes.push('@@index([documentId])');
  
  return {
    name: modelName,
    fields,
    indexes,
    uniqueConstraints: [],
    map: tableName,
  };
}

// ============================================================================
// MODEL TO STRING
// ============================================================================

function generateModelString(model: PrismaModel): string {
  let output = `model ${model.name} {\n`;
  
  for (const field of model.fields) {
    let fieldLine = `  ${field.name} ${field.type}`;
    
    if (field.isOptional && !field.attributes.some(a => a.startsWith('@default'))) {
      fieldLine += '?';
    }
    
    if (field.isList) {
      fieldLine += '[]';
    }
    
    // Add attributes
    for (const attr of field.attributes) {
      fieldLine += ` ${attr}`;
    }
    
    // Add relation
    if (field.relation) {
      fieldLine += ` @relation(`;
      fieldLine += `fields: [${field.relation.fields.join(', ')}], `;
      fieldLine += `references: [${field.relation.references.join(', ')}]`;
      if (field.relation.onDelete) {
        fieldLine += `, onDelete: ${field.relation.onDelete}`;
      }
      fieldLine += ')';
    }
    
    output += fieldLine + '\n';
  }
  
  // Add indexes
  for (const index of model.indexes) {
    output += `  ${index}\n`;
  }
  
  // Add map
  output += `  @@map("${model.map}")\n`;
  
  output += '}\n';
  
  return output;
}

// ============================================================================
// MAIN EXPORTS
// ============================================================================

/**
 * Generate Prisma schema from collection configurations
 */
export function generatePrismaSchema(
  collections: CollectionConfig[],
  options: SchemaEngineOptions = {}
): string {
  const provider = options.provider || 'postgresql';
  
  let schema = `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "${provider}"
}

`;
  
  for (const collection of collections) {
    // Generate main model
    const mainModel = generateMainModel(collection, options);
    schema += generateModelString(mainModel);
    schema += '\n';
    
    // Generate locale model
    if (options.localization !== false) {
      const localeModel = generateLocaleModel(collection, options);
      if (localeModel) {
        schema += generateModelString(localeModel);
        schema += '\n';
      }
    }
    
    // Generate version model
    if (options.versioning !== false) {
      const versionModel = generateVersionModel(collection, options);
      if (versionModel) {
        schema += generateModelString(versionModel);
        schema += '\n';
      }
    }
  }
  
  return schema;
}

/**
 * Generate a single model's Prisma schema
 */
export function generateModelSchema(config: CollectionConfig, options: SchemaEngineOptions = {}): string {
  let schema = '';
  
  // Main model
  const mainModel = generateMainModel(config, options);
  schema += generateModelString(mainModel);
  schema += '\n';
  
  // Locale model
  if (options.localization !== false) {
    const localeModel = generateLocaleModel(config, options);
    if (localeModel) {
      schema += generateModelString(localeModel);
      schema += '\n';
    }
  }
  
  // Version model
  if (options.versioning !== false) {
    const versionModel = generateVersionModel(config, options);
    if (versionModel) {
      schema += generateModelString(versionModel);
      schema += '\n';
    }
  }
  
  return schema;
}
