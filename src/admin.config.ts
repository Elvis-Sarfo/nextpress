/**
 * NextPress Admin UI Configuration
 *
 * Configure the admin sidebar layout here: groups, icons, custom links,
 * and per-collection display overrides.
 *
 * This file is safe to import from both server and client components.
 * Icons are specified by their Lucide icon name (PascalCase string).
 * See https://lucide.dev/icons/ for available icon names.
 */

import type { NextPressAdminConfig } from './core/types';

const adminConfig: NextPressAdminConfig = {
  sidebar: {
    // ── Navigation groups ────────────────────────────────────────────────────
    // Define groups in the order you want them to appear in the sidebar.
    // 'key' must match the value used in collection.admin.group.key.
    groups: [
      {
        key: 'catalogue',
        label: 'Catalogue',
        icon: 'ShoppingBag',
        order: 1,
        items: ['products', 'product-categories', 'countries', 'jobs'],
      },
      {
        key: 'content',
        label: 'Content Management',
        icon: 'FileText',
        order: 2,
        items: ['pages', 'posts', 'categories', 'comments', 'contact-messages'],
      },
      {
        key: 'media',
        label: 'Media',
        icon: 'Image',
        order: 3,
        items: [],
      },
      {
        key: 'data',
        label: 'Data',
        icon: 'Database',
        order: 4,
        items: [],
      },
      {
        key: 'appearance',
        label: 'Appearance',
        icon: 'Palette',
        order: 5,
        items: ['hero-slides', 'blocks', 'menus'],
      },
      {
        key: 'user-management',
        label: 'User Management',
        icon: 'Users',
        order: 6,
        items: ['users', 'roles', 'permissions'],
      },
      {
        key: 'system',
        label: 'System',
        icon: 'Settings',
        order: 7,
        items: ['settings'],
      }
    ],

    // ── Per-collection overrides ──────────────────────────────────────────────
    // Keyed by collection slug. Only specify what you want to override.
    collections: {
      // Catalogue
      products:              { icon: 'Package', group: 'catalogue', order: 1, showAddNew: false },
      'product-categories':  { group: 'catalogue', order: 2, parent: 'products', showAddNew: false },
      countries:             { icon: 'Map', group: 'catalogue', order: 3, showAddNew: false },
      jobs:                  { icon: 'BriefcaseBusiness', group: 'catalogue', order: 4, showAddNew: false },

      // Content
      pages:       { icon: 'LayoutTemplate', group: 'content', order: 1, showAddNew: false },
      posts:       { icon: 'FileText', group: 'content', order: 2, showAddNew: false },
      categories:  { icon: undefined, group: 'content', order: 3, parent: 'posts', showAddNew: false },
      comments:    { icon: 'MessageSquare', group: 'content', order: 4, showAddNew: false },
      'contact-messages': { icon: 'Mail', group: 'content', order: 5, showAddNew: false, standalone: true },

      // Media
      media:       { icon: 'Image', group: 'media', order: 1, showAddNew: false, standalone: true },

      // Appearance
      // 'hero-slides': { icon: 'SlidersHorizontal', group: 'appearance', order: 1 },
      blocks:      { icon: 'SquareDashedBottom', group: 'appearance', order: 2, showAddNew: false },
      menus:       { icon: 'MenuSquare', group: 'appearance', order: 3, showAddNew: false },

      // User management
      users:       { icon: 'Users', group: 'user-management', order: 1, showAddNew: false },
      roles:       { icon: 'Shield', group: 'user-management', order: 2, showAddNew: false },
      permissions: { icon: 'Key', group: 'user-management', order: 3, showAddNew: false },

      // System
      // Settings is a singleton — hide the "Add New" sub-item
      settings:    { icon: 'Settings2', group: 'system', order: 7, showAddNew: false, standalone: true  },
    },

    // ── Top links ─────────────────────────────────────────────────────────────
    // Custom links shown at the top of the sidebar, after Dashboard.
    // topLinks: [
    //   { label: 'Analytics', href: '/admin/analytics', icon: 'BarChart2' },
    // ],

    // ── Footer links ──────────────────────────────────────────────────────────
    // Custom links shown at the bottom of the sidebar (alongside "View Site").
    footerLinks: [
      { label: 'Documentation', href: '/docs', icon: 'BookOpen', external: true },
    ],
  },
};

export default adminConfig;
