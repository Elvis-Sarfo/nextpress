import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'order', 'updatedAt'],
  },
  access: {
    read: () => true, // Public access for reading
    create: ({ req: { user } }) => !!user, // Authenticated users can create
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => user?.role === 'admin', // Only admins can delete
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Category name (localized)',
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
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.name) {
              // Auto-generate slug from English name
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
      localized: true,
      admin: {
        description: 'Category description (localized)',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Category icon/image',
      },
    },
    {
      name: 'icon',
      type: 'text',
      admin: {
        description: 'Optional emoji or text icon (fallback if no image)',
      },
    },
    {
      name: 'parentCategory',
      type: 'relationship',
      relationTo: 'categories',
      required: false,
      admin: {
        description: 'Parent category (leave empty for top-level categories)',
        position: 'sidebar',
      },
      filterOptions: ({ id }) => {
        // Prevent selecting self as parent
        return {
          id: {
            not_equals: id,
          },
        }
      },
    },
    {
      name: 'media',
      type: 'array',
      minRows: 0,
      maxRows: 20,
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            { label: 'Video', value: 'video' },
            { label: 'Image', value: 'image' },
          ],
          admin: {
            description: 'Type of media item',
          },
        },
        {
          name: 'mediaItem',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Upload video or image file',
          },
        },
        {
          name: 'videoUrl',
          type: 'text',
          admin: {
            description: 'Optional: YouTube or external video URL (if type is video)',
            condition: (data, siblingData) => siblingData?.type === 'video',
          },
        },
        {
          name: 'title',
          type: 'text',
          localized: true,
          admin: {
            description: 'Optional: Title for the media item (localized)',
          },
        },
      ],
      admin: {
        description: 'Featured videos and gallery images for this category',
      },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        description: 'Display order (lower numbers appear first)',
        step: 1,
      },
    },
  ],
}
