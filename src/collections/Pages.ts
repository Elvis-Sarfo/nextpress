/**
 * Pages Collection
 *
 * Block-based page builder. Pages contain Sections → Columns → Block references.
 * All text fields (title, slug, excerpt) are locale-first JSON:
 *   { "en": "About", "fr": "À propos" }
 */

import {
  CollectionConfig,
  CollectionTextField,
  CollectionNumberField,
  SelectField,
  UploadField,
  GroupField,
  CheckboxField,
  JSONField,
} from '../core/collection';

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',

  labels: {
    singular: 'Page',
    plural: 'Pages',
  },

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'createdAt'],
    group: 'Content',
  },

  access: {
    read: ({ req }) => {
      if (req.user?.role === 'admin') return true;
      return { status: { equals: 'published' } };
    },
    create: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
    update: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
    delete: ({ req }) => req.user?.role === 'admin',
  },

  fields: [
    {
      name: 'title',
      type: 'json',
      required: true,
      localized: true,
      admin: {
        localizedAs: 'text',
        description: 'Page title per locale — { "en": "About Us", "fr": "À propos" }',
      },
    } satisfies JSONField,
    {
      name: 'slug',
      type: 'json',
      required: true,
      localized: true,
      admin: {
        localizedAs: 'text',
        description: 'URL slug per locale — { "en": "about", "fr": "a-propos" }. Must be unique per locale.',
      },
    } satisfies JSONField,
    {
      name: 'excerpt',
      type: 'json',
      localized: true,
      admin: {
        localizedAs: 'textarea',
        description: 'Short description per locale — { "en": "...", "fr": "..." }',
      },
    } satisfies JSONField,
    {
      name: 'sections',
      type: 'json',
      admin: {
        description: 'Page sections containing columns and block references. Structure: [{ id, name, templateName, settings, columns: [{ id, width, offset, blocks: [{ blockId, order }] }] }]',
      },
    } satisfies JSONField,
    {
      name: 'config',
      type: 'json',
      admin: {
        description: 'Page configuration — layout, theme, etc.',
      },
    } satisfies JSONField,
    {
      name: 'parentId',
      label: 'Parent Page',
      type: 'text',
      admin: {
        description: 'Parent page ID for hierarchical page trees (references pages.id)',
      },
    } satisfies CollectionTextField,
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Sort order within sibling pages (lower = first)',
      },
    } satisfies CollectionNumberField,
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
          type: 'text',
          admin: {
            description: 'Custom SEO description',
          },
        } satisfies CollectionTextField,
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

  versions: {
    enabled: true,
    maxPerDoc: 10,
  },

  localization: {
    locales: ['en', 'fr', 'de'],
    defaultLocale: 'en',
    fallback: true,
  },

  // slug uniqueness is enforced at the API level (Json columns can't use DB unique index)
  indexes: [
    { fields: ['status'] },
    { fields: ['parentId'] },
  ],
};
