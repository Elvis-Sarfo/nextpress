'use server';

import { prisma } from '@/adapters/prisma-adapter/client';

export interface PageInfo {
  title: string;
  editHref: string;
}

/**
 * Given a public pathname (e.g. "/en/about" or "/en"), returns the matching
 * page title and admin edit link, or null if no page is found.
 */
export async function getPageInfoForPath(pathname: string): Promise<PageInfo | null> {
  // Parse /{locale}/{slug} or /{locale} (home)
  const match = pathname.match(/^\/([a-z]{2,5})(?:\/([^/]+))?(?:\/.*)?$/);
  const locale = match?.[1] ?? null;
  const slug   = match?.[2] ?? (locale ? 'home' : null);

  if (!locale || !slug) return null;

  try {
    const page = await prisma.pages.findFirst({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      where: { slug: { path: `$.${locale}`, equals: slug } as any },
      select: { id: true, title: true },
    });

    if (!page) return null;

    const titleJson = (page.title as unknown) as Record<string, string> | null;
    const title = titleJson?.[locale] ?? titleJson?.['en'] ?? slug;

    return { title, editHref: `/admin/pages/${page.id}` };
  } catch {
    return null;
  }
}
