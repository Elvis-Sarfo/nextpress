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

// Collections that have many-to-many relations we want to include in responses
const INCLUDE_MAP: Record<string, object> = {
  users: { roles: { select: { id: true, name: true, displayName: true } } },
  roles: { permissions: { select: { id: true, name: true, resource: true, action: true, scope: true } } },
  pages: { featuredImage: { select: { id: true, url: true, altText: true } } },
  posts: {
    category: { select: { id: true, name: true, color: true } },
    featuredImage: { select: { id: true, url: true, altText: true } },
    author: { select: { id: true, name: true, email: true } },
  },
  comments: {
    author: { select: { id: true, name: true, email: true } },
  },
};

// Allowed collection slugs that this API handles
const ALLOWED = new Set([
  'users', 'roles', 'permissions', 'media', 'pages', 'settings', 'blocks', 'menus',
  'categories', 'posts', 'comments',
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
  blocks: ['name', 'templateName'],
  menus: ['name', 'location'],
  categories: ['name'],
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

function getPrismaModel(collection: string) {
  const db = prisma as unknown as Record<string, unknown>;
  return db[collection] as {
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

  const searchableFields = SEARCH_FIELDS[collection] ?? [];
  let parsedFilters: Record<string, string> = {};
  if (rawFilters) {
    try {
      const candidate = JSON.parse(rawFilters) as Record<string, unknown>;
      const next: Record<string, string> = {};
      for (const [k, v] of Object.entries(candidate)) {
        if (typeof k === 'string' && typeof v === 'string' && v.trim().length > 0) {
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
      OR: searchableFields.map((field) => ({
        [field]: { contains: search, mode: 'insensitive' },
      })),
    });
  }

  for (const [field, rawValue] of Object.entries(parsedFilters)) {
    const value = rawValue.trim();
    if (!value) continue;
    andClauses.push({
      [field]: { contains: value, mode: 'insensitive' },
    });
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

  // Remap relation object/id to scalar FK for pages and posts
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

  // Enforce per-locale slug uniqueness for pages and posts (Json column can't use DB unique index)
  if ((collection === 'pages' || collection === 'posts') && body.slug && typeof body.slug === 'object') {
    const slugEntries = Object.entries(body.slug as Record<string, string>);
    for (const [locale, localeSlug] of slugEntries) {
      if (!localeSlug) continue;
      const jsonPath = `$.${locale}`;
      const existing = collection === 'pages'
        ? await prisma.pages.findFirst({ where: { slug: { path: jsonPath, equals: localeSlug } } })
        : await prisma.posts.findFirst({ where: { slug: { path: jsonPath, equals: localeSlug } } });
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

    if (collection === 'users' && body.id) {
      invalidatePrincipalCache(body.id as string);
    }

    return NextResponse.json({ doc }, { status: 201 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
