import { prisma } from '@/adapters/prisma-adapter';
import type { Prisma } from '@prisma/client';
import { ContentStatus } from '@/kernel/content/types';
import { CommentStatus } from '@/kernel/comments/types';

// Re-export from kernel for backwards compatibility
export type { ContentStatus };
export type { CommentStatus };

// Also re-export buildCommentTree from kernel
export { buildCommentTree } from '@/kernel/comments/types';

export type PageWithLocales = Prisma.PageGetPayload<{ include: { locales: true } }>;
export type PostWithLocales = Prisma.PostGetPayload<{ include: { locales: true } }>;
export type NewsWithLocales = Prisma.NewsGetPayload<{ include: { locales: true } }>;
export type MenuWithItems = Prisma.MenuGetPayload<{ include: { items: true } }>;
export type LinkCollection = Prisma.LinkCollectionGetPayload<Record<string, never>>;
export type Link = Prisma.LinkGetPayload<Record<string, never>>;
export type Role = Prisma.RoleGetPayload<Record<string, never>>;
export type Comment = Prisma.CommentGetPayload<Record<string, never>>;

// CommentWithReplies for Prisma compatibility
export type CommentWithReplies = Comment & {
  replies: CommentWithReplies[];
};

// Local alias for use within this file
type LocalCommentWithReplies = Comment & {
  replies: CommentWithReplies[];
};

// Helper function using kernel's generic buildCommentTree
function buildLocalCommentTree(comments: Comment[]): LocalCommentWithReplies[] {
  return buildCommentTree(comments) as LocalCommentWithReplies[];
}

export interface Principal {
  id: string;
  roles: Role[];
}

const DEFAULT_LOCALE = 'en';
const SUPPORTED_LOCALES = ['en', 'fr', 'de', 'es'] as const;

export const localeEngine = {
  getDefaultLocale: () => DEFAULT_LOCALE,
  getSupportedLocales: () => [...SUPPORTED_LOCALES],
  isSupported: (locale: string) => SUPPORTED_LOCALES.includes(locale as (typeof SUPPORTED_LOCALES)[number]),
  getFallbackLocale: () => DEFAULT_LOCALE,
};

export async function getCurrentPrincipal(): Promise<Principal | null> {
  const roles = await prisma.role.findMany();
  return {
    id: 'demo-user',
    roles,
  };
}

export async function requirePrincipal(): Promise<Principal> {
  const principal = await getCurrentPrincipal();
  if (!principal) {
    throw new Error('Unauthorized');
  }
  return principal;
}

export async function getPages(options?: {
  limit?: number;
  offset?: number;
  status?: ContentStatus;
  parentId?: string | null;
}): Promise<{ pages: PageWithLocales[]; total: number }> {
  const where: Prisma.PageWhereInput = {
    ...(options?.status ? { status: options.status } : {}),
    ...(options?.parentId !== undefined ? { parentId: options.parentId } : {}),
  };

  const [pages, total] = await Promise.all([
    prisma.page.findMany({
      where,
      include: { locales: true },
      take: options?.limit ?? 20,
      skip: options?.offset ?? 0,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.page.count({ where }),
  ]);

  return { pages, total };
}

export async function getPage(id: string): Promise<PageWithLocales | null> {
  return prisma.page.findUnique({
    where: { id },
    include: { locales: true },
  });
}

export async function getPageByDocumentId(
  documentId: string,
  status?: ContentStatus
): Promise<PageWithLocales | null> {
  return prisma.page.findFirst({
    where: {
      documentId,
      ...(status ? { status } : {}),
    },
    include: { locales: true },
  });
}

export async function getPublishedPage(
  locale: string,
  slug: string
): Promise<PageWithLocales | null> {
  return prisma.page.findFirst({
    where: {
      status: 'PUBLISHED',
      locales: {
        some: {
          locale,
          slug,
        },
      },
    },
    include: { locales: true },
  });
}

export async function getPageChildren(
  parentId: string,
  options?: { status?: ContentStatus }
): Promise<PageWithLocales[]> {
  return prisma.page.findMany({
    where: {
      parentId,
      ...(options?.status ? { status: options.status } : {}),
    },
    include: { locales: true },
    orderBy: { order: 'asc' },
  });
}

export async function getPosts(options?: {
  limit?: number;
  offset?: number;
  status?: ContentStatus;
}): Promise<{ posts: PostWithLocales[]; total: number }> {
  const where: Prisma.PostWhereInput = options?.status ? { status: options.status } : {};

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: { locales: true },
      take: options?.limit ?? 20,
      skip: options?.offset ?? 0,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.post.count({ where }),
  ]);

  return { posts, total };
}

export async function getPost(id: string): Promise<PostWithLocales | null> {
  return prisma.post.findUnique({
    where: { id },
    include: { locales: true },
  });
}

export async function getPostByDocumentId(
  documentId: string,
  status?: ContentStatus
): Promise<PostWithLocales | null> {
  return prisma.post.findFirst({
    where: {
      documentId,
      ...(status ? { status } : {}),
    },
    include: { locales: true },
  });
}

export async function getPublishedPost(
  locale: string,
  slug: string
): Promise<PostWithLocales | null> {
  return prisma.post.findFirst({
    where: {
      status: 'PUBLISHED',
      locales: {
        some: {
          locale,
          slug,
        },
      },
    },
    include: { locales: true },
  });
}

export async function getPublishedPosts(
  locale: string,
  options?: { limit?: number; offset?: number }
): Promise<PostWithLocales[]> {
  return prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
      locales: {
        some: {
          locale,
        },
      },
    },
    include: { locales: true },
    take: options?.limit ?? 20,
    skip: options?.offset ?? 0,
    orderBy: { publishedAt: 'desc' },
  });
}

export async function getNews(options?: {
  limit?: number;
  offset?: number;
  status?: ContentStatus;
  category?: string;
}): Promise<{ news: NewsWithLocales[]; total: number }> {
  const where: Prisma.NewsWhereInput = {
    ...(options?.status ? { status: options.status } : {}),
    ...(options?.category ? { category: options.category } : {}),
  };

  const [news, total] = await Promise.all([
    prisma.news.findMany({
      where,
      include: { locales: true },
      take: options?.limit ?? 20,
      skip: options?.offset ?? 0,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.news.count({ where }),
  ]);

  return { news, total };
}

export async function getNewsItem(id: string): Promise<NewsWithLocales | null> {
  return prisma.news.findUnique({
    where: { id },
    include: { locales: true },
  });
}

export async function getNewsByDocumentId(
  documentId: string,
  status?: ContentStatus
): Promise<NewsWithLocales | null> {
  return prisma.news.findFirst({
    where: {
      documentId,
      ...(status ? { status } : {}),
    },
    include: { locales: true },
  });
}

export async function getPublishedNewsItem(
  locale: string,
  slug: string
): Promise<NewsWithLocales | null> {
  return prisma.news.findFirst({
    where: {
      status: 'PUBLISHED',
      locales: {
        some: {
          locale,
          slug,
        },
      },
    },
    include: { locales: true },
  });
}

export async function getNewsByCategory(
  category: string,
  options?: { limit?: number; offset?: number }
): Promise<NewsWithLocales[]> {
  return prisma.news.findMany({
    where: {
      category,
      status: 'PUBLISHED',
    },
    include: { locales: true },
    take: options?.limit ?? 20,
    skip: options?.offset ?? 0,
    orderBy: { publishedAt: 'desc' },
  });
}

export async function getMenus(): Promise<MenuWithItems[]> {
  return prisma.menu.findMany({
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getMenu(id: string): Promise<MenuWithItems | null> {
  return prisma.menu.findUnique({
    where: { id },
    include: { items: true },
  });
}

export async function getMenuByName(name: string): Promise<MenuWithItems | null> {
  return prisma.menu.findUnique({
    where: { name },
    include: { items: true },
  });
}

export async function getMenuByLocation(location: string): Promise<MenuWithItems[]> {
  return prisma.menu.findMany({
    where: { location },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getMenuItems(menuId: string) {
  return prisma.menuItem.findMany({
    where: { menuId },
    orderBy: { order: 'asc' },
  });
}

export async function getLinkCollections(): Promise<LinkCollection[]> {
  return prisma.linkCollection.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function getLinkCollection(id: string) {
  return prisma.linkCollection.findUnique({
    where: { id },
  });
}

export async function getLinkCollectionByName(name: string) {
  return prisma.linkCollection.findUnique({
    where: { name },
  });
}

export async function getLinksByCollection(collectionId: string): Promise<Link[]> {
  return prisma.link.findMany({
    where: { collectionId },
    orderBy: { order: 'asc' },
  });
}

// buildCommentTree is now imported from @/kernel/comments/types

export async function getCommentsByStatus(
  status: CommentStatus,
  options?: { limit?: number; offset?: number }
): Promise<Comment[]> {
  return prisma.comment.findMany({
    where: { status },
    take: options?.limit,
    skip: options?.offset,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getPageComments(
  pageId: string,
  options?: { status?: CommentStatus; limit?: number; offset?: number }
): Promise<CommentWithReplies[]> {
  const comments = await prisma.comment.findMany({
    where: {
      pageId,
      ...(options?.status ? { status: options.status } : {}),
    },
    take: options?.limit,
    skip: options?.offset,
    orderBy: { createdAt: 'desc' },
  });

  return buildLocalCommentTree(comments);
}

export async function getPostComments(
  postId: string,
  options?: { status?: CommentStatus; limit?: number; offset?: number }
): Promise<CommentWithReplies[]> {
  const comments = await prisma.comment.findMany({
    where: {
      postId,
      ...(options?.status ? { status: options.status } : {}),
    },
    take: options?.limit,
    skip: options?.offset,
    orderBy: { createdAt: 'desc' },
  });

  return buildLocalCommentTree(comments);
}

export async function getNewsComments(
  newsId: string,
  options?: { status?: CommentStatus; limit?: number; offset?: number }
): Promise<CommentWithReplies[]> {
  const comments = await prisma.comment.findMany({
    where: {
      newsId,
      ...(options?.status ? { status: options.status } : {}),
    },
    take: options?.limit,
    skip: options?.offset,
    orderBy: { createdAt: 'desc' },
  });

  return buildLocalCommentTree(comments);
}

export async function getPendingComments(options?: { limit?: number; offset?: number }) {
  return prisma.comment.findMany({
    where: { status: 'pending' },
    take: options?.limit,
    skip: options?.offset,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getPendingCommentCount(): Promise<number> {
  return prisma.comment.count({
    where: { status: 'pending' },
  });
}

export function getLocalizedField<T extends { locales: Array<{ locale: string }> }>(
  content: T,
  locale: string,
  fallbackLocale: string = 'en'
): T['locales'][number] | undefined {
  const localeData = content.locales.find((l) => l.locale === locale);
  if (localeData) return localeData;

  return content.locales.find((l) => l.locale === fallbackLocale);
}
