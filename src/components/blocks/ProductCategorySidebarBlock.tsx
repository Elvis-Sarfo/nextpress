'use client';

import { useParams } from 'next/navigation';
import { CatalogueSidebar } from '@/components/agbon/catalogue-sidebar';
import type { ProductCategoryRecord } from '@/lib/cms';
import type { BlockContent } from '@/core/blocks/types';

function asBoolean(value: unknown, fallback: boolean): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') return value === 'true'
  return fallback
}

function asLayoutMode(value: unknown, fallback: 'standard' | 'compact' | 'responsive') {
  return value === 'standard' || value === 'compact' || value === 'responsive' ? value : fallback
}

function asSearchMode(value: unknown, fallback: 'inline' | 'dialog' | 'auto') {
  return value === 'inline' || value === 'dialog' || value === 'auto' ? value : fallback
}

export function ProductCategorySidebarBlock({
  content,
  data,
}: {
  content: BlockContent;
  data?: unknown[];
}) {
  const params = useParams<{ locale?: string }>();
  const locale = typeof params?.locale === 'string' ? params.locale : 'en';
  const categories = Array.isArray(data) ? (data as ProductCategoryRecord[]) : [];
  const layoutMode = asLayoutMode(
    content.layoutMode,
    asBoolean(content.compactOnMobile, true) ? 'responsive' : 'standard',
  )
  const searchMode = asSearchMode(
    content.searchMode,
    asBoolean(content.showSearchButton, false) ? 'dialog' : 'auto',
  )

  return (
    <CatalogueSidebar
      locale={locale}
      categories={categories}
      layoutMode={layoutMode}
      searchMode={searchMode}
      showSearch={asBoolean(content.showSearch, true)}
      showAllProducts={asBoolean(content.showAllProducts, true)}
      showHotSelling={asBoolean(content.showHotSelling, true)}
      showCategoryHeading={asBoolean(content.showCategoryHeading, true)}
    />
  );
}
