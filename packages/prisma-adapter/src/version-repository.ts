import type { PrismaClient } from '@prisma/client';
import type {
  ContentEntryId,
  ContentVersionId,
  ContentTypeId,
  ContentVersion,
  VersionStatus,
  ContentVersionRepository,
  Locale,
} from '@cms/kernel';
import {
  mapPrismaVersionToDomain,
  mapDomainVersionToPrismaCreate,
  mapDomainVersionToPrismaUpdate,
} from './mappers/content-mapper.js';

/**
 * Prisma implementation of ContentVersionRepository
 */
export class PrismaContentVersionRepository implements ContentVersionRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: ContentVersionId): Promise<ContentVersion | null> {
    const version = await this.prisma.contentVersion.findUnique({
      where: { id },
    });

    if (!version) return null;

    return mapPrismaVersionToDomain(version);
  }

  async findByEntry(entryId: ContentEntryId): Promise<ContentVersion[]> {
    const versions = await this.prisma.contentVersion.findMany({
      where: { entryId },
      orderBy: { version: 'asc' },
    });

    return versions.map(mapPrismaVersionToDomain);
  }

  async findByEntryAndStatus(
    entryId: ContentEntryId,
    status: VersionStatus
  ): Promise<ContentVersion | null> {
    const version = await this.prisma.contentVersion.findFirst({
      where: { entryId, status },
      orderBy: { version: 'desc' },
    });

    if (!version) return null;

    return mapPrismaVersionToDomain(version);
  }

  async findByEntryAndVersion(
    entryId: ContentEntryId,
    versionNumber: number
  ): Promise<ContentVersion | null> {
    const version = await this.prisma.contentVersion.findFirst({
      where: { entryId, version: versionNumber },
    });

    if (!version) return null;

    return mapPrismaVersionToDomain(version);
  }

  async findLatestByEntry(entryId: ContentEntryId): Promise<ContentVersion | null> {
    const version = await this.prisma.contentVersion.findFirst({
      where: { entryId },
      orderBy: { version: 'desc' },
    });

    if (!version) return null;

    return mapPrismaVersionToDomain(version);
  }

  async findScheduledBefore(date: Date): Promise<ContentVersion[]> {
    const versions = await this.prisma.contentVersion.findMany({
      where: {
        status: 'SCHEDULED',
        scheduledAt: {
          lte: date,
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });

    return versions.map(mapPrismaVersionToDomain);
  }

  async findPublishedBySlug(
    typeId: ContentTypeId,
    locale: Locale,
    slug: string
  ): Promise<ContentVersion | null> {
    // Find all published versions and filter by slug in data
    const versions = await this.prisma.contentVersion.findMany({
      where: {
        status: 'PUBLISHED',
        entry: {
          typeId,
        },
      },
      include: {
        entry: true,
      },
    });

    for (const version of versions) {
      const data = version.data as Record<string, unknown>;
      const locales = data?.locales as Record<string, Record<string, unknown>> | undefined;
      const localeData = locales?.[locale];
      if (localeData?.slug === slug) {
        return mapPrismaVersionToDomain(version);
      }
    }

    return null;
  }

  async save(version: ContentVersion): Promise<void> {
    const existing = await this.prisma.contentVersion.findUnique({
      where: { id: version.id },
    });

    if (existing) {
      await this.prisma.contentVersion.update({
        where: { id: version.id },
        data: mapDomainVersionToPrismaUpdate(version),
      });
    } else {
      await this.prisma.contentVersion.create({
        data: mapDomainVersionToPrismaCreate(version),
      });
    }
  }

  async delete(id: ContentVersionId): Promise<void> {
    await this.prisma.contentVersion.delete({
      where: { id },
    });
  }

  async getNextVersionNumber(entryId: ContentEntryId): Promise<number> {
    const latest = await this.prisma.contentVersion.findFirst({
      where: { entryId },
      orderBy: { version: 'desc' },
      select: { version: true },
    });

    return (latest?.version ?? 0) + 1;
  }
}
