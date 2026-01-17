import type {
  ContentEntry as DomainContentEntry,
  ContentVersion as DomainContentVersion,
  VersionData,
  VersionStatus,
} from '@cms/kernel';

import {
  ContentEntryId,
  ContentTypeId,
  ContentVersionId,
  PrincipalId,
  Locale,
} from '@cms/kernel';

import type {
  ContentEntry as PrismaContentEntry,
  ContentVersion as PrismaContentVersion,
} from '@prisma/client';

/**
 * Extended content entry with version information for repository queries
 */
export interface ContentEntryWithVersions extends DomainContentEntry {
  versions: DomainContentVersion[];
}

/**
 * Map Prisma ContentEntry to domain ContentEntry
 */
export function mapPrismaEntryToDomain(
  prismaEntry: PrismaContentEntry
): DomainContentEntry {
  return {
    id: ContentEntryId(prismaEntry.id),
    typeId: ContentTypeId(prismaEntry.typeId),
    defaultLocale: Locale(prismaEntry.defaultLocale),
    createdAt: prismaEntry.createdAt,
    createdBy: PrincipalId(prismaEntry.createdBy),
  };
}

/**
 * Map Prisma ContentEntry with versions to domain type
 */
export function mapPrismaEntryWithVersionsToDomain(
  prismaEntry: PrismaContentEntry & { versions: PrismaContentVersion[] }
): ContentEntryWithVersions {
  return {
    id: ContentEntryId(prismaEntry.id),
    typeId: ContentTypeId(prismaEntry.typeId),
    defaultLocale: Locale(prismaEntry.defaultLocale),
    createdAt: prismaEntry.createdAt,
    createdBy: PrincipalId(prismaEntry.createdBy),
    versions: prismaEntry.versions.map(mapPrismaVersionToDomain),
  };
}

/**
 * Map Prisma ContentVersion to domain ContentVersion
 */
export function mapPrismaVersionToDomain(
  prismaVersion: PrismaContentVersion
): DomainContentVersion {
  return {
    id: ContentVersionId(prismaVersion.id),
    entryId: ContentEntryId(prismaVersion.entryId),
    version: prismaVersion.version,
    status: prismaVersion.status as VersionStatus,
    data: prismaVersion.data as unknown as VersionData,
    createdAt: prismaVersion.createdAt,
    createdBy: PrincipalId(prismaVersion.createdBy),
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
  data: object;
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
    data: version.data as object,
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
  data: object;
  publishedAt: Date | null;
  scheduledAt: Date | null;
} {
  return {
    status: version.status,
    data: version.data as object,
    publishedAt: version.publishedAt ?? null,
    scheduledAt: version.scheduledAt ?? null,
  };
}
