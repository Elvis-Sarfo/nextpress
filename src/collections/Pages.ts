/**
 * Pages Collection
 * 
 * NextPress-style collection for static pages.
 */

import { 
  CollectionConfig,
  CollectionTextField,
  CollectionTextareaField,
  CollectionRichTextField,
  SelectField,
  UploadField,
  GroupField,
  CheckboxField,
  Collections,
} from '../core/collection';

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  
  labels: {
    singular: 'Page',
    plural: 'Pages',
  },
  
  // Admin panel configuration
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'createdAt'],
    group: 'Content',
  },
  
  // Access control
  access: {
    // Anyone can read published pages
    read: ({ req }) => {
      // Admins can read all
      if (req.user?.role === 'admin') return true;
      // Only published pages are public
      return { status: { equals: 'published' } };
    },
    // Only admins/editors can create
    create: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
    // Only admins/editors can update
    update: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
    // Only admins can delete
    delete: ({ req }) => req.user?.role === 'admin',
  },
  
  // Field definitions
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Page title',
      },
    } satisfies CollectionTextField,
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL slug (e.g., about, contact, pricing)',
      },
    } satisfies CollectionTextField,
    {
      name: 'excerpt',
      type: 'textarea',
      admin: {
        description: 'Short description for SEO and previews',
      },
    } satisfies CollectionTextareaField,
    {
      name: 'content',
      type: 'richText',
      admin: {
        description: 'Page content (Rich Text)',
      },
    } satisfies CollectionRichTextField,
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
    } satisfies SelectField,
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Featured image for the page',
      },
    } satisfies UploadField,
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          admin: {
            description: 'Custom SEO title (defaults to page title if empty)',
          },
        } satisfies CollectionTextField,
        {
          name: 'metaDescription',
          type: 'textarea',
          admin: {
            description: 'Custom SEO description',
          },
        } satisfies CollectionTextareaField,
        {
          name: 'noIndex',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Prevent search engines from indexing this page',
          },
        } satisfies CheckboxField,
      ],
    } satisfies GroupField,
  ],
  
  // Enable versioning for pages
  versions: {
    enabled: true,
    maxPerDoc: 10,
  },
  
  // Enable localization (for multi-language content)
  localization: {
    locales: ['en', 'fr', 'de'],
    defaultLocale: 'en',
    fallback: true,
  },
  
  // Indexes
  indexes: [
    { fields: ['slug'], unique: true },
    { fields: ['status'] },
  ],
};

// Register the collection
// Note: Collections are now registered centrally in nextpress.config.ts
// Collections.register(Pages);
