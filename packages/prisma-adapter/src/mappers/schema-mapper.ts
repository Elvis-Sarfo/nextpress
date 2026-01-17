import type { ContentTypeSchema, FieldDefinition, LocalizationPolicy, SEOPolicy } from '@cms/kernel';
import { ContentTypeId, Locale } from '@cms/kernel';
import type { ContentType as PrismaContentType } from '@prisma/client';

// Extended Prisma schema type that includes optional fields stored in schema JSON
interface PrismaSchemaData {
  fields: FieldDefinition[];
  displayName?: string;
  localization?: LocalizationPolicy;
  seo?: SEOPolicy;
}

// Default localization policy
const defaultLocalizationPolicy: LocalizationPolicy = {
  enabled: false,
  requiredLocales: [Locale('en')],
  optionalLocales: [],
};

// Default SEO policy
const defaultSeoPolicy: SEOPolicy = {
  slugPolicy: {
    maxLength: 200,
    lowercase: true,
    reservedSlugs: [],
  },
  metaDescriptionPolicy: {
    required: false,
    minLength: 0,
    maxLength: 160,
  },
  canonicalPolicy: {
    strategy: 'self',
  },
};

/**
 * Map Prisma ContentType to domain ContentTypeSchema
 */
export function mapPrismaSchemaToDomain(
  prismaSchema: PrismaContentType
): ContentTypeSchema {
  const schemaData = prismaSchema.schema as unknown as PrismaSchemaData;

  return {
    id: ContentTypeId(prismaSchema.id),
    name: prismaSchema.name,
    displayName: schemaData.displayName ?? prismaSchema.name,
    description: prismaSchema.description ?? undefined,
    version: prismaSchema.version,
    fields: schemaData.fields ?? [],
    localization: schemaData.localization ?? defaultLocalizationPolicy,
    seo: schemaData.seo ?? defaultSeoPolicy,
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
  description: string | null;
  version: number;
  schema: object;
  createdAt: Date;
  updatedAt: Date;
} {
  return {
    id: schema.id,
    name: schema.name,
    description: schema.description ?? null,
    version: schema.version,
    schema: {
      fields: schema.fields,
      displayName: schema.displayName,
      localization: schema.localization,
      seo: schema.seo,
    } as object,
    createdAt: schema.createdAt,
    updatedAt: schema.updatedAt,
  };
}

/**
 * Map domain ContentTypeSchema to Prisma update input
 */
export function mapDomainSchemaToPrismaUpdate(schema: ContentTypeSchema): {
  name: string;
  description: string | null;
  version: number;
  schema: object;
  updatedAt: Date;
} {
  return {
    name: schema.name,
    description: schema.description ?? null,
    version: schema.version,
    schema: {
      fields: schema.fields,
      displayName: schema.displayName,
      localization: schema.localization,
      seo: schema.seo,
    } as object,
    updatedAt: schema.updatedAt,
  };
}
