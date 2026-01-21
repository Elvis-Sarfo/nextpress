import {
  RBACEngine,
  EventBus,
  Locale,
  PrincipalId,
  DocumentId,
  PageId,
  PostId,
  NewsId,
  type Principal,
  type PageWithLocales,
  type PostWithLocales,
  type NewsWithLocales,
  type MenuWithItems,
  type ContentStatus,
  type CommentStatus,
  type CommentWithReplies,
} from '../kernel/src';

import {
  prisma,
  PrismaPageRepository,
  PrismaPageVersionRepository,
  PrismaPostRepository,
  PrismaPostVersionRepository,
  PrismaNewsRepository,
  PrismaNewsVersionRepository,
  PrismaMenuRepository,
  PrismaMenuItemRepository,
  PrismaLinkCollectionRepository,
  PrismaLinkRepository,
  PrismaCommentRepository,
  PrismaRoleRepository,
} from '@cms/prisma-adapter';

import { revalidatePath } from 'next/cache';

// ============================================================================
// EVENT BUS
// ============================================================================

export const eventBus = new EventBus();

// Cache invalidation on publish
eventBus.on('CONTENT_PUBLISHED', async () => {
  revalidatePath(`/en`);
  revalidatePath(`/sitemap.xml`);
});

eventBus.on('CONTENT_UNPUBLISHED', async () => {
  revalidatePath(`/en`);
});

eventBus.on('CONTENT_DELETED', async () => {
  revalidatePath(`/en`);
});

// ============================================================================
// REPOSITORIES
// ============================================================================

// Page repositories
export const pageRepository = new PrismaPageRepository(prisma);
export const pageVersionRepository = new PrismaPageVersionRepository(prisma);

// Post repositories
export const postRepository = new PrismaPostRepository(prisma);
export const postVersionRepository = new PrismaPostVersionRepository(prisma);

// News repositories
export const newsRepository = new PrismaNewsRepository(prisma);
export const newsVersionRepository = new PrismaNewsVersionRepository(prisma);

// Navigation repositories
export const menuRepository = new PrismaMenuRepository(prisma);
export const menuItemRepository = new PrismaMenuItemRepository(prisma);
export const linkCollectionRepository = new PrismaLinkCollectionRepository(prisma);
export const linkRepository = new PrismaLinkRepository(prisma);

// Comment repository
export const commentRepository = new PrismaCommentRepository(prisma);

// Role repository
export const roleRepository = new PrismaRoleRepository(prisma);

// ============================================================================
// ENGINES
// ============================================================================

export const rbacEngine = new RBACEngine();

// ============================================================================
// LOCALE ENGINE
// ============================================================================

const DEFAULT_LOCALE = Locale('en');
const SUPPORTED_LOCALES = [Locale('en'), Locale('fr'), Locale('de'), Locale('es')];

export const localeEngine = {
  getDefaultLocale: () => DEFAULT_LOCALE,
  getSupportedLocales: () => SUPPORTED_LOCALES,
  isSupported: (locale: string) => SUPPORTED_LOCALES.includes(Locale(locale)),
  getFallbackLocale: () => DEFAULT_LOCALE,
};

// ============================================================================
// PRINCIPAL (AUTH PLACEHOLDER)
// ============================================================================

export async function getCurrentPrincipal(): Promise<Principal | null> {
  // TODO: Integrate with next-auth session
  const demoRoles = await roleRepository.findAll();
  return {
    id: PrincipalId('demo-user'),
    roles: demoRoles,
  };
}

export async function requirePrincipal(): Promise<Principal> {
  const principal = await getCurrentPrincipal();
  if (!principal) {
    throw new Error('Unauthorized');
  }
  return principal;
}

// ============================================================================
// PAGE OPERATIONS
// ============================================================================

export async function getPages(options?: {
  limit?: number;
  offset?: number;
  status?: ContentStatus;
  parentId?: string | null;
}): Promise<{ pages: PageWithLocales[]; total: number }> {
  const parentId = options?.parentId !== undefined
    ? (options.parentId === null ? null : PageId(options.parentId))
    : undefined;

  const pages = await pageRepository.findMany({
    limit: options?.limit ?? 20,
    offset: options?.offset ?? 0,
    status: options?.status,
    parentId,
  });

  const total = await pageRepository.count({
    status: options?.status,
    parentId,
  });

  return { pages, total };
}

export async function getPage(id: string): Promise<PageWithLocales | null> {
  return pageRepository.findById(id as any);
}

export async function getPageByDocumentId(
  documentId: string,
  status?: ContentStatus
): Promise<PageWithLocales | null> {
  return pageRepository.findByDocumentId(DocumentId(documentId), status);
}

export async function getPublishedPage(
  locale: string,
  slug: string
): Promise<PageWithLocales | null> {
  return pageRepository.findBySlug(Locale(locale), slug, 'PUBLISHED');
}

export async function getPageChildren(
  parentId: string,
  options?: { status?: ContentStatus }
): Promise<PageWithLocales[]> {
  return pageRepository.findChildren(parentId as any, options);
}

// ============================================================================
// POST OPERATIONS
// ============================================================================

export async function getPosts(options?: {
  limit?: number;
  offset?: number;
  status?: ContentStatus;
}): Promise<{ posts: PostWithLocales[]; total: number }> {
  const posts = await postRepository.findMany({
    limit: options?.limit ?? 20,
    offset: options?.offset ?? 0,
    status: options?.status,
  });

  const total = await postRepository.count({ status: options?.status });

  return { posts, total };
}

export async function getPost(id: string): Promise<PostWithLocales | null> {
  return postRepository.findById(id as any);
}

export async function getPostByDocumentId(
  documentId: string,
  status?: ContentStatus
): Promise<PostWithLocales | null> {
  return postRepository.findByDocumentId(DocumentId(documentId), status);
}

export async function getPublishedPost(
  locale: string,
  slug: string
): Promise<PostWithLocales | null> {
  return postRepository.findBySlug(Locale(locale), slug, 'PUBLISHED');
}

export async function getPublishedPosts(
  locale: string,
  options?: { limit?: number; offset?: number }
): Promise<PostWithLocales[]> {
  const posts = await postRepository.findMany({
    limit: options?.limit ?? 20,
    offset: options?.offset ?? 0,
    status: 'PUBLISHED',
  });

  // Filter to only posts that have the requested locale
  return posts.filter((post) =>
    post.locales.some((l) => l.locale === locale)
  );
}

// ============================================================================
// NEWS OPERATIONS
// ============================================================================

export async function getNews(options?: {
  limit?: number;
  offset?: number;
  status?: ContentStatus;
  category?: string;
}): Promise<{ news: NewsWithLocales[]; total: number }> {
  const news = await newsRepository.findMany({
    limit: options?.limit ?? 20,
    offset: options?.offset ?? 0,
    status: options?.status,
    category: options?.category,
  });

  const total = await newsRepository.count({
    status: options?.status,
    category: options?.category,
  });

  return { news, total };
}

export async function getNewsItem(id: string): Promise<NewsWithLocales | null> {
  return newsRepository.findById(id as any);
}

export async function getNewsByDocumentId(
  documentId: string,
  status?: ContentStatus
): Promise<NewsWithLocales | null> {
  return newsRepository.findByDocumentId(DocumentId(documentId), status);
}

export async function getPublishedNewsItem(
  locale: string,
  slug: string
): Promise<NewsWithLocales | null> {
  return newsRepository.findBySlug(Locale(locale), slug, 'PUBLISHED');
}

export async function getNewsByCategory(
  category: string,
  options?: { limit?: number; offset?: number }
): Promise<NewsWithLocales[]> {
  return newsRepository.findByCategory(category, {
    ...options,
    status: 'PUBLISHED',
  });
}

// ============================================================================
// MENU OPERATIONS
// ============================================================================

export async function getMenus(): Promise<ReturnType<typeof menuRepository.findAll>> {
  return menuRepository.findAll();
}

export async function getMenu(id: string): Promise<MenuWithItems | null> {
  return menuRepository.findById(id as any);
}

export async function getMenuByName(name: string): Promise<MenuWithItems | null> {
  return menuRepository.findByName(name);
}

export async function getMenuByLocation(location: string): Promise<MenuWithItems[]> {
  return menuRepository.findByLocation(location);
}

// ============================================================================
// LINK COLLECTION OPERATIONS
// ============================================================================

export async function getLinkCollections(): Promise<
  ReturnType<typeof linkCollectionRepository.findAll>
> {
  return linkCollectionRepository.findAll();
}

export async function getLinkCollection(
  id: string
): Promise<ReturnType<typeof linkCollectionRepository.findById>> {
  return linkCollectionRepository.findById(id as any);
}

export async function getLinkCollectionByName(
  name: string
): Promise<ReturnType<typeof linkCollectionRepository.findByName>> {
  return linkCollectionRepository.findByName(name);
}

// ============================================================================
// COMMENT OPERATIONS
// ============================================================================

export async function getPageComments(
  pageId: string,
  options?: { status?: CommentStatus; limit?: number; offset?: number }
): Promise<CommentWithReplies[]> {
  return commentRepository.findByPage(PageId(pageId), options);
}

export async function getPostComments(
  postId: string,
  options?: { status?: CommentStatus; limit?: number; offset?: number }
): Promise<CommentWithReplies[]> {
  return commentRepository.findByPost(PostId(postId), options);
}

export async function getNewsComments(
  newsId: string,
  options?: { status?: CommentStatus; limit?: number; offset?: number }
): Promise<CommentWithReplies[]> {
  return commentRepository.findByNews(NewsId(newsId), options);
}

export async function getPendingComments(
  options?: { limit?: number; offset?: number }
) {
  return commentRepository.findPending(options);
}

export async function getPendingCommentCount(): Promise<number> {
  return commentRepository.countPending();
}

// ============================================================================
// HELPER: GET LOCALIZED CONTENT
// ============================================================================

export function getLocalizedField<T extends { locales: Array<{ locale: string }> }>(
  content: T,
  locale: string,
  fallbackLocale: string = 'en'
): T['locales'][number] | undefined {
  const localeData = content.locales.find((l) => l.locale === locale);
  if (localeData) return localeData;

  // Fallback to default locale
  return content.locales.find((l) => l.locale === fallbackLocale);
}
