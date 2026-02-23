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

const ALLOWED = new Set([
  'users', 'roles', 'permissions', 'media', 'pages', 'settings', 'blocks', 'menus',
  'categories', 'posts', 'comments',
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
  return db[collection] as {
    findUnique: (args: unknown) => Promise<unknown>;
    update: (args: unknown) => Promise<unknown>;
    delete: (args: unknown) => Promise<unknown>;
  } | undefined;
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
