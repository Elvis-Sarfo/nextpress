/**
 * Users Collection
 *
 * NextPress-style collection definition using the new CollectionConfig type.
 * Users are linked to one or more Roles via a many-to-many relationship.
 * Role-based permissions are resolved dynamically at runtime from the DB.
 */

import {
  CollectionConfig,
  CollectionTextField,
  CollectionNumberField,
  DateField,
  CheckboxField,
  RelationshipField,
  Collections,
  registerCollection,
} from '../core/collection';

export const Users: CollectionConfig<'users'> = {
  slug: 'users',

  labels: {
    singular: 'User',
    plural: 'Users',
  },

  // Authentication configuration
  auth: {
    tokenExpiration: 7200, // 2 hours
    verify: false,
    maxLoginAttempts: 5,
    lockTime: 600000, // 10 minutes
  },

  // Admin panel configuration
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'active', 'createdAt'],
    group: { key: 'user-management', label: 'User Management', order: 1 },
  },

  // Access control
  access: {
    create: () => true,
    read: ({ req }) => {
      if (req.user?.role === 'admin') return true;
      return { id: { equals: req.user?.id } };
    },
    update: ({ req }) => {
      if (req.user?.role === 'admin') return true;
      return { id: { equals: req.user?.id } };
    },
    delete: ({ req }) => req.user?.role === 'admin',
  },

  // Field definitions
  fields: [
    {
      name: 'email',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        placeholder: 'user@example.com',
      },
    } satisfies CollectionTextField,
    {
      name: 'name',
      type: 'text',
      admin: {
        description: 'Full name of the user',
        placeholder: 'John Doe',
      },
    } satisfies CollectionTextField,
    {
      name: 'roles',
      type: 'relationship',
      relationTo: 'roles',
      hasMany: true,
      admin: {
        description: 'Roles assigned to this user — determines their permissions',
      },
    } satisfies RelationshipField,
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether the user account is active',
      },
    } satisfies CheckboxField,
    // System-only fields — hidden from admin UI, managed by auth layer
    {
      name: 'passwordHash',
      type: 'text',
      admin: { hidden: true },
    } satisfies CollectionTextField,
    {
      name: 'loginAttempts',
      type: 'number',
      defaultValue: 0,
      admin: { hidden: true },
    } satisfies CollectionNumberField,
    {
      name: 'lockedUntil',
      type: 'date',
      admin: { hidden: true },
    } satisfies DateField,
  ],

  versions: { enabled: false },
  localization: { locales: [], defaultLocale: 'en' },
  queryable: false,

  indexes: [
    { fields: ['email'], unique: true },
  ],
};

export interface IUser {
  id: string;
  email: string;
  name?: string;
  active: boolean;
  roles: string[]; // array of role IDs
  createdAt: string;
  updatedAt: string;
}
