'use client';

import type { CollectionFieldMeta } from '@/lib/collections-data';
import type { AdminTableColumn } from './types';
import { formatCellValue, labelFor } from './collection-table-utils';

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
    },
  }));
}
