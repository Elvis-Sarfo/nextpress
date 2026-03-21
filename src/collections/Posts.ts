/**
 * Posts Collection
 *
 * Unified post type for all editorial content (blog, news, announcements, etc.).
 * Category determines the grouping. All text fields use locale-first JSON:
 *   { "en": "Hello World", "fr": "Bonjour le monde" }
 */

import {
  CollectionConfig,
  CollectionTextField,
  CollectionTextareaField,
  CollectionRichTextField,
  SelectField,
  UploadField,
  RelationshipField,
  CheckboxField,
  DateField,
  ArrayField,
  GroupField,
  JSONField,
} from '../core/collection';

export const Posts: CollectionConfig<'posts'> = {
  slug: 'posts',

  labels: {
    singular: 'Post',
    plural: 'Posts',
  },

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'publishedAt'],
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
        description: 'Post title per locale — { "en": "My Post", "fr": "Mon article" }',
      },
    } satisfies JSONField,
    {
      name: 'slug',
      type: 'json',
      localized: true,
      admin: {
        localizedAs: 'text',
        description: 'Optional URL slug per locale — if empty, it will be generated from the title on save.',
      },
    } satisfies JSONField,
    {
      name: 'excerpt',
      type: 'json',
      localized: true,
      admin: {
        localizedAs: 'textarea',
        description: 'Short summary per locale — { "en": "...", "fr": "..." }',
      },
    } satisfies JSONField,
    {
      name: 'content',
      type: 'richText',
      localized: true,
      admin: {
        localizedAs: 'json',
        description: 'Post body per locale — stored as rich text JSON (locale-first)',
      },
    } satisfies CollectionRichTextField,
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        description: 'Category this post belongs to (e.g. Blog, News)',
      },
    } satisfies RelationshipField,
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Featured image for the post',
      },
    } satisfies UploadField,
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'Author of the post',
      },
    } satisfies RelationshipField,
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
        } satisfies CollectionTextField,
      ],
      admin: {
        description: 'Tags for filtering and discovery',
      },
    } satisfies ArrayField,
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        description: 'Date the post was or will be published',
      },
    } satisfies DateField,
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft',     value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived',  value: 'archived' },
      ],
    } satisfies SelectField,
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          admin: {
            description: 'Custom SEO title (defaults to post title if empty)',
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
            description: 'Prevent search engines from indexing this post',
          },
        } satisfies CheckboxField,
      ],
    } satisfies GroupField,
  ],

  comments: true,

  versions: {
    enabled: true,
    maxPerDoc: 10,
  },

  localization: {
    locales: ['en', 'fr'],
    defaultLocale: 'en',
    fallback: true,
  },

  // slug uniqueness is enforced at the API level (Json columns can't use DB unique index)
  indexes: [
    { fields: ['status'] },
    { fields: ['publishedAt'] },
  ],
};
