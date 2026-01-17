import type { ContentType as PrismaContentType } from '@prisma/client';
import {
  ContentTypeId,
  Locale,
  type ContentTypeSchema,
  type FieldDefinition,
  type LocalizationPolicy,
  type SEOPolicy,
} from '@cms/kernel';

/**
 * Maps between Prisma ContentType and kernel ContentTypeSchema.
 */
export class SchemaMapper {
  /**
   * Prisma model → Kernel domain object.
   */
  toDomain(prisma: PrismaContentType): ContentTypeSchema {
    return {
      id: ContentTypeId(prisma.id),
      name: prisma.name,
      displayName: prisma.displayName,
      description: prisma.description ?? undefined,
      version: prisma.version,
      fields: prisma.schema as unknown as FieldDefinition[],
      localization: this.mapLocalization(prisma.localization),
      seo: prisma.seo as unknown as SEOPolicy,
      createdAt: prisma.createdAt,
      updatedAt: prisma.updatedAt,
    };
  }

  /**
   * Kernel domain object → Prisma create input.
   */
  toCreateInput(domain: ContentTypeSchema): {
    id: string;
    name: string;
    displayName: string;
    description?: string;
    version: number;
    schema: object;
    localization: object;
    seo: object;
  } {
    return {
      id: domain.id,
      name: domain.name,
      displayName: domain.displayName,
      description: domain.description,
      version: domain.version,
      schema: domain.fields as object,
      localization: this.serializeLocalization(domain.localization),
      seo: domain.seo as object,
    };
  }

  /**
   * Kernel domain object → Prisma update input.
   */
  toUpdateInput(domain: Partial<ContentTypeSchema>): {
    name?: string;
    displayName?: string;
    description?: string;
    version?: number;
    schema?: object;
    localization?: object;
    seo?: object;
  } {
    const input: ReturnType<typeof this.toUpdateInput> = {};

    if (domain.name !== undefined) input.name = domain.name;
    if (domain.displayName !== undefined) input.displayName = domain.displayName;
    if (domain.description !== undefined) input.description = domain.description;
    if (domain.version !== undefined) input.version = domain.version;
    if (domain.fields !== undefined) input.schema = domain.fields as object;
    if (domain.localization !== undefined) input.localization = this.serializeLocalization(domain.localization);
    if (domain.seo !== undefined) input.seo = domain.seo as object;

    return input;
  }

  private mapLocalization(json: unknown): LocalizationPolicy {
    const data = json as {
      enabled?: boolean;
      requiredLocales?: string[];
      optionalLocales?: string[];
    };

    return {
      enabled: data.enabled ?? false,
      requiredLocales: (data.requiredLocales ?? ['en']).map(Locale),
      optionalLocales: (data.optionalLocales ?? []).map(Locale),
    };
  }

  private serializeLocalization(policy: LocalizationPolicy): object {
    return {
      enabled: policy.enabled,
      requiredLocales: policy.requiredLocales,
      optionalLocales: policy.optionalLocales,
    };
  }
}

export const schemaMapper = new SchemaMapper();
