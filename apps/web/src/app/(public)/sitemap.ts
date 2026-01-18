import { MetadataRoute } from 'next';
import { getPages, getPosts, getNews, localeEngine } from '@/lib/cms';

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
  const [pagesResult, postsResult, newsResult] = await Promise.all([
    getPages({ status: 'PUBLISHED', limit: 1000 }),
    getPosts({ status: 'PUBLISHED', limit: 1000 }),
    getNews({ status: 'PUBLISHED', limit: 1000 }),
  ]);

  // Add pages to sitemap
  for (const page of pagesResult.pages) {
    for (const localeData of page.locales) {
      // Build alternates for this content
      const alternates: Record<string, string> = {};
      for (const alt of page.locales) {
        alternates[alt.locale] = `${baseUrl}/${alt.locale}/${alt.slug}`;
      }

      entries.push({
        url: `${baseUrl}/${localeData.locale}/${localeData.slug}`,
        lastModified: page.publishedAt ?? page.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates:
          Object.keys(alternates).length > 1 ? { languages: alternates } : undefined,
      });
    }
  }

  // Add posts to sitemap
  for (const post of postsResult.posts) {
    for (const localeData of post.locales) {
      const alternates: Record<string, string> = {};
      for (const alt of post.locales) {
        alternates[alt.locale] = `${baseUrl}/${alt.locale}/${alt.slug}`;
      }

      entries.push({
        url: `${baseUrl}/${localeData.locale}/${localeData.slug}`,
        lastModified: post.publishedAt ?? post.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates:
          Object.keys(alternates).length > 1 ? { languages: alternates } : undefined,
      });
    }
  }

  // Add news to sitemap
  for (const news of newsResult.news) {
    for (const localeData of news.locales) {
      const alternates: Record<string, string> = {};
      for (const alt of news.locales) {
        alternates[alt.locale] = `${baseUrl}/${alt.locale}/${alt.slug}`;
      }

      entries.push({
        url: `${baseUrl}/${localeData.locale}/${localeData.slug}`,
        lastModified: news.publishedAt ?? news.updatedAt,
        changeFrequency: 'daily',
        priority: 0.6,
        alternates:
          Object.keys(alternates).length > 1 ? { languages: alternates } : undefined,
      });
    }
  }

  return entries;
}
