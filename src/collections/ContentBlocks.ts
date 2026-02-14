import type { CollectionConfig } from 'payload'

export const ContentBlocks: CollectionConfig = {
  slug: 'content-blocks',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'key', 'updatedAt'],
    description: 'Reusable content blocks for various sections of the website',
  },
  access: {
    read: () => true, // Public access for reading
    create: ({ req: { user } }) => !!user, // Authenticated users can create
    update: ({ req: { user } }) => !!user, // Authenticated users can update
    delete: ({ req: { user } }) => user?.role === 'admin', // Only admins can delete
  },
  fields: [
    {
      name: 'key',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Unique identifier for this content block (e.g., "our-story", "mission-statement")',
        placeholder: 'our-story',
      },
      validate: (value) => {
        // Ensure key is lowercase with hyphens only
        if (!/^[a-z0-9-]+$/.test(value)) {
          return 'Key must contain only lowercase letters, numbers, and hyphens'
        }
        return true
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Title of the content block (localized)',
        placeholder: 'Our Story',
      },
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      localized: true,
      admin: {
        description: 'Main content text (localized). Use double line breaks for paragraphs.',
        rows: 10,
        placeholder: 'Enter the content here...\n\nUse double line breaks to separate paragraphs.',
      },
    },
    {
      name: 'images',
      type: 'array',
      label: 'Images',
      maxRows: 5,
      admin: {
        description: 'Images associated with this content block (optional)',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Upload an image',
          },
        },
        {
          name: 'alt',
          type: 'text',
          required: false,
          localized: true,
          admin: {
            description: 'Alt text for accessibility (optional)',
          },
        },
        {
          name: 'caption',
          type: 'text',
          required: false,
          localized: true,
          admin: {
            description: 'Image caption (optional)',
          },
        },
      ],
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional metadata (JSON format) - optional',
        condition: (data, siblingData, { user }) => user?.role === 'admin',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'published',
      options: [
        {
          label: 'Published',
          value: 'published',
        },
        {
          label: 'Draft',
          value: 'draft',
        },
      ],
      admin: {
        description: 'Content block status',
      },
    },
  ],
  // Add hooks to ensure consistent data
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Ensure key is lowercase
        if (data.key) {
          data.key = data.key.toLowerCase()
        }
        return data
      },
    ],
  },
}
