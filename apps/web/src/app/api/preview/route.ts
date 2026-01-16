import { NextRequest, NextResponse } from 'next/server';
import { contentStore, localeEngine } from '@/lib/cms';
import { contentId } from '@cms/kernel';
import { cookies, draftMode } from 'next/headers';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const contentIdStr = searchParams.get('id');
  const locale = searchParams.get('locale') ?? localeEngine.getDefaultLocale();
  const secret = searchParams.get('secret');

  // Validate preview secret
  if (secret !== process.env.PREVIEW_SECRET) {
    return NextResponse.json({ error: 'Invalid preview secret' }, { status: 401 });
  }

  if (!contentIdStr) {
    return NextResponse.json({ error: 'Missing content ID' }, { status: 400 });
  }

  try {
    const entry = await contentStore.getById(contentId(contentIdStr));

    if (!entry) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    // Get the draft version data
    const localeData = entry.currentVersion?.data.find((d) => d.locale === locale);
    const slug = localeData?.slug ?? entry.id;

    // Enable draft mode
    const draft = await draftMode();
    draft.enable();

    // Redirect to the content page
    return NextResponse.redirect(new URL(`/${locale}/${slug}`, request.url));
  } catch (error) {
    console.error('Preview error:', error);
    return NextResponse.json({ error: 'Preview failed' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Disable draft mode
  const draft = await draftMode();
  draft.disable();

  return NextResponse.json({ success: true, message: 'Preview mode disabled' });
}
