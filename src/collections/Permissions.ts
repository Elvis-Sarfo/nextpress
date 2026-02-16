/**
 * Permissions Collection
 * 
 * NextPress-style collection for RBAC permissions.
 * 
 * Permissions define what actions users can perform on what resources.
 */

import { 
  CollectionConfig,
  CollectionTextField,
  SelectField,
  JSONField,
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
    group: 'System',
  },
  
  // Access control - only admins can manage
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
        description: 'Permission name (e.g., "products:create", "users:read")',
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
        description: 'The resource type this permission applies to',
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
      ],
      admin: {
        description: 'The action this permission allows',
      },
    } satisfies SelectField,
    {
      name: 'description',
      type: 'text',
      admin: {
        description: 'Human-readable description of this permission',
      },
    } satisfies CollectionTextField,
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional metadata (scope, conditions, etc.)',
      },
    } satisfies JSONField,
  ],
  
  // Disable versioning (not needed for permissions)
  versions: {
    enabled: false,
  },
  
  // Disable localization (permissions are system-wide, not localized)
  localization: {
    locales: [],
    defaultLocale: 'en',
  },
  
  // Indexes
  indexes: [
    { fields: ['name'], unique: true },
    { fields: ['resource'] },
    { fields: ['action'] },
  ],
};

// Register the collection
// Note: Collections are now registered centrally in nextpress.config.ts
// Collections.register(Permissions);
