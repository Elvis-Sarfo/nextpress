const DEFAULT_LOCALE = 'en';

/**
 * Extracts the value for a given locale from a locale-first JSON object.
 *
 * Works for both scalar fields:
 *   { en: "About", fr: "À propos" }  →  getLocale(obj, "fr") = "À propos"
 *
 * And multi-field block content:
 *   { en: { heading: "Hi", ctaText: "Click" }, fr: { ... } }
 *   →  getLocale(obj, "fr") = { heading: "...", ctaText: "..." }
 *
 * Falls back to DEFAULT_LOCALE if the requested locale is missing.
 */
export function getLocale<T>(
  localized: Record<string, T> | null | undefined,
  locale: string,
  fallback = DEFAULT_LOCALE,
): T | undefined {
  if (!localized) return undefined;
  return localized[locale] ?? localized[fallback];
}

/**
 * Returns all locale/slug pairs from a page's slug field.
 * Used for generating hreflang <link> tags and locale switchers.
 *
 * @example
 * getLocaleAlternates({ en: "about", fr: "a-propos" })
 * // → [{ locale: "en", slug: "about" }, { locale: "fr", slug: "a-propos" }]
 */
export function getLocaleAlternates(
  slugs: Record<string, string> | null | undefined,
): { locale: string; slug: string }[] {
  if (!slugs) return [];
  return Object.entries(slugs).map(([locale, slug]) => ({ locale, slug }));
}

export function getLocalizedSlug(
  value: Record<string, string> | null | undefined,
  locale: string,
  fallback = DEFAULT_LOCALE,
): string | undefined {
  if (!value) return undefined;
  return value[locale] ?? value[fallback];
}

export function getCategorySlugForLocale(
  category: { slug?: Record<string, string> | null } | null | undefined,
  locale: string,
): string | undefined {
  return getLocalizedSlug(category?.slug, locale);
}

export function getLocalizedRichTextHtml(
  localized: Record<string, unknown> | string | null | undefined,
  locale: string,
  fallback = DEFAULT_LOCALE,
): string | undefined {
  if (!localized) return undefined;
  if (typeof localized === 'string') return localized;

  const value = localized[locale] ?? localized[fallback];
  return typeof value === 'string' && value.trim() ? value : undefined;
}
