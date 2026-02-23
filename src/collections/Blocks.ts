/**
 * Blocks Collection
 *
 * Reusable content blocks referenced by ID from Page sections.
 * Block content is locale-first JSON:
 *   { "en": { "heading": "...", "ctaText": "..." }, "fr": { ... } }
 *
 * No versioning — avoids name-uniqueness conflict with documentId/status rows.
 */

import {
  CollectionConfig,
  CollectionTextField,
  SelectField,
  JSONField,
} from '../core/collection';

export const BLOCK_TYPES = [
  { label: 'Hero',            value: 'hero' },
  { label: 'Banner Section',  value: 'banner' },
  { label: 'About Us',        value: 'about' },
  { label: 'FAQ Section',     value: 'faq' },
  { label: 'Gallery',         value: 'gallery' },
  { label: 'Service Section', value: 'service' },
  { label: 'Testimonial',     value: 'testimonial' },
  { label: 'Contact Us',      value: 'contact' },
  { label: 'Subscribe',       value: 'subscribe' },
  { label: 'Featured Rooms',  value: 'featured_rooms' },
  { label: 'Showcase',        value: 'showcase' },
  { label: 'Post List',       value: 'post-list' },
] as const;

export const Blocks: CollectionConfig<'blocks'> = {
  slug: 'blocks',

  labels: {
    singular: 'Block',
    plural: 'Blocks',
  },

  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'templateName', 'status', 'updatedAt'],
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
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Unique internal identifier, e.g. "hero-home", "cta-footer"',
      },
    } satisfies CollectionTextField,
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [...BLOCK_TYPES],
      admin: {
        description: 'Block type determines the renderer component used on the public site',
      },
    } satisfies SelectField,
    {
      name: 'templateName',
      type: 'text',
      admin: {
        description: 'Template variant, e.g. "hero-full-width", "cta-centered"',
      },
    } satisfies CollectionTextField,
    {
      name: 'contentDefinition',
      type: 'json',
      admin: {
        description: 'Schema-like block definition (DB source of truth for block editor fields)',
      },
    } satisfies JSONField,
    {
      name: 'dataSource',
      type: 'json',
      admin: {
        description: 'Admin-configured query params for the block\'s data source (limit, filters, etc.)',
      },
    } satisfies JSONField,
    {
      name: 'content',
      type: 'json',
      localized: true,
      defaultValue: { en: {}, fr: {}, de: {} },
      admin: {
        localizedAs: 'json',
        description: 'Block values (locale-first optional) — { "en": { "heading": "..." }, "fr": { ... } }',
      },
    } satisfies JSONField,
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft',     value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    } satisfies SelectField,
  ],

  queryable: false,

  indexes: [
    { fields: ['name'], unique: true },
    { fields: ['type'] },
    { fields: ['status'] },
  ],
};
