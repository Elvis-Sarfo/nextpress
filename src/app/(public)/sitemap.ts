import { MetadataRoute } from 'next';
import { getPages, getPosts, getProductCategories, localeEngine } from '@/lib/cms';
import { buildProductCategoryPath } from '@/lib/agbon-routes';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  const locales = localeEngine.getSupportedLocales();

  const entries: MetadataRoute.Sitemap = [];

  // Add home pages for each locale
  for (const locale of locales) {
    entries.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    });
  }

  // Fetch all published content
  const [pagesResult, postsResult, productCategories] = await Promise.all([
    getPages({ status: 'PUBLISHED', limit: 1000 }),
    getPosts({ status: 'PUBLISHED', limit: 1000 }),
    getProductCategories(),
  ]);

  // Add pages to sitemap — pages use locale-first JSON slug: { en: '...', fr: '...' }
  for (const page of pagesResult.pages) {
    const slugMap = page.slug as Record<string, string> | null;
    if (!slugMap) continue;
    const alternates: Record<string, string> = {};
    for (const [loc, slug] of Object.entries(slugMap)) {
      if (slug) alternates[loc] = `${baseUrl}/${loc}/${slug}`;
    }
    for (const [loc, url] of Object.entries(alternates)) {
      entries.push({
        url,
        lastModified: page.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: Object.keys(alternates).length > 1 ? { languages: alternates } : undefined,
      });
      // Only emit one entry per page — let the first locale be canonical
      void loc;
      break;
    }
  }

  // Add posts to sitemap — same locale-first JSON pattern
  for (const post of postsResult.posts) {
    const slugMap = post.slug as Record<string, string> | null;
    if (!slugMap) continue;
    const alternates: Record<string, string> = {};
    for (const [loc, slug] of Object.entries(slugMap)) {
      if (slug) alternates[loc] = `${baseUrl}/${loc}/${slug}`;
    }
    for (const url of Object.values(alternates)) {
      entries.push({
        url,
        lastModified: post.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: Object.keys(alternates).length > 1 ? { languages: alternates } : undefined,
      });
      break;
    }
  }

  for (const category of productCategories) {
    const alternates = Object.fromEntries(
      locales.map((locale) => [locale, `${baseUrl}${buildProductCategoryPath(locale, category.path)}`]),
    );

    entries.push({
      url: `${baseUrl}${buildProductCategoryPath(locales[0], category.path)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
      alternates: Object.keys(alternates).length > 1 ? { languages: alternates } : undefined,
    });
  }

  return entries;
}
