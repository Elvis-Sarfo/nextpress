import type { CollectionConfig } from '@/core/collection/types';

export const ProductCategories: CollectionConfig = {
  slug: 'product-categories',
  labels: { singular: 'Product Category', plural: 'Product Categories' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'order'],
    group: { key: 'catalogue', label: 'Catalogue', order: 2 },
  },
  fields: [
    {
      name: 'name',
      type: 'json',
      required: true,
      localized: true,
      admin: {
        localizedAs: 'text',
        description: 'Category name per locale',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier (must be unique, e.g. "agricultural-machinery")',
      },
    },
    {
      name: 'description',
      type: 'json',
      localized: true,
      admin: {
        localizedAs: 'textarea',
        description: 'Category description per locale',
      },
    },
    {
      name: 'image',
      type: 'relationship',
      relationTo: 'media',
      admin: {
        description: 'Category icon / image',
      },
    },
    {
      name: 'icon',
      type: 'text',
      admin: {
        description: 'Emoji or text icon (fallback when no image uploaded)',
      },
    },
    {
      // Stored as a plain text ID to avoid a self-referencing Prisma ambiguity
      name: 'parentCategoryId',
      type: 'text',
      admin: {
        description: 'Parent category ID — leave empty for top-level categories',
      },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        description: 'Display order — lower numbers appear first',
      },
    },
  ],
};
