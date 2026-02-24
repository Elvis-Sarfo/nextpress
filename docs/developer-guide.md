# NextPress — Developer Guide

A comprehensive technical reference for understanding, using, and extending NextPress.

---

## Table of Contents

1. [What is NextPress](#1-what-is-nextpress)
2. [Architecture Overview](#2-architecture-overview)
3. [Getting Started](#3-getting-started)
4. [Configuration](#4-configuration)
5. [Collections — The Content Type System](#5-collections)
6. [Schema Engine](#6-schema-engine)
7. [Block System](#7-block-system)
8. [Localization](#8-localization)
9. [Authentication & RBAC](#9-authentication--rbac)
10. [Admin UI](#10-admin-ui)
11. [Public Routes & Page Rendering](#11-public-routes--page-rendering)
12. [API Reference](#12-api-reference)
13. [How-To Recipes](#13-how-to-recipes)
14. [Database & Migrations](#14-database--migrations)

---

## 1. What is NextPress

NextPress is a **headless CMS** built on top of Next.js 14+ (App Router). It lets you define content types (called **Collections**) in TypeScript, automatically generates a Prisma database schema from those definitions, and provides a full admin UI for managing content.

**Key properties:**
- **Code-first**: Content types live in your repo as `.ts` files — the database schema is derived from them, not the other way around.
- **Block-based page builder**: Pages are composed of reusable **Blocks** arranged into **Sections** and **Columns**.
- **Locale-first JSON**: All translatable fields store a `{ locale: value }` map in a single JSON column — no duplicated tables per language.
- **Dynamic RBAC**: Roles and permissions live in the database and are evaluated at runtime with 5-minute caching.
- **Multi-provider media**: Swap between local disk, S3, Supabase, or Cloudinary storage with one env-var change.

---

## 2. Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                        Request Layer                         │
│   Public routes (/(public)/[locale]/…)   Admin (/admin/…)   │
│               API routes (/api/…)                            │
└───────────────────────┬──────────────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────────────┐
│                      Application Layer                       │
│  src/lib/cms.ts — helper functions (pages, posts, menus…)    │
│  src/lib/rbac-service.ts — load principal from DB            │
│  src/auth.ts — NextAuth v5 (JWT + credentials)               │
└───────────────────────┬──────────────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────────────┐
│                    Adapter Layer (Prisma)                     │
│  src/adapters/prisma-adapter/repositories/                   │
│  src/adapters/prisma-adapter/mappers/                        │
└───────────────────────┬──────────────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────────────┐
│                      Database (PostgreSQL)                    │
│  schema.prisma — auto-generated from Collection definitions  │
└──────────────────────────────────────────────────────────────┘
```

### Module map

| Path | Purpose |
|------|---------|
| `src/core/` | CMS kernel — collection types, schema engine, RBAC, events, versioning |
| `src/adapters/prisma-adapter/` | Prisma ORM — repositories (data access) + mappers (type translation) |
| `src/collections/` | **Your content types** — edit these to change what data the CMS manages |
| `src/blocks/` | Block type registry + manifests (editor schema + React component per block) |
| `src/lib/` | App-layer utilities: cms.ts, auth-utils.ts, rbac-service.ts, locale-utils.ts |
| `src/app/admin/` | Admin UI (Next.js App Router pages) |
| `src/app/(public)/` | Public site (locale-prefixed routes) |
| `src/app/api/` | REST API handlers |
| `src/scripts/` | CLI: schema generation, migration runner, doc generation |
| `src/nextpress.config.ts` | **Central configuration file** — register collections, set locales, configure storage |

### Data flow for schema changes

```
Edit src/collections/MyType.ts
          │
          ▼
pnpm schema:generate          ← reads all collections, writes schema.prisma
          │
          ▼
pnpm db:push  OR  db:migrate  ← Prisma pushes/migrates the DB
          │
          ▼
pnpm db:generate              ← regenerates the Prisma client typings
```

---

## 3. Getting Started

### Prerequisites

- Node.js 18+
- pnpm (`npm i -g pnpm`)
- PostgreSQL database (local or cloud)

### First-time setup

```bash
pnpm install
cp .env.example .env
# Edit .env — fill in DATABASE_URL, DATABASE_URI, AUTH_SECRET, PAYLOAD_SECRET
pnpm schema:generate          # generate schema.prisma from collections
pnpm db:migration:run         # apply schema to DB  (or --push flag for push mode)
pnpm db:seed                  # create admin user, roles, permissions, sample pages
pnpm dev                      # start dev server at localhost:3000
```

After seeding, log in to the admin at `http://localhost:3000/admin` with:
- **Email**: `admin@example.com`
- **Password**: `Admin1234!`

### Development commands

```bash
pnpm dev              # Next.js dev server (hot reload)
pnpm build            # Production build
pnpm lint             # ESLint
```

### Database commands

```bash
pnpm db:generate      # Regenerate Prisma client (after schema changes)
pnpm db:migrate       # Create + apply a new dev migration
pnpm db:push          # Push schema without creating a migration file (quick dev)
pnpm db:deploy        # Apply pending migrations in production
pnpm db:seed          # Seed default data
pnpm db:reset         # Force-reset the database (destructive!)
```

### Code generation commands

```bash
pnpm schema:generate  # Regenerate schema.prisma from collection definitions
pnpm docs:generate    # Regenerate auto-generated doc fragments
```

---

## 4. Configuration

### `src/nextpress.config.ts`

This is the single configuration file for the entire CMS. Changes here affect schema generation, localization, media storage, and migration behavior.

> **Note:** Admin UI layout (sidebar groups, icons, custom links) is configured separately in `src/admin.config.ts` — see [Admin UI Configuration](#admin-ui-configuration) below.

```typescript
const config = {
  // 1. Collections — import from src/collections/index.ts
  collections,

  // 2. Authentication secret
  secret: process.env.PAYLOAD_SECRET || '',

  // 3. Database
  db: {
    provider: 'postgres',
    url: process.env.DATABASE_URI || '',
  },

  // 4. Media storage — switch provider with one env var
  storage: {
    provider: process.env.NEXTPRESS_STORAGE_PROVIDER || 'local',
    local: { uploadDir: 'public/uploads/media', publicBasePath: '/uploads/media' },
    s3: { bucket, region, accessKeyId, secretAccessKey, endpoint, publicBaseUrl },
    supabase: { url, serviceRoleKey, bucket },
    cloudinary: { cloudName, apiKey, apiSecret, folder },
  },

  // 5. Localization
  localization: {
    locales: [
      { code: 'en', label: 'English' },
      { code: 'fr', label: 'Français' },
      { code: 'zh', label: '中文' },
    ],
    defaultLocale: 'en',
    fallback: true,   // use defaultLocale when requested locale is missing
  },

  // 6. Schema generation behavior
  schema: {
    generateOnStart: process.env.NODE_ENV === 'development',
    outputPath: 'src/adapters/prisma-adapter/prisma/schema.prisma',
    configChangeDetectionStrategy: 'once',  // 'once' | 'hash' | 'always'
    stateBackend: 'memory',                 // 'memory' | 'file'
    stateFilePath: '.next/cache/nextpress-state.json',
    migrationMode: 'auto',                  // 'auto' | 'manual' | 'deploy' | 'prompt'
  },
}
```

**`configChangeDetectionStrategy` options:**
| Value | Behavior |
|-------|----------|
| `'once'` | Re-generates only once per server start (default) |
| `'hash'` | Re-generates when collection definitions change (MD5 hash comparison) |
| `'always'` | Re-generates on every request (debugging only) |

**`migrationMode` options:**
| Value | Behavior |
|-------|----------|
| `'auto'` | Automatically runs `db push` after schema changes |
| `'manual'` | Never auto-migrates; run `pnpm db:migrate` yourself |
| `'deploy'` | Runs `prisma migrate deploy` (for production CI/CD) |
| `'prompt'` | Asks before running |

### Environment variables

```bash
# Required
DATABASE_URL=postgresql://user:pass@host:5432/db   # Prisma connection
DATABASE_URI=postgresql://user:pass@host:5432/db   # NextPress config
AUTH_SECRET=your-nextauth-secret-32chars+
PAYLOAD_SECRET=your-cms-secret

# Media storage (local is default, no extra vars needed)
NEXTPRESS_STORAGE_PROVIDER=local      # local | s3 | supabase | cloudinary

# S3 (if NEXTPRESS_STORAGE_PROVIDER=s3)
S3_BUCKET=my-bucket
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
S3_ENDPOINT=                          # optional, for custom S3-compatible endpoints
S3_PUBLIC_BASE_URL=https://...

# Supabase (if NEXTPRESS_STORAGE_PROVIDER=supabase)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_STORAGE_BUCKET=media

# Cloudinary (if NEXTPRESS_STORAGE_PROVIDER=cloudinary)
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLOUDINARY_FOLDER=nextpress-media
```

### Admin UI Configuration

Admin sidebar layout is configured in `src/admin.config.ts` — separate from `nextpress.config.ts` so it can be safely imported from both server and client components.

```typescript
// src/admin.config.ts
import type { NextPressAdminConfig } from './core/types';

const adminConfig: NextPressAdminConfig = {
  sidebar: {
    // ── Navigation groups ──────────────────────────────────────────
    // Define groups in the order they appear in the sidebar.
    // 'key' must match the value used in collection.admin.group.key.
    groups: [
      { key: 'content',         label: 'Content',         icon: 'FileText', order: 1 },
      { key: 'media',           label: 'Media',           icon: 'Image',    order: 2 },
      { key: 'data',            label: 'Data',            icon: 'Database', order: 3 },
      { key: 'appearance',      label: 'Appearance',      icon: 'Palette',  order: 4 },
      { key: 'user-management', label: 'User Management', icon: 'Users',    order: 5 },
      { key: 'system',          label: 'System',          icon: 'Settings', order: 6 },
    ],

    // ── Per-collection overrides ───────────────────────────────────
    // Keyed by collection slug. Only specify what you want to override.
    collections: {
      users:       { icon: 'Users' },
      roles:       { icon: 'Shield' },
      permissions: { icon: 'Key' },
      media:       { icon: 'Image' },
      pages:       { icon: 'LayoutTemplate' },
      posts:       { icon: 'FileText', showAddNew: false },
      // Nest categories inside the Posts menu item:
      categories:  { icon: undefined, parent: 'posts', showAddNew: false },
      comments:    { icon: 'MessageSquare' },
      blocks:      { icon: 'SquareDashedBottom' },
      menus:       { icon: 'MenuSquare' },
      // Singleton — hide "Add New":
      settings:    { icon: 'Settings2', showAddNew: false },
    },

    // ── Custom footer links ────────────────────────────────────────
    footerLinks: [
      { label: 'Documentation', href: '/docs', icon: 'BookOpen' },
    ],

    // ── Custom top links (after Dashboard) ────────────────────────
    // topLinks: [
    //   { label: 'Analytics', href: '/admin/analytics', icon: 'BarChart2' },
    // ],
  },
};

export default adminConfig;
```

This config is imported by `src/nextpress.config.ts` via `admin: adminConfig`.

**Sidebar group config options (`NextPressAdminSidebarGroupConfig`):**

| Field | Type | Description |
|-------|------|-------------|
| `key` | `string` | Matches `collection.admin.group.key` |
| `label` | `string` | Display label in sidebar |
| `icon` | `string` | Lucide icon name (PascalCase) |
| `order` | `number` | Sort order — lower numbers appear higher |
| `defaultCollapsed` | `boolean` | Whether the group starts collapsed (default: `false`) |

**Per-collection override options (`NextPressAdminSidebarCollectionConfig`):**

| Field | Type | Description |
|-------|------|-------------|
| `label` | `string` | Override the display label |
| `icon` | `string \| null` | Lucide icon name; `undefined` keeps collection default |
| `hidden` | `boolean` | Hide from sidebar entirely |
| `showAddNew` | `boolean` | Show/hide the "Add New" sub-item (default: `true`) |
| `parent` | `string` | Nest under another collection's menu item (e.g. `'posts'`) |

**Custom link options (`NextPressAdminSidebarLinkConfig`):**

| Field | Type | Description |
|-------|------|-------------|
| `label` | `string` | Display label |
| `href` | `string` | Target URL |
| `icon` | `string` | Lucide icon name |
| `external` | `boolean` | Open in a new tab |

---

## 5. Collections

Collections are TypeScript objects that define your content types. They live in `src/collections/` and are registered in `src/collections/index.ts`.

### Built-in collections

| Slug | Purpose |
|------|---------|
| `users` | CMS users with roles + login lockout |
| `roles` | Named roles assigned to users |
| `permissions` | Granular resource/action/scope permissions assigned to roles |
| `pages` | Block-based page builder content |
| `posts` | Blog posts / news articles |
| `categories` | Taxonomy for posts |
| `comments` | Threaded comments on pages and posts |
| `blocks` | Reusable block instances referenced by pages |
| `media` | Uploaded files with multi-provider storage |
| `menus` | Navigation menus with nested item trees |
| `settings` | Global site configuration (logo, contact, SEO defaults) |

### Collection definition anatomy

```typescript
// src/collections/YourType.ts
import { CollectionConfig } from '../core/collection';

export const YourType: CollectionConfig<'yourtype'> = {
  // Required
  slug: 'yourtype',

  // Admin UI labels
  labels: { singular: 'Thing', plural: 'Things' },

  // Admin UI options
  admin: {
    useAsTitle: 'name',          // Field shown in list rows as title
    defaultColumns: ['name', 'status', 'createdAt'],
    group: 'Content',            // Sidebar grouping
  },

  // Field definitions (see field types below)
  fields: [...],

  // Access control (optional — defaults to authenticated admin-only)
  access: {
    read: ({ req }) => true,          // public read
    create: ({ req }) => !!req.user,  // authenticated create
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },

  // Versioning
  versions: { enabled: true, maxPerDoc: 10 },

  // Localization
  localization: { locales: ['en', 'fr', 'de'], defaultLocale: 'en', fallback: true },

  // Enable comment threading on this collection
  comments: true,

  // Authentication (for the Users collection only)
  auth: {
    tokenExpiration: 7200,       // 2 hours in seconds
    lockout: { enabled: true, maxAttempts: 5, lockoutDuration: 600 },
  },

  // DB indexes
  indexes: [
    { fields: ['status'] },
    { fields: ['category', 'status'], unique: false },
  ],
};
```

### Field types reference

Every field is an object with a `name`, `type`, and optional modifiers.

#### Text

```typescript
{
  name: 'title',
  type: 'text',
  required: true,
  unique: false,
  admin: { description: 'Page title' }
}
```

#### Textarea

```typescript
{ name: 'bio', type: 'textarea' }
```

#### Number

```typescript
{ name: 'order', type: 'number', defaultValue: 0 }
```

#### Email

```typescript
{ name: 'email', type: 'email', unique: true, required: true }
```

#### Checkbox

```typescript
{ name: 'active', type: 'checkbox', defaultValue: true }
```

#### Select

```typescript
{
  name: 'status',
  type: 'select',
  defaultValue: 'draft',
  options: [
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' },
    { label: 'Archived', value: 'archived' },
  ],
}
```

#### JSON (localized or raw)

```typescript
// Raw JSON
{ name: 'config', type: 'json' }

// Locale-first JSON — stores { "en": "value", "fr": "valeur" }
{
  name: 'title',
  type: 'json',
  required: true,
  localized: true,
  admin: { localizedAs: 'text' },       // 'text' | 'textarea' | 'json'
}
```

#### Upload (media relation)

```typescript
{
  name: 'featuredImage',
  type: 'upload',
  relationTo: 'media',
}
```

#### Relationship

```typescript
// Single FK reference
{
  name: 'category',
  type: 'relationship',
  relationTo: 'categories',
  hasMany: false,
}

// Many-to-many (implicit junction table)
{
  name: 'roles',
  type: 'relationship',
  relationTo: 'roles',
  hasMany: true,
}
```

#### Group (nested fields)

```typescript
{
  name: 'seo',
  type: 'group',
  fields: [
    { name: 'metaTitle', type: 'text' },
    { name: 'metaDescription', type: 'text' },
    { name: 'noIndex', type: 'checkbox', defaultValue: false },
  ],
}
```

#### Array

```typescript
{
  name: 'tags',
  type: 'array',
  fields: [{ name: 'value', type: 'text' }],
}
```

#### RichText

```typescript
{
  name: 'content',
  type: 'richText',
  localized: true,
  admin: { localizedAs: 'json' },
}
```

### Access control

Each collection can define per-operation access functions. The functions receive `{ req }` with `req.user` containing `{ id, role }`.

```typescript
access: {
  // Return true/false OR a Prisma where-clause object to filter results
  read: ({ req }) => {
    if (req.user?.role === 'admin') return true;
    return { status: { equals: 'published' } };  // non-admin only sees published
  },
  create: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
  update: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
  delete: ({ req }) => req.user?.role === 'admin',
}
```

### Versioning

When `versions.enabled: true`, every save creates a version record in a `*Version` model (e.g., `PagesVersion`). Each version is identified by `documentId + status`. The live document is `status: 'published'`; drafts are `status: 'draft'`.

```typescript
versions: {
  enabled: true,
  maxPerDoc: 10,    // keep only the last 10 versions per document
}
```

### Registering a new collection

1. Create `src/collections/YourType.ts` (copy an existing one as a template).
2. Export your collection object.
3. Add it to `src/collections/index.ts`:

```typescript
// src/collections/index.ts
import { YourType } from './YourType'
export const collections = [
  // ...existing collections...
  YourType,
]
```

4. Run the schema pipeline:

```bash
pnpm schema:generate
pnpm db:push          # or db:migrate for a migration file
pnpm db:generate      # regenerate Prisma client
```

5. If you need API support, check that your collection's slug is in the `ALLOWED` set in both:
   - `src/app/api/admin/collections/[collection]/route.ts`
   - `src/app/api/admin/collections/[collection]/[id]/route.ts`

---

## 6. Schema Engine

The schema engine lives in `src/core/schema-engine/` and converts collection definitions into a valid `schema.prisma` file.

### How it works

1. `pnpm schema:generate` executes `src/scripts/generate-schema.ts`.
2. That script reads `src/nextpress.config.ts`, collects all registered collections.
3. For each collection it generates:
   - A Prisma model with fields matching the collection's field definitions
   - Versioning models (e.g., `PagesVersion`) when `versions.enabled`
   - Implicit many-to-many relations for `hasMany: true` relationship fields
4. `injectBackRelations()` automatically adds back-relation fields so Prisma knows both sides of every foreign key.
5. The result is written to `src/adapters/prisma-adapter/prisma/schema.prisma`.

> **Warning**: `pnpm schema:generate` **completely overwrites** `schema.prisma`. Never hand-edit that file — put all customizations in the collection definitions instead.

### Field type → Prisma type mapping

| Collection field type | Prisma column type |
|-----------------------|--------------------|
| `text`, `email` | `String` |
| `textarea` | `String` |
| `number` | `Int` or `Float` |
| `checkbox` | `Boolean` |
| `select` | `String` |
| `json`, `richText` | `Json` |
| `date` | `DateTime` |
| `upload` | `String?` (stores Media ID FK) |
| `relationship` (hasMany: false) | `String?` (FK column) |
| `relationship` (hasMany: true) | `Model[]` (implicit M2M) |
| `group` | Inline on same model (prefixed field names) |

### Versioning schema pattern

For a collection with slug `pages` and versioning enabled, the schema engine creates:

```prisma
model Pages {
  id         String        @id @default(cuid())
  documentId String
  status     String        @default("draft")
  // ...content fields...
  createdAt  DateTime      @default(now())
  updatedAt  DateTime      @updatedAt
  versions   PagesVersion[]

  @@unique([documentId, status])
}

model PagesVersion {
  id         String   @id @default(cuid())
  documentId String
  version    Int
  data       Json
  createdAt  DateTime @default(now())
  page       Pages    @relation(fields: [documentId], references: [documentId])
}
```

---

## 7. Block System

The block system enables a visual page builder. Pages contain **Sections**, each section has **Columns**, and each column holds ordered references to reusable **Block** records.

### Core concepts

| Concept | Description |
|---------|-------------|
| **Block manifest** | TypeScript object defining a block's editor schema + React component |
| **Block record** | A database row in the `Blocks` table with a `name`, `type`, `content` JSON, and optional `dataSource` |
| **Page sections** | The `sections` JSON column on a `Pages` record stores the layout tree |
| **PageRenderer** | RSC that reads `page.sections`, loads all referenced blocks in one query, and renders them |

### Block manifest structure

Every block type is defined as a `BlockManifest` in `src/blocks/manifests/<type>.ts`:

```typescript
import type { BlockManifest } from '../types';
import { MyComponent } from '@/components/blocks/MyComponent';

export const myBlockManifest: BlockManifest = {
  // Stored in DB as Blocks.type
  type: 'my-block',

  // Shown in admin block picker
  label: 'My Block',
  icon: 'Star',    // lucide-react icon name

  definition: {
    // Fields for this block's content (shown in BlockContentPage)
    content: [
      { name: 'heading',  type: 'text',     label: 'Heading',  required: true },
      { name: 'subtext',  type: 'textarea', label: 'Subtext'  },
      { name: 'ctaLabel', type: 'text',     label: 'CTA Label' },
      { name: 'ctaUrl',   type: 'text',     label: 'CTA URL'   },
    ],

    // Repeatable items (e.g., FAQ entries, gallery images)
    elements: {
      label: 'Item',
      fields: [
        { name: 'question', type: 'text',     label: 'Question' },
        { name: 'answer',   type: 'textarea', label: 'Answer'   },
      ],
    },

    // Optional: query live collection data at render time
    dataSource: {
      collection: 'posts',
      defaultParams: {
        where: { status: 'published' },
        orderBy: { publishedAt: 'desc' },
      },
      fields: [
        { name: 'limit',      type: 'number',       scope: 'root' },
        { name: 'categoryId', type: 'relationship',  scope: 'where', relationTo: 'categories' },
      ],
    },
  },

  component: MyComponent,
};
```

### Block component signature

```typescript
import type { BlockComponent } from '@/blocks/types';

interface MyBlockContent {
  heading?: string;
  subtext?: string;
}

// data is populated when dataSource is configured
export const MyComponent: BlockComponent = ({ content, data }) => {
  const c = content as MyBlockContent;
  const posts = (data ?? []) as PostRecord[];

  return (
    <section>
      <h2>{c.heading}</h2>
      {posts.map(p => <PostCard key={p.id} post={p} />)}
    </section>
  );
};
```

### Adding a new block type

1. Create `src/blocks/manifests/my-block.ts` with a `BlockManifest`.
2. Create `src/components/blocks/MyBlockComponent.tsx` with the React component.
3. Register the manifest in `src/blocks/registry.ts`:

```typescript
import { myBlockManifest } from './manifests/my-block';

const BUILT_IN_MANIFESTS: BlockManifest[] = [
  // ...existing...
  myBlockManifest,
];
```

4. Add `'my-block'` to the `type` field options in `src/collections/Blocks.ts` so it appears in the admin dropdown.

**No schema change is needed** — block content is stored as JSON and the block type is just a string key.

### Block data sources

A block can query **live collection data** at render time. This is controlled by the `dataSource` on a block manifest and stored per-block-instance in `Blocks.dataSource` (JSON column).

**To make a collection queryable by blocks:**

1. Add it to `QUERYABLE_COLLECTIONS` in `src/lib/cms.ts`:

```typescript
const QUERYABLE_COLLECTIONS: Record<string, (params: CollectionQueryParams) => Promise<unknown[]>> = {
  posts: (params) => queryPosts(params),
  categories: (params) => queryCategories(params),
  // add yours here:
  events: (params) => queryEvents(params),
};
```

2. Add its metadata to `src/lib/datasource-meta.ts` so the admin UI knows which fields to offer in the query builder:

```typescript
export const QUERYABLE_COLLECTION_META: QueryableCollectionMeta[] = [
  // ...existing...
  {
    slug: 'events',
    label: 'Events',
    fields: [
      { name: 'startDate', label: 'Start Date', type: 'date' },
      { name: 'category',  label: 'Category',  type: 'relationship', relationTo: 'categories' },
    ],
  },
];
```

### Page sections JSON structure

The `sections` column on a `Pages` record looks like this:

```json
[
  {
    "id": "sec-1",
    "name": "Hero Section",
    "templateName": "full-width",
    "settings": {},
    "columns": [
      {
        "id": "col-1",
        "width": 12,
        "offset": 0,
        "blocks": [
          { "blockId": "cldxxxxxxx", "order": 0 },
          { "blockId": "cldyyyyyyy", "order": 1 }
        ]
      }
    ]
  }
]
```

The `blockId` values are IDs from the `Blocks` table. `PageRenderer` resolves them via `getBlocksByIds()`.

---

## 8. Localization

### Locale-first JSON pattern

All translatable content is stored in a single JSON column as a `{ locale: value }` map:

```json
// Scalar field (title, slug, excerpt)
{ "en": "About Us", "fr": "À propos", "de": "Über uns" }

// Object field (block content)
{ "en": { "heading": "Welcome", "cta": "Click here" }, "fr": { "heading": "Bienvenue", "cta": "Cliquez" } }
```

### Locale utilities (`src/lib/locale-utils.ts`)

```typescript
import { getLocale, getLocaleAlternates } from '@/lib/locale-utils';

// Read a scalar localized field
const title = getLocale(page.title, 'fr');           // "À propos" or 'en' fallback

// Read an object localized field (block content)
const content = getLocale(block.content, locale);    // { heading: 'Welcome', ... }

// Generate hreflang alternates for SEO
const alternates = getLocaleAlternates(page.slug);
// [{ locale: 'en', slug: 'about-us' }, { locale: 'fr', slug: 'a-propos' }]
```

### Querying by slug in a locale

Since slug is a JSON column, use Prisma path queries:

```typescript
const page = await prisma.pages.findFirst({
  where: {
    slug: { path: [locale], equals: slug },
    status: 'published',
  },
});
```

### Marking a field as localized

In a collection definition:

```typescript
{
  name: 'title',
  type: 'json',
  localized: true,
  admin: { localizedAs: 'text' },  // how to render in admin: 'text' | 'textarea' | 'json'
}
```

The admin UI will show a locale switcher in the form header and render the input only for the active locale.

### Adding or removing a locale

1. Edit `src/nextpress.config.ts` — add/remove from the `localization.locales` array.
2. Run `pnpm schema:generate && pnpm db:push` (no schema change needed for JSON columns, but the config update triggers regeneration).
3. Update `src/components/admin/LocaleSwitcher.tsx` if you want to surface the locale in the admin toolbar.
4. Update `src/app/(public)/[locale]/` dynamic routes to include the new locale in `generateStaticParams` if needed.

---

## 9. Authentication & RBAC

### Authentication flow

NextPress uses **NextAuth v5** with the **credentials provider** (email + password). Auth config is in `src/auth.ts`.

1. User submits email + password to `POST /api/auth/callback/credentials`.
2. Server looks up user by email, checks `active` flag, verifies lockout.
3. Password is verified with **bcrypt** against `passwordHash`.
4. On success: a JWT session token is issued containing `{ id, email, name, role }`.
5. On failure: `loginAttempts` increments; after 5 failures, `lockedUntil` is set for 10 minutes.
6. `middleware.ts` protects all `/admin/*` routes by checking for a valid session.

### Sessions

The NextAuth JWT carries the user's **primary role** as a string (`admin`, `editor`, `author`, `viewer`). This is derived from the DB role set on first login via priority order: admin > editor > author > viewer.

For full permission checks, call `getCurrentPrincipal()` which loads the complete role+permission graph from the DB (with 5-minute cache).

### RBAC model

```
User ──(many-to-many)──► Role ──(many-to-many)──► Permission
                                                      │
                               resource (content/schema/user/media/settings)
                               action   (create/read/update/delete/publish/…)
                               scope    (all | own)
```

**Scope values:**
- `all` — permission applies to all documents
- `own` — permission applies only to documents where the user is the author

### Using `requireAuth` / `requireRole` in server code

```typescript
import { requireAuth, requireRole } from '@/lib/auth-utils';

// In a server action or API route:
const principal = await requireAuth();          // throws 401 if not logged in
await requireRole(principal, 'admin');          // throws 403 if not admin
```

### Using `getCurrentPrincipal` for dynamic permission checks

```typescript
import { getCurrentPrincipal } from '@/lib/cms';
import { rbacEngine } from '@/core/permissions/rbac-engine';

const principal = await getCurrentPrincipal();
if (!principal) return { error: 'Unauthenticated' };

const canPublish = rbacEngine.can(principal, 'content', 'publish', 'all');
```

### Adding a new permission

Permissions are DB records, so add them via the admin UI (Admin → Permissions → New) or via seed:

```typescript
// src/adapters/prisma-adapter/prisma/seed.ts
await prisma.permissions.upsert({
  where: { name: 'events:create:all' },
  update: {},
  create: {
    name: 'events:create:all',
    resource: 'content',
    action: 'create',
    scope: 'all',
    description: 'Create any event',
  },
});
```

Then assign it to a role via the Roles admin page.

### Cache invalidation

After changing a user's roles in the admin, call:

```typescript
import { invalidatePrincipalCache } from '@/lib/rbac-service';
invalidatePrincipalCache(userId);
```

This is already done automatically by the admin API when roles are updated.

### PermissionGate (client component)

`src/components/admin/PermissionGate/PermissionGate.tsx` conditionally renders children based on the current user's permissions. It reads permissions baked into the JWT at sign-in — no extra API round-trips.

```typescript
import { PermissionGate } from '@/components/admin/PermissionGate/PermissionGate';

// Show delete button only to users with content:delete permission
<PermissionGate action="delete" resource="content">
  <Button onClick={handleDelete}>Delete</Button>
</PermissionGate>

// Scope to the resource owner only
<PermissionGate action="update" resource="content" ownerId={post.authorId}>
  <Button>Edit</Button>
</PermissionGate>

// Admin-only with a fallback
<PermissionGate requireAdmin fallback={<span>Admins only</span>}>
  <SettingsPanel />
</PermissionGate>
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `action` | `Action` | Permission action (e.g. `'delete'`, `'update'`, `'publish'`) |
| `resource` | `ResourceType` | Resource category (`content`, `schema`, `user`, `media`, `settings`) |
| `ownerId` | `string` | For `'own'`-scoped permissions — the resource owner's user ID |
| `typeId` | `string` | For `'contentType'`-scoped permissions |
| `requireAdmin` | `boolean` | Shortcut: require admin role regardless of action/resource |
| `children` | `ReactNode` | Rendered when permission is granted |
| `fallback` | `ReactNode` | Rendered when permission is denied (default: `null`) |

### `usePermission` hook

For programmatic checks inside client components, use the `usePermission` hook directly:

```typescript
import { usePermission } from '@/hooks/usePermission';

function MyComponent({ post }: { post: Post }) {
  const canDelete = usePermission('delete', 'content');
  const canEditOwn = usePermission('update', 'content', { ownerId: post.authorId });

  return (
    <div>
      {canEditOwn && <EditButton />}
      {canDelete && <DeleteButton />}
    </div>
  );
}
```

The hook reads the `perms` array from the NextAuth JWT (`session.user.perms`). Admins (`session.user.isAdmin`) always return `true`. Returns `false` while the session is loading.

---

## 10. Admin UI

### Routes

| URL | Component | Purpose |
|-----|-----------|---------|
| `/admin` | RootPage | Dashboard + collection navigation |
| `/admin/[collection]` | CollectionList | Paginated list with search and bulk delete |
| `/admin/[collection]/new` | CollectionEdit | Create new document |
| `/admin/[collection]/[id]` | CollectionEdit | Edit existing document |
| `/admin/blocks` | Special page | Manage block instances |
| `/admin/settings` | Settings | Global site config |

### Field rendering in `CollectionEdit`

`CollectionEdit` reads `CollectionMeta` (from `/api/admin/collections/[collection]`) and renders fields based on `field.type`:

| Field type | Admin component |
|------------|----------------|
| `text`, `email` | `<input type="text">` |
| `textarea` | `<textarea>` |
| `number` | `<input type="number">` |
| `checkbox` | `<input type="checkbox">` |
| `select` | `<select>` dropdown |
| `json` (plain) | CodeMirror JSON editor |
| `json` (localized) | Text/textarea input per active locale |
| `upload` | MediaUpload component |
| `relationship` (single) | Select dropdown |
| `relationship` (hasMany) | Checkbox list |
| `group` | Nested field group |
| custom component | Specified by `field.adminComponent` |

### Locale switcher in forms

When a collection has at least one `localized: true` field, a locale switcher appears in the form header. It reads from `AdminLocaleProvider` context (persisted to localStorage). Changing the locale updates all localized field inputs simultaneously.

### Custom admin components

You can replace the default field renderer for a specific field by adding `component: 'my-component'` to `admin` in the collection definition, then handling that in `CollectionEdit`:

```typescript
// 1. In collection definition:
{
  name: 'items',
  type: 'json',
  admin: { component: 'menu-items' },
}

// 2. In CollectionEdit.tsx, in the 'json' case:
case 'json':
  if (field.adminComponent === 'menu-items') {
    return <MenuItemsEditor value={...} onChange={...} />;
  }
  // ...default JSON editor
```

Built-in custom components:
- `menu-items` → `MenuItemsEditor` (recursive drag-drop tree for Menus)

### MediaUpload component

Used in forms where a field is `type: 'upload'`. Handles:
- Selecting from existing media library
- Uploading new files
- Provider-agnostic (uploads go through `/api/media` which routes to the configured storage provider)

### PageSectionsEditor

A drag-and-drop editor for the `sections` JSON field on Pages. Lets editors:
- Add/remove/reorder sections
- Add/remove/reorder columns within sections
- Pick blocks from the block registry to add to a column
- Click through to a block's content editor

### DataSourceBuilder

Appears in `BlockContentPage` for all blocks. Allows configuring a live data query:

- Select a queryable collection (posts, categories, etc.)
- Set a limit
- Add filter rows (field + operator + value)
- Set sort field and direction

### SettingsEditor

`src/components/admin/SettingsEditor/SettingsEditor.tsx` is a specialized editor for singleton settings documents. It renders a tabbed UI driven entirely by the collection schema:

- **Left sidebar**: one tab per `group` field + a "General" tab for top-level scalar fields.
- **Right content**: `GroupFieldEditor` for the active group, or native inputs for the General tab.
- Localized fields within a group respect the active locale from `AdminLocaleProvider`.

It is used at `/admin/settings` and invoked by the settings page with the collection's `CollectionMeta` and the document `id`. You do not instantiate it directly — it is wired up by the settings admin page.

To add new settings fields, edit `src/collections/Settings.ts`, re-run `pnpm schema:generate && pnpm db:push && pnpm db:generate`, and the `SettingsEditor` will pick them up automatically through `CollectionMeta`.

### GroupFieldEditor

`src/components/admin/GroupFieldEditor/GroupFieldEditor.tsx` renders a `group` field as a set of nested inputs. It is used by:

- `SettingsEditor` — one `GroupFieldEditor` per group tab.
- `CollectionEdit` — inline within the standard collection form.

It handles `upload`, `text`, `textarea`, `checkbox`, `number`, `select`, and nested `array` fields within a group. Custom sub-field rendering (e.g. localized fields) follows the same `localizedAs` pattern as the top-level `CollectionEdit`.

### RichtextEditor (Tiptap)

`src/components/admin/RichtextEditor.tsx` wraps **Tiptap** to provide a `richText` field editor. Two editor variants are available:

| Variant | Location | Description |
|---------|----------|-------------|
| `NotionEditor` | `src/components/admin/editors/NotionEditor.tsx` | Full Notion-style editor with slash commands and floating toolbar |
| `SimpleEditor` | `src/components/admin/editors/SimpleEditor.tsx` | Lightweight inline editor for short-form rich text |

The editor is automatically used by `CollectionEdit` whenever a field has `type: 'richText'`. Content is stored as a Tiptap/ProseMirror JSON object in the database (`Json` column).

**Slash commands** (defined in `SlashCommandExtension.ts`) are triggered with `/` in the `NotionEditor`. Built-in commands include headings (H1–H3), bullet list, ordered list, blockquote, code block, and horizontal rule.

To use the `NotionEditor` programmatically:

```typescript
import { NotionEditor } from '@/components/admin/editors/NotionEditor';

<NotionEditor
  content={value}                       // Tiptap JSON object or null
  onChange={(json) => setField(json)}   // receives updated JSON on every change
  placeholder="Start writing…"
/>
```

---

## 11. Public Routes & Page Rendering

### Route structure

```
src/app/(public)/
├── layout.tsx              # Async layout — fetches menus, wraps in providers
├── [locale]/
│   ├── page.tsx            # Home page (locale default)
│   └── [slug]/
│       └── page.tsx        # Dynamic pages/posts
└── sitemap.ts              # XML sitemap
```

### Home page (`/[locale]`)

Fetches the page with slug matching the locale's default home slug (or falls back to first published page). Renders via `PageRenderer`.

### Dynamic slug page (`/[locale]/[slug]`)

Tries in parallel:
1. `getPublishedPage(locale, slug)` — Pages collection
2. `getPostBySlug(locale, slug)` — Posts collection

Whichever resolves first is rendered. Pages use `PageRenderer`; Posts use a post template component.

### PageRenderer

`src/components/blocks/PageRenderer.tsx` — a React Server Component:

```
page.sections (JSON)
    │
    ▼
Extract all blockIds from all sections/columns
    │
    ▼
getBlocksByIds(ids) — single batch DB query
    │
    ▼
For each block: check dataSource config
    │
    ▼
queryCollection(collection, params) — live data fetch
    │
    ▼
Render: sections → columns → BlockComponent({ content, data })
```

### NavMenu component

`src/components/public/NavMenu.tsx` — a React Server Component that renders a menu from the database:

```typescript
// In layout.tsx
const primaryMenu = await getMenuByLocation('primary');
const footerMenu = await getMenuByLocation('footer');

// Component usage
<NavMenu menu={primaryMenu} orientation="horizontal" />
<NavMenu menu={footerMenu} orientation="vertical" />
```

Dropdowns are CSS-only (Tailwind `group-hover`), no JavaScript needed.

### Sitemap

`src/app/(public)/sitemap.ts` generates an XML sitemap with entries for all published pages and posts across all locales, using `getLocaleAlternates()` for hreflang alternates.

---

## 12. API Reference

### Admin Collections API

All routes require authentication. RBAC is checked per operation.

```
GET    /api/admin/collections/:collection
       Query params: page, limit, search, sortBy, sortDir, status
       Response: { docs: [...], totalDocs, totalPages, page, limit }

POST   /api/admin/collections/:collection
       Body: collection field values (JSON)
       Response: created document

GET    /api/admin/collections/:collection/:id
       Response: single document

PUT    /api/admin/collections/:collection/:id
       Body: partial or full document update
       Relationship arrays use { set: [id1, id2] } syntax to replace all
       Response: updated document

DELETE /api/admin/collections/:collection/:id
       Response: { success: true }

GET    /api/admin/collections/:collection/:id/versions
       Response: { versions: [...] }
```

**Supported collection slugs**: `users`, `roles`, `permissions`, `media`, `pages`, `posts`, `categories`, `comments`, `blocks`, `menus`, `settings`

**Special behaviors:**
- `users` — `passwordHash` is never returned in responses; plain `password` in POST/PUT body is hashed server-side
- `roles`/`permissions` — relationship arrays in `PUT` use `{ set: [...] }` to replace the full set
- Versioned collections — saving via `PUT` creates a version snapshot

### Datasource API

```
GET /api/admin/datasource/collections
    Response: array of queryable collection metadata (slug, label, fields)
```

### Content API

```
GET /api/content
    Public endpoint for fetching content programmatically
    Query params: collection, id, locale, slug

GET /api/preview
    Draft preview — renders a draft page/post

POST /api/publish/:collection/:id
    Publish a draft document
```

### Media API

```
GET  /api/media             List media with pagination
POST /api/media             Upload a file (multipart/form-data)
GET  /api/media/:id         Get metadata for one media item
POST /api/media/signed-upload  Get a signed upload URL (for direct-to-provider uploads)
```

---

## 13. How-To Recipes

### Add a new content type (full walkthrough)

**Step 1** — Create the collection definition:

```typescript
// src/collections/Events.ts
import { CollectionConfig, CollectionTextField, JSONField, SelectField } from '../core/collection';

export const Events: CollectionConfig<'events'> = {
  slug: 'events',
  labels: { singular: 'Event', plural: 'Events' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'startDate', 'status'] },
  fields: [
    {
      name: 'title',
      type: 'json',
      required: true,
      localized: true,
      admin: { localizedAs: 'text' },
    } satisfies JSONField,
    {
      name: 'startDate',
      type: 'text',
      required: true,
    } satisfies CollectionTextField,
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    } satisfies SelectField,
  ],
  versions: { enabled: true, maxPerDoc: 5 },
};
```

**Step 2** — Register it:

```typescript
// src/collections/index.ts
import { Events } from './Events';
export const collections = [...existingCollections, Events];
```

**Step 3** — Generate and migrate:

```bash
pnpm schema:generate
pnpm db:push
pnpm db:generate
```

**Step 4** — Allow in API routes (add `'events'` to the `ALLOWED` set in both route files):

```typescript
// src/app/api/admin/collections/[collection]/route.ts
const ALLOWED = new Set(['users', 'roles', ..., 'events']);
```

**Step 5** — (Optional) Add to sidebar in admin layout by ensuring the collection is registered.

---

### Add a new block type

**Step 1** — Create the component:

```typescript
// src/components/blocks/EventListBlock.tsx
import type { BlockComponent } from '@/blocks/types';

export const EventListBlock: BlockComponent = ({ content, data }) => {
  const events = (data ?? []) as EventRecord[];
  return (
    <div className="event-list">
      <h2>{(content as { heading?: string }).heading}</h2>
      {events.map(e => <EventCard key={e.id} event={e} />)}
    </div>
  );
};
```

**Step 2** — Create the manifest:

```typescript
// src/blocks/manifests/event-list.ts
import type { BlockManifest } from '../types';
import { EventListBlock } from '@/components/blocks/EventListBlock';

export const eventListManifest: BlockManifest = {
  type: 'event-list',
  label: 'Event List',
  icon: 'Calendar',
  definition: {
    content: [
      { name: 'heading', type: 'text', label: 'Heading' },
      { name: 'limit',   type: 'number', label: 'Max Events' },
    ],
    dataSource: {
      collection: 'events',
      defaultParams: { where: { status: 'published' }, orderBy: { startDate: 'asc' } },
      fields: [{ name: 'limit', type: 'number', scope: 'root' }],
    },
  },
  component: EventListBlock,
};
```

**Step 3** — Register it:

```typescript
// src/blocks/registry.ts
import { eventListManifest } from './manifests/event-list';
const BUILT_IN_MANIFESTS = [...existing, eventListManifest];
```

**Step 4** — Add `'event-list'` to the `type` select options in `src/collections/Blocks.ts`.

**Step 5** — Make `events` queryable (see [Block data sources](#block-data-sources) above).

---

### Change media storage provider

Change a single environment variable:

```bash
# .env
NEXTPRESS_STORAGE_PROVIDER=s3   # local | s3 | supabase | cloudinary
```

Then fill in the corresponding env vars for that provider (see [Environment variables](#environment-variables)). No code change required.

---

### Add a new localized field to an existing collection

1. In the collection file, change the field's `type` to `json` and add `localized: true`:

```typescript
{
  name: 'teaser',
  type: 'json',
  localized: true,
  admin: { localizedAs: 'textarea' },
}
```

2. Re-run the schema pipeline:

```bash
pnpm schema:generate && pnpm db:push && pnpm db:generate
```

3. In your query code, read the value with `getLocale()`:

```typescript
const teaser = getLocale(page.teaser, locale);
```

---

### Create a custom admin field component

1. Build your React component (must be a client component — `'use client'`):

```typescript
// src/components/admin/ColorPickerField/ColorPickerField.tsx
'use client';
export function ColorPickerField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <input type="color" value={value} onChange={(e) => onChange(e.target.value)} />;
}
```

2. Set `component: 'color-picker'` in the field's `admin` config:

```typescript
{ name: 'color', type: 'text', admin: { component: 'color-picker' } }
```

3. Handle it in `CollectionEdit.tsx` — in the appropriate `case` branch, check `field.adminComponent`:

```typescript
case 'text':
  if (field.adminComponent === 'color-picker') {
    return <ColorPickerField value={formData[field.name]} onChange={(v) => setField(field.name, v)} />;
  }
  // ...default text input
```

---

### Seed a new permission and assign it to a role

```typescript
// src/adapters/prisma-adapter/prisma/seed.ts — append to existing seed logic
const eventPerm = await prisma.permissions.upsert({
  where: { name: 'events:create:all' },
  update: {},
  create: {
    name: 'events:create:all',
    resource: 'content',
    action: 'create',
    scope: 'all',
    description: 'Create events',
  },
});

const editorRole = await prisma.roles.findUnique({ where: { name: 'editor' } });
if (editorRole) {
  await prisma.roles.update({
    where: { id: editorRole.id },
    data: { permissions: { connect: { id: eventPerm.id } } },
  });
}
```

Run `pnpm db:seed` to apply.

---

### Add a navigation menu location

1. Add the new location value to the `location` select in `src/collections/Menus.ts`:

```typescript
{
  name: 'location',
  type: 'select',
  options: [
    { label: 'Primary', value: 'primary' },
    { label: 'Footer', value: 'footer' },
    { label: 'Mobile', value: 'mobile' },
    { label: 'Secondary', value: 'secondary' },
    { label: 'Sidebar', value: 'sidebar' },  // ← new
  ],
}
```

2. Use it in your layout or component:

```typescript
const sidebarMenu = await getMenuByLocation('sidebar');
<NavMenu menu={sidebarMenu} orientation="vertical" />
```

---

## 14. Database & Migrations

### Prisma adapter

All database access goes through **repositories** in `src/adapters/prisma-adapter/repositories/`. Never call `prisma.*` directly from pages, API routes, or `cms.ts` — always go through a repository or the helper functions in `src/lib/cms.ts`.

### Migration workflow

**Development (fast iteration):**

```bash
# After every collection change:
pnpm schema:generate     # update schema.prisma
pnpm db:push             # push to dev DB (no migration file)
pnpm db:generate         # update Prisma client
```

**Development (with migration history):**

```bash
pnpm schema:generate
pnpm db:migrate          # creates a timestamped migration file + applies it
pnpm db:generate
```

**Production deployment:**

```bash
pnpm schema:generate     # generate schema from code
pnpm db:deploy           # apply pending migration files (no changes allowed)
pnpm db:generate
```

### Seeding

The seed script at `src/adapters/prisma-adapter/prisma/seed.ts` creates:
- Permissions (all resource/action combinations)
- Roles (admin, editor, author, viewer) with their permission sets
- Default admin user (`admin@example.com` / `Admin1234!`)
- Sample pages (home, about)

Run with: `pnpm db:seed`

> After running seed, change the admin password immediately in production.

### Versioning and document IDs

Versioned collections use a **`documentId + status`** composite unique constraint rather than a simple `id` primary key. This means:
- `documentId` is a stable identifier that persists across all versions
- `status: 'draft'` is the working copy
- `status: 'published'` is the live version
- `status: 'archived'` is a previous version

When querying the live version:

```typescript
const page = await prisma.pages.findUnique({
  where: { documentId_status: { documentId: id, status: 'published' } },
});
```

### Adding a repository for a new collection

1. Create `src/adapters/prisma-adapter/repositories/events-repository.ts`:

```typescript
import { prisma } from '../prisma-client';

export async function findEventById(id: string) {
  return prisma.events.findUnique({ where: { id } });
}

export async function findPublishedEvents(locale: string, limit = 10) {
  return prisma.events.findMany({
    where: { status: 'published' },
    orderBy: { startDate: 'asc' },
    take: limit,
  });
}
```

2. Create a mapper in `src/adapters/prisma-adapter/mappers/events-mapper.ts` to convert between DB types and kernel types if needed.

3. Add helper functions to `src/lib/cms.ts` that call the repository.

---

*This document was generated from the NextPress codebase at revision `break`. For the most current information, refer to the inline JSDoc in collection files and the docs at `docs/`.*
