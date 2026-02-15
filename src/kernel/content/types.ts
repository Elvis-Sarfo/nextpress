import type {
  ContentEntryId, ContentVersionId, ContentTypeId, PrincipalId, Locale, DocumentId
} from '../core/types';

// ============================================================================
// VERSION STATUS (Unified - used across all content types)
// ============================================================================

/**
 * Unified content status used across all content types (Page, Post, News).
 * This replaces the duplicate ContentStatus in page/types.ts.
 */
export type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED';

/**
 * @deprecated Use ContentStatus instead. Kept for backwards compatibility.
 */
export type VersionStatus = ContentStatus;

// ============================================================================
// BASE CONTENT INTERFACES
// ============================================================================

/**
 * Base interface for all content types.
 */
export interface BaseContent<IdType extends string, IdBrand extends { __brand: string }> {
  id: IdType & IdBrand;
  documentId: DocumentId;
  status: ContentStatus;
  featuredImage: string | null;
  metadata: Record<string, unknown> | null;
  publishedAt: Date | null;
  scheduledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: PrincipalId;
}

/**
 * Base interface for localized content data.
 */
export interface BaseLocale<IdType extends string, ParentIdType extends string> {
  id: IdType;
  parentId: ParentIdType;
  locale: Locale;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
}

/**
 * Base interface for content versions.
 */
export interface BaseVersionData<ContentType> {
  content: Omit<ContentType, 'id' | 'createdAt' | 'updatedAt'>;
  locales: Record<string, Record<string, unknown>>;
}

export interface BaseVersion<IdType extends string> {
  id: IdType;
  documentId: DocumentId;
  version: number;
  createdAt: Date;
  createdBy: PrincipalId;
}

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
  status: ContentStatus;
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
  findByEntryAndStatus(entryId: ContentEntryId, status: ContentStatus): Promise<ContentVersion | null>;
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
// SLUG REDIRECT
// ============================================================================

export interface SlugRedirect {
  id: string;
  contentTypeId: ContentTypeId;
  locale: Locale;
  fromSlug: string;
  toEntryId: ContentEntryId;
  createdAt: Date;
}

export interface SlugRedirectRepository {
  findBySlug(typeId: ContentTypeId, locale: Locale, slug: string): Promise<SlugRedirect | null>;
  findByEntry(entryId: ContentEntryId): Promise<SlugRedirect[]>;
  save(redirect: SlugRedirect): Promise<void>;
  delete(id: string): Promise<void>;
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
  status?: ContentStatus;
}

export interface ListResult<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}
