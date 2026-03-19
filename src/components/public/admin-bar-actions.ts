'use server';

import { prisma } from '@/adapters/prisma-adapter/client';
import { getPublishedPageByPath } from '@/lib/cms';

export interface PageInfo {
  title: string;
  editHref: string;
}

/**
 * Given a public pathname (e.g. "/en/about" or "/en"), returns the matching
 * page title and admin edit link, or null if no page is found.
 */
export async function getPageInfoForPath(pathname: string): Promise<PageInfo | null> {
  const parts = pathname.split('/').filter(Boolean);
  const locale = parts[0] ?? null;
  const slugParts = parts.slice(1);

  if (!locale) return null;

  if (slugParts.length === 0) {
    const homePage = await prisma.pages.findFirst({
      where: { status: 'published', isIndexPage: true },
      select: { id: true, title: true },
    });

    if (!homePage) return null;

    const titleJson = homePage.title as Record<string, string> | null;
    const title = titleJson?.[locale] ?? titleJson?.['en'] ?? 'home';
    return { title, editHref: `/admin/pages/${homePage.id}` };
  }

  try {
    const match = await getPublishedPageByPath(locale, slugParts);
    if (!match) return null;

    const titleJson = match.page.title as Record<string, string> | null;
    const title = titleJson?.[locale] ?? titleJson?.['en'] ?? slugParts.join('/');

    return { title, editHref: `/admin/pages/${match.page.id}` };
  } catch {
    return null;
  }
}
