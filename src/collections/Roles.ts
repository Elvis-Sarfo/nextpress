/**
 * Roles Collection
 *
 * NextPress-style collection for RBAC roles.
 * Roles are assigned to users (many-to-many) and hold a set of Permissions
 * (many-to-many). The RBAC engine loads roles and permissions from the DB at runtime.
 */

import {
  CollectionConfig,
  CollectionTextField,
  RelationshipField,
  Collections,
} from '../core/collection';

export const Roles: CollectionConfig<'roles'> = {
  slug: 'roles',

  labels: {
    singular: 'Role',
    plural: 'Roles',
  },

  // Admin panel configuration
  admin: {
    useAsTitle: 'displayName',
    defaultColumns: ['name', 'displayName', 'createdAt'],
    group: { key: 'user-management', label: 'User Management', order: 1 },
  },

  // Access control — only admins can manage roles
  access: {
    create: ({ req }) => req.user?.role === 'admin',
    read: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },

  // Field definitions
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Internal identifier (e.g., admin, editor, author)',
      },
    } satisfies CollectionTextField,
    {
      name: 'displayName',
      type: 'text',
      required: true,
      admin: {
        description: 'Human-readable label (e.g., Administrator, Content Editor)',
      },
    } satisfies CollectionTextField,
    {
      name: 'description',
      type: 'text',
      admin: {
        description: 'Brief description of what this role allows',
      },
    } satisfies CollectionTextField,
    {
      name: 'permissions',
      type: 'relationship',
      relationTo: 'permissions',
      hasMany: true,
      admin: {
        description: 'Permissions granted to users who hold this role',
      },
    } satisfies RelationshipField,
  ],

  versions: { enabled: false },
  localization: { locales: [], defaultLocale: 'en' },
  queryable: false,

  indexes: [
    { fields: ['name'], unique: true },
  ],
};
