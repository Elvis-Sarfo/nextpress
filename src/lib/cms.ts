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
// CONTENT TYPES
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PageWithLocales = any;

export interface Category {
  id: string;
  name: string;
  slug: Record<string, string> | null;
  description?: Record<string, string> | null;
  color?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostWithLocales {
  id: string;
  documentId?: string | null;
  title: Record<string, string>;
  slug: Record<string, string>;
  excerpt?: Record<string, string> | null;
  content?: Record<string, unknown> | null;
  categoryId?: string | null;
  category?: Category | null;
  featuredImageId?: string | null;
  featuredImage?: { id: string; url: string; altText?: string | null } | null;
  authorId?: string | null;
  author?: { id: string; name: string; email: string } | null;
  tags?: unknown[] | null;
  publishedAt?: Date | null;
  status: string;
  seo?: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

/** News is Posts — kept as an alias so existing callers stay compatible */
export type NewsWithLocales = PostWithLocales;
export interface MenuItem {
  id: string;
  label: string;
  type: 'page' | 'custom' | 'section';
  pageId?: string;
  /** Locale → slug map, injected at query time for page-type items */
  slugsByLocale?: Record<string, string>;
  url?: string;
  target?: '_self' | '_blank';
  children?: MenuItem[];
}

export interface MenuWithItems {
  id: string;
  name: string;
  location?: string | null;
  items: MenuItem[];
}

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
      slug: { path: `$.${locale}`, equals: slug },
    },
  });
}

export async function getPublishedIndexPage(): Promise<PageWithLocales | null> {
  return prisma.pages.findFirst({
    where: {
      status: 'published',
      isIndexPage: true,
    },
    orderBy: { updatedAt: 'desc' },
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
  name?: string;
  status?: string;
}): Promise<BlockRecord[]> {
  return prisma.blocks.findMany({
    where: {
      ...(options?.name   ? { name:   options.name   } : {}),
      ...(options?.status ? { status: options.status } : {}),
    },
    orderBy: { label: 'asc' },
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
// COUNT HELPERS — used by the admin dashboard
// ============================================================================

export async function getPageCount(): Promise<number> {
  return prisma.pages.count();
}

export async function getMediaCount(): Promise<number> {
  return prisma.media.count();
}

export async function getUserCount(): Promise<number> {
  return prisma.users.count();
}

// ============================================================================
// CATEGORIES
// ============================================================================

export async function getCategories(): Promise<Category[]> {
  return prisma.categories.findMany({ orderBy: { name: 'asc' } }) as unknown as Category[];
}

export async function getCategory(id: string): Promise<Category | null> {
  return prisma.categories.findUnique({ where: { id } }) as unknown as Category | null;
}

export async function getCategoryBySlug(
  locale: string,
  slug: string
): Promise<Category | null> {
  return prisma.categories.findFirst({
    where: { slug: { path: `$.${locale}`, equals: slug } },
  }) as unknown as Category | null;
}

// ============================================================================
// POSTS
// ============================================================================

const POST_INCLUDE = {
  category: { select: { id: true, name: true, slug: true, color: true } },
  featuredImage: { select: { id: true, url: true, altText: true } },
  author: { select: { id: true, name: true, email: true } },
};

export async function getPosts(options?: {
  limit?: number;
  offset?: number;
  status?: ContentStatus;
  categoryId?: string;
}): Promise<{ posts: PostWithLocales[]; total: number }> {
  const where = {
    ...(options?.status ? { status: options.status } : {}),
    ...(options?.categoryId ? { categoryId: options.categoryId } : {}),
  };
  const [posts, total] = await Promise.all([
    prisma.posts.findMany({
      where,
      take: options?.limit ?? 20,
      skip: options?.offset ?? 0,
      include: POST_INCLUDE,
      orderBy: { publishedAt: 'desc' },
    }),
    prisma.posts.count({ where }),
  ]);
  return { posts: posts as unknown as PostWithLocales[], total };
}

export async function getPost(id: string): Promise<PostWithLocales | null> {
  return prisma.posts.findUnique({ where: { id }, include: POST_INCLUDE }) as unknown as PostWithLocales | null;
}

export async function getPostByDocumentId(
  documentId: string,
  status?: ContentStatus
): Promise<PostWithLocales | null> {
  return prisma.posts.findFirst({
    where: { documentId, ...(status ? { status } : {}) },
    include: POST_INCLUDE,
  }) as unknown as PostWithLocales | null;
}

export async function getPublishedPost(
  locale: string,
  slug: string
): Promise<PostWithLocales | null> {
  return prisma.posts.findFirst({
    where: {
      status: 'published',
      slug: { path: `$.${locale}`, equals: slug },
    },
    include: POST_INCLUDE,
  }) as unknown as PostWithLocales | null;
}

export async function getPublishedPosts(
  _locale: string,
  options?: { limit?: number; offset?: number }
): Promise<PostWithLocales[]> {
  const posts = await prisma.posts.findMany({
    where: { status: 'published' },
    take: options?.limit ?? 20,
    skip: options?.offset ?? 0,
    include: POST_INCLUDE,
    orderBy: { publishedAt: 'desc' },
  });
  return posts as unknown as PostWithLocales[];
}

export async function getPostsByCategory(
  locale: string,
  categorySlug: string,
  options?: { limit?: number; offset?: number }
): Promise<PostWithLocales[]> {
  const category = await getCategoryBySlug(locale, categorySlug);
  if (!category) return [];
  const posts = await prisma.posts.findMany({
    where: { status: 'published', categoryId: category.id },
    take: options?.limit ?? 20,
    skip: options?.offset ?? 0,
    include: POST_INCLUDE,
    orderBy: { publishedAt: 'desc' },
  });
  return posts as unknown as PostWithLocales[];
}

// ============================================================================
// NEWS — alias to Posts; news = posts with a "News" category
// Kept for backwards compatibility with existing callers.
// ============================================================================

export async function getNews(options?: {
  limit?: number;
  offset?: number;
  status?: ContentStatus;
  category?: string;
}): Promise<{ news: NewsWithLocales[]; total: number }> {
  const { posts, total } = await getPosts({
    limit: options?.limit,
    offset: options?.offset,
    status: options?.status,
  });
  return { news: posts, total };
}

export async function getNewsItem(id: string): Promise<NewsWithLocales | null> {
  return getPost(id);
}

export async function getNewsByDocumentId(
  documentId: string,
  status?: ContentStatus
): Promise<NewsWithLocales | null> {
  return getPostByDocumentId(documentId, status);
}

export async function getPublishedNewsItem(
  locale: string,
  slug: string
): Promise<NewsWithLocales | null> {
  return getPublishedPost(locale, slug);
}

export async function getNewsByCategory(
  categorySlug: string,
  options?: { limit?: number; offset?: number }
): Promise<NewsWithLocales[]> {
  return getPostsByCategory('en', categorySlug, options);
}

// ── Navigation helpers ────────────────────────────────────────────────────────

/** DFS collect all pageIds referenced in an item tree (deduped) */
function collectPageIds(items: MenuItem[]): string[] {
  const ids = new Set<string>();
  function walk(nodes: MenuItem[]) {
    for (const n of nodes) {
      if (n.type === 'page' && n.pageId) ids.add(n.pageId);
      if (n.children?.length) walk(n.children);
    }
  }
  walk(items);
  return Array.from(ids);
}

/** Inject slugsByLocale into page-type items using a pageId → slugJSON map */
function injectPageUrls(
  items: MenuItem[],
  slugMap: Record<string, Record<string, string>>
): void {
  for (const item of items) {
    if (item.type === 'page' && item.pageId && slugMap[item.pageId]) {
      item.slugsByLocale = slugMap[item.pageId];
    }
    if (item.children?.length) injectPageUrls(item.children, slugMap);
  }
}

/** Rows from the menus table shape */
interface MenuRow {
  id: string;
  name: string;
  location: string | null;
  items: unknown;
}

async function resolveMenuItems(row: MenuRow): Promise<MenuWithItems> {
  const items = (Array.isArray(row.items) ? row.items : []) as MenuItem[];
  const pageIds = collectPageIds(items);
  if (pageIds.length > 0) {
    const pages = await prisma.pages.findMany({
      where: { id: { in: pageIds } },
      select: { id: true, slug: true },
    });
    const slugMap: Record<string, Record<string, string>> = {};
    for (const p of pages) {
      if (p.slug && typeof p.slug === 'object') {
        slugMap[p.id] = p.slug as Record<string, string>;
      }
    }
    injectPageUrls(items, slugMap);
  }
  return { id: row.id, name: row.name, location: row.location, items };
}

export async function getMenus(): Promise<MenuWithItems[]> {
  const rows = await prisma.menus.findMany({
    orderBy: { createdAt: 'asc' },
  });
  return Promise.all(rows.map((r) => resolveMenuItems(r as unknown as MenuRow)));
}

export async function getMenu(id: string): Promise<MenuWithItems | null> {
  const row = await prisma.menus.findUnique({ where: { id } });
  if (!row) return null;
  return resolveMenuItems(row as unknown as MenuRow);
}

export async function getMenuByName(name: string): Promise<MenuWithItems | null> {
  const row = await prisma.menus.findFirst({ where: { name } });
  if (!row) return null;
  return resolveMenuItems(row as unknown as MenuRow);
}

export async function getMenuByLocation(location: string): Promise<MenuWithItems | null> {
  const row = await prisma.menus.findFirst({ where: { location } });
  if (!row) return null;
  return resolveMenuItems(row as unknown as MenuRow);
}

export async function getMenuItems(menuId: string): Promise<MenuItem[]> {
  const menu = await getMenu(menuId);
  return menu?.items ?? [];
}

// ============================================================================
// COMMENTS
// ============================================================================

const COMMENT_INCLUDE = {
  author: { select: { id: true, name: true } },
};

async function fetchContentComments(
  contentType: 'pages' | 'posts',
  contentId: string,
  options?: { status?: CommentStatus; limit?: number; offset?: number }
): Promise<CommentWithReplies[]> {
  const flat = await prisma.comments.findMany({
    where: {
      contentType,
      contentId,
      status: options?.status ?? 'approved',
    },
    take: options?.limit ?? 100,
    skip: options?.offset ?? 0,
    include: COMMENT_INCLUDE,
    orderBy: { createdAt: 'asc' },
  });
  return buildCommentTree(flat as unknown as Comment[]);
}

export async function getCommentsByStatus(
  status: CommentStatus,
  options?: { limit?: number; offset?: number }
): Promise<Comment[]> {
  return prisma.comments.findMany({
    where: { status },
    take: options?.limit ?? 50,
    skip: options?.offset ?? 0,
    include: COMMENT_INCLUDE,
    orderBy: { createdAt: 'desc' },
  }) as unknown as Comment[];
}

export async function getPageComments(
  pageId: string,
  options?: { status?: CommentStatus; limit?: number; offset?: number }
): Promise<CommentWithReplies[]> {
  return fetchContentComments('pages', pageId, options);
}

export async function getPostComments(
  postId: string,
  options?: { status?: CommentStatus; limit?: number; offset?: number }
): Promise<CommentWithReplies[]> {
  return fetchContentComments('posts', postId, options);
}

/** @deprecated News is now Posts — use getPostComments instead */
export async function getNewsComments(
  newsId: string,
  options?: { status?: CommentStatus; limit?: number; offset?: number }
): Promise<CommentWithReplies[]> {
  return fetchContentComments('posts', newsId, options);
}

export async function getPendingComments(
  options?: { limit?: number; offset?: number }
): Promise<Comment[]> {
  return getCommentsByStatus('pending', options);
}

export async function getPendingCommentCount(): Promise<number> {
  return prisma.comments.count({ where: { status: 'pending' } });
}

export async function getPostCount(): Promise<number> {
  return prisma.posts.count();
}

// ============================================================================
// GENERIC COLLECTION QUERY (used by PageRenderer for block data sources)
// ============================================================================

import type { CollectionQueryParams } from '@/core/blocks/types';

async function queryPostsDirect(params: CollectionQueryParams) {
  const where = params.where ?? {};
  return prisma.posts.findMany({
    where: {
      status: (where.status as string | undefined) ?? 'published',
      ...(where.categoryId ? { categoryId: where.categoryId as string } : {}),
      ...(where.authorId ? { authorId: where.authorId as string } : {}),
    },
    take: params.limit ?? 10,
    include: POST_INCLUDE,
    orderBy: (params.orderBy as Record<string, 'asc' | 'desc'> | undefined) ?? { publishedAt: 'desc' },
  });
}

// Collections with custom query logic (relationships, access control, etc.)
const SPECIFIC_HANDLERS: Partial<
  Record<string, (p: CollectionQueryParams) => Promise<unknown[]>>
> = {
  posts: (p) => queryPostsDirect(p),
  'product-categories': async () => getProductCategories(),
  pages: (p) =>
    prisma.pages.findMany({
      where: { status: 'published', ...(p.where ?? {}) },
      take: p.limit ?? 10,
      orderBy: (p.orderBy as Record<string, 'asc' | 'desc'> | undefined) ?? { createdAt: 'desc' },
    }),
};

export async function queryCollection(
  collection: string,
  params: CollectionQueryParams
): Promise<unknown[]> {
  // Try a collection-specific handler first (handles includes, access control, etc.)
  const handler = SPECIFIC_HANDLERS[collection];
  if (handler) {
    try {
      return await handler(params);
    } catch (err) {
      console.error(`[queryCollection] Handler error for "${collection}":`, err);
      return [];
    }
  }

  // Generic fallback: dynamic Prisma access for any registered collection
  try {
    const db = prisma as unknown as Record<string, unknown>;
    const model = db[collection] as
      | { findMany: (args: unknown) => Promise<unknown[]> }
      | undefined;

    if (!model?.findMany) {
      console.warn(`[queryCollection] No Prisma model found for "${collection}"`);
      return [];
    }

    return await model.findMany({
      take: params.limit ?? 10,
      ...(params.where && Object.keys(params.where).length > 0 ? { where: params.where } : {}),
      ...(params.orderBy
        ? { orderBy: params.orderBy }
        : { orderBy: { createdAt: 'desc' } }),
    });
  } catch (err) {
    console.error(`[queryCollection] Generic query error for "${collection}":`, err);
    return [];
  }
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

// ============================================================================
// SETTINGS
// ============================================================================

/** In-memory cache: { doc, expiresAt } */
let _settingsCache: { doc: Record<string, unknown>; expiresAt: number } | null = null;
const SETTINGS_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/** Invalidate the in-memory settings cache (call after a settings save). */
export function invalidateSettingsCache(): void {
  _settingsCache = null;
}

/**
 * Returns the active settings document as a plain object.
 * Results are cached in memory for 5 minutes to avoid repeated DB hits.
 */
export async function getSettings(): Promise<Record<string, unknown>> {
  const now = Date.now();
  if (_settingsCache && _settingsCache.expiresAt > now) {
    return _settingsCache.doc;
  }

  const row = await prisma.settings.findFirst({
    orderBy: { createdAt: 'asc' },
  });

  const doc = (row ?? {}) as Record<string, unknown>;
  _settingsCache = { doc, expiresAt: now + SETTINGS_CACHE_TTL_MS };
  return doc;
}

/**
 * Returns a single settings value by dot-path (e.g. `'contact.email'`).
 * Returns `undefined` if the path doesn't exist.
 */
export async function getSetting<T = unknown>(path: string): Promise<T | undefined> {
  const doc = await getSettings();
  const parts = path.split('.');
  let current: unknown = doc;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current as T;
}

// ============================================================================
// CATALOGUE — PRODUCT CATEGORIES
// ============================================================================

export type ProductCategoryRecord = {
  id: string;
  name: Record<string, string>;
  slug: string;
  description: Record<string, string> | null;
  imageUrl: string | null;
  icon: string | null;
  parentCategoryId: string | null;
  order: number;
  children?: ProductCategoryRecord[];
};

export async function getProductCategories(): Promise<ProductCategoryRecord[]> {
  const rows = await prisma.productCategories.findMany({
    orderBy: { order: 'asc' },
    include: { image: { select: { url: true } } },
  });
  return rows.map((r) => ({
    id: r.id,
    name: r.name as Record<string, string>,
    slug: r.slug,
    description: r.description as Record<string, string> | null,
    imageUrl: (r as any).image?.url ?? null,
    icon: r.icon ?? null,
    parentCategoryId: r.parentCategoryId ?? null,
    order: r.order,
  }));
}

export async function getProductCategoryBySlug(slug: string): Promise<ProductCategoryRecord | null> {
  const row = await prisma.productCategories.findUnique({
    where: { slug },
    include: { image: { select: { url: true } } },
  });
  if (!row) return null;
  return {
    id: row.id,
    name: row.name as Record<string, string>,
    slug: row.slug,
    description: row.description as Record<string, string> | null,
    imageUrl: (row as any).image?.url ?? null,
    icon: row.icon ?? null,
    parentCategoryId: row.parentCategoryId ?? null,
    order: row.order,
  };
}

// ============================================================================
// CATALOGUE — PRODUCTS
// ============================================================================

export type ProductRecord = {
  id: string;
  name: Record<string, string>;
  model: Record<string, string> | null;
  slug: string;
  description: Record<string, string> | null;
  shortDescription: Record<string, string> | null;
  categoryId: string | null;
  category: ProductCategoryRecord | null;
  media: unknown;
  specifications: unknown;
  inStock: boolean;
  featured: boolean;
  order: number;
  instructions: unknown;
  createdAt: Date;
  updatedAt: Date;
};

export async function getProducts(options?: {
  categoryId?: string;
  search?: string;
  featured?: boolean;
  limit?: number;
  page?: number;
}): Promise<{ products: ProductRecord[]; total: number }> {
  const { categoryId, search, featured, limit = 24, page = 1 } = options ?? {};

  const where: Record<string, unknown> = {};
  if (categoryId) where.categoryId = categoryId;
  if (featured !== undefined) where.featured = featured;
  if (search) {
    // Basic search on slug (JSON name search not supported at DB level without raw query)
    where.slug = { contains: search.toLowerCase() };
  }

  const [rows, total] = await Promise.all([
    prisma.products.findMany({
      where,
      orderBy: { order: 'asc' },
      take: limit,
      skip: (page - 1) * limit,
      include: {
        category: {
          include: { image: { select: { url: true } } },
        },
      },
    }),
    prisma.products.count({ where }),
  ]);

  return {
    products: rows.map(mapProductRow),
    total,
  };
}

export async function getProduct(id: string): Promise<ProductRecord | null> {
  const row = await prisma.products.findUnique({
    where: { id },
    include: {
      category: {
        include: { image: { select: { url: true } } },
      },
    },
  });
  if (!row) return null;
  return mapProductRow(row);
}

export async function getProductBySlug(slug: string): Promise<ProductRecord | null> {
  const row = await prisma.products.findFirst({
    where: { slug },
    include: {
      category: {
        include: { image: { select: { url: true } } },
      },
    },
  });
  if (!row) return null;
  return mapProductRow(row);
}

export async function getFeaturedProducts(limit = 8): Promise<ProductRecord[]> {
  const { products } = await getProducts({ featured: true, limit });
  return products;
}

function mapProductRow(r: any): ProductRecord {
  const cat = r.category;
  return {
    id: r.id,
    name: r.name as Record<string, string>,
    model: r.model as Record<string, string> | null,
    slug: r.slug,
    description: r.description as Record<string, string> | null,
    shortDescription: r.shortDescription as Record<string, string> | null,
    categoryId: r.categoryId ?? null,
    category: cat
      ? {
          id: cat.id,
          name: cat.name as Record<string, string>,
          slug: cat.slug,
          description: cat.description as Record<string, string> | null,
          imageUrl: cat.image?.url ?? null,
          icon: cat.icon ?? null,
          parentCategoryId: cat.parentCategoryId ?? null,
          order: cat.order,
        }
      : null,
    media: r.media ?? [],
    specifications: r.specifications ?? [],
    inStock: r.inStock,
    featured: r.featured,
    order: r.order,
    instructions: r.instructions ?? [],
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}
