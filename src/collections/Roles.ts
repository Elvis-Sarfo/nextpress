/**
 * Roles Collection
 * 
 * NextPress-style collection for RBAC roles.
 */

import { 
  CollectionConfig,
  CollectionTextField,
  JSONField,
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
    group: 'System',
  },
  
  // Access control
  access: {
    // Only admins can manage roles
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
        description: 'Internal name (e.g., admin, editor, author)',
      },
    } satisfies CollectionTextField,
    {
      name: 'displayName',
      type: 'text',
      required: true,
      admin: {
        description: 'Display name (e.g., Administrator, Editor)',
      },
    } satisfies CollectionTextField,
    {
      name: 'description',
      type: 'text',
      admin: {
        description: 'Brief description of this role',
      },
    } satisfies CollectionTextField,
    {
      name: 'permissions',
      type: 'json',
      required: true,
      defaultValue: [],
      admin: {
        description: 'JSON array of permission objects',
      },
    } satisfies JSONField,
  ],
  
  // Disable versioning (not needed for roles)
  versions: {
    enabled: false,
  },
  
  // Disable localization (roles are system-wide, not localized)
  localization: {
    locales: [],
    defaultLocale: 'en',
  },
  
  // Indexes
  indexes: [
    { fields: ['name'], unique: true },
  ],
};

// Register the collection
// Note: Collections are now registered centrally in nextpress.config.ts
// Collections.register(Roles);
