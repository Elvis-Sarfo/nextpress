import type { PrismaClient } from '@prisma/client';
import type { ContentTypeId, ContentTypeSchema, SchemaRepository } from '@cms/kernel';
import {
  mapPrismaSchemaToMomain,
  mapDomainSchemaToPrismaCreate,
  mapDomainSchemaToPrismaUpdate,
} from './mappers/schema-mapper.js';

/**
 * Prisma implementation of SchemaRepository
 */
export class PrismaSchemaRepository implements SchemaRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: ContentTypeId): Promise<ContentTypeSchema | null> {
    const schema = await this.prisma.contentType.findUnique({
      where: { id },
    });

    if (!schema) return null;

    return mapPrismaSchemaToMomain(schema);
  }

  async findByName(name: string): Promise<ContentTypeSchema | null> {
    const schema = await this.prisma.contentType.findUnique({
      where: { name },
    });

    if (!schema) return null;

    return mapPrismaSchemaToMomain(schema);
  }

  async findAll(): Promise<ContentTypeSchema[]> {
    const schemas = await this.prisma.contentType.findMany({
      orderBy: { name: 'asc' },
    });

    return schemas.map(mapPrismaSchemaToMomain);
  }

  async save(schema: ContentTypeSchema): Promise<ContentTypeSchema> {
    const existing = await this.prisma.contentType.findUnique({
      where: { id: schema.id },
    });

    if (existing) {
      // Update existing schema
      const updated = await this.prisma.contentType.update({
        where: { id: schema.id },
        data: mapDomainSchemaToPrismaUpdate(schema),
      });
      return mapPrismaSchemaToMomain(updated);
    }

    // Create new schema
    const created = await this.prisma.contentType.create({
      data: mapDomainSchemaToPrismaCreate(schema),
    });

    return mapPrismaSchemaToMomain(created);
  }

  async delete(id: ContentTypeId): Promise<void> {
    await this.prisma.contentType.delete({
      where: { id },
    });
  }
}
