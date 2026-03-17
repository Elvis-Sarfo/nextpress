'use client';

import { useParams } from 'next/navigation';
import { AgbonProductList, DEFAULT_AGBON_PRODUCT_GRID_COLUMNS } from '@/components/agbon/product-list';
import type { ProductCategoryRecord, ProductRecord } from '@/lib/cms';
import type { BlockContent } from '@/core/blocks/types';

function asBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value === 'true';
  return fallback;
}

function asNumber(value: unknown, fallback: number): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

type ProductWithCategory = ProductRecord & {
  category?: ProductCategoryRecord | string | null;
};

export function AgbonProductListBlock({
  content,
  data,
}: {
  content: BlockContent;
  data?: unknown[];
}) {
  const params = useParams<{ locale?: string }>();
  const locale = typeof params?.locale === 'string' ? params.locale : 'en';
  const products = Array.isArray(data) ? (data as ProductWithCategory[]) : [];

  const categories = products
    .map((product) => product.category)
    .filter((category): category is ProductCategoryRecord => Boolean(category && typeof category === 'object' && 'id' in category));

  return (
    <AgbonProductList
      products={products}
      categories={categories}
      locale={locale}
      itemsPerPage={asNumber(content.itemsPerPage, 12)}
      gridColumns={asString(content.gridColumns, DEFAULT_AGBON_PRODUCT_GRID_COLUMNS)}
      showHeader={asBoolean(content.showHeader, true)}
      title={asString(content.title)}
      showPagination={asBoolean(content.showPagination, true)}
      featuredProducts={products.filter((product) => product.featured)}
      showFeatured={asBoolean(content.showFeatured, false)}
      featuredTitle={asString(content.featuredTitle)}
    />
  );
}
