/**
 * Menus Collection
 *
 * Stores site navigation menus. Each menu has a location (primary, footer,
 * mobile, secondary) and a tree of items stored as locale-aware JSON.
 *
 * Item structure:
 * {
 *   id: string,           // stable uuid
 *   label: string,
 *   type: 'page' | 'custom' | 'section',
 *   pageId?: string,      // type:'page' — resolved to URL at render time
 *   url?: string,         // type:'custom'
 *   target?: '_self' | '_blank',
 *   children?: MenuItem[],
 * }
 */

import {
  CollectionConfig,
  CollectionTextField,
  SelectField,
  JSONField,
} from '../core/collection';

export const Menus: CollectionConfig<'menus'> = {
  slug: 'menus',

  labels: {
    singular: 'Menu',
    plural: 'Menus',
  },

  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'location', 'updatedAt'],
    group: 'appearance',
  },

  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
    delete: ({ req }) => req.user?.role === 'admin',
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Menu Name',
      admin: {
        description: 'Internal name for this menu (e.g. "Main Navigation")',
      },
    } satisfies CollectionTextField,
    {
      name: 'location',
      type: 'select',
      label: 'Location',
      options: [
        { label: 'Primary (Header)', value: 'primary' },
        { label: 'Footer', value: 'footer' },
        { label: 'Mobile', value: 'mobile' },
        { label: 'Secondary', value: 'secondary' },
      ],
      admin: {
        description: 'Where this menu is displayed on the site',
      },
    } satisfies SelectField,
    {
      name: 'items',
      type: 'json',
      localized: true,
      label: 'Menu Items',
      admin: {
        localizedAs: 'json',
        component: 'menu-items',
        description: 'Tree of navigation items for the active locale — supports unlimited nesting',
      },
    } satisfies JSONField,
  ],

  localization: {
    locales: ['en', 'fr'],
    defaultLocale: 'en',
    fallback: true,
  },

  queryable: false,

  indexes: [
    { fields: ['location'] },
  ],
};
