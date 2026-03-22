import type { CollectionConfig } from '@/core/collection/types';

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Product', plural: 'Products' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'model', 'category', 'featured'],
    group: { key: 'catalogue', label: 'Catalogue', order: 2 },
    editorView: 'slider',
  },
  fields: [
    {
      name: 'name',
      type: 'json',
      required: true,
      localized: true,
      admin: {
        localizedAs: 'text',
        description: 'Product name per locale',
      },
    },
    {
      name: 'model',
      type: 'json',
      localized: true,
      admin: {
        localizedAs: 'text',
        description: 'Product model number / identifier per locale',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier (must be unique)',
      },
    },
    {
      name: 'description',
      type: 'json',
      localized: true,
      admin: {
        localizedAs: 'richText',
        description: 'Full product description per locale',
      },
    },
    {
      name: 'shortDescription',
      type: 'json',
      localized: true,
      admin: {
        hidden: true,
        description: 'Brief description for product cards per locale',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'product-categories',
      admin: {
        description: 'Product category',
      },
    },
    {
      name: 'media',
      type: 'json',
      admin: {
        component: 'product-media',
        description: 'Product gallery items. Add images and videos in display order.',
      },
    },
    {
      name: 'specifications',
      type: 'json',
      localized: true,
      admin: {
        localizedAs: 'richText',
        description: 'Technical specifications per locale.',
      },
    },
    {
      name: 'inStock',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        hidden: true,
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show on homepage as a featured product',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Display order — lower numbers appear first',
      },
    },
    {
      name: 'instructions',
      type: 'json',
      admin: {
        hidden: true,
        description: 'Usage instructions. Array of { stepNumber, title, description, imageId, videos[] }',
      },
    },
  ],
  localization: {
    locales: ['en', 'fr'],
    defaultLocale: 'en',
    fallback: true,
  },
};
