/**
 * Media Collection
 *
 * Refined media schema with storage metadata + editorial metadata.
 */

import {
  CollectionConfig,
  CollectionTextField,
  CollectionNumberField,
  DateField,
  JSONField,
  SelectField,
} from '../core/collection';

export const Media: CollectionConfig<'media'> = {
  slug: 'media',

  labels: {
    singular: 'Media Asset',
    plural: 'Media Library',
  },

  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'mimeType', 'size', 'storageProvider', 'uploadedAt'],
    group: 'media',
  },

  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
    update: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
    delete: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
  },

  fields: [
    {
      name: 'filename',
      type: 'text',
      required: true,
      admin: {
        description: 'Stored filename (can differ from original).',
      },
    } satisfies CollectionTextField,
    {
      name: 'originalFilename',
      type: 'text',
      admin: {
        description: 'Filename from the uploader device.',
      },
    } satisfies CollectionTextField,
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: {
        description: 'Public URL for rendering the media.',
      },
    } satisfies CollectionTextField,
    {
      name: 'mimeType',
      type: 'text',
      required: true,
      admin: {
        description: 'IANA MIME type (e.g. image/jpeg).',
      },
    } satisfies CollectionTextField,
    {
      name: 'kind',
      type: 'select',
      required: true,
      options: [
        { label: 'Image', value: 'image' },
        { label: 'Video', value: 'video' },
        { label: 'Document', value: 'document' },
        { label: 'Other', value: 'other' },
      ],
    } satisfies SelectField,
    {
      name: 'extension',
      type: 'text',
      admin: {
        description: 'Lowercase extension without the leading dot.',
      },
    } satisfies CollectionTextField,
    {
      name: 'size',
      type: 'number',
      required: true,
      admin: {
        description: 'File size in bytes.',
      },
    } satisfies CollectionNumberField,
    {
      name: 'width',
      type: 'number',
      admin: {
        description: 'Image/video width.',
      },
    } satisfies CollectionNumberField,
    {
      name: 'height',
      type: 'number',
      admin: {
        description: 'Image/video height.',
      },
    } satisfies CollectionNumberField,
    {
      name: 'storageProvider',
      type: 'select',
      required: true,
      options: [
        { label: 'Local', value: 'local' },
        { label: 'AWS S3', value: 's3' },
        { label: 'Supabase', value: 'supabase' },
        { label: 'Cloudinary', value: 'cloudinary' },
      ],
      admin: {
        description: 'Provider where the binary object is stored.',
      },
    } satisfies SelectField,
    {
      name: 'storageKey',
      type: 'text',
      required: true,
      admin: {
        description: 'Provider-specific object key/path.',
      },
    } satisfies CollectionTextField,
    {
      name: 'altText',
      type: 'text',
      admin: {
        description: 'Accessibility alternative text.',
      },
    } satisfies CollectionTextField,
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'Human-readable title in media picker UIs.',
      },
    } satisfies CollectionTextField,
    {
      name: 'description',
      type: 'text',
      admin: {
        description: 'Long-form description/caption.',
      },
    } satisfies CollectionTextField,
    {
      name: 'uploadedAt',
      type: 'date',
      required: true,
      admin: {
        description: 'Timestamp when upload completed.',
      },
    } satisfies DateField,
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Provider payloads and custom metadata.',
      },
    } satisfies JSONField,

    // Compatibility fields (legacy admin API/UI)
    { name: 'filesize', type: 'number' } satisfies CollectionNumberField,
    { name: 'alt', type: 'text' } satisfies CollectionTextField,
    { name: 'caption', type: 'text' } satisfies CollectionTextField,
  ],

  versions: {
    enabled: true,
    maxPerDoc: 5,
  },

  localization: {
    locales: ['en', 'fr'],
    defaultLocale: 'en',
    fallback: true,
  },

  indexes: [
    { fields: ['filename'] },
    { fields: ['mimeType'] },
    { fields: ['kind'] },
    { fields: ['uploadedAt'] },
    { fields: ['storageProvider'] },
  ],
};
