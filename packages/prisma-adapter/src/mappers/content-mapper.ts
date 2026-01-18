import type { ContentEntry as PrismaEntry } from '../../prisma-client/index.js';
import {
  ContentEntryId,
  ContentTypeId,
  PrincipalId,
  Locale,
  type ContentEntry,
} from '@cms/kernel';

/**
 * Maps between Prisma ContentEntry and kernel ContentEntry.
 */
export class ContentMapper {
  /**
   * Prisma model → Kernel domain object.
   */
  toDomain(prisma: PrismaEntry): ContentEntry {
    return {
      id: ContentEntryId(prisma.id),
      typeId: ContentTypeId(prisma.typeId),
      defaultLocale: Locale(prisma.defaultLocale),
      createdAt: prisma.createdAt,
      createdBy: PrincipalId(prisma.createdBy),
      deletedAt: prisma.deletedAt ?? undefined,
    };
  }

  /**
   * Kernel domain object → Prisma create input.
   */
  toCreateInput(domain: ContentEntry): {
    id: string;
    typeId: string;
    defaultLocale: string;
    createdBy: string;
    createdAt?: Date;
    deletedAt?: Date | null;
  } {
    return {
      id: domain.id,
      typeId: domain.typeId,
      defaultLocale: domain.defaultLocale,
      createdBy: domain.createdBy,
      createdAt: domain.createdAt,
      deletedAt: domain.deletedAt ?? null,
    };
  }

  /**
   * Kernel domain object → Prisma update input.
   */
  toUpdateInput(domain: Partial<ContentEntry>): {
    defaultLocale?: string;
    deletedAt?: Date | null;
  } {
    const input: ReturnType<typeof this.toUpdateInput> = {};

    if (domain.defaultLocale !== undefined) input.defaultLocale = domain.defaultLocale;
    if (domain.deletedAt !== undefined) input.deletedAt = domain.deletedAt ?? null;

    return input;
  }
}

export const contentMapper = new ContentMapper();
