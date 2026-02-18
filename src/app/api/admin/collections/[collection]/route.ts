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
};

// Allowed collection slugs that this API handles
const ALLOWED = new Set(['users', 'roles', 'permissions', 'media', 'pages', 'settings']);

// Fields to use for full-text search per collection (only fields that actually exist)
const SEARCH_FIELDS: Record<string, string[]> = {
  users: ['name', 'email'],
  roles: ['name', 'displayName', 'description'],
  permissions: ['name', 'resource', 'action'],
  media: ['filename', 'alt', 'caption'],
  pages: ['title', 'slug'],
  settings: ['siteName'],
};

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

  const skip = (page - 1) * limit;

  const searchableFields = SEARCH_FIELDS[collection] ?? [];
  const where = search && searchableFields.length > 0
    ? {
        OR: searchableFields.map((field) => ({
          [field]: { contains: search, mode: 'insensitive' },
        })),
      }
    : {};

  const include = INCLUDE_MAP[collection];

  const [docs, total] = await Promise.all([
    model.findMany({ where, skip, take: limit, include, orderBy: { createdAt: 'desc' } }),
    model.count({ where }),
  ]);

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
