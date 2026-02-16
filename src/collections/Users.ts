/**
 * Users Collection
 * 
 * NextPress-style collection definition using the new CollectionConfig type.
 */

import { 
  CollectionConfig,
  CollectionTextField,
  SelectField,
  CheckboxField,
  Collections,
  registerCollection
} from '../core/collection';

// Define the collection configuration
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
    defaultColumns: ['email', 'role', 'createdAt'],
    group: 'System',
  },
  
  // Access control
  access: {
    // Anyone can create the first user
    create: () => true,
    // Admins can read all, users can only read themselves
    read: ({ req }) => {
      if (req.user?.role === 'admin') return true;
      return { id: { equals: req.user?.id } };
    },
    // Admins can update all, users can update themselves
    update: ({ req }) => {
      if (req.user?.role === 'admin') return true;
      return { id: { equals: req.user?.id } };
    },
    // Only admins can delete
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
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'user',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'User', value: 'user' },
      ],
      admin: {
        description: 'Admin users have full access to the CMS',
      },
    } satisfies SelectField,
    {
      name: 'name',
      type: 'text',
      admin: {
        description: 'Full name of the user',
        placeholder: 'John Doe',
      },
    } satisfies CollectionTextField,
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether the user account is active',
      },
    } satisfies CheckboxField,
  ],
  
  // Disable versioning for users (not needed, security risk)
  versions: {
    enabled: false,
  },
  
  // Disable localization for users (not needed - user data is language-agnostic)
  localization: {
    locales: [],
    defaultLocale: 'en',
  },
  
  // Indexes
  indexes: [
    { fields: ['email'], unique: true },
    { fields: ['role'] },
  ],
};

// Alternative: Using the decorator approach
// @registerCollection('users')
// export const Users: CollectionConfig<'users'> = { ... }

// Register the collection
// Note: Collections are now registered centrally in nextpress.config.ts
// Collections.register(Users);

export interface IUser {
  id: string;
  email: string;
  role: 'admin' | 'editor' | 'user';
  name?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};
