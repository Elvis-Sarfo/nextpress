import type { ContentTypeSchema, FieldDefinition } from '@cms/kernel';
import { contentTypeId } from '@cms/kernel';
import type { ContentType as PrismaContentType } from '@prisma/client';

/**
 * Map Prisma ContentType to domain ContentTypeSchema
 */
export function mapPrismaSchemaToMomain(
  prismaSchema: PrismaContentType
): ContentTypeSchema {
  return {
    id: contentTypeId(prismaSchema.id),
    name: prismaSchema.name,
    pluralName: prismaSchema.pluralName,
    description: prismaSchema.description ?? undefined,
    version: prismaSchema.version,
    fields: prismaSchema.schema as FieldDefinition[],
    singletonMode: prismaSchema.singletonMode,
    createdAt: prismaSchema.createdAt,
    updatedAt: prismaSchema.updatedAt,
  };
}

/**
 * Map domain ContentTypeSchema to Prisma create input
 */
export function mapDomainSchemaToPrismaCreate(schema: ContentTypeSchema): {
  id: string;
  name: string;
  pluralName: string;
  description: string | null;
  version: number;
  schema: unknown;
  singletonMode: boolean;
  createdAt: Date;
  updatedAt: Date;
} {
  return {
    id: schema.id,
    name: schema.name,
    pluralName: schema.pluralName,
    description: schema.description ?? null,
    version: schema.version,
    schema: schema.fields,
    singletonMode: schema.singletonMode ?? false,
    createdAt: schema.createdAt,
    updatedAt: schema.updatedAt,
  };
}

/**
 * Map domain ContentTypeSchema to Prisma update input
 */
export function mapDomainSchemaToPrismaUpdate(schema: ContentTypeSchema): {
  name: string;
  pluralName: string;
  description: string | null;
  version: number;
  schema: unknown;
  singletonMode: boolean;
  updatedAt: Date;
} {
  return {
    name: schema.name,
    pluralName: schema.pluralName,
    description: schema.description ?? null,
    version: schema.version,
    schema: schema.fields,
    singletonMode: schema.singletonMode ?? false,
    updatedAt: schema.updatedAt,
  };
}
