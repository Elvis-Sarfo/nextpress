import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import {
  createMedia,
  listMedia,
  validateFileInput,
} from '@/lib/media/service';
import { getStorageProvider, storeServerFile } from '@/lib/storage/provider';

function canWrite(role?: string) {
  return role === 'admin' || role === 'editor';
}

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page') || '1');
  const limit = Number(searchParams.get('limit') || '24');
  const query = searchParams.get('q') || undefined;
  const type = searchParams.get('type') || undefined;

  const data = await listMedia({ page, limit, query, type });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || !canWrite(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('multipart/form-data')) {
    if (getStorageProvider() !== 'local') {
      return NextResponse.json(
        { error: 'Use /api/media/signed-upload for non-local storage providers.' },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Missing file.' }, { status: 400 });
    }

    const validationError = validateFileInput({
      filename: file.name,
      mimeType: file.type,
      size: file.size,
    });

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const stored = await storeServerFile({
      filename: file.name,
      mimeType: file.type,
      content: buffer,
    });

    const width = Number(formData.get('width') || 0) || undefined;
    const height = Number(formData.get('height') || 0) || undefined;

    const doc = await createMedia({
      filename: file.name,
      originalFilename: file.name,
      url: stored.url,
      storageKey: stored.key,
      storageProvider: stored.provider,
      mimeType: file.type,
      size: file.size,
      width,
      height,
      altText: String(formData.get('altText') || ''),
      title: String(formData.get('title') || ''),
      description: String(formData.get('description') || ''),
      metadata: {
        uploaderId: session.user.id,
      },
    });

    return NextResponse.json({ doc }, { status: 201 });
  }

  // Finalization endpoint for direct-to-cloud uploads.
  const body = (await request.json()) as {
    filename: string;
    originalFilename?: string;
    mimeType: string;
    size: number;
    url: string;
    storageKey: string;
    storageProvider: string;
    width?: number;
    height?: number;
    altText?: string;
    title?: string;
    description?: string;
    metadata?: Record<string, unknown>;
  };

  const validationError = validateFileInput({
    filename: body.filename,
    mimeType: body.mimeType,
    size: body.size,
  });
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  if (!body.url || !body.storageKey) {
    return NextResponse.json({ error: 'Missing uploaded file details.' }, { status: 400 });
  }

  const doc = await createMedia({
    filename: body.filename,
    originalFilename: body.originalFilename,
    url: body.url,
    storageKey: body.storageKey,
    storageProvider: body.storageProvider,
    mimeType: body.mimeType,
    size: body.size,
    width: body.width,
    height: body.height,
    altText: body.altText,
    title: body.title,
    description: body.description,
    metadata: {
      ...(body.metadata || {}),
      uploaderId: session.user.id,
    },
  });

  return NextResponse.json({ doc }, { status: 201 });
}
