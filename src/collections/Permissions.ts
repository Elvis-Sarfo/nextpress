/**
 * Permissions Collection
 *
 * NextPress-style collection for RBAC permissions.
 * A permission = resource + action + scope.
 * Permissions are assigned to Roles (many-to-many) and checked at runtime
 * by the RBACEngine.
 */

import {
  CollectionConfig,
  CollectionTextField,
  SelectField,
  Collections,
} from '../core/collection';

export const Permissions: CollectionConfig<'permissions'> = {
  slug: 'permissions',

  labels: {
    singular: 'Permission',
    plural: 'Permissions',
  },

  // Admin panel configuration
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'resource', 'action', 'scope'],
    group: { key: 'user-management', label: 'User Management', order: 1 },
  },

  // Access control — only admins can manage permissions
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
        description: 'Unique permission identifier (e.g., "content:create:all")',
      },
    } satisfies CollectionTextField,
    {
      name: 'resource',
      type: 'select',
      required: true,
      options: [
        { label: 'Content', value: 'content' },
        { label: 'Schema', value: 'schema' },
        { label: 'User', value: 'user' },
        { label: 'Media', value: 'media' },
        { label: 'Settings', value: 'settings' },
      ],
      admin: {
        description: 'The resource type this permission controls',
      },
    } satisfies SelectField,
    {
      name: 'action',
      type: 'select',
      required: true,
      options: [
        { label: 'Create', value: 'create' },
        { label: 'Read', value: 'read' },
        { label: 'Update', value: 'update' },
        { label: 'Delete', value: 'delete' },
        { label: 'Publish', value: 'publish' },
        { label: 'Unpublish', value: 'unpublish' },
        { label: 'Schedule', value: 'schedule' },
        { label: 'Manage (all)', value: 'manage' },
      ],
      admin: {
        description: 'The action this permission allows',
      },
    } satisfies SelectField,
    {
      name: 'scope',
      type: 'select',
      required: true,
      defaultValue: 'all',
      options: [
        { label: 'All (any document)', value: 'all' },
        { label: 'Own (only authored documents)', value: 'own' },
      ],
      admin: {
        description: '"All" grants access to every document; "Own" restricts to documents the user created',
      },
    } satisfies SelectField,
    {
      name: 'description',
      type: 'text',
      admin: {
        description: 'Human-readable explanation of this permission',
      },
    } satisfies CollectionTextField,
  ],

  versions: { enabled: false },
  localization: { locales: [], defaultLocale: 'en' },

  indexes: [
    { fields: ['name'], unique: true },
    { fields: ['resource'] },
    { fields: ['action'] },
  ],
};
