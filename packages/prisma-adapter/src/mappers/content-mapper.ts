import type {
  ContentEntry as DomainContentEntry,
  ContentVersion as DomainContentVersion,
  ContentWithVersions,
  VersionData,
  ContentStatus,
} from '@cms/kernel';
import { contentId, contentTypeId, userId, versionId } from '@cms/kernel';
import type {
  ContentEntry as PrismaContentEntry,
  ContentVersion as PrismaContentVersion,
} from '@prisma/client';

type PrismaContentEntryWithVersions = PrismaContentEntry & {
  versions: PrismaContentVersion[];
};

/**
 * Map Prisma ContentEntry to domain ContentEntry
 */
export function mapPrismaEntryToDomain(
  prismaEntry: PrismaContentEntry,
  currentVersion?: PrismaContentVersion | null,
  publishedVersion?: PrismaContentVersion | null
): DomainContentEntry {
  return {
    id: contentId(prismaEntry.id),
    typeId: contentTypeId(prismaEntry.typeId),
    defaultLocale: prismaEntry.defaultLocale,
    createdAt: prismaEntry.createdAt,
    createdBy: userId(prismaEntry.createdBy),
    currentVersion: currentVersion
      ? mapPrismaVersionToDomain(currentVersion)
      : undefined,
    publishedVersion: publishedVersion
      ? mapPrismaVersionToDomain(publishedVersion)
      : undefined,
  };
}

/**
 * Map Prisma ContentEntry with versions to domain ContentWithVersions
 */
export function mapPrismaEntryWithVersionsToDomain(
  prismaEntry: PrismaContentEntryWithVersions
): ContentWithVersions {
  const versions = prismaEntry.versions.map(mapPrismaVersionToDomain);
  const sortedVersions = versions.sort((a, b) => b.version - a.version);
  const currentVersion = sortedVersions[0];
  const publishedVersion = versions.find((v) => v.status === 'PUBLISHED');

  return {
    id: contentId(prismaEntry.id),
    typeId: contentTypeId(prismaEntry.typeId),
    defaultLocale: prismaEntry.defaultLocale,
    createdAt: prismaEntry.createdAt,
    createdBy: userId(prismaEntry.createdBy),
    currentVersion,
    publishedVersion,
    versions,
  };
}

/**
 * Map Prisma ContentVersion to domain ContentVersion
 */
export function mapPrismaVersionToDomain(
  prismaVersion: PrismaContentVersion
): DomainContentVersion {
  return {
    id: versionId(prismaVersion.id),
    entryId: contentId(prismaVersion.entryId),
    version: prismaVersion.version,
    status: prismaVersion.status as ContentStatus,
    data: prismaVersion.data as VersionData[],
    createdAt: prismaVersion.createdAt,
    createdBy: userId(prismaVersion.createdBy),
    publishedAt: prismaVersion.publishedAt ?? undefined,
    scheduledAt: prismaVersion.scheduledAt ?? undefined,
  };
}

/**
 * Map domain ContentEntry to Prisma create input
 */
export function mapDomainEntryToPrismaCreate(entry: DomainContentEntry): {
  id: string;
  typeId: string;
  defaultLocale: string;
  createdBy: string;
  createdAt: Date;
} {
  return {
    id: entry.id,
    typeId: entry.typeId,
    defaultLocale: entry.defaultLocale,
    createdBy: entry.createdBy,
    createdAt: entry.createdAt,
  };
}

/**
 * Map domain ContentVersion to Prisma create input
 */
export function mapDomainVersionToPrismaCreate(version: DomainContentVersion): {
  id: string;
  entryId: string;
  version: number;
  status: string;
  data: unknown;
  createdBy: string;
  createdAt: Date;
  publishedAt: Date | null;
  scheduledAt: Date | null;
} {
  return {
    id: version.id,
    entryId: version.entryId,
    version: version.version,
    status: version.status,
    data: version.data,
    createdBy: version.createdBy,
    createdAt: version.createdAt,
    publishedAt: version.publishedAt ?? null,
    scheduledAt: version.scheduledAt ?? null,
  };
}

/**
 * Map domain ContentVersion to Prisma update input
 */
export function mapDomainVersionToPrismaUpdate(version: DomainContentVersion): {
  status: string;
  data: unknown;
  publishedAt: Date | null;
  scheduledAt: Date | null;
} {
  return {
    status: version.status,
    data: version.data,
    publishedAt: version.publishedAt ?? null,
    scheduledAt: version.scheduledAt ?? null,
  };
}
