import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'model', 'category', 'inStock', 'featured'],
  },
  access: {
    read: () => true, // Public access
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Product name (localized)',
      },
    },
    {
      name: 'model',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Product model number or identifier (localized)',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.name) {
              const englishName = typeof data.name === 'object' ? data.name.en : data.name
              return englishName
                ?.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      localized: true,
      admin: {
        description: 'Full product description (localized)',
      },
    },
    {
      name: 'shortDescription',
      type: 'text',
      localized: true,
      admin: {
        description: 'Brief description for product cards (localized)',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      hasMany: false,
      admin: {
        description: 'Product category',
      },
    },
    {
      name: 'media',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 20,
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          defaultValue: 'image',
          options: [
            { label: 'Image', value: 'image' },
            { label: 'Video', value: 'video' },
          ],
        },
        {
          name: 'source',
          type: 'select',
          defaultValue: 'upload',
          options: [
            { label: 'Upload Video', value: 'upload' },
            { label: 'External Link (YouTube, etc.)', value: 'external' },
          ],
          admin: {
            description: 'Choose video source type',
            condition: (data, siblingData) => siblingData?.type === 'video',
          },
        },
        {
          name: 'mediaFile',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Upload image or video file',
            condition: (data, siblingData) =>
              siblingData?.type === 'image' ||
              (siblingData?.type === 'video' && siblingData?.source === 'upload'),
          },
        },
        {
          name: 'videoUrl',
          type: 'text',
          admin: {
            description: 'YouTube or external video URL',
            condition: (data, siblingData) =>
              siblingData?.type === 'video' && siblingData?.source === 'external',
          },
        },
        {
          name: 'videoCover',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Cover/thumbnail image for the video',
            condition: (data, siblingData) => siblingData?.type === 'video',
          },
        },
        {
          name: 'isCover',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Set as cover/main image (only one should be selected)',
          },
        },
        {
          name: 'alt',
          type: 'text',
          admin: {
            description: 'Alt text for accessibility',
          },
        },
      ],
      admin: {
        description: 'Product images and videos (1-20 items). Select one as cover image.',
      },
    },
    {
      name: 'specifications',
      type: 'array',
      fields: [
        {
          name: 'key',
          type: 'text',
          required: true,
          localized: true,
          admin: {
            description: 'Specification name (e.g., "Engine Power")',
          },
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          localized: true,
          admin: {
            description: 'Specification value (e.g., "7.5 HP")',
          },
        },
      ],
      admin: {
        description: 'Technical specifications (localized)',
      },
    },
    {
      name: 'inStock',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether the product is currently in stock',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show on homepage as featured product',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Display order (lower numbers appear first)',
      },
    },
    {
      name: 'instructions',
      type: 'array',
      fields: [
        {
          name: 'stepNumber',
          type: 'number',
          required: true,
          min: 1,
          admin: {
            description: 'Step number (1, 2, 3...)',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
          admin: {
            description: 'Step title (localized)',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          localized: true,
          admin: {
            description: 'Step description (localized)',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Optional image for this step',
          },
        },
        {
          name: 'videos',
          type: 'array',
          fields: [
            {
              name: 'type',
              type: 'select',
              required: true,
              defaultValue: 'youtube',
              options: [
                { label: 'YouTube', value: 'youtube' },
                { label: 'Upload', value: 'upload' },
              ],
            },
            {
              name: 'videoFile',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Upload video file',
                condition: (data, siblingData) => siblingData?.type === 'upload',
              },
            },
            {
              name: 'youtubeUrl',
              type: 'text',
              admin: {
                description: 'YouTube video URL',
                condition: (data, siblingData) => siblingData?.type === 'youtube',
              },
            },
            {
              name: 'title',
              type: 'text',
              localized: true,
              admin: {
                description: 'Video title (optional)',
              },
            },
          ],
          admin: {
            description: 'Optional videos for this instruction step',
          },
        },
      ],
      admin: {
        description: 'Product usage instructions (optional)',
      },
    },
  ],
}
