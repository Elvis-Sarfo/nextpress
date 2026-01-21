import type {
  PostId,
  DocumentId,
  PrincipalId,
  Locale,
} from '../core/types.js';
import type { ContentStatus } from '../page/types.js';

// ============================================================================
// POST
// ============================================================================

export interface Post {
  id: PostId;
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

// ============================================================================
// POST LOCALE
// ============================================================================

export interface PostLocale {
  id: string;
  postId: PostId;
  locale: Locale;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
}

// ============================================================================
// POST VERSION (for history/rollback)
// ============================================================================

export interface PostVersionData {
  post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>;
  locales: Omit<PostLocale, 'id' | 'postId'>[];
}

export interface PostVersion {
  id: string;
  documentId: DocumentId;
  version: number;
  data: PostVersionData;
  createdAt: Date;
  createdBy: PrincipalId;
}

// ============================================================================
// POST WITH LOCALES (full document)
// ============================================================================

export interface PostWithLocales extends Post {
  locales: PostLocale[];
}

// ============================================================================
// REPOSITORY INTERFACES
// ============================================================================

export interface PostListOptions {
  status?: ContentStatus;
  locale?: Locale;
  limit?: number;
  offset?: number;
  orderBy?: 'createdAt' | 'updatedAt' | 'publishedAt';
  orderDirection?: 'asc' | 'desc';
}

export interface PostRepository {
  // Find operations
  findById(id: PostId): Promise<PostWithLocales | null>;
  findByDocumentId(documentId: DocumentId, status?: ContentStatus): Promise<PostWithLocales | null>;
  findBySlug(locale: Locale, slug: string, status?: ContentStatus): Promise<PostWithLocales | null>;
  findMany(options?: PostListOptions): Promise<PostWithLocales[]>;
  count(options?: PostListOptions): Promise<number>;

  // Write operations
  save(post: Post, locales: PostLocale[]): Promise<void>;
  delete(id: PostId): Promise<void>;
  deleteByDocumentId(documentId: DocumentId): Promise<void>;
}

export interface PostVersionRepository {
  findByDocumentId(documentId: DocumentId): Promise<PostVersion[]>;
  findByVersion(documentId: DocumentId, version: number): Promise<PostVersion | null>;
  getLatestVersion(documentId: DocumentId): Promise<number>;
  save(version: PostVersion): Promise<void>;
}
