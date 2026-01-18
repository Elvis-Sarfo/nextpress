import type { ContentVersion as PrismaVersion } from '../../prisma-client/index.js';

import {
  ContentVersionId,
  ContentEntryId,
  PrincipalId,
  type ContentVersion,
  type VersionStatus,
  type VersionData,
} from '@cms/kernel';

/**
 * Maps between Prisma ContentVersion and kernel ContentVersion.
 */
export class VersionMapper {
  /**
   * Prisma model → Kernel domain object.
   */
  toDomain(prisma: PrismaVersion): ContentVersion {
    return {
      id: ContentVersionId(prisma.id),
      entryId: ContentEntryId(prisma.entryId),
      version: prisma.version,
      status: prisma.status as VersionStatus,
      data: prisma.data as unknown as VersionData,
      createdAt: prisma.createdAt,
      createdBy: PrincipalId(prisma.createdBy),
      publishedAt: prisma.publishedAt ?? undefined,
      scheduledAt: prisma.scheduledAt ?? undefined,
    };
  }

  /**
   * Kernel domain object → Prisma create input.
   */
  toCreateInput(domain: ContentVersion): {
    id: string;
    entryId: string;
    version: number;
    status: string;
    data: object;
    createdBy: string;
    createdAt?: Date;
    publishedAt?: Date | null;
    scheduledAt?: Date | null;
  } {
    return {
      id: domain.id,
      entryId: domain.entryId,
      version: domain.version,
      status: domain.status,
      data: domain.data as object,
      createdBy: domain.createdBy,
      createdAt: domain.createdAt,
      publishedAt: domain.publishedAt ?? null,
      scheduledAt: domain.scheduledAt ?? null,
    };
  }

  /**
   * Kernel domain object → Prisma update input.
   */
  toUpdateInput(domain: Partial<ContentVersion>): {
    status?: string;
    data?: object;
    publishedAt?: Date | null;
    scheduledAt?: Date | null;
  } {
    const input: ReturnType<typeof this.toUpdateInput> = {};

    if (domain.status !== undefined) input.status = domain.status;
    if (domain.data !== undefined) input.data = domain.data as object;
    if (domain.publishedAt !== undefined) input.publishedAt = domain.publishedAt ?? null;
    if (domain.scheduledAt !== undefined) input.scheduledAt = domain.scheduledAt ?? null;

    return input;
  }
}

export const versionMapper = new VersionMapper();
