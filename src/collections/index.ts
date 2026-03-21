/**
 * Collection registry — single source of truth for all registered collections.
 *
 * This file is imported by both nextpress.config.ts (server) and
 * collections-data.ts (client). Keep it free of Node.js APIs (no `path`,
 * no `fileURLToPath`, no `process.env` at module level).
 */

import type { CollectionConfig } from '@/core/collection/types';

// System collections
import { Users } from './Users';
import { Roles } from './Roles';
import { Permissions } from './Permissions';

// Content collections
import { Media } from './Media';
import { Pages } from './Pages';
import { Blocks } from './Blocks';
import { Menus } from './Menus';
import { Categories } from './Categories';
import { Posts } from './Posts';
import { Comments } from './Comments';
import { ContactMessages } from './ContactMessages';
import { Countries } from './Countries';
import { Jobs } from './Jobs';

// Settings
import { Settings } from './Settings';

// Catalogue (AGBON)
import { ProductCategories } from './ProductCategories';
import { Products } from './Products';

export const collections: CollectionConfig[] = [
  // System
  Users,
  Roles,
  Permissions,

  // Content
  Media,
  Pages,
  Blocks,
  Menus,
  Categories,
  Posts,
  Comments,
  ContactMessages,
  Countries,
  Jobs,

  // Settings
  Settings,

  // Catalogue
  ProductCategories,
  Products,
];
