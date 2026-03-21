import { NextRequest, NextResponse } from 'next/server';
import { getPage, getPost, getNewsItem, localeEngine } from '@/lib/cms';
import { getCategorySlugForLocale, getLocale } from '@/lib/locale-utils';
import { draftMode } from 'next/headers';
import { auth } from '@/auth';
import type { SerializedPermission } from '@/types/permissions';
import { buildLocalizedPath, buildPostItemPath } from '@/lib/agbon-routes';

type PreviewSession = {
  user?: {
    isAdmin?: boolean;
    perms?: SerializedPermission[];
  };
} | null;

function canPreviewPages(session: PreviewSession): boolean {
  if (!session?.user) return false;
  if (session.user.isAdmin) return true;

  const perms = Array.isArray(session.user.perms)
    ? (session.user.perms as SerializedPermission[])
    : [];

  return perms.some((perm) => perm.r === 'content' && perm.a === 'read');
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  const type = searchParams.get('type'); // 'page', 'post', 'news'
  const locale = searchParams.get('locale') ?? localeEngine.getDefaultLocale();
  const session = await auth();

  if (!canPreviewPages(session)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (!id) {
    return NextResponse.json({ error: 'Missing content ID' }, { status: 400 });
  }

  try {
    let previewPath: string | undefined;

    if (type === 'page') {
      const page = await getPage(id);
      const slug = page ? getLocale(page.slug as Record<string, string> | null, locale) ?? undefined : undefined;
      if (slug) previewPath = buildLocalizedPath(locale, `/${slug}`);
    } else if (type === 'post') {
      const post = await getPost(id);
      const slug = post ? getLocale(post.slug as Record<string, string> | null, locale) ?? undefined : undefined;
      const categorySlug = getCategorySlugForLocale(post?.category, locale);
      if (slug && categorySlug) previewPath = buildPostItemPath(locale, categorySlug, slug);
    } else if (type === 'news') {
      const news = await getNewsItem(id);
      const slug = news ? getLocale(news.slug as Record<string, string> | null, locale) ?? undefined : undefined;
      const categorySlug = getCategorySlugForLocale(news?.category, locale);
      if (slug && categorySlug) previewPath = buildPostItemPath(locale, categorySlug, slug);
    } else {
      // Try all types
      const [page, post, news] = await Promise.all([
        getPage(id),
        getPost(id),
        getNewsItem(id),
      ]);

      if (page) {
        const slug = getLocale(page.slug as Record<string, string> | null, locale) ?? undefined;
        if (slug) previewPath = buildLocalizedPath(locale, `/${slug}`);
      } else if (post) {
        const slug = getLocale(post.slug as Record<string, string> | null, locale) ?? undefined;
        const categorySlug = getCategorySlugForLocale(post.category, locale);
        if (slug && categorySlug) previewPath = buildPostItemPath(locale, categorySlug, slug);
      } else if (news) {
        const slug = getLocale(news.slug as Record<string, string> | null, locale) ?? undefined;
        const categorySlug = getCategorySlugForLocale(news.category, locale);
        if (slug && categorySlug) previewPath = buildPostItemPath(locale, categorySlug, slug);
      }
    }

    if (!previewPath) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    // Enable draft mode
    const draft = await draftMode();
    draft.enable();

    // Redirect to the content page
    return NextResponse.redirect(new URL(previewPath, request.url));
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
