import type { CollectionConfig } from '@/core/collection/types';

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Product', plural: 'Products' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'model', 'category', 'inStock', 'featured'],
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
        localizedAs: 'textarea',
        description: 'Full product description per locale',
      },
    },
    {
      name: 'shortDescription',
      type: 'json',
      localized: true,
      admin: {
        localizedAs: 'text',
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
      // Stores array of { type, source, mediaFileId, videoUrl, videoCoverId, isCover, alt }
      name: 'media',
      type: 'json',
      admin: {
        description: 'Product images and videos. Array of { type: "image"|"video", source: "upload"|"external", mediaFileId, videoUrl, videoCoverId, isCover, alt }',
      },
    },
    {
      // Stores array of { key: { en, fr }, value: { en, fr } }
      name: 'specifications',
      type: 'json',
      admin: {
        description: 'Technical specifications. Array of { key: LocalizedText, value: LocalizedText }',
      },
    },
    {
      name: 'inStock',
      type: 'checkbox',
      defaultValue: true,
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
      // Stores array of { stepNumber, title: LocalizedText, description: LocalizedText, imageId, videos[] }
      name: 'instructions',
      type: 'json',
      admin: {
        description: 'Usage instructions. Array of { stepNumber, title, description, imageId, videos[] }',
      },
    },
  ],
};
