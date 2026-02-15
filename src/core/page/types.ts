import type {
  PageId,
  DocumentId,
  PrincipalId,
  Locale,
} from '../core/types';
import type { ContentStatus } from '../content/types';

// Re-export for convenience
export type { ContentStatus };

// ============================================================================
// PAGE
// ============================================================================

export interface Page {
  id: PageId;
  documentId: DocumentId;
  status: ContentStatus;
  parentId: PageId | null;
  order: number;
  template: string | null;
  metadata: Record<string, unknown> | null;
  publishedAt: Date | null;
  scheduledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: PrincipalId;
}

// ============================================================================
// PAGE LOCALE
// ============================================================================

export interface PageLocale {
  id: string;
  pageId: PageId;
  locale: Locale;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
}

// ============================================================================
// PAGE VERSION (for history/rollback)
// ============================================================================

export interface PageVersionData {
  page: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>;
  locales: Omit<PageLocale, 'id' | 'pageId'>[];
}

export interface PageVersion {
  id: string;
  documentId: DocumentId;
  version: number;
  data: PageVersionData;
  createdAt: Date;
  createdBy: PrincipalId;
}

// ============================================================================
// PAGE WITH LOCALES (full document)
// ============================================================================

export interface PageWithLocales extends Page {
  locales: PageLocale[];
}

// ============================================================================
// REPOSITORY INTERFACES
// ============================================================================

export interface PageListOptions {
  status?: ContentStatus;
  parentId?: PageId | null;
  locale?: Locale;
  limit?: number;
  offset?: number;
  orderBy?: 'createdAt' | 'updatedAt' | 'order';
  orderDirection?: 'asc' | 'desc';
}

export interface PageRepository {
  // Find operations
  findById(id: PageId): Promise<PageWithLocales | null>;
  findByDocumentId(documentId: DocumentId, status?: ContentStatus): Promise<PageWithLocales | null>;
  findBySlug(locale: Locale, slug: string, status?: ContentStatus): Promise<PageWithLocales | null>;
  findMany(options?: PageListOptions): Promise<PageWithLocales[]>;
  findChildren(parentId: PageId, options?: PageListOptions): Promise<PageWithLocales[]>;
  count(options?: PageListOptions): Promise<number>;

  // Write operations
  save(page: Page, locales: PageLocale[]): Promise<void>;
  delete(id: PageId): Promise<void>;
  deleteByDocumentId(documentId: DocumentId): Promise<void>;
}

export interface PageVersionRepository {
  findByDocumentId(documentId: DocumentId): Promise<PageVersion[]>;
  findByVersion(documentId: DocumentId, version: number): Promise<PageVersion | null>;
  getLatestVersion(documentId: DocumentId): Promise<number>;
  save(version: PageVersion): Promise<void>;
}
