import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createSignedUpload, getStorageProvider } from '@/lib/storage/provider';
import { validateFileInput } from '@/lib/media/service';

function canWrite(role?: string) {
  return role === 'admin' || role === 'editor';
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || !canWrite(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = (await request.json()) as {
    filename: string;
    mimeType: string;
    size: number;
  };

  const validationError = validateFileInput({
    filename: body.filename,
    mimeType: body.mimeType,
    size: body.size,
  });

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  try {
    const signed = await createSignedUpload({
      filename: body.filename,
      mimeType: body.mimeType,
      size: body.size,
    });

    return NextResponse.json({
      ...signed,
      provider: getStorageProvider(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create signed upload URL.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
