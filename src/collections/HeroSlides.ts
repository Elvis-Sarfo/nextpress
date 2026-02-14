import type { CollectionConfig } from 'payload'

export const HeroSlides: CollectionConfig = {
  slug: 'hero-slides',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'order', 'active'],
  },
  access: {
    read: () => true, // Public access
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Main heading text (localized)',
      },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Subtitle or description text (localized)',
      },
    },
    {
      name: 'mediaType',
      type: 'select',
      required: true,
      defaultValue: 'image',
      options: [
        { label: 'Image', value: 'image' },
        { label: 'Video', value: 'video' },
        { label: 'YouTube', value: 'youtube' },
      ],
      admin: {
        description: 'Type of media for the slide',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (data) => data.mediaType === 'image',
        description: 'Upload a desktop image for the slide (recommended: 1920x600px)',
      },
    },
    {
      name: 'mobileImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (data) => data.mediaType === 'image',
        description: 'Upload a mobile image for the slide (optional, recommended: 768x600px). If not set, desktop image will be used.',
      },
    },
    {
      name: 'videoUrl',
      type: 'text',
      admin: {
        condition: (data) => data.mediaType === 'video',
        description: 'URL to video file (MP4, WebM)',
      },
    },
    {
      name: 'youtubeId',
      type: 'text',
      admin: {
        condition: (data) => data.mediaType === 'youtube',
        description: 'YouTube video ID (e.g., "dQw4w9WgXcQ")',
      },
    },
    {
      name: 'ctaText',
      type: 'text',
      localized: true,
      admin: {
        description: 'Call-to-action button text (localized)',
      },
    },
    {
      name: 'ctaLink',
      type: 'text',
      admin: {
        description: 'Call-to-action button link (e.g., "/products")',
      },
    },
    {
      name: 'textPosition',
      type: 'group',
      label: 'Text Positioning',
      admin: {
        description: 'Configure text alignment and positioning for desktop and mobile',
      },
      fields: [
        {
          name: 'desktopAlignment',
          type: 'select',
          required: true,
          defaultValue: 'center',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
          ],
          admin: {
            description: 'Horizontal alignment of text on desktop',
          },
        },
        {
          name: 'desktopVerticalPosition',
          type: 'select',
          required: true,
          defaultValue: 'center',
          options: [
            { label: 'Top', value: 'top' },
            { label: 'Center', value: 'center' },
            { label: 'Bottom', value: 'bottom' },
          ],
          admin: {
            description: 'Vertical position of text on desktop',
          },
        },
        {
          name: 'mobileAlignment',
          type: 'select',
          required: true,
          defaultValue: 'center',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
          ],
          admin: {
            description: 'Horizontal alignment of text on mobile',
          },
        },
        {
          name: 'mobileVerticalPosition',
          type: 'select',
          required: true,
          defaultValue: 'center',
          options: [
            { label: 'Top', value: 'top' },
            { label: 'Center', value: 'center' },
            { label: 'Bottom', value: 'bottom' },
          ],
          admin: {
            description: 'Vertical position of text on mobile',
          },
        },
      ],
    },
    {
      name: 'textColor',
      type: 'select',
      required: true,
      defaultValue: 'white',
      options: [
        { label: 'White', value: 'white' },
        { label: 'Black', value: 'black' },
        { label: 'AGBON Orange', value: 'orange' },
      ],
      admin: {
        description: 'Text color for title and subtitle',
      },
    },
    {
      name: 'overlayOpacity',
      type: 'number',
      required: true,
      defaultValue: 30,
      min: 0,
      max: 100,
      admin: {
        description: 'Background overlay opacity (0-100). Higher values make text more readable.',
      },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        description: 'Display order (lower numbers appear first)',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this slide is active and visible',
      },
    },
  ],
}
