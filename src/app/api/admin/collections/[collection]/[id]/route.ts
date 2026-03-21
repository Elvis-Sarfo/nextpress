/**
 * Admin Collection API — Get, Update, Delete a single document
 * GET    /api/admin/collections/[collection]/[id]  → fetch one document
 * PUT    /api/admin/collections/[collection]/[id]  → update document
 * DELETE /api/admin/collections/[collection]/[id]  → delete document
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/adapters/prisma-adapter';
import bcrypt from 'bcryptjs';
import { invalidatePrincipalCache } from '@/lib/rbac-service';
import { invalidateSettingsCache } from '@/lib/cms';
import { getCollection } from '@/lib/collections-data';
import { slugify } from '@/lib/utils';

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

const ALLOWED = new Set([
  'users', 'roles', 'permissions', 'media', 'pages', 'settings', 'blocks', 'menus',
  'categories', 'posts', 'comments', 'contact-messages', 'product-categories', 'products', 'countries', 'jobs',
]);

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
  const delegateMap: Record<string, string> = {
    'contact-messages': 'contactMessages',
    'product-categories': 'productCategories',
  };
  const delegate = delegateMap[collection] ?? collection;
  return db[delegate] as {
    findUnique: (args: unknown) => Promise<unknown>;
    update: (args: unknown) => Promise<unknown>;
    delete: (args: unknown) => Promise<unknown>;
  } | undefined;
}

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

function normalizeDateFieldValue(value: unknown): unknown {
  if (typeof value !== 'string') return value;

  const trimmed = value.trim();
  if (!trimmed) return null;

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

async function clearOtherIndexPages(exceptId: string): Promise<void> {
  await prisma.pages.updateMany({
    where: {
      isIndexPage: true,
      id: { not: exceptId },
    },
    data: {
      isIndexPage: false,
    },
  });
}

// ────────────────────────────────────────────────────────────────────────────
// GET — fetch one document
// ────────────────────────────────────────────────────────────────────────────

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ collection: string; id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { collection, id } = await params;

  if (!ALLOWED.has(collection)) {
    return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
  }

  const model = getPrismaModel(collection);
  if (!model) {
    return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
  }

  const doc = await model.findUnique({
    where: { id },
    include: INCLUDE_MAP[collection],
  });

  if (!doc) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  }

  // Strip sensitive fields from user responses
  if (collection === 'users') {
    const d = doc as Record<string, unknown>;
    delete d.passwordHash;
  }

  return NextResponse.json({ doc });
}

// ────────────────────────────────────────────────────────────────────────────
// PUT — update document
// ────────────────────────────────────────────────────────────────────────────

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string; id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { collection, id } = await params;

  if (!ALLOWED.has(collection)) {
    return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
  }

  const model = getPrismaModel(collection);
  if (!model) {
    return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
  }

  const body: Record<string, unknown> = await request.json();

  if (collection === 'blocks') {
    if (Object.prototype.hasOwnProperty.call(body, 'content') && body.content === null) {
      body.content = {};
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

  if ((collection === 'pages' || collection === 'posts') && body.slug && typeof body.slug === 'object') {
    const slugEntries = Object.entries(body.slug as Record<string, string>);
    const existingDocs = collection === 'pages'
      ? await prisma.pages.findMany({ select: { id: true, slug: true } })
      : await prisma.posts.findMany({ select: { id: true, slug: true } });

    for (const [locale, localeSlug] of slugEntries) {
      if (!localeSlug) continue;
      const existing = existingDocs.find(
        (doc) => doc.id !== id && getLocalizedValue(doc.slug, locale) === localeSlug,
      );
      if (existing) {
        return NextResponse.json(
          { error: `Slug "${localeSlug}" is already in use for locale "${locale}"` },
          { status: 409 },
        );
      }
    }
  }

  // Extract many-to-many arrays
  const rolesIds = body.roles as string[] | undefined;
  const permissionsIds = body.permissions as string[] | undefined;
  delete body.roles;
  delete body.permissions;

  // Never allow overwriting system fields from external input
  delete body.id;
  delete body.createdAt;
  delete body.createdBy;
  delete body.passwordHash;

  // Hash password if a new one is provided
  if (collection === 'users' && typeof body.password === 'string' && body.password) {
    body.passwordHash = await bcrypt.hash(body.password, 12);
  }
  delete body.password;

  normalizeCollectionDateFields(collection, body);

  const data: Record<string, unknown> = { ...body };

  // Replace all role/permission connections (set replaces all existing links)
  if (collection === 'users' && rolesIds !== undefined) {
    data.roles = { set: rolesIds.map((rid) => ({ id: rid })) };
  }
  if (collection === 'roles' && permissionsIds !== undefined) {
    data.permissions = { set: permissionsIds.map((pid) => ({ id: pid })) };
  }

  try {
    const doc = await (model as { update: (args: unknown) => Promise<unknown> }).update({
      where: { id },
      data,
      include: INCLUDE_MAP[collection],
    });

    if (collection === 'pages' && data.isIndexPage === true) {
      await clearOtherIndexPages(id);
    }

    // Invalidate RBAC cache so the next request picks up fresh roles
    if (collection === 'users') {
      invalidatePrincipalCache(id);
    }
    // Invalidate settings cache when settings are updated
    if (collection === 'settings') {
      invalidateSettingsCache();
    }
    // If a role's permissions changed, invalidate all users who hold this role
    if (collection === 'roles') {
      // Broad invalidation — clear entire cache so every user gets fresh data
      const { clearPrincipalCache } = await import('@/lib/rbac-service');
      clearPrincipalCache();
    }

    if (collection === 'users') {
      const d = doc as Record<string, unknown>;
      delete d.passwordHash;
    }

    return NextResponse.json({ doc });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

// ────────────────────────────────────────────────────────────────────────────
// DELETE — remove document
// ────────────────────────────────────────────────────────────────────────────

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ collection: string; id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { collection, id } = await params;

  if (!ALLOWED.has(collection)) {
    return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
  }

  const model = getPrismaModel(collection);
  if (!model) {
    return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
  }

  try {
    await (model as { delete: (args: unknown) => Promise<unknown> }).delete({
      where: { id },
    });

    if (collection === 'users') {
      invalidatePrincipalCache(id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
