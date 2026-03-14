'use client';

import { useParams } from 'next/navigation';
import { AgbonSidebarCategories } from '@/components/agbon/sidebar-categories';
import type { ProductCategoryRecord } from '@/lib/cms';
import type { BlockContent } from '@/core/blocks/types';

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
  const showSearchButton =
    content.showSearchButton === true || content.showSearchButton === 'true';
  const compactOnMobile =
    content.compactOnMobile !== false && content.compactOnMobile !== 'false';

  return (
    <AgbonSidebarCategories
      categories={categories}
      locale={locale}
      showSearchButton={showSearchButton}
      compactOnMobile={compactOnMobile}
    />
  );
}
