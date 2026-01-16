import type {
  ContentEntryId, ContentVersionId, ContentTypeId, PrincipalId, Locale
} from '../core/types.js';

// ============================================================================
// VERSION STATUS
// ============================================================================

export type VersionStatus = 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED';

// ============================================================================
// CONTENT ENTRY
// ============================================================================

export interface ContentEntry {
  id: ContentEntryId;
  typeId: ContentTypeId;
  defaultLocale: Locale;
  createdAt: Date;
  createdBy: PrincipalId;
  deletedAt?: Date;
}

// ============================================================================
// CONTENT VERSION
// ============================================================================

export interface VersionData {
  // Non-localizable fields at root
  [key: string]: unknown;
  // Localizable fields nested
  locales: Record<string, Record<string, unknown>>;
}

export interface ContentVersion {
  id: ContentVersionId;
  entryId: ContentEntryId;
  version: number;
  status: VersionStatus;
  data: VersionData;
  createdAt: Date;
  createdBy: PrincipalId;
  publishedAt?: Date;
  scheduledAt?: Date;
}

// ============================================================================
// CONTENT LOCK
// ============================================================================

export interface ContentLock {
  id: string;
  entryId: ContentEntryId;
  lockedBy: PrincipalId;
  lockedAt: Date;
  expiresAt: Date;
}

// ============================================================================
// REPOSITORY INTERFACES
// ============================================================================

export interface ContentEntryRepository {
  findById(id: ContentEntryId): Promise<ContentEntry | null>;
  findByType(typeId: ContentTypeId, options?: ListOptions): Promise<ContentEntry[]>;
  countByType(typeId: ContentTypeId): Promise<number>;
  save(entry: ContentEntry): Promise<void>;
  delete(id: ContentEntryId): Promise<void>;
}

export interface ContentVersionRepository {
  findById(id: ContentVersionId): Promise<ContentVersion | null>;
  findByEntry(entryId: ContentEntryId): Promise<ContentVersion[]>;
  findByEntryAndStatus(entryId: ContentEntryId, status: VersionStatus): Promise<ContentVersion | null>;
  findByEntryAndVersion(entryId: ContentEntryId, version: number): Promise<ContentVersion | null>;
  findLatestByEntry(entryId: ContentEntryId): Promise<ContentVersion | null>;
  findScheduledBefore(date: Date): Promise<ContentVersion[]>;
  findPublishedBySlug(typeId: ContentTypeId, locale: Locale, slug: string): Promise<ContentVersion | null>;
  save(version: ContentVersion): Promise<void>;
  delete(id: ContentVersionId): Promise<void>;
}

export interface ContentLockRepository {
  findByEntry(entryId: ContentEntryId): Promise<ContentLock | null>;
  save(lock: ContentLock): Promise<void>;
  delete(entryId: ContentEntryId): Promise<void>;
  deleteExpired(): Promise<number>;
}

// ============================================================================
// QUERY OPTIONS
// ============================================================================

export interface ListOptions {
  limit?: number;
  offset?: number;
  orderBy?: 'createdAt' | 'updatedAt';
  orderDirection?: 'asc' | 'desc';
  createdBy?: PrincipalId;
  status?: VersionStatus;
}

export interface ListResult<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}
