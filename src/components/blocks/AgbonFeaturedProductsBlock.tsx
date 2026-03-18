'use client';

import { useParams } from 'next/navigation';
import { AgbonFeaturedProducts } from '@/components/agbon/featured-products';
import { DEFAULT_AGBON_PRODUCT_GRID_COLUMNS } from '@/components/agbon/product-list';
import { buildLocalizedPath } from '@/lib/agbon-routes';
import type { ProductRecord } from '@/lib/cms';
import type { BlockContent } from '@/core/blocks/types';

function asBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value === 'true';
  return fallback;
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

export function AgbonFeaturedProductsBlock({
  content,
  data,
}: {
  content: BlockContent;
  data?: unknown[];
}) {
  const params = useParams<{ locale?: string }>();
  const locale = typeof params?.locale === 'string' ? params.locale : 'en';
  const products = Array.isArray(data) ? (data as ProductRecord[]) : [];

  return (
    <AgbonFeaturedProducts
      products={products}
      locale={locale}
      title={asString(content.title, 'Hot Selling Products')}
      showViewAllButton={asBoolean(content.showViewAllButton, false)}
      viewAllLabel={asString(content.viewAllLabel, 'View All')}
      viewAllHref={buildLocalizedPath(locale, asString(content.viewAllHref, '/products'))}
      gridColumns={asString(content.gridColumns, DEFAULT_AGBON_PRODUCT_GRID_COLUMNS)}
    />
  );
}
