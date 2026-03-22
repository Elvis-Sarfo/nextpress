import type { CollectionConfig } from '@/core/collection/types';

export const Countries: CollectionConfig = {
  slug: 'countries',
  labels: { singular: 'Country', plural: 'Countries' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'code', 'order'],
    group: { key: 'catalogue', label: 'Catalogue', order: 2 },
    editorView: 'slider',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Country display name',
      },
    },
    {
      name: 'code',
      type: 'text',
      admin: {
        description: 'Optional ISO country code',
      },
    },
    {
      name: 'flag',
      type: 'text',
      admin: {
        description: 'Flag emoji used on the card',
      },
    },
    {
      name: 'color',
      type: 'text',
      defaultValue: '#FF6B35',
      admin: {
        description: 'Accent color hex for gradients and highlights',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: {
        localizedAs: 'textarea',
        description: 'Optional short description',
      },
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Background image for the country card',
      },
    },
    {
      name: 'offices',
      type: 'array',
      admin: {
        description: 'Office locations shown inside the country card',
      },
      fields: [
        {
          name: 'city',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'address',
          type: 'textarea',
          localized: true,
          admin: {
            localizedAs: 'textarea',
          },
        },
        {
          name: 'phone',
          type: 'text',
          required: true,
        },
        {
          name: 'email',
          type: 'email',
        },
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Headquarters', value: 'headquarters' },
            { label: 'Regional', value: 'regional' },
            { label: 'Branch', value: 'branch' },
            { label: 'Distribution', value: 'distribution' },
            { label: 'Service', value: 'service' },
          ],
          defaultValue: 'regional',
        },
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Display order. Lower values appear first.',
      },
    },
  ],
  localization: {
    locales: ['en', 'fr'],
    defaultLocale: 'en',
    fallback: true,
  },
};
