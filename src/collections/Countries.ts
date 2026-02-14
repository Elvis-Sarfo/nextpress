import type { CollectionConfig } from 'payload'

export const Countries: CollectionConfig = {
  slug: 'countries',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'flag', 'color'],
  },
  access: {
    read: () => true, // Public access
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Country name (e.g., "Ghana", "Nigeria", "Côte d\'Ivoire")',
      },
    },
    {
      name: 'code',
      type: 'text',
      admin: {
        description: 'ISO country code (e.g., "GH", "NG", "CI") - optional',
      },
    },
    {
      name: 'coordinates',
      type: 'group',
      required: true,
      admin: {
        description:
          'Geographic coordinates [latitude, longitude] for the country capital or main office',
      },
      fields: [
        {
          name: 'latitude',
          type: 'number',
          required: true,
          admin: {
            description: 'Latitude (e.g., 5.36 for Abidjan)',
          },
        },
        {
          name: 'longitude',
          type: 'number',
          required: true,
          admin: {
            description: 'Longitude (e.g., -4.0083 for Abidjan)',
          },
        },
      ],
    },
    {
      name: 'flag',
      type: 'text',
      required: true,
      admin: {
        description: 'Country flag emoji (e.g., "🇬🇭", "🇳🇬", "🇨🇮")',
      },
    },
    {
      name: 'color',
      type: 'text',
      required: true,
      admin: {
        description: 'Hex color code for map marker (e.g., "#E74C3C", "#FF6B35")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Brief description of AGBON presence and services in this country',
      },
    },
    {
      name: 'symbol',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Country symbol or emblem image (e.g., coat of arms, national symbol)',
      },
    },
    {
      name: 'background',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Background image for country card and displays',
      },
    },
    {
      name: 'wallpaper',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Wallpaper image for full-page country displays',
      },
    },
    {
      name: 'offices',
      type: 'array',
      required: true,
      minRows: 1,
      admin: {
        description: 'List of AGBON offices in this country',
      },
      fields: [
        {
          name: 'city',
          type: 'text',
          required: true,
          localized: true,
          admin: {
            description: 'City name (e.g., "Abidjan", "Accra")',
          },
        },
        {
          name: 'address',
          type: 'textarea',
          required: true,
          localized: true,
          admin: {
            description: 'Full street address',
          },
        },
        {
          name: 'phone',
          type: 'text',
          required: true,
          admin: {
            description: 'Office phone number with country code',
          },
        },
        {
          name: 'email',
          type: 'email',
          required: true,
          admin: {
            description: 'Office email address',
          },
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            { label: 'Headquarters', value: 'headquarters' },
            { label: 'Regional Office', value: 'regional' },
            { label: 'Branch Office', value: 'branch' },
            { label: 'Distribution Center', value: 'distribution' },
            { label: 'Service Center', value: 'service' },
          ],
          admin: {
            description: 'Type of office',
          },
        },
        {
          name: 'coordinates',
          type: 'group',
          required: true,
          admin: {
            description: 'Geographic coordinates for this office location',
          },
          fields: [
            {
              name: 'latitude',
              type: 'number',
              required: true,
            },
            {
              name: 'longitude',
              type: 'number',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
