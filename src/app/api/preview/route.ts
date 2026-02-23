import { NextRequest, NextResponse } from 'next/server';
import { getPage, getPost, getNewsItem, localeEngine } from '@/lib/cms';
import { getLocale } from '@/lib/locale-utils';
import { draftMode } from 'next/headers';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  const type = searchParams.get('type'); // 'page', 'post', 'news'
  const locale = searchParams.get('locale') ?? localeEngine.getDefaultLocale();
  const secret = searchParams.get('secret');

  // Validate preview secret
  if (secret !== process.env.PREVIEW_SECRET) {
    return NextResponse.json({ error: 'Invalid preview secret' }, { status: 401 });
  }

  if (!id) {
    return NextResponse.json({ error: 'Missing content ID' }, { status: 400 });
  }

  try {
    let slug: string | undefined;

    if (type === 'page') {
      const page = await getPage(id);
      if (page) slug = getLocale(page.slug as Record<string, string> | null, locale) ?? undefined;
    } else if (type === 'post') {
      const post = await getPost(id);
      if (post) slug = getLocale(post.slug as Record<string, string> | null, locale) ?? undefined;
    } else if (type === 'news') {
      const news = await getNewsItem(id);
      if (news) slug = getLocale(news.slug as Record<string, string> | null, locale) ?? undefined;
    } else {
      // Try all types
      const [page, post, news] = await Promise.all([
        getPage(id),
        getPost(id),
        getNewsItem(id),
      ]);

      if (page) slug = getLocale(page.slug as Record<string, string> | null, locale) ?? undefined;
      else if (post) slug = getLocale(post.slug as Record<string, string> | null, locale) ?? undefined;
      else if (news) slug = getLocale(news.slug as Record<string, string> | null, locale) ?? undefined;
    }

    if (!slug) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

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

export async function POST() {
  // Disable draft mode
  const draft = await draftMode();
  draft.disable();

  return NextResponse.json({ success: true, message: 'Preview mode disabled' });
}
