import type { PrismaClient } from '@prisma/client';
import type {
  ContentId,
  ContentTypeId,
  PaginatedResult,
  ContentEntry,
  ContentWithVersions,
  ContentQueryOptions,
  ContentRepository,
  VersionData,
} from '@cms/kernel';
import { paginate } from '@cms/kernel';
import {
  mapPrismaEntryToDomain,
  mapPrismaEntryWithVersionsToDomain,
  mapDomainEntryToPrismaCreate,
} from './mappers/content-mapper.js';

/**
 * Prisma implementation of ContentRepository
 */
export class PrismaContentRepository implements ContentRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: ContentId): Promise<ContentEntry | null> {
    const entry = await this.prisma.contentEntry.findUnique({
      where: { id },
      include: {
        versions: {
          orderBy: { version: 'desc' },
          take: 1,
        },
      },
    });

    if (!entry) return null;

    const publishedVersion = await this.prisma.contentVersion.findFirst({
      where: { entryId: id, status: 'PUBLISHED' },
    });

    return mapPrismaEntryToDomain(
      entry,
      entry.versions[0],
      publishedVersion
    );
  }

  async findByIdWithVersions(id: ContentId): Promise<ContentWithVersions | null> {
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

  async findByType(
    typeId: ContentTypeId,
    options?: ContentQueryOptions
  ): Promise<PaginatedResult<ContentEntry>> {
    const page = options?.page ?? 1;
    const pageSize = options?.pageSize ?? 20;
    const skip = (page - 1) * pageSize;

    const where = {
      typeId,
      ...(options?.filter?.status && {
        versions: {
          some: {
            status: options.filter.status,
          },
        },
      }),
    };

    const [entries, total] = await Promise.all([
      this.prisma.contentEntry.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: options?.sort?.direction ?? 'desc' },
        include: {
          versions: {
            orderBy: { version: 'desc' },
            take: 1,
          },
        },
      }),
      this.prisma.contentEntry.count({ where }),
    ]);

    const items = entries.map((entry) =>
      mapPrismaEntryToDomain(entry, entry.versions[0])
    );

    return paginate(items, total, { page, pageSize });
  }

  async findBySlug(
    typeId: ContentTypeId,
    slug: string,
    locale: string
  ): Promise<ContentEntry | null> {
    // Find entry where the published version has this slug for this locale
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

    // Filter by slug in the version data
    for (const entry of entries) {
      const version = entry.versions[0];
      if (!version) continue;

      const versionData = version.data as VersionData[];
      const localeData = versionData.find((d) => d.locale === locale);
      if (localeData?.slug === slug) {
        return mapPrismaEntryToDomain(entry, version, version);
      }
    }

    return null;
  }

  async query(options: ContentQueryOptions): Promise<PaginatedResult<ContentEntry>> {
    const page = options?.page ?? 1;
    const pageSize = options?.pageSize ?? 20;
    const skip = (page - 1) * pageSize;

    const where: Record<string, unknown> = {};

    if (options.filter?.typeId) {
      where.typeId = options.filter.typeId;
    }

    if (options.filter?.createdBy) {
      where.createdBy = options.filter.createdBy;
    }

    if (options.filter?.createdAfter || options.filter?.createdBefore) {
      where.createdAt = {};
      if (options.filter.createdAfter) {
        (where.createdAt as Record<string, Date>).gte = options.filter.createdAfter;
      }
      if (options.filter.createdBefore) {
        (where.createdAt as Record<string, Date>).lte = options.filter.createdBefore;
      }
    }

    if (options.filter?.status) {
      where.versions = {
        some: {
          status: options.filter.status,
        },
      };
    }

    const orderBy: Record<string, string> = {};
    if (options.sort) {
      orderBy[options.sort.field] = options.sort.direction;
    } else {
      orderBy.createdAt = 'desc';
    }

    const [entries, total] = await Promise.all([
      this.prisma.contentEntry.findMany({
        where,
        skip,
        take: pageSize,
        orderBy,
        include: {
          versions: {
            orderBy: { version: 'desc' },
            take: 1,
          },
        },
      }),
      this.prisma.contentEntry.count({ where }),
    ]);

    const items = entries.map((entry) =>
      mapPrismaEntryToDomain(entry, entry.versions[0])
    );

    return paginate(items, total, { page, pageSize });
  }

  async save(entry: ContentEntry): Promise<ContentEntry> {
    const data = mapDomainEntryToPrismaCreate(entry);

    await this.prisma.contentEntry.upsert({
      where: { id: entry.id },
      create: data,
      update: {
        defaultLocale: data.defaultLocale,
      },
    });

    return entry;
  }

  async delete(id: ContentId): Promise<void> {
    await this.prisma.contentEntry.delete({
      where: { id },
    });
  }

  async isSlugAvailable(
    typeId: ContentTypeId,
    slug: string,
    locale: string,
    excludeId?: ContentId
  ): Promise<boolean> {
    // Find entries with this content type
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

    // Check if any entry has this slug
    for (const entry of entries) {
      const version = entry.versions[0];
      if (!version) continue;

      const versionData = version.data as VersionData[];
      const localeData = versionData.find((d) => d.locale === locale);
      if (localeData?.slug === slug) {
        return false;
      }
    }

    return true;
  }
}
