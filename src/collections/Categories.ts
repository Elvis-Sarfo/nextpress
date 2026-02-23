/**
 * Categories Collection
 *
 * Flexible, admin-managed groupings for Posts (e.g. Blog, News, Tutorial).
 * Slug is locale-first JSON: { "en": "blog", "fr": "blog" }
 */

import {
  CollectionConfig,
  CollectionTextField,
  CollectionTextareaField,
  JSONField,
} from '../core/collection';

export const Categories: CollectionConfig<'categories'> = {
  slug: 'categories',

  labels: {
    singular: 'Category',
    plural: 'Categories',
  },

  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'createdAt'],
    group: 'Content',
  },

  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
    update: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
    delete: ({ req }) => req.user?.role === 'admin',
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Category display name (e.g. "Blog", "News")',
      },
    } satisfies CollectionTextField,
    {
      name: 'slug',
      type: 'json',
      required: true,
      localized: true,
      admin: {
        localizedAs: 'text',
        description: 'URL slug per locale — { "en": "blog", "fr": "blog" }. Must be unique per locale.',
      },
    } satisfies JSONField,
    {
      name: 'description',
      type: 'json',
      localized: true,
      admin: {
        localizedAs: 'textarea',
        description: 'Short description per locale — { "en": "...", "fr": "..." }',
      },
    } satisfies JSONField,
    {
      name: 'color',
      type: 'text',
      admin: {
        description: 'Optional hex color for UI badge, e.g. "#3B82F6"',
      },
    } satisfies CollectionTextField,
  ],

  indexes: [
    { fields: ['name'], unique: true },
  ],
};
