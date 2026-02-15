import type {
  NewsId,
  DocumentId,
  PrincipalId,
  Locale,
} from '../core/types';
import type { ContentStatus } from '../content/types';

// Re-export for convenience
export type { ContentStatus };

// ============================================================================
// NEWS
// ============================================================================

export interface News {
  id: NewsId;
  documentId: DocumentId;
  status: ContentStatus;
  category: string | null;
  featuredImage: string | null;
  metadata: Record<string, unknown> | null;
  publishedAt: Date | null;
  scheduledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: PrincipalId;
}

// ============================================================================
// NEWS LOCALE
// ============================================================================

export interface NewsLocale {
  id: string;
  newsId: NewsId;
  locale: Locale;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
}

// ============================================================================
// NEWS VERSION (for history/rollback)
// ============================================================================

export interface NewsVersionData {
  news: Omit<News, 'id' | 'createdAt' | 'updatedAt'>;
  locales: Omit<NewsLocale, 'id' | 'newsId'>[];
}

export interface NewsVersion {
  id: string;
  documentId: DocumentId;
  version: number;
  data: NewsVersionData;
  createdAt: Date;
  createdBy: PrincipalId;
}

// ============================================================================
// NEWS WITH LOCALES (full document)
// ============================================================================

export interface NewsWithLocales extends News {
  locales: NewsLocale[];
}

// ============================================================================
// REPOSITORY INTERFACES
// ============================================================================

export interface NewsListOptions {
  status?: ContentStatus;
  category?: string;
  locale?: Locale;
  limit?: number;
  offset?: number;
  orderBy?: 'createdAt' | 'updatedAt' | 'publishedAt';
  orderDirection?: 'asc' | 'desc';
}

export interface NewsRepository {
  // Find operations
  findById(id: NewsId): Promise<NewsWithLocales | null>;
  findByDocumentId(documentId: DocumentId, status?: ContentStatus): Promise<NewsWithLocales | null>;
  findBySlug(locale: Locale, slug: string, status?: ContentStatus): Promise<NewsWithLocales | null>;
  findMany(options?: NewsListOptions): Promise<NewsWithLocales[]>;
  findByCategory(category: string, options?: NewsListOptions): Promise<NewsWithLocales[]>;
  count(options?: NewsListOptions): Promise<number>;

  // Write operations
  save(news: News, locales: NewsLocale[]): Promise<void>;
  delete(id: NewsId): Promise<void>;
  deleteByDocumentId(documentId: DocumentId): Promise<void>;
}

export interface NewsVersionRepository {
  findByDocumentId(documentId: DocumentId): Promise<NewsVersion[]>;
  findByVersion(documentId: DocumentId, version: number): Promise<NewsVersion | null>;
  getLatestVersion(documentId: DocumentId): Promise<number>;
  save(version: NewsVersion): Promise<void>;
}
