import type { PrismaClient } from '@prisma/client';
import type {
  ContentEntryId,
  ContentTypeId,
  ContentEntry,
  ContentEntryRepository,
  ListOptions,
  ListResult,
  VersionData,
} from '@cms/kernel';
import {
  mapPrismaEntryToDomain,
  mapPrismaEntryWithVersionsToDomain,
  mapDomainEntryToPrismaCreate,
  ContentEntryWithVersions,
} from './mappers/content-mapper.js';

/**
 * Prisma implementation of ContentEntryRepository
 */
export class PrismaContentEntryRepository implements ContentEntryRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: ContentEntryId): Promise<ContentEntry | null> {
    const entry = await this.prisma.contentEntry.findUnique({
      where: { id },
    });

    if (!entry) return null;

    return mapPrismaEntryToDomain(entry);
  }

  async findByIdWithVersions(id: ContentEntryId): Promise<ContentEntryWithVersions | null> {
    const entry = await this.prisma.contentEntry.findUnique({
      where: { id },
      include: {
        versions: {
          orderBy: { version: 'desc' },
        },
      },
    });

    if (!entry) return null;

    return mapPrismaEntryWithVersionsToDomain(entry);
  }

  async findByType(typeId: ContentTypeId, options?: ListOptions): Promise<ContentEntry[]> {
    const limit = options?.limit ?? 20;
    const offset = options?.offset ?? 0;

    const where: Record<string, unknown> = { typeId };

    if (options?.createdBy) {
      where.createdBy = options.createdBy;
    }

    if (options?.status) {
      where.versions = {
        some: {
          status: options.status,
        },
      };
    }

    const entries = await this.prisma.contentEntry.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: { [options?.orderBy ?? 'createdAt']: options?.orderDirection ?? 'desc' },
    });

    return entries.map(mapPrismaEntryToDomain);
  }

  async countByType(typeId: ContentTypeId): Promise<number> {
    return this.prisma.contentEntry.count({
      where: { typeId },
    });
  }

  async findBySlug(
    typeId: ContentTypeId,
    slug: string,
    locale: string
  ): Promise<ContentEntry | null> {
    const entries = await this.prisma.contentEntry.findMany({
      where: {
        typeId,
        versions: {
          some: {
            status: 'PUBLISHED',
          },
        },
      },
      include: {
        versions: {
          where: { status: 'PUBLISHED' },
          take: 1,
        },
      },
    });

    for (const entry of entries) {
      const version = entry.versions[0];
      if (!version) continue;

      const versionData = version.data as unknown as VersionData;
      const localeData = versionData.locales?.[locale];
      if (localeData && (localeData as Record<string, unknown>).slug === slug) {
        return mapPrismaEntryToDomain(entry);
      }
    }

    return null;
  }

  async save(entry: ContentEntry): Promise<void> {
    const data = mapDomainEntryToPrismaCreate(entry);

    await this.prisma.contentEntry.upsert({
      where: { id: entry.id },
      create: data,
      update: {
        defaultLocale: data.defaultLocale,
      },
    });
  }

  async delete(id: ContentEntryId): Promise<void> {
    await this.prisma.contentEntry.delete({
      where: { id },
    });
  }

  async isSlugAvailable(
    typeId: ContentTypeId,
    slug: string,
    locale: string,
    excludeId?: ContentEntryId
  ): Promise<boolean> {
    const entries = await this.prisma.contentEntry.findMany({
      where: {
        typeId,
        ...(excludeId && { NOT: { id: excludeId } }),
      },
      include: {
        versions: {
          where: {
            status: { in: ['DRAFT', 'PUBLISHED', 'SCHEDULED'] },
          },
          orderBy: { version: 'desc' },
          take: 1,
        },
      },
    });

    for (const entry of entries) {
      const version = entry.versions[0];
      if (!version) continue;

      const versionData = version.data as unknown as VersionData;
      const localeData = versionData.locales?.[locale];
      if (localeData && (localeData as Record<string, unknown>).slug === slug) {
        return false;
      }
    }

    return true;
  }

  async list(options?: ListOptions): Promise<ListResult<ContentEntry>> {
    const limit = options?.limit ?? 20;
    const offset = options?.offset ?? 0;

    const where: Record<string, unknown> = {};

    if (options?.createdBy) {
      where.createdBy = options.createdBy;
    }

    if (options?.status) {
      where.versions = {
        some: {
          status: options.status,
        },
      };
    }

    const [entries, total] = await Promise.all([
      this.prisma.contentEntry.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { [options?.orderBy ?? 'createdAt']: options?.orderDirection ?? 'desc' },
      }),
      this.prisma.contentEntry.count({ where }),
    ]);

    return {
      items: entries.map(mapPrismaEntryToDomain),
      total,
      limit,
      offset,
    };
  }
}
