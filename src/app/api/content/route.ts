import { NextRequest, NextResponse } from 'next/server';
import { getPages, getPosts, getNews, getStandardPosts } from '@/lib/cms';
import { getLocale } from '@/lib/locale-utils';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type'); // 'page', 'post', 'news', or null for all
  const limit = parseInt(searchParams.get('limit') ?? '20', 10);
  const offset = parseInt(searchParams.get('offset') ?? '0', 10);
  const status = searchParams.get('status') as 'DRAFT' | 'PUBLISHED' | null;

  try {
    if (type === 'page') {
      const result = await getPages({ limit, offset, status: status ?? undefined });
      return NextResponse.json({
        type: 'page',
        items: result.pages.map((p) => ({
          id: p.id,
          documentId: p.documentId,
          status: p.status,
          title: getLocale(p.title as Record<string, string> | null, 'en') ?? 'Untitled',
          slug: getLocale(p.slug as Record<string, string> | null, 'en') ?? '',
          createdAt: p.createdAt,
          publishedAt: p.publishedAt,
        })),
        total: result.total,
        limit,
        offset,
      });
    }

    if (type === 'post') {
      const result = await getStandardPosts({ limit, offset, status: status ?? undefined });
      return NextResponse.json({
        type: 'post',
        items: result.posts.map((p) => ({
          id: p.id,
          documentId: p.documentId,
          status: p.status,
          title: getLocale(p.title as Record<string, string> | null, 'en') ?? 'Untitled',
          slug: getLocale(p.slug as Record<string, string> | null, 'en') ?? '',
          createdAt: p.createdAt,
          publishedAt: p.publishedAt,
        })),
        total: result.total,
        limit,
        offset,
      });
    }

    if (type === 'news') {
      const result = await getNews({ limit, offset, status: status ?? undefined });
      return NextResponse.json({
        type: 'news',
        items: result.news.map((n) => ({
          id: n.id,
          documentId: n.documentId,
          status: n.status,
          title: getLocale(n.title as Record<string, string> | null, 'en') ?? 'Untitled',
          slug: getLocale(n.slug as Record<string, string> | null, 'en') ?? '',
          category: n.category,
          createdAt: n.createdAt,
          publishedAt: n.publishedAt,
        })),
        total: result.total,
        limit,
        offset,
      });
    }

    // Get all content types
    const [pagesResult, postsResult, newsResult] = await Promise.all([
      getPages({ limit: 10, status: status ?? undefined }),
      getStandardPosts({ limit: 10, status: status ?? undefined }),
      getNews({ limit: 10, status: status ?? undefined }),
    ]);

    const allItems = [
      ...pagesResult.pages.map((p) => ({
        type: 'page' as const,
        id: p.id,
        documentId: p.documentId,
        status: p.status,
        title: getLocale(p.title as Record<string, string> | null, 'en') ?? 'Untitled',
        slug: getLocale(p.slug as Record<string, string> | null, 'en') ?? '',
        createdAt: p.createdAt,
        publishedAt: p.publishedAt,
      })),
      ...postsResult.posts.map((p) => ({
        type: 'post' as const,
        id: p.id,
        documentId: p.documentId,
        status: p.status,
        title: getLocale(p.title as Record<string, string> | null, 'en') ?? 'Untitled',
        slug: getLocale(p.slug as Record<string, string> | null, 'en') ?? '',
        createdAt: p.createdAt,
        publishedAt: p.publishedAt,
      })),
      ...newsResult.news.map((n) => ({
        type: 'news' as const,
        id: n.id,
        documentId: n.documentId,
        status: n.status,
        title: getLocale(n.title as Record<string, string> | null, 'en') ?? 'Untitled',
        slug: getLocale(n.slug as Record<string, string> | null, 'en') ?? '',
        createdAt: n.createdAt,
        publishedAt: n.publishedAt,
      })),
    ];

    // Sort by createdAt desc
    allItems.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return NextResponse.json({
      items: allItems.slice(offset, offset + limit),
      total: pagesResult.total + postsResult.total + newsResult.total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Failed to fetch content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

// POST endpoint for creating content - to be implemented
export async function POST() {
  return NextResponse.json(
    { error: 'Not implemented. Use /api/pages, /api/posts, or /api/news endpoints.' },
    { status: 501 }
  );
}
