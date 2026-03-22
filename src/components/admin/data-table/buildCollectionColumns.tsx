'use client';

import type { CollectionFieldMeta } from '@/lib/collections-data';
import type { AdminTableColumn } from './types';
import { formatCellValue, getDisplayText, labelFor } from './collection-table-utils';

type Doc = Record<string, unknown>;

export function buildCollectionColumns(
  fields: CollectionFieldMeta[],
  locale: string
): AdminTableColumn<Doc>[] {
  return fields.map((field) => ({
    id: field.name,
    accessorKey: field.name,
    header: labelFor(field),
    cell: ({ row }) => formatCellValue(field, row.original, locale),
    enableSorting: true,
    meta: {
      filterable: ['text', 'email', 'textarea', 'select'].includes(field.type),
      getFilterValues: (row) => {
        const rawValue = row[field.name];
        if (rawValue === null || rawValue === undefined) return [];

        if (field.localized && typeof rawValue === 'object' && !Array.isArray(rawValue)) {
          const localized = rawValue as Record<string, unknown>;
          const localeValue = localized[locale] ?? localized.en ?? Object.values(localized).find((value) => typeof value === 'string');
          if (localeValue === null || localeValue === undefined) return [];
          return [typeof localeValue === 'string' ? localeValue : getDisplayText(localeValue, locale)];
        }

        if (Array.isArray(rawValue)) {
          return rawValue
            .map((item) => getDisplayText(item, locale).trim())
            .filter(Boolean);
        }

        return [getDisplayText(rawValue, locale).trim()].filter(Boolean);
      },
    },
  }));
}
