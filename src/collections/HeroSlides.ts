import type { CollectionConfig } from '@/core/collection/types';

export const HeroSlides: CollectionConfig = {
  slug: 'hero-slides',
  labels: { singular: 'Hero Slide', plural: 'Hero Slides' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'order', 'active'],
    group: { key: 'catalogue', label: 'Catalogue', order: 2 },
    description: 'Homepage carousel slides — support image, video, or YouTube embeds.',
  },
  fields: [
    {
      name: 'title',
      type: 'json',
      required: true,
      localized: true,
      admin: {
        localizedAs: 'text',
        description: 'Main heading text per locale',
      },
    },
    {
      name: 'subtitle',
      type: 'json',
      localized: true,
      admin: {
        localizedAs: 'textarea',
        description: 'Subtitle / description text per locale',
      },
    },
    {
      name: 'mediaType',
      type: 'select',
      required: true,
      defaultValue: 'image',
      options: [
        { label: 'Image', value: 'image' },
        { label: 'Video (file URL)', value: 'video' },
        { label: 'YouTube', value: 'youtube' },
      ],
    },
    {
      name: 'image',
      type: 'relationship',
      relationTo: 'media',
      admin: {
        description: 'Desktop image (recommended 1920×600 px)',
      },
    },
    {
      // Stored as URL string to avoid a second ambiguous FK on Media
      name: 'mobileImageUrl',
      type: 'text',
      admin: {
        description: 'Mobile image URL (optional, recommended 768×600 px). Falls back to desktop image.',
      },
    },
    {
      name: 'videoUrl',
      type: 'text',
      admin: {
        description: 'URL to video file (MP4/WebM) — used when mediaType is "video"',
      },
    },
    {
      name: 'youtubeId',
      type: 'text',
      admin: {
        description: 'YouTube video ID (e.g. dQw4w9WgXcQ) — used when mediaType is "youtube"',
      },
    },
    {
      name: 'ctaText',
      type: 'json',
      localized: true,
      admin: {
        localizedAs: 'text',
        description: 'Call-to-action button label per locale',
      },
    },
    {
      name: 'ctaLink',
      type: 'text',
      admin: {
        description: 'Call-to-action button URL (e.g. /en/products)',
      },
    },
    {
      name: 'textPosition',
      type: 'json',
      admin: {
        description: 'Text alignment config: { desktopAlignment, desktopVerticalPosition, mobileAlignment, mobileVerticalPosition }',
      },
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
    },
    {
      name: 'overlayOpacity',
      type: 'number',
      defaultValue: 30,
      min: 0,
      max: 100,
      admin: {
        description: 'Dark overlay opacity 0–100. Higher values improve text readability.',
      },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        description: 'Display order — lower numbers appear first.',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Only active slides are shown on the site.',
      },
    },
  ],
};
