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
        key: 'content',
        label: 'Content',
        icon: 'FileText',
        order: 1,
      },
      {
        key: 'media',
        label: 'Media',
        icon: 'Image',
        order: 2,
      },
      {
        key: 'user-management',
        label: 'User Management',
        icon: 'Users',
        order: 3,
      },
      {
        key: 'system',
        label: 'System',
        icon: 'Settings',
        order: 4,
      },
      {
        key: 'data',
        label: 'Data',
        icon: 'Database',
        order: 5,
      },
      {
        key: 'appearance',
        label: 'Appearance',
        icon: 'Palette',
        order: 5,
      },
    ],

    // ── Per-collection overrides ──────────────────────────────────────────────
    // Keyed by collection slug. Only specify what you want to override.
    collections: {
      users:       { icon: 'Users'          },
      roles:       { icon: 'Shield'         },
      permissions: { icon: 'Key'            },
      media:       { icon: 'Image'          },
      pages:       { icon: 'LayoutTemplate' },
      posts:       { icon: 'FileText',showAddNew: false       },
      categories:  { icon: undefined, parent: 'posts', showAddNew: false },
      comments:    { icon: 'MessageSquare'  },
      blocks:      { icon: 'SquareDashedBottom', },
      menus:       { icon: 'MenuSquare'     },
      // Settings is a singleton — hide the "Add New" sub-item
      settings:    { icon: 'Settings2', showAddNew: false },

      // To nest a collection inside another collection's menu item,
      // set 'parent' to the target collection's slug.
      // Example: show Categories inside the Posts menu item:
      // categories: { icon: 'Tag', parent: 'posts' },
    },

    // ── Top links ─────────────────────────────────────────────────────────────
    // Custom links shown at the top of the sidebar, after Dashboard.
    // topLinks: [
    //   { label: 'Analytics', href: '/admin/analytics', icon: 'BarChart2' },
    // ],

    // ── Footer links ──────────────────────────────────────────────────────────
    // Custom links shown at the bottom of the sidebar (alongside "View Site").
    footerLinks: [
      { label: 'Documentation', href: '/docs', icon: 'BookOpen' },
    ],
  },
};

export default adminConfig;
