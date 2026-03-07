/**
 * Schema Engine: Converts CollectionConfig to Prisma Schema
 * 
 * Generates Prisma schema from NextPress collection definitions.
 * 
 * Output:
 * - Main table per collection
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
  /** Store localized fields as locale-keyed JSON on the main model */
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
  // Localized fields are stored as locale-keyed JSON on the main table.
  if (field.localized && options.localization !== false) {
    return {
      name: field.name,
      type: 'Json',
      isOptional: !field.required,
      isList: false,
      defaultValue: field.defaultValue !== undefined ? String(field.defaultValue) : undefined,
      attributes: [],
    };
  }

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
      // Upload fields become String foreign keys pointing to Media
      type = 'String';
      attributes.push(`@db.VarChar(255)`);
      break;

    case 'relationship':
      // Handled separately in generateMainModel — do not map here
      type = 'String';
      attributes.push(`@db.VarChar(100)`);
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
  
  // JSON-localized fields cannot use a DB-level unique constraint.
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
    if (field.type === 'upload') {
      // Upload: FK + @relation to Media (single reference)
      const foreignKeyField = mapFieldToPrisma(field, options);
      foreignKeyField.name = `${field.name}Id`;
      fields.push(foreignKeyField);

      const relation: PrismaRelation = {
        name: field.name,
        model: formatModelName((field as any).relationTo ?? 'media'),
        fields: [foreignKeyField.name],
        references: ['id'],
        onDelete: 'SetNull',
      };

      relationshipFields.push({
        name: field.name,
        type: formatModelName((field as any).relationTo ?? 'media'),
        isOptional: foreignKeyField.isOptional,
        isList: false,
        attributes: [],
        relation,
      });
    } else if (field.type === 'relationship') {
      const relField = field as any;
      const targetSlug = Array.isArray(relField.relationTo)
        ? relField.relationTo[0]
        : relField.relationTo;

      if (relField.hasMany === true) {
        // Many-to-many: implicit Prisma junction table (roles Roles[])
        relationshipFields.push({
          name: field.name,
          type: formatModelName(targetSlug),
          isOptional: false,
          isList: true,
          attributes: [],
        });
      } else {
        // Many-to-one: FK + @relation
        const foreignKeyField = mapFieldToPrisma(field, options);
        foreignKeyField.name = `${field.name}Id`;
        fields.push(foreignKeyField);

        const relation: PrismaRelation = {
          name: field.name,
          model: formatModelName(targetSlug),
          fields: [foreignKeyField.name],
          references: ['id'],
          onDelete: 'SetNull',
        };

        relationshipFields.push({
          name: field.name,
          type: formatModelName(targetSlug),
          isOptional: foreignKeyField.isOptional,
          isList: false,
          attributes: [],
          relation,
        });
      }
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
    
    // List fields are never nullable in Prisma — do not add '?'
    if (!field.isList && field.isOptional && !field.attributes.some(a => a.startsWith('@default'))) {
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
 * Inject implicit back-relation fields into target models.
 *
 * Prisma requires both sides of a relation to be declared. The schema engine
 * only generates the owning side (e.g. `featuredImage Media?` on Pages).
 * This pass scans all generated models for relation fields and adds the
 * corresponding list field on the referenced model (e.g. `pages Pages[]`).
 *
 * When a single source model has multiple relations to the same target, the
 * back-relation fields are disambiguated as `<sourceModel>_<fieldName>`.
 */
function injectBackRelations(models: PrismaModel[]): void {
  const modelMap = new Map<string, PrismaModel>();
  for (const model of models) {
    modelMap.set(model.name, model);
  }

  // targetModelName -> sourceModelName -> fieldNames[]
  const forward = new Map<string, Map<string, string[]>>();

  for (const model of models) {
    for (const field of model.fields) {
      // Explicit FK relation (@relation annotation)
      if (field.relation) {
        const target = field.relation.model;
        if (!forward.has(target)) forward.set(target, new Map());
        const bySource = forward.get(target)!;
        if (!bySource.has(model.name)) bySource.set(model.name, []);
        bySource.get(model.name)!.push(field.name);
      }
      // Implicit many-to-many: list field pointing to a known model
      else if (field.isList && modelMap.has(field.type)) {
        const target = field.type;
        if (!forward.has(target)) forward.set(target, new Map());
        const bySource = forward.get(target)!;
        if (!bySource.has(model.name)) bySource.set(model.name, []);
        bySource.get(model.name)!.push(field.name);
      }
    }
  }

  for (const [targetModelName, bySource] of forward) {
    const targetModel = modelMap.get(targetModelName);
    if (!targetModel) continue;

    for (const [sourceModelName, fieldNames] of bySource) {
      const needsDisambiguation = fieldNames.length > 1;
      const sourceBase = sourceModelName.charAt(0).toLowerCase() + sourceModelName.slice(1);

      for (const fieldName of fieldNames) {
        const backFieldName = needsDisambiguation
          ? `${sourceBase}_${fieldName}`
          : sourceBase;

        // Skip if a field with this name already exists
        if (targetModel.fields.some(f => f.name === backFieldName)) continue;

        targetModel.fields.push({
          name: backFieldName,
          type: sourceModelName,
          isOptional: false,
          isList: true,
          attributes: [],
        });
      }
    }
  }
}

/**
 * Generate Prisma schema from collection configurations
 */
export function generatePrismaSchema(
  collections: CollectionConfig[],
  options: SchemaEngineOptions = {}
): string {
  const provider = options.provider || 'postgresql';

  // Phase 1: build all models
  const allModels: PrismaModel[] = [];

  for (const collection of collections) {
    allModels.push(generateMainModel(collection, options));

    if (options.versioning !== false) {
      const versionModel = generateVersionModel(collection, options);
      if (versionModel) allModels.push(versionModel);
    }
  }

  // Phase 2: inject back-relations so every relation has both sides
  injectBackRelations(allModels);

  // Phase 3: render to string
  let schema = `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "${provider}"
}

`;

  for (const model of allModels) {
    schema += generateModelString(model);
    schema += '\n';
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
