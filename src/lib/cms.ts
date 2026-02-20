import { prisma } from '@/adapters/prisma-adapter';
import { ContentStatus } from '@/core/content/types';
import { auth } from '@/auth';
import { loadPrincipalFromDB } from '@/lib/rbac-service';
import type { Principal } from '@/core/permissions/types';

// Re-export from kernel for backwards compatibility
export type { ContentStatus };

// ============================================================================
// COMMENT TYPES (inlined — comments kernel module not yet implemented)
// ============================================================================

export type CommentStatus = 'pending' | 'approved' | 'rejected' | 'spam';

// Loose Comment shape — status is string so it is compatible with Prisma rows
export type Comment = {
  id: string;
  status: string;
  parentId?: string | null;
  authorName?: string | null;
  authorEmail?: string | null;
  content?: string | null;
  createdAt?: Date | null;
  [key: string]: unknown;
};

export type CommentWithReplies = Comment & {
  replies: CommentWithReplies[];
};

/** Build a nested comment tree from a flat list of comments. */
export function buildCommentTree(
  comments: Comment[],
  parentId: string | null = null
): CommentWithReplies[] {
  return comments
    .filter((c) => (c.parentId ?? null) === parentId)
    .map((c) => ({ ...c, replies: buildCommentTree(comments, c.id) }));
}

// Re-export kernel Principal so callers that previously imported from here still work
export type { Principal } from '@/core/permissions/types';

// ============================================================================
// PLACEHOLDER TYPES for models not yet in the generated schema
// These functions compile but will throw at runtime until the models are added.
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PageWithLocales = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PostWithLocales = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NewsWithLocales = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MenuWithItems = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LinkCollection = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Link = any;

// ============================================================================
// LOCALE ENGINE
// ============================================================================

const DEFAULT_LOCALE = 'en';
const SUPPORTED_LOCALES = ['en', 'fr', 'de', 'es'] as const;

export const localeEngine = {
  getDefaultLocale: () => DEFAULT_LOCALE,
  getSupportedLocales: () => [...SUPPORTED_LOCALES],
  isSupported: (locale: string) =>
    SUPPORTED_LOCALES.includes(locale as (typeof SUPPORTED_LOCALES)[number]),
  getFallbackLocale: () => DEFAULT_LOCALE,
};

// ============================================================================
// AUTH / PRINCIPAL
// ============================================================================

export async function getCurrentPrincipal(): Promise<Principal | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  return loadPrincipalFromDB(session.user.id);
}

export async function requirePrincipal(): Promise<Principal> {
  const principal = await getCurrentPrincipal();
  if (!principal) {
    throw new Error('Unauthorized');
  }
  return principal;
}

// ============================================================================
// PAGES  (uses prisma.pages — the model is named Pages in the schema)
// ============================================================================

export async function getPages(options?: {
  limit?: number;
  offset?: number;
  status?: ContentStatus;
  parentId?: string | null;
}): Promise<{ pages: PageWithLocales[]; total: number }> {
  // NOTE: Pages model does not yet have a `locales` relation.
  // Replace with the correct query once locales are added to the schema.
  const where = {
    ...(options?.status ? { status: options.status } : {}),
  };

  const [pages, total] = await Promise.all([
    prisma.pages.findMany({
      where,
      take: options?.limit ?? 20,
      skip: options?.offset ?? 0,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.pages.count({ where }),
  ]);

  return { pages, total };
}

export async function getPage(id: string): Promise<PageWithLocales | null> {
  return prisma.pages.findUnique({ where: { id } });
}

export async function getPageByDocumentId(
  documentId: string,
  status?: ContentStatus
): Promise<PageWithLocales | null> {
  return prisma.pages.findFirst({
    where: { documentId, ...(status ? { status } : {}) },
  });
}

export async function getPublishedPage(
  locale: string,
  slug: string
): Promise<PageWithLocales | null> {
  return prisma.pages.findFirst({
    where: {
      status: 'published',
      slug: { path: [locale], equals: slug },
    },
  });
}

export async function getPageChildren(
  parentId: string,
  options?: { status?: ContentStatus }
): Promise<PageWithLocales[]> {
  return prisma.pages.findMany({
    where: {
      parentId,
      ...(options?.status ? { status: options.status } : {}),
    },
    orderBy: { order: 'asc' },
  });
}

// ============================================================================
// BLOCKS  (uses prisma.blocks — reusable localized content blocks)
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BlockRecord = any;

export async function getBlocks(options?: {
  type?: string;
  status?: string;
}): Promise<BlockRecord[]> {
  return prisma.blocks.findMany({
    where: {
      ...(options?.type   ? { type:   options.type   } : {}),
      ...(options?.status ? { status: options.status } : {}),
    },
    orderBy: { name: 'asc' },
  });
}

export async function getBlock(id: string): Promise<BlockRecord | null> {
  return prisma.blocks.findUnique({ where: { id } });
}

export async function getBlocksByIds(ids: string[]): Promise<BlockRecord[]> {
  if (ids.length === 0) return [];
  return prisma.blocks.findMany({ where: { id: { in: ids } } });
}

// ============================================================================
// POSTS / NEWS / MENUS / LINKS — not yet in the generated schema.
// Stubs return empty results so callers don't crash at import time.
// ============================================================================

export async function getPosts(_options?: {
  limit?: number;
  offset?: number;
  status?: ContentStatus;
}): Promise<{ posts: PostWithLocales[]; total: number }> {
  return { posts: [], total: 0 };
}

export async function getPost(_id: string): Promise<PostWithLocales | null> {
  return null;
}

export async function getPostByDocumentId(
  _documentId: string,
  _status?: ContentStatus
): Promise<PostWithLocales | null> {
  return null;
}

export async function getPublishedPost(
  _locale: string,
  _slug: string
): Promise<PostWithLocales | null> {
  return null;
}

export async function getPublishedPosts(
  _locale: string,
  _options?: { limit?: number; offset?: number }
): Promise<PostWithLocales[]> {
  return [];
}

export async function getNews(_options?: {
  limit?: number;
  offset?: number;
  status?: ContentStatus;
  category?: string;
}): Promise<{ news: NewsWithLocales[]; total: number }> {
  return { news: [], total: 0 };
}

export async function getNewsItem(_id: string): Promise<NewsWithLocales | null> {
  return null;
}

export async function getNewsByDocumentId(
  _documentId: string,
  _status?: ContentStatus
): Promise<NewsWithLocales | null> {
  return null;
}

export async function getPublishedNewsItem(
  _locale: string,
  _slug: string
): Promise<NewsWithLocales | null> {
  return null;
}

export async function getNewsByCategory(
  _category: string,
  _options?: { limit?: number; offset?: number }
): Promise<NewsWithLocales[]> {
  return [];
}

export async function getMenus(): Promise<MenuWithItems[]> {
  return [];
}

export async function getMenu(_id: string): Promise<MenuWithItems | null> {
  return null;
}

export async function getMenuByName(_name: string): Promise<MenuWithItems | null> {
  return null;
}

export async function getMenuByLocation(_location: string): Promise<MenuWithItems[]> {
  return [];
}

export async function getMenuItems(_menuId: string): Promise<unknown[]> {
  return [];
}

export async function getLinkCollections(): Promise<LinkCollection[]> {
  return [];
}

export async function getLinkCollection(_id: string): Promise<LinkCollection | null> {
  return null;
}

export async function getLinkCollectionByName(
  _name: string
): Promise<LinkCollection | null> {
  return null;
}

export async function getLinksByCollection(_collectionId: string): Promise<Link[]> {
  return [];
}

// ============================================================================
// COMMENTS — stubs until Comment model is in the schema
// ============================================================================

export async function getCommentsByStatus(
  _status: CommentStatus,
  _options?: { limit?: number; offset?: number }
): Promise<Comment[]> {
  return [];
}

export async function getPageComments(
  _pageId: string,
  _options?: { status?: CommentStatus; limit?: number; offset?: number }
): Promise<CommentWithReplies[]> {
  return [];
}

export async function getPostComments(
  _postId: string,
  _options?: { status?: CommentStatus; limit?: number; offset?: number }
): Promise<CommentWithReplies[]> {
  return [];
}

export async function getNewsComments(
  _newsId: string,
  _options?: { status?: CommentStatus; limit?: number; offset?: number }
): Promise<CommentWithReplies[]> {
  return [];
}

export async function getPendingComments(
  _options?: { limit?: number; offset?: number }
): Promise<Comment[]> {
  return [];
}

export async function getPendingCommentCount(): Promise<number> {
  return 0;
}

// ============================================================================
// LOCALIZATION HELPER
// ============================================================================

export function getLocalizedField<T extends { locales: Array<{ locale: string }> }>(
  content: T,
  locale: string,
  fallbackLocale: string = 'en'
): T['locales'][number] | undefined {
  const localeData = content.locales.find((l) => l.locale === locale);
  if (localeData) return localeData;
  return content.locales.find((l) => l.locale === fallbackLocale);
}
