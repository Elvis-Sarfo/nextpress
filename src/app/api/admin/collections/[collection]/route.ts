/**
 * Admin Collection API — List & Create
 * GET  /api/admin/collections/[collection]  → list documents (paginated)
 * POST /api/admin/collections/[collection]  → create a document
 *
 * All routes require authentication. Write operations require admin role.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/adapters/prisma-adapter';
import bcrypt from 'bcryptjs';
import { invalidatePrincipalCache } from '@/lib/rbac-service';
import { getCollection } from '@/lib/collections-data';
import { slugify } from '@/lib/utils';

// Collections that have many-to-many relations we want to include in responses
const INCLUDE_MAP: Record<string, object> = {
  users: { roles: { select: { id: true, name: true, displayName: true } } },
  roles: { permissions: { select: { id: true, name: true, resource: true, action: true, scope: true } } },
  pages: { featuredImage: { select: { id: true, url: true, altText: true } } },
  'contact-messages': { assignedTo: { select: { id: true, name: true, email: true } } },
  countries: { backgroundImage: { select: { id: true, url: true, altText: true } } },
  'product-categories': { image: { select: { id: true, url: true, altText: true } } },
  products: {
    category: { select: { id: true, name: true, slug: true } },
  },
  posts: {
    category: { select: { id: true, name: true, color: true } },
    featuredImage: { select: { id: true, url: true, altText: true } },
    author: { select: { id: true, name: true, email: true } },
  },
  comments: {
    author: { select: { id: true, name: true, email: true } },
  },
};

function getLocalizedValue(value: unknown, locale: string): string | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
  const localized = value as Record<string, unknown>;
  const direct = localized[locale];
  return typeof direct === 'string' && direct ? direct : undefined;
}

function normalizeLocalizedSlugFromTitle(
  title: unknown,
  slug: unknown,
): Record<string, string> | undefined {
  const titleMap =
    title && typeof title === 'object' && !Array.isArray(title)
      ? (title as Record<string, unknown>)
      : null;

  const slugMap =
    slug && typeof slug === 'object' && !Array.isArray(slug)
      ? Object.fromEntries(
          Object.entries(slug as Record<string, unknown>).filter(
            (entry): entry is [string, string] => typeof entry[1] === 'string' && entry[1].trim().length > 0,
          ),
        )
      : {};

  if (!titleMap) {
    return Object.keys(slugMap).length > 0 ? slugMap : undefined;
  }

  for (const [locale, value] of Object.entries(titleMap)) {
    if (typeof value !== 'string' || !value.trim()) continue;
    if (!slugMap[locale]) {
      const generated = slugify(value);
      if (generated) slugMap[locale] = generated;
    }
  }

  return Object.keys(slugMap).length > 0 ? slugMap : undefined;
}

// Allowed collection slugs that this API handles
const ALLOWED = new Set([
  'users', 'roles', 'permissions', 'media', 'pages', 'settings', 'blocks', 'menus',
  'categories', 'posts', 'comments', 'contact-messages', 'product-categories', 'products', 'countries', 'jobs',
]);

// Fields to use for full-text search per collection (only plain String fields)
// Note: pages/posts title and slug are Json — omitted from search until JSON search is implemented
const SEARCH_FIELDS: Record<string, string[]> = {
  users: ['name', 'email'],
  roles: ['name', 'displayName', 'description'],
  permissions: ['name', 'resource', 'action'],
  media: ['filename', 'alt', 'caption'],
  pages: [],
  settings: ['siteName'],
  blocks: ['label', 'name', 'templateName', 'status'],
  'contact-messages': ['name', 'email', 'phone', 'company', 'subject', 'status', 'sourcePage', 'locale'],
  menus: ['name', 'location'],
  countries: ['name', 'code', 'flag'],
  jobs: ['title', 'location', 'employmentType', 'salary'],
  categories: ['name'],
  'product-categories': ['slug', 'icon'],
  products: ['slug'],
  posts: [],
  comments: ['authorName', 'authorEmail', 'content'],
};

function supportsBlocksContentDefinition(): boolean {
  const runtime = (prisma as unknown as {
    _runtimeDataModel?: {
      models?: Record<string, { fields?: Array<{ name?: string }> }>;
    };
  })._runtimeDataModel;

  const model = runtime?.models?.blocks ?? runtime?.models?.Blocks;
  if (!model?.fields) return true;
  return model.fields.some((field) => field.name === 'contentDefinition');
}

function supportsBlocksDataSource(): boolean {
  const runtime = (prisma as unknown as {
    _runtimeDataModel?: {
      models?: Record<string, { fields?: Array<{ name?: string }> }>;
    };
  })._runtimeDataModel;

  const model = runtime?.models?.blocks ?? runtime?.models?.Blocks;
  if (!model?.fields) return true;
  return model.fields.some((field) => field.name === 'dataSource');
}

function modelHasField(collection: string, fieldName: string): boolean {
  const runtime = (prisma as unknown as {
    _runtimeDataModel?: {
      models?: Record<string, { fields?: Array<{ name?: string }> }>;
    };
  })._runtimeDataModel;

  const pascalCollection = collection.charAt(0).toUpperCase() + collection.slice(1);
  const model = runtime?.models?.[collection] ?? runtime?.models?.[pascalCollection];
  if (!model?.fields) return false;
  return model.fields.some((field) => field.name === fieldName);
}

function getModelFieldType(collection: string, fieldName: string): string | null {
  const runtime = (prisma as unknown as {
    _runtimeDataModel?: {
      models?: Record<string, { fields?: Array<{ name?: string; type?: string }> }>;
    };
  })._runtimeDataModel;

  const pascalCollection = collection.charAt(0).toUpperCase() + collection.slice(1);
  const model = runtime?.models?.[collection] ?? runtime?.models?.[pascalCollection];
  if (!model?.fields) return null;

  const field = model.fields.find((entry) => entry.name === fieldName);
  return field?.type ?? null;
}

function supportsInsensitiveMode(): boolean {
  const databaseUrl = process.env.DATABASE_URL?.toLowerCase() ?? '';
  return databaseUrl.startsWith('postgres') || databaseUrl.startsWith('mongodb');
}

function buildContainsFilter(field: string, value: string): Record<string, unknown> {
  const filter = supportsInsensitiveMode()
    ? { contains: value, mode: 'insensitive' as const }
    : { contains: value };

  return { [field]: filter };
}

function getSearchableFields(collection: string): string[] {
  return (SEARCH_FIELDS[collection] ?? []).filter(
    (fieldName) => modelHasField(collection, fieldName) && getModelFieldType(collection, fieldName) === 'String'
  );
}

function getFilterableFields(collection: string): Set<string> {
  const collectionMeta = getCollection(collection);
  if (!collectionMeta) return new Set();

  return new Set(
    collectionMeta.fields
      .filter((field) => ['text', 'email', 'textarea', 'select'].includes(field.type))
      .map((field) => field.name)
      .filter(
        (fieldName) => modelHasField(collection, fieldName) && getModelFieldType(collection, fieldName) === 'String'
      )
  );
}

function createDocumentId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function stripNullScalarDefaultFields(collection: string, body: Record<string, unknown>): void {
  const runtime = (prisma as unknown as {
    _runtimeDataModel?: {
      models?: Record<string, { fields?: Array<{ name?: string; type?: string }> }>;
    };
  })._runtimeDataModel;

  const pascalCollection = collection.charAt(0).toUpperCase() + collection.slice(1);
  const model = runtime?.models?.[collection] ?? runtime?.models?.[pascalCollection];
  if (!model?.fields) return;

  for (const field of model.fields) {
    if (!field.name) continue;
    if (field.type !== 'Int' && field.type !== 'Float' && field.type !== 'Boolean') continue;
    if (body[field.name] === null) {
      delete body[field.name];
    }
  }
}

function normalizeDateFieldValue(value: unknown): unknown {
  if (typeof value !== 'string') return value;

  const trimmed = value.trim();
  if (!trimmed) return null;

  // HTML date inputs submit YYYY-MM-DD; Prisma DateTime expects full ISO-8601.
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return `${trimmed}T00:00:00.000Z`;
  }

  return trimmed;
}

function normalizeCollectionDateFields(collection: string, body: Record<string, unknown>): void {
  const collectionMeta = getCollection(collection);
  if (!collectionMeta) return;

  for (const field of collectionMeta.fields) {
    if (field.type !== 'date') continue;
    if (!Object.prototype.hasOwnProperty.call(body, field.name)) continue;
    body[field.name] = normalizeDateFieldValue(body[field.name]);
  }
}

async function clearOtherIndexPages(exceptId?: string): Promise<void> {
  await prisma.pages.updateMany({
    where: {
      isIndexPage: true,
      ...(exceptId ? { id: { not: exceptId } } : {}),
    },
    data: {
      isIndexPage: false,
    },
  });
}

function getPrismaModel(collection: string) {
  const db = prisma as unknown as Record<string, unknown>;
  const delegateMap: Record<string, string> = {
    'contact-messages': 'contactMessages',
    'product-categories': 'productCategories',
  };
  const delegate = delegateMap[collection] ?? collection;
  return db[delegate] as {
    findMany: (args: unknown) => Promise<unknown[]>;
    count: (args: unknown) => Promise<number>;
    create: (args: unknown) => Promise<unknown>;
  } | undefined;
}

// ────────────────────────────────────────────────────────────────────────────
// GET — list documents
// ────────────────────────────────────────────────────────────────────────────

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { collection } = await params;

  if (!ALLOWED.has(collection)) {
    return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
  }

  const model = getPrismaModel(collection);
  if (!model) {
    return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const limit = Math.min(100, parseInt(searchParams.get('limit') ?? '20', 10));
  const search = searchParams.get('search') ?? '';
  const sortField = searchParams.get('sortField') ?? 'createdAt';
  const sortDir = searchParams.get('sortDir') === 'asc' ? 'asc' : 'desc';
  const rawFilters = searchParams.get('filters');

  const skip = (page - 1) * limit;

  const searchableFields = getSearchableFields(collection);
  const filterableFields = getFilterableFields(collection);
  let parsedFilters: Record<string, string> = {};
  if (rawFilters) {
    try {
      const candidate = JSON.parse(rawFilters) as Record<string, unknown>;
      const next: Record<string, string> = {};
      for (const [k, v] of Object.entries(candidate)) {
        if (
          typeof k === 'string' &&
          typeof v === 'string' &&
          v.trim().length > 0 &&
          filterableFields.has(k)
        ) {
          next[k] = v;
        }
      }
      parsedFilters = next;
    } catch {
      parsedFilters = {};
    }
  }

  const andClauses: Array<Record<string, unknown>> = [];
  if (search && searchableFields.length > 0) {
    andClauses.push({
      OR: searchableFields.map((field) => buildContainsFilter(field, search)),
    });
  }

  for (const [field, rawValue] of Object.entries(parsedFilters)) {
    const value = rawValue.trim();
    if (!value) continue;
    andClauses.push(buildContainsFilter(field, value));
  }

  const where = andClauses.length > 0 ? { AND: andClauses } : {};

  const include = INCLUDE_MAP[collection];

  let docs: unknown[] = [];
  let total = 0;
  try {
    [docs, total] = await Promise.all([
      model.findMany({ where, skip, take: limit, include, orderBy: { [sortField]: sortDir } }),
      model.count({ where }),
    ]);
  } catch {
    [docs, total] = await Promise.all([
      model.findMany({ where, skip, take: limit, include, orderBy: { createdAt: 'desc' } }),
      model.count({ where }),
    ]);
  }

  // Strip sensitive fields
  if (collection === 'users') {
    for (const doc of docs as Array<Record<string, unknown>>) {
      delete doc.passwordHash;
    }
  }

  return NextResponse.json({ docs, total, page, limit });
}

// ────────────────────────────────────────────────────────────────────────────
// POST — create document
// ────────────────────────────────────────────────────────────────────────────

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { collection } = await params;

  if (!ALLOWED.has(collection)) {
    return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
  }

  const model = getPrismaModel(collection);
  if (!model) {
    return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
  }

  const body: Record<string, unknown> = await request.json();

  if (collection === 'blocks') {
    if (body.content === undefined || body.content === null) {
      body.content = {};
    }
    if (body.contentDefinition === undefined) {
      body.contentDefinition = null;
    }
    if (!supportsBlocksContentDefinition()) {
      delete body.contentDefinition;
    }
    if (!supportsBlocksDataSource()) {
      delete body.dataSource;
    }
  }

  // Remap upload objects/ids to scalar FKs
  for (const col of ['pages', 'posts'] as const) {
    if (collection === col && Object.prototype.hasOwnProperty.call(body, 'featuredImage')) {
      const fi = body.featuredImage;
      body.featuredImageId = fi === null || fi === undefined ? null
        : typeof fi === 'string' ? fi
        : typeof fi === 'object' && 'id' in (fi as Record<string, unknown>) ? (fi as Record<string, unknown>).id
        : null;
      delete body.featuredImage;
    }
  }
  if (collection === 'product-categories' && Object.prototype.hasOwnProperty.call(body, 'image')) {
    const image = body.image;
    body.imageId = image === null || image === undefined ? null
      : typeof image === 'string' ? image
      : typeof image === 'object' && 'id' in (image as Record<string, unknown>) ? (image as Record<string, unknown>).id
      : null;
    delete body.image;
  }
  if (collection === 'countries' && Object.prototype.hasOwnProperty.call(body, 'backgroundImage')) {
    const image = body.backgroundImage;
    body.backgroundImageId = image === null || image === undefined ? null
      : typeof image === 'string' ? image
      : typeof image === 'object' && 'id' in (image as Record<string, unknown>) ? (image as Record<string, unknown>).id
      : null;
    delete body.backgroundImage;
  }
  if (collection === 'contact-messages' && Object.prototype.hasOwnProperty.call(body, 'assignedTo')) {
    const assigned = body.assignedTo;
    body.assignedToId = assigned === null || assigned === undefined ? null
      : typeof assigned === 'string' ? assigned
      : typeof assigned === 'object' && 'id' in (assigned as Record<string, unknown>) ? (assigned as Record<string, unknown>).id
      : null;
    delete body.assignedTo;
  }

  // Posts: remap category and author relation objects to scalar FKs
  if (collection === 'posts') {
    if (Object.prototype.hasOwnProperty.call(body, 'category')) {
      const cat = body.category;
      body.categoryId = cat === null || cat === undefined ? null
        : typeof cat === 'string' ? cat
        : typeof cat === 'object' && 'id' in (cat as Record<string, unknown>) ? (cat as Record<string, unknown>).id
        : null;
      delete body.category;
    }
    if (Object.prototype.hasOwnProperty.call(body, 'author')) {
      const au = body.author;
      body.authorId = au === null || au === undefined ? null
        : typeof au === 'string' ? au
        : typeof au === 'object' && 'id' in (au as Record<string, unknown>) ? (au as Record<string, unknown>).id
        : null;
      delete body.author;
    }
  }

  if (collection === 'products' && Object.prototype.hasOwnProperty.call(body, 'category')) {
    const cat = body.category;
    body.categoryId = cat === null || cat === undefined ? null
      : typeof cat === 'string' ? cat
      : typeof cat === 'object' && 'id' in (cat as Record<string, unknown>) ? (cat as Record<string, unknown>).id
      : null;
    delete body.category;
  }

  if (collection === 'posts') {
    const nextSlug = normalizeLocalizedSlugFromTitle(body.title, body.slug);
    if (nextSlug) {
      body.slug = nextSlug;
    }
  }

  // Enforce per-locale slug uniqueness for pages and posts (Json column can't use DB unique index)
  if ((collection === 'pages' || collection === 'posts') && body.slug && typeof body.slug === 'object') {
    const slugEntries = Object.entries(body.slug as Record<string, string>);
    const existingDocs = collection === 'pages'
      ? await prisma.pages.findMany({ select: { id: true, slug: true } })
      : await prisma.posts.findMany({ select: { id: true, slug: true } });
    for (const [locale, localeSlug] of slugEntries) {
      if (!localeSlug) continue;
      const existing = existingDocs.find((doc) => getLocalizedValue(doc.slug, locale) === localeSlug);
      if (existing) {
        return NextResponse.json(
          { error: `Slug "${localeSlug}" is already in use for locale "${locale}"` },
          { status: 409 }
        );
      }
    }
  }

  // Comments: default status to 'pending' if not provided
  if (collection === 'comments' && !body.status) {
    body.status = 'pending';
  }

  // Extract many-to-many relation arrays before building data
  const rolesIds = body.roles as string[] | undefined;
  const permissionsIds = body.permissions as string[] | undefined;
  delete body.roles;
  delete body.permissions;

  // Hash password if provided
  if (collection === 'users' && typeof body.password === 'string' && body.password) {
    body.passwordHash = await bcrypt.hash(body.password, 12);
  }
  delete body.password;

  if (modelHasField(collection, 'documentId')) {
    body.documentId = typeof body.documentId === 'string' && body.documentId.trim().length > 0
      ? body.documentId
      : createDocumentId();
  } else {
    delete body.documentId;
  }

  normalizeCollectionDateFields(collection, body);
  stripNullScalarDefaultFields(collection, body);

  // Build Prisma data object
  const data: Record<string, unknown> = {
    ...body,
    status: body.status ?? 'active',
    createdBy: session.user.id,
  };

  // Attach many-to-many connections
  if (collection === 'users' && rolesIds) {
    data.roles = { connect: rolesIds.map((id) => ({ id })) };
  }
  if (collection === 'roles' && permissionsIds) {
    data.permissions = { connect: permissionsIds.map((id) => ({ id })) };
  }

  try {
    const doc = await (model as { create: (args: unknown) => Promise<unknown> }).create({
      data,
      include: INCLUDE_MAP[collection],
    });

    if (collection === 'pages' && data.isIndexPage === true) {
      await clearOtherIndexPages((doc as { id?: string }).id);
    }

    if (collection === 'users' && body.id) {
      invalidatePrincipalCache(body.id as string);
    }

    return NextResponse.json({ doc }, { status: 201 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
