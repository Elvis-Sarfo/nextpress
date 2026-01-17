import type { PrismaClient } from '@prisma/client';
import {
  type ContentVersionId,
  type ContentEntryId,
  type ContentTypeId,
  type Locale,
  type ContentVersion,
  type VersionStatus,
  type ContentVersionRepository,
} from '@cms/kernel';
import { versionMapper } from '../mappers/version-mapper.js';

export class PrismaContentVersionRepository implements ContentVersionRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: ContentVersionId): Promise<ContentVersion | null> {
    const record = await this.prisma.contentVersion.findUnique({
      where: { id },
    });

    return record ? versionMapper.toDomain(record) : null;
  }

  async findByEntry(entryId: ContentEntryId): Promise<ContentVersion[]> {
    const records = await this.prisma.contentVersion.findMany({
      where: { entryId },
      orderBy: { version: 'desc' },
    });

    return records.map((r) => versionMapper.toDomain(r));
  }

  async findByEntryAndStatus(
    entryId: ContentEntryId,
    status: VersionStatus
  ): Promise<ContentVersion | null> {
    const record = await this.prisma.contentVersion.findFirst({
      where: { entryId, status },
      orderBy: { version: 'desc' },
    });

    return record ? versionMapper.toDomain(record) : null;
  }

  async findByEntryAndVersion(
    entryId: ContentEntryId,
    version: number
  ): Promise<ContentVersion | null> {
    const record = await this.prisma.contentVersion.findUnique({
      where: { entryId_version: { entryId, version } },
    });

    return record ? versionMapper.toDomain(record) : null;
  }

  async findLatestByEntry(entryId: ContentEntryId): Promise<ContentVersion | null> {
    const record = await this.prisma.contentVersion.findFirst({
      where: { entryId },
      orderBy: { version: 'desc' },
    });

    return record ? versionMapper.toDomain(record) : null;
  }

  async findScheduledBefore(date: Date): Promise<ContentVersion[]> {
    const records = await this.prisma.contentVersion.findMany({
      where: {
        status: 'SCHEDULED',
        scheduledAt: { lte: date },
      },
    });

    return records.map((r) => versionMapper.toDomain(r));
  }

  async findPublishedBySlug(
    typeId: ContentTypeId,
    locale: Locale,
    slug: string
  ): Promise<ContentVersion | null> {
    // Find all published versions for the given content type
    const records = await this.prisma.contentVersion.findMany({
      where: {
        status: 'PUBLISHED',
        entry: {
          typeId,
          deletedAt: null,
        },
      },
      include: {
        entry: true,
      },
    });

    // Filter by slug in JSON data
    for (const record of records) {
      const data = record.data as Record<string, unknown>;
      const locales = data?.locales as Record<string, Record<string, unknown>> | undefined;
      const localeData = locales?.[locale];
      if (localeData?.slug === slug) {
        return versionMapper.toDomain(record);
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
        data: versionMapper.toUpdateInput(version),
      });
    } else {
      await this.prisma.contentVersion.create({
        data: versionMapper.toCreateInput(version),
      });
    }
  }

  async delete(id: ContentVersionId): Promise<void> {
    await this.prisma.contentVersion.delete({
      where: { id },
    });
  }
}
