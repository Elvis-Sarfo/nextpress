import {
  Result, Ok, Err, DomainError, ContentTypeId, Locale
} from '../core/types';
import type {
  ContentTypeSchema, SchemaRepository, FieldDefinition
} from './types';
import { SchemaValidator } from './validator';

/**
 * Schema engine manages content type schemas.
 */
export class SchemaEngine {
  private validator = new SchemaValidator();

  constructor(private repository: SchemaRepository) {}

  async getSchema(id: ContentTypeId): Promise<Result<ContentTypeSchema>> {
    const schema = await this.repository.findById(id);
    if (!schema) {
      return Err(DomainError.notFound('ContentType', id));
    }
    return Ok(schema);
  }

  async getSchemaByName(name: string): Promise<Result<ContentTypeSchema>> {
    const schema = await this.repository.findByName(name);
    if (!schema) {
      return Err(DomainError.notFound('ContentType', name));
    }
    return Ok(schema);
  }

  async getAllSchemas(): Promise<ContentTypeSchema[]> {
    return this.repository.findAll();
  }

  async createSchema(schema: Omit<ContentTypeSchema, 'id' | 'createdAt' | 'updatedAt'>): Promise<Result<ContentTypeSchema>> {
    // Check if name already exists
    const existing = await this.repository.findByName(schema.name);
    if (existing) {
      return Err(DomainError.alreadyExists('ContentType', schema.name));
    }

    const now = new Date();
    const newSchema: ContentTypeSchema = {
      ...schema,
      id: ContentTypeId(crypto.randomUUID()),
      createdAt: now,
      updatedAt: now,
    };

    await this.repository.save(newSchema);
    return Ok(newSchema);
  }

  async updateSchema(
    id: ContentTypeId,
    updates: Partial<Omit<ContentTypeSchema, 'id' | 'createdAt'>>
  ): Promise<Result<ContentTypeSchema>> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      return Err(DomainError.notFound('ContentType', id));
    }

    const updated: ContentTypeSchema = {
      ...existing,
      ...updates,
      version: existing.version + 1,
      updatedAt: new Date(),
    };

    await this.repository.save(updated);
    return Ok(updated);
  }

  async deleteSchema(id: ContentTypeId): Promise<Result<void>> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      return Err(DomainError.notFound('ContentType', id));
    }

    await this.repository.delete(id);
    return Ok(undefined);
  }

  validateContent(
    data: Record<string, unknown>,
    schema: ContentTypeSchema,
    locale: Locale
  ): Result<void> {
    return this.validator.validateContent(data, schema, locale);
  }

  validateForPublish(
    data: Record<string, unknown>,
    schema: ContentTypeSchema,
    locale: Locale
  ): Result<void> {
    return this.validator.validateForPublish(data, schema, locale);
  }

  getField(schema: ContentTypeSchema, fieldName: string): FieldDefinition | undefined {
    return schema.fields.find(f => f.name === fieldName);
  }

  getLocalizableFields(schema: ContentTypeSchema): FieldDefinition[] {
    return schema.fields.filter(f => f.localizable);
  }

  getNonLocalizableFields(schema: ContentTypeSchema): FieldDefinition[] {
    return schema.fields.filter(f => !f.localizable);
  }
}
