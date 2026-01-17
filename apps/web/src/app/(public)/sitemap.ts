import { MetadataRoute } from 'next';
import { getContentTypes, getPublishedList, localeEngine } from '@/lib/cms';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  const locales = localeEngine.getSupportedLocales();
  const schemas = await getContentTypes();

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

  // Add content pages
  for (const schema of schemas) {
    for (const locale of locales) {
      const published = await getPublishedList(schema.id, locale, { limit: 1000 });

      for (const { entry, version } of published) {
        // Extract slug from version data
        const versionData = version.data as {
          locales?: Record<string, { slug?: string }>;
        };
        const slug = versionData?.locales?.[locale]?.slug;

        if (slug) {
          // Build alternates for this content
          const alternates: Record<string, string> = {};
          for (const altLocale of locales) {
            const altSlug = versionData?.locales?.[altLocale]?.slug;
            if (altSlug) {
              alternates[altLocale] = `${baseUrl}/${altLocale}/${altSlug}`;
            }
          }

          entries.push({
            url: `${baseUrl}/${locale}/${slug}`,
            lastModified: version.publishedAt ?? version.createdAt,
            changeFrequency: 'weekly',
            priority: 0.7,
            alternates: Object.keys(alternates).length > 1
              ? { languages: alternates }
              : undefined,
          });
        }
      }
    }
  }

  return entries;
}
