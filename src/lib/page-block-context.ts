import type { BlockPageContext } from '@/core/blocks/types';
import { getLocale } from '@/lib/locale-utils';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getSubtitleValue(value: unknown, locale: string): string | undefined {
  if (typeof value === 'string' && value.trim()) return value;

  if (isRecord(value)) {
    return getLocale(
      Object.fromEntries(
        Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === 'string'),
      ),
      locale,
    );
  }

  return undefined;
}

function getConfigSubtitle(config: unknown, locale: string): string | undefined {
  if (!isRecord(config)) return undefined;

  const directSubtitle = config.subtitle;
  if (typeof directSubtitle === 'string' && directSubtitle.trim()) return directSubtitle;

  const directSubTitle = config.subTitle;
  if (typeof directSubTitle === 'string' && directSubTitle.trim()) return directSubTitle;

  if (isRecord(directSubtitle)) {
    return getLocale(
      Object.fromEntries(
        Object.entries(directSubtitle).filter((entry): entry is [string, string] => typeof entry[1] === 'string'),
      ),
      locale,
    );
  }

  if (isRecord(directSubTitle)) {
    return getLocale(
      Object.fromEntries(
        Object.entries(directSubTitle).filter((entry): entry is [string, string] => typeof entry[1] === 'string'),
      ),
      locale,
    );
  }

  return undefined;
}

export function buildPageBlockContext(page: {
  title?: Record<string, string> | null;
  subtitle?: unknown;
  excerpt?: Record<string, string> | null;
  config?: unknown;
  featuredImage?: { url?: string | null; altText?: string | null } | null;
}, locale: string): BlockPageContext {
  return {
    title: getLocale(page.title ?? null, locale),
    subTitle:
      getSubtitleValue(page.subtitle, locale) ??
      getConfigSubtitle(page.config, locale) ??
      getLocale(page.excerpt ?? null, locale),
    featuredImage: page.featuredImage?.url ?? undefined,
    featuredImageAlt: page.featuredImage?.altText ?? undefined,
  };
}
