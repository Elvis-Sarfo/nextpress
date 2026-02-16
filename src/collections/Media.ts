/**
 * Media Collection
 * 
 * NextPress-style collection for managing media files (images, videos, documents).
 */

import { 
  CollectionConfig,
  CollectionTextField,
  CollectionNumberField,
  JSONField,
  Collections,
} from '../core/collection';

export const Media: CollectionConfig<'media'> = {
  slug: 'media',
  
  labels: {
    singular: 'Media',
    plural: 'Media',
  },
  
  // Admin panel configuration
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'mimeType', 'filesize', 'createdAt'],
    group: 'Content',
  },
  
  // Access control
  access: {
    // Anyone can read media
    read: () => true,
    // Only admins can create/update/delete
    create: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
    update: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  
  // Field definitions
  fields: [
    {
      name: 'filename',
      type: 'text',
      required: true,
      admin: {
        description: 'Original filename',
      },
    } satisfies CollectionTextField,
    {
      name: 'mimeType',
      type: 'text',
      required: true,
      admin: {
        description: 'MIME type (e.g., image/jpeg, application/pdf)',
      },
    } satisfies CollectionTextField,
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: {
        description: 'Public URL to the file',
      },
    } satisfies CollectionTextField,
    {
      name: 'width',
      type: 'number',
      admin: {
        description: 'Image/video width in pixels (0 for non-visual files)',
      },
    } satisfies CollectionNumberField,
    {
      name: 'height',
      type: 'number',
      admin: {
        description: 'Image/video height in pixels (0 for non-visual files)',
      },
    } satisfies CollectionNumberField,
    {
      name: 'filesize',
      type: 'number',
      required: true,
      admin: {
        description: 'File size in bytes',
      },
    } satisfies CollectionNumberField,
    {
      name: 'alt',
      type: 'text',
      admin: {
        description: 'Alt text for images (for accessibility)',
      },
    } satisfies CollectionTextField,
    {
      name: 'caption',
      type: 'text',
      admin: {
        description: 'Optional caption for the media file',
      },
    } satisfies CollectionTextField,
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional metadata (EXIF, thumbnails, etc.)',
      },
    } satisfies JSONField,
  ],
  
  // Enable versioning for media (to track file changes)
  versions: {
    enabled: true,
    maxPerDoc: 3,
  },
  
  // Enable localization (for alt text, captions)
  localization: {
    locales: ['en', 'fr', 'de'],
    defaultLocale: 'en',
    fallback: true,
  },
  
  // Indexes
  indexes: [
    { fields: ['filename'] },
    { fields: ['mimeType'] },
  ],
};

// Register the collection
// Note: Collections are now registered centrally in nextpress.config.ts
// Collections.register(Media);
