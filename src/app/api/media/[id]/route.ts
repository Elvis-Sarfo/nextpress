import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import {
  deleteMediaById,
  getMediaById,
  updateMediaById,
} from '@/lib/media/service';
import { deleteStoredFile } from '@/lib/storage/provider';

function canWrite(role?: string) {
  return role === 'admin' || role === 'editor';
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const doc = await getMediaById(id);
  if (!doc) {
    return NextResponse.json({ error: 'Media not found.' }, { status: 404 });
  }

  return NextResponse.json({ doc });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || !canWrite(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const body = (await request.json()) as {
    altText?: string;
    title?: string;
    description?: string;
    metadata?: Record<string, unknown>;
  };

  try {
    const doc = await updateMediaById(id, body);
    return NextResponse.json({ doc });
  } catch {
    return NextResponse.json({ error: 'Unable to update media.' }, { status: 400 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || !canWrite(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const current = await getMediaById(id);
  if (!current) {
    return NextResponse.json({ error: 'Media not found.' }, { status: 404 });
  }

  await deleteMediaById(id);

  if (current.storageKey) {
    await deleteStoredFile({ key: current.storageKey, url: current.url });
  }

  return NextResponse.json({ success: true });
}
