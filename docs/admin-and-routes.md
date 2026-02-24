# Admin and Routes

## App structure

- **Public**: `(public)/[locale]/`, `(public)/[locale]/[slug]/` — locale and slug-based pages.
- **Admin**: `admin/` — dynamic admin UI driven by registered collections.
- **Docs**: `docs/` — in-app documentation (this content).

## Dynamic admin (`/admin`)

| URL | Purpose |
|-----|---------|
| `/admin` | Dashboard — collection overview and quick stats |
| `/admin/[collection]` | Collection list view (search, sort, paginate, bulk delete) |
| `/admin/[collection]/new` | Create a new document |
| `/admin/[collection]/[id]` | Edit an existing document |
| `/admin/blocks` | Manage reusable block instances |
| `/admin/settings` | Global site settings (singleton editor) |

Collections and fields come from `nextpress.config.ts` and the individual collection configs. The admin uses shared components and types from `@/core/collection` and `@/lib/collections-data`.

## Admin UI configuration (`src/admin.config.ts`)

The sidebar layout, icons, and grouping are configured in `src/admin.config.ts`. This file is separate from `nextpress.config.ts` so it can be safely imported from both server and client components.

```typescript
import type { NextPressAdminConfig } from './core/types';

const adminConfig: NextPressAdminConfig = {
  sidebar: {
    groups: [
      { key: 'content', label: 'Content', icon: 'FileText', order: 1 },
      { key: 'system',  label: 'System',  icon: 'Settings', order: 6 },
      // ...
    ],
    collections: {
      pages:    { icon: 'LayoutTemplate' },
      settings: { icon: 'Settings2', showAddNew: false },  // singleton
      // Nest categories inside the Posts menu item:
      categories: { parent: 'posts', showAddNew: false },
    },
    footerLinks: [
      { label: 'Documentation', href: '/docs', icon: 'BookOpen' },
    ],
  },
};
export default adminConfig;
```

This config is imported into `src/nextpress.config.ts` via `admin: adminConfig`.

**Key configuration options:**

- `groups` — define sidebar sections with a `key`, `label`, `icon`, and `order`. The `key` must match the `group.key` used in each collection's `admin.group` setting.
- `collections` — per-collection overrides: override the icon, hide from sidebar (`hidden: true`), suppress "Add New" (`showAddNew: false`), or nest under a parent collection (`parent: 'slug'`).
- `topLinks` — custom links shown at the top of the sidebar after Dashboard.
- `footerLinks` — custom links shown at the bottom of the sidebar alongside "View Site".

Icon names are Lucide icon names in PascalCase. See [lucide.dev/icons](https://lucide.dev/icons/) for the full list.

## Admin components overview

| Component | Location | Purpose |
|-----------|----------|---------|
| `AdminBar` | `src/app/admin/AdminBar.tsx` | Server component — top navigation bar with session info |
| `AdminSidebar` | `src/app/admin/AdminSidebar.tsx` | Client component — interactive sidebar driven by `adminConfig` |
| `CollectionList` | `src/components/admin/CollectionList/` | Paginated table with search, sort, bulk delete |
| `CollectionEdit` | `src/components/admin/CollectionEdit/` | Dynamic form driven by `CollectionMeta` |
| `SettingsEditor` | `src/components/admin/SettingsEditor/` | Tabbed singleton editor for the Settings collection |
| `BlockContentPage` | `src/components/admin/BlockContentPage.tsx` | Editor for a single block instance |
| `PageSectionsEditor` | `src/components/admin/PageSectionsEditor/` | Drag-and-drop layout editor for page sections/columns |
| `DataSourceBuilder` | `src/components/admin/DataSourceBuilder/` | Query builder UI for block data sources |
| `MenuItemsEditor` | `src/components/admin/MenuItemsEditor/` | Recursive tree editor for navigation menus |
| `PermissionGate` | `src/components/admin/PermissionGate/` | Client component for conditional rendering by permission |
| `LocaleSwitcher` | `src/components/admin/LocaleSwitcher.tsx` | Globe icon + locale buttons in top nav |
| `RichtextEditor` | `src/components/admin/RichtextEditor.tsx` | Tiptap-based rich text field editor |
| `MediaUpload` | `src/components/admin/MediaUpload/` | File uploader (provider-agnostic) |

## Permission-gating admin UI

Use `PermissionGate` to conditionally show admin UI based on the current user's permissions:

```typescript
import { PermissionGate } from '@/components/admin/PermissionGate/PermissionGate';

<PermissionGate action="delete" resource="content">
  <DeleteButton />
</PermissionGate>

<PermissionGate requireAdmin fallback={<p>Admins only</p>}>
  <DangerZone />
</PermissionGate>
```

For programmatic checks in client components, use the `usePermission` hook:

```typescript
import { usePermission } from '@/hooks/usePermission';

const canPublish = usePermission('publish', 'content');
```

Both rely on permissions serialized into the NextAuth JWT at sign-in — no extra API calls.

## API routes

API routes live under `src/app/api/`. Use them for custom endpoints (webhooks, external integrations). Auth and permissions must be enforced in each handler.

The admin collections API is at `/api/admin/collections/[collection]` and `/api/admin/collections/[collection]/[id]`. See the [API Reference](./developer-guide.md#12-api-reference) in the developer guide for full details.

## Path aliases

`@/*` → `./src/*` (tsconfig). Use `@/adapters/prisma-adapter`, `@/core/*`, `@/collections/*`, `@/lib/*` for imports. Next.js resolves these without `transpilePackages`.
