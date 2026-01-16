import type { PrismaClient } from '@prisma/client';
import type {
  ContentId,
  VersionId,
  ContentVersion,
  ContentStatus,
  VersionRepository,
} from '@cms/kernel';
import {
  mapPrismaVersionToDomain,
  mapDomainVersionToPrismaCreate,
  mapDomainVersionToPrismaUpdate,
} from './mappers/content-mapper.js';

/**
 * Prisma implementation of VersionRepository
 */
export class PrismaVersionRepository implements VersionRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: VersionId): Promise<ContentVersion | null> {
    const version = await this.prisma.contentVersion.findUnique({
      where: { id },
    });

    if (!version) return null;

    return mapPrismaVersionToDomain(version);
  }

  async findByEntryId(entryId: ContentId): Promise<ContentVersion[]> {
    const versions = await this.prisma.contentVersion.findMany({
      where: { entryId },
      orderBy: { version: 'asc' },
    });

    return versions.map(mapPrismaVersionToDomain);
  }

  async findLatestByEntryId(entryId: ContentId): Promise<ContentVersion | null> {
    const version = await this.prisma.contentVersion.findFirst({
      where: { entryId },
      orderBy: { version: 'desc' },
    });

    if (!version) return null;

    return mapPrismaVersionToDomain(version);
  }

  async findPublishedByEntryId(entryId: ContentId): Promise<ContentVersion | null> {
    const version = await this.prisma.contentVersion.findFirst({
      where: { entryId, status: 'PUBLISHED' },
    });

    if (!version) return null;

    return mapPrismaVersionToDomain(version);
  }

  async findByStatus(status: ContentStatus): Promise<ContentVersion[]> {
    const versions = await this.prisma.contentVersion.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' },
    });

    return versions.map(mapPrismaVersionToDomain);
  }

  async findDueScheduled(before: Date): Promise<ContentVersion[]> {
    const versions = await this.prisma.contentVersion.findMany({
      where: {
        status: 'SCHEDULED',
        scheduledAt: {
          lte: before,
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });

    return versions.map(mapPrismaVersionToDomain);
  }

  async save(version: ContentVersion): Promise<ContentVersion> {
    const existing = await this.prisma.contentVersion.findUnique({
      where: { id: version.id },
    });

    if (existing) {
      // Update existing version
      const updated = await this.prisma.contentVersion.update({
        where: { id: version.id },
        data: mapDomainVersionToPrismaUpdate(version),
      });
      return mapPrismaVersionToDomain(updated);
    }

    // Create new version
    const created = await this.prisma.contentVersion.create({
      data: mapDomainVersionToPrismaCreate(version),
    });

    return mapPrismaVersionToDomain(created);
  }

  async getNextVersionNumber(entryId: ContentId): Promise<number> {
    const latest = await this.prisma.contentVersion.findFirst({
      where: { entryId },
      orderBy: { version: 'desc' },
      select: { version: true },
    });

    return (latest?.version ?? 0) + 1;
  }
}
