import type { PrismaClient } from '@prisma/client';
import {
  type ContentTypeId,
  type ContentTypeSchema,
  type SchemaRepository,
} from '@cms/kernel';
import { schemaMapper } from '../mappers/schema-mapper.js';

export class PrismaSchemaRepository implements SchemaRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: ContentTypeId): Promise<ContentTypeSchema | null> {
    const record = await this.prisma.contentType.findUnique({
      where: { id },
    });

    return record ? schemaMapper.toDomain(record) : null;
  }

  async findByName(name: string): Promise<ContentTypeSchema | null> {
    const record = await this.prisma.contentType.findUnique({
      where: { name },
    });

    return record ? schemaMapper.toDomain(record) : null;
  }

  async findAll(): Promise<ContentTypeSchema[]> {
    const records = await this.prisma.contentType.findMany({
      orderBy: { name: 'asc' },
    });

    return records.map((r) => schemaMapper.toDomain(r));
  }

  async save(schema: ContentTypeSchema): Promise<void> {
    const existing = await this.prisma.contentType.findUnique({
      where: { id: schema.id },
    });

    if (existing) {
      await this.prisma.contentType.update({
        where: { id: schema.id },
        data: schemaMapper.toUpdateInput(schema),
      });
    } else {
      await this.prisma.contentType.create({
        data: schemaMapper.toCreateInput(schema),
      });
    }
  }

  async delete(id: ContentTypeId): Promise<void> {
    await this.prisma.contentType.delete({
      where: { id },
    });
  }
}
