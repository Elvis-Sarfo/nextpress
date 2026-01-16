import { MetadataRoute } from 'next';
import { contentStore, schemaEngine, localeEngine } from '@/lib/cms';
import { SitemapProvider } from '@cms/kernel';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

  const sitemapProvider = new SitemapProvider({
    baseUrl,
    defaultChangeFrequency: 'weekly',
    defaultPriority: 0.5,
    includeLocaleAlternates: true,
  });

  const schemas = await schemaEngine.getAllSchemas();
  const locales = localeEngine.getEnabledLocales();

  // Fetch all published content
  const content = await contentStore.query({
    filter: { status: 'PUBLISHED' },
    pageSize: 1000,
  });

  const schemaMap = new Map(schemas.map((s) => [s.id, s]));

  // Generate sitemap entries
  const entries = sitemapProvider.generateEntries(
    content.items,
    schemaMap,
    locales
  );

  // Convert to Next.js sitemap format
  return entries.map((entry) => ({
    url: entry.url,
    lastModified: entry.lastModified,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
    alternates: entry.alternates
      ? {
          languages: Object.fromEntries(
            entry.alternates.map((alt) => [alt.locale, alt.url])
          ),
        }
      : undefined,
  }));
}
