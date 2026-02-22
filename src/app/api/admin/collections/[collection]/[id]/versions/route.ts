/**
 * Version history API
 * GET /api/admin/collections/[collection]/[id]/versions
 *   → returns all saved versions for the document, newest first
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/adapters/prisma-adapter';

const VERSION_MODEL_MAP: Record<string, 'pagesVersion' | 'mediaVersion'> = {
  pages: 'pagesVersion',
  media: 'mediaVersion',
};

type VersionModel = {
  findMany: (args: unknown) => Promise<unknown[]>;
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ collection: string; id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { collection, id } = await params;

  const modelKey = VERSION_MODEL_MAP[collection];
  if (!modelKey) {
    return NextResponse.json({ error: 'No version history for this collection' }, { status: 404 });
  }

  // Get the document's documentId
  const db = prisma as unknown as Record<string, { findUnique: (args: unknown) => Promise<Record<string, unknown> | null> }>;
  const docModel = db[collection];
  if (!docModel) return NextResponse.json({ error: 'Collection not found' }, { status: 404 });

  const doc = await docModel.findUnique({ where: { id }, select: { documentId: true } } as unknown as never);
  if (!doc) return NextResponse.json({ error: 'Document not found' }, { status: 404 });

  const versionModel = (prisma as unknown as Record<string, VersionModel>)[modelKey];
  const versions = await versionModel.findMany({
    where: { documentId: (doc as Record<string, unknown>).documentId },
    orderBy: { version: 'desc' },
  });

  return NextResponse.json({ versions });
}
