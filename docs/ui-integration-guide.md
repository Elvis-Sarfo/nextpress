# UI Integration Guide

A step-by-step guide for connecting an existing frontend UI to NextPress as its content backend.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Project Setup](#2-project-setup)
3. [Understanding the Data Layer](#3-understanding-the-data-layer)
4. [Locale Routing](#4-locale-routing)
5. [Fetching Pages and Posts](#5-fetching-pages-and-posts)
6. [Rendering Block-Based Pages](#6-rendering-block-based-pages)
7. [Mapping Your UI Components to Block Types](#7-mapping-your-ui-components-to-block-types)
8. [Navigation Menus](#8-navigation-menus)
9. [Site Settings](#9-site-settings)
10. [Media and Images](#10-media-and-images)
11. [Localization in Templates](#11-localization-in-templates)
12. [Posts, Categories, and Comments](#12-posts-categories-and-comments)
13. [Permission-Gated UI](#13-permission-gated-ui)
14. [Full Walkthrough Example](#14-full-walkthrough-example)

---

## 1. Overview

NextPress is a **code-first headless CMS** built on Next.js App Router. Content types (collections) are defined in TypeScript and the database schema is generated from them automatically.

When integrating an existing UI, you are essentially:

1. **Replacing static/hardcoded content** with data fetched from the CMS.
2. **Wrapping your existing React components** as NextPress block components so editors can compose pages visually.
3. **Using the CMS navigation, settings, and media APIs** instead of static configuration files.

The public frontend lives in `src/app/(public)/` and is a standard Next.js App Router application. All data-fetching helpers are in `src/lib/cms.ts`. You do not query the database directly from pages — always go through `cms.ts` functions.

---

## 2. Project Setup

### Install and configure

```bash
pnpm install
cp .env.example .env
# Fill in: DATABASE_URL, DATABASE_URI, AUTH_SECRET, PAYLOAD_SECRET
pnpm schema:generate
pnpm db:migration:run    # or: pnpm db:migration:run --push
pnpm db:seed             # creates admin user, roles, sample pages
pnpm dev
```

Admin: `http://localhost:3000/admin` — `admin@example.com` / `Admin1234!`

### Directory map

```
src/
├── app/
│   ├── (public)/          ← Your public-facing frontend lives here
│   │   ├── layout.tsx     ← Async layout: fetches menus, wraps providers
│   │   └── [locale]/
│   │       ├── page.tsx   ← Home page
│   │       └── [slug]/
│   │           └── page.tsx  ← Dynamic pages and posts
│   └── admin/             ← CMS admin UI (don't modify for content integration)
├── blocks/
│   ├── manifests/         ← One file per block type (schema + component)
│   └── registry.ts        ← Register all block manifests here
├── components/
│   └── blocks/            ← Your React block components go here
│       └── PageRenderer.tsx
├── lib/
│   └── cms.ts             ← All data-fetching functions (pages, posts, menus…)
└── collections/           ← Content type definitions
```

---

## 3. Understanding the Data Layer

All data access for the frontend goes through `src/lib/cms.ts`. Never import Prisma or call repositories directly from page files.

### Key functions

```typescript
import {
  getPublishedPage,
  getPublishedPost,
  getPublishedPosts,
  getMenuByLocation,
  getCategories,
  getCategoryBySlug,
  getPostsByCategory,
  getBlocksByIds,
  queryCollection,
} from '@/lib/cms';
```

### Fetching a single page

```typescript
// src/app/(public)/[locale]/[slug]/page.tsx
import { getPublishedPage } from '@/lib/cms';

export default async function Page({ params }: { params: { locale: string; slug: string } }) {
  const page = await getPublishedPage(params.locale, params.slug);
  if (!page) notFound();

  // page.title   → Json column: { en: 'About Us', fr: 'À propos' }
  // page.sections → Json column: layout tree with block references
  // ...
}
```

### Fetching a list of posts

```typescript
import { getPublishedPosts } from '@/lib/cms';

const { docs: posts, totalDocs } = await getPublishedPosts('en', {
  page: 1,
  limit: 10,
  category: 'news',   // optional category slug filter
});
```

---

## 4. Locale Routing

The public frontend uses `[locale]` as the first path segment. The locale is always a two-letter code matching one of the locales configured in `src/nextpress.config.ts`.

```
http://localhost:3000/en/about-us
http://localhost:3000/fr/a-propos
```

### Reading the locale from params

```typescript
// src/app/(public)/[locale]/[slug]/page.tsx
export default async function Page({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const { locale, slug } = params;
  // locale is 'en', 'fr', 'zh', etc.
}
```

### Generating static paths

```typescript
export async function generateStaticParams() {
  const locales = ['en', 'fr', 'zh'];  // mirror nextpress.config.ts
  const pages = await getPublishedPages();
  return locales.flatMap(locale =>
    pages.map(page => ({
      locale,
      slug: getLocale(page.slug, locale) as string,
    }))
  );
}
```

### Locale utility

```typescript
import { getLocale, getLocaleAlternates } from '@/lib/locale-utils';

// Read a localized scalar field
const title = getLocale(page.title, locale);          // string
const slug  = getLocale(page.slug, locale);            // string

// Read a localized object field (block content)
const content = getLocale(block.content, locale);      // object

// Generate hreflang alternates for SEO
const alternates = getLocaleAlternates(page.slug as Record<string, string>);
// [{ locale: 'en', slug: 'about-us' }, { locale: 'fr', slug: 'a-propos' }]
```

---

## 5. Fetching Pages and Posts

### Pages (block-based)

Pages are composed of sections → columns → block references. The `sections` JSON column stores the layout tree. Use `PageRenderer` to render a page (see [Section 6](#6-rendering-block-based-pages)).

```typescript
const page = await getPublishedPage(locale, slug);
// page.id, page.documentId, page.title (Json), page.slug (Json),
// page.excerpt (Json), page.sections (Json), page.status
```

### Posts (article/blog)

```typescript
const post = await getPublishedPost(locale, slug);
// post.id, post.title (Json), post.slug (Json), post.content (Json),
// post.excerpt (Json), post.author, post.category, post.featuredImage
```

### Generating metadata for SEO

```typescript
import { getLocale, getLocaleAlternates } from '@/lib/locale-utils';

export async function generateMetadata({ params }: Props) {
  const page = await getPublishedPage(params.locale, params.slug);
  if (!page) return {};

  const title = getLocale(page.title, params.locale) as string;
  const alternates = getLocaleAlternates(page.slug as Record<string, string>);

  return {
    title,
    alternates: {
      languages: Object.fromEntries(
        alternates.map(({ locale, slug }) => [locale, `/${locale}/${slug}`])
      ),
    },
  };
}
```

---

## 6. Rendering Block-Based Pages

Pages store their layout as a `sections` JSON tree. `PageRenderer` is a React Server Component that resolves block references and renders them.

```typescript
// src/app/(public)/[locale]/[slug]/page.tsx
import { PageRenderer } from '@/components/blocks/PageRenderer';
import { getPublishedPage } from '@/lib/cms';

export default async function Page({ params }) {
  const page = await getPublishedPage(params.locale, params.slug);
  if (!page) notFound();

  return <PageRenderer page={page} locale={params.locale} />;
}
```

### How PageRenderer works

```
page.sections (JSON layout tree)
    │
    ▼
Extract all blockIds from sections → columns → blocks
    │
    ▼
getBlocksByIds(ids)           ← one batch DB query
    │
    ▼
For each block: resolve dataSource (if any) via queryCollection()
    │
    ▼
Render: sections → columns → YourBlockComponent({ content, data, locale })
```

`PageRenderer` handles all of this automatically. Your only job is to register your React components as block components (see [Section 7](#7-mapping-your-ui-components-to-block-types)).

---

## 7. Mapping Your UI Components to Block Types

This is the main integration point. Each section of your existing UI becomes a **block manifest** — a TypeScript object that pairs a React component with an editor schema.

### Step 1 — Identify your UI sections

List the distinct visual sections in your existing UI. For example:

- Hero banner
- Features grid
- Testimonials slider
- CTA banner
- FAQ accordion
- Post list

Each becomes one block type.

### Step 2 — Adapt your component to the BlockComponent signature

Your existing component needs to accept `content` (field values from the DB) and optionally `data` (live queried records).

```typescript
// src/components/blocks/HeroBannerBlock.tsx
import type { BlockComponent } from '@/blocks/types';
import { getLocale } from '@/lib/locale-utils';

interface HeroBannerContent {
  heading?: string;
  subheading?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  backgroundImage?: string;
}

export const HeroBannerBlock: BlockComponent = ({ content, locale }) => {
  // content is the raw stored value — locale-aware if using locale-first JSON
  const c = content as HeroBannerContent;

  return (
    // Paste your existing JSX here — replace hardcoded strings with c.heading etc.
    <section className="hero-banner" style={{ backgroundImage: `url(${c.backgroundImage})` }}>
      <h1>{c.heading}</h1>
      <p>{c.subheading}</p>
      <a href={c.ctaUrl}>{c.ctaLabel}</a>
    </section>
  );
};
```

### Step 3 — Create the block manifest

```typescript
// src/blocks/manifests/hero-banner.ts
import type { BlockManifest } from '../types';
import { HeroBannerBlock } from '@/components/blocks/HeroBannerBlock';

export const heroBannerManifest: BlockManifest = {
  type: 'hero-banner',       // stored in DB — must be unique
  label: 'Hero Banner',
  icon: 'Star',              // Lucide icon name

  definition: {
    content: [
      { name: 'heading',         type: 'text',     label: 'Heading',          required: true },
      { name: 'subheading',      type: 'textarea', label: 'Subheading' },
      { name: 'ctaLabel',        type: 'text',     label: 'CTA Button Label' },
      { name: 'ctaUrl',          type: 'text',     label: 'CTA URL' },
      { name: 'backgroundImage', type: 'text',     label: 'Background Image URL' },
    ],
  },

  component: HeroBannerBlock,
};
```

### Step 4 — Register in the block registry

```typescript
// src/blocks/registry.ts
import { heroBannerManifest } from './manifests/hero-banner';

const BUILT_IN_MANIFESTS: BlockManifest[] = [
  // ...existing manifests...
  heroBannerManifest,
];
```

### Step 5 — Add the type to the Blocks collection

Open `src/collections/Blocks.ts` and add `'hero-banner'` to the `type` field's options array:

```typescript
{
  name: 'type',
  type: 'select',
  options: [
    // ...existing types...
    { label: 'Hero Banner', value: 'hero-banner' },
  ],
}
```

No schema migration is needed — block content is stored as JSON.

### Localized block content

If your block content needs to be translatable, use locale-first JSON:

```typescript
// In the manifest definition
content: [
  {
    name: 'heading',
    type: 'json',
    localized: true,
    admin: { localizedAs: 'text' },   // renders as a text input per locale
  },
],
```

In the component, read with `getLocale`:

```typescript
const heading = getLocale(c.heading, locale);
```

### Block with live data (e.g. post list, product grid)

For blocks that need to display live database content, add a `dataSource` to the manifest and accept `data` in the component:

```typescript
// Manifest
definition: {
  content: [
    { name: 'heading', type: 'text', label: 'Section Heading' },
  ],
  dataSource: {
    collection: 'posts',
    defaultParams: {
      where: { status: 'published' },
      orderBy: { createdAt: 'desc' },
    },
    fields: [
      { name: 'limit', type: 'number', scope: 'root' },
    ],
  },
},

// Component
export const PostListBlock: BlockComponent = ({ content, data, locale }) => {
  const posts = (data ?? []) as PostWithLocales[];
  const c = content as { heading?: string };

  return (
    <section>
      <h2>{c.heading}</h2>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <a href={`/${locale}/${getLocale(post.slug, locale)}`}>
              {getLocale(post.title, locale) as string}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};
```

To make a collection queryable by blocks, add it to `QUERYABLE_COLLECTIONS` in `src/lib/cms.ts` and add its metadata to `src/lib/datasource-meta.ts`.

---

## 8. Navigation Menus

Navigation menus are stored in the database and fetched at request time. This replaces any hardcoded nav arrays in your existing UI.

### Fetching menus in the layout

```typescript
// src/app/(public)/layout.tsx
import { getMenuByLocation } from '@/lib/cms';
import { NavMenu } from '@/components/public/NavMenu';

export default async function PublicLayout({ children }) {
  const primaryMenu = await getMenuByLocation('primary');
  const footerMenu  = await getMenuByLocation('footer');

  return (
    <html>
      <body>
        <header>
          <NavMenu menu={primaryMenu} orientation="horizontal" />
        </header>
        <main>{children}</main>
        <footer>
          <NavMenu menu={footerMenu} orientation="vertical" />
        </footer>
      </body>
    </html>
  );
}
```

### NavMenu component

`src/components/public/NavMenu.tsx` is a React Server Component that renders a menu from the database. It generates CSS-only dropdowns using Tailwind `group-hover` — no JavaScript required.

```typescript
<NavMenu menu={menu} orientation="horizontal" />
<NavMenu menu={menu} orientation="vertical" />
```

### Using menu data directly

If you need to render the menu with your own markup, you can work with the `MenuWithItems` type:

```typescript
import type { MenuWithItems, MenuItem } from '@/lib/cms';

function MyNav({ menu }: { menu: MenuWithItems | null }) {
  if (!menu) return null;

  return (
    <nav>
      {menu.items.map(item => (
        <a key={item.id} href={item.url ?? `/${item.slugsByLocale?.en}`}>
          {item.label}
        </a>
      ))}
    </nav>
  );
}
```

### Menu item structure

```typescript
interface MenuItem {
  id: string;
  label: string;
  type: 'page' | 'custom' | 'section';
  pageId?: string;
  slugsByLocale?: Record<string, string>;  // { en: 'about-us', fr: 'a-propos' }
  url?: string;                             // for 'custom' type
  target?: '_blank' | '_self';
  children?: MenuItem[];
}
```

### Adding a new menu location

1. Add the value to the `location` select in `src/collections/Menus.ts`.
2. Fetch with `getMenuByLocation('your-location')` in any layout or component.

---

## 9. Site Settings

Global configuration (logo, contact info, footer, social links, feature flags) is stored in the `settings` collection and managed via the admin UI at `/admin/settings`.

### Fetching settings in a server component

```typescript
import { prisma } from '@/adapters/prisma-adapter/prisma-client';

async function getSiteSettings() {
  const settings = await prisma.settings.findFirst({
    orderBy: { updatedAt: 'desc' },
  });
  return settings;
}
```

### Accessing settings fields

The `Settings` collection uses `group` fields. In Prisma, group fields are stored as separate JSON columns named after each group:

```typescript
const settings = await getSiteSettings();

// Scalar field
const siteName = settings?.siteName;

// Group field — stored as a JSON object
const logo    = settings?.logo    as { image?: string; alt: string; width: number; height: number } | null;
const contact = settings?.contact as { phone: string; email: string; address: string } | null;
const footer  = settings?.footer  as { companyName: string; copyright: string; quickLinks: Array<{label: string; href: string}> } | null;
```

### Adding a settings helper to cms.ts

Add a typed helper for easy reuse:

```typescript
// src/lib/cms.ts
export async function getSiteSettings() {
  return prisma.settings.findFirst({ orderBy: { updatedAt: 'desc' } });
}
```

Then use it anywhere:

```typescript
import { getSiteSettings } from '@/lib/cms';

const settings = await getSiteSettings();
const logo = settings?.logo as LogoConfig | null;
```

### Using settings in a layout

```typescript
// src/app/(public)/layout.tsx
import { getSiteSettings } from '@/lib/cms';

export default async function PublicLayout({ children }) {
  const settings = await getSiteSettings();
  const siteName = settings?.siteName ?? 'My Site';
  const logo = settings?.logo as { alt: string; width: number; height: number } | null;

  return (
    <html>
      <body>
        <header>
          <span>{siteName}</span>
        </header>
        {children}
      </body>
    </html>
  );
}
```

---

## 10. Media and Images

Files uploaded through the admin are stored and served through the configured storage provider (local, S3, Supabase, or Cloudinary).

### Media fields in content

When a collection field is `type: 'upload'`, it stores a foreign key to the `Media` table. Related media is available with a Prisma include:

```typescript
const post = await prisma.posts.findFirst({
  where: { ... },
  include: { featuredImage: true },
});
// post.featuredImage.url — public URL for the file
// post.featuredImage.width, post.featuredImage.height
// post.featuredImage.mimeType, post.featuredImage.alt
```

### Using media in components

```typescript
import Image from 'next/image';

function PostCard({ post }: { post: PostWithLocales }) {
  const image = post.featuredImage;

  return (
    <article>
      {image && (
        <Image
          src={image.url}
          alt={image.alt ?? ''}
          width={image.width ?? 800}
          height={image.height ?? 450}
        />
      )}
    </article>
  );
}
```

### Switching storage providers

Change a single environment variable — no code change required:

```bash
# .env
NEXTPRESS_STORAGE_PROVIDER=s3   # local | s3 | supabase | cloudinary
```

Fill in the corresponding `S3_*`, `SUPABASE_*`, or `CLOUDINARY_*` variables. See [Configuration](./developer-guide.md#environment-variables).

---

## 11. Localization in Templates

### Reading localized field values

All translatable fields are stored as locale-first JSON:

```json
{ "en": "About Us", "fr": "À propos", "de": "Über uns" }
```

Use `getLocale` to read the correct value:

```typescript
import { getLocale } from '@/lib/locale-utils';

// String field
const title = getLocale(page.title, locale) as string;

// Object field (block content)
const content = getLocale(block.content, locale) as MyBlockContent;

// With fallback: if 'fr' is missing, falls back to 'en' automatically
```

### Language switcher

To render a language switcher on the public site, generate the alternate slugs for the current page and link to each locale:

```typescript
import { getLocaleAlternates } from '@/lib/locale-utils';

const alternates = getLocaleAlternates(page.slug as Record<string, string>);
// [{ locale: 'en', slug: 'about-us' }, { locale: 'fr', slug: 'a-propos' }]
```

```tsx
<ul>
  {alternates.map(({ locale, slug }) => (
    <li key={locale}>
      <a href={`/${locale}/${slug}`}>{locale.toUpperCase()}</a>
    </li>
  ))}
</ul>
```

### Adding a new locale

1. Add the locale to `localization.locales` in `src/nextpress.config.ts`.
2. Run `pnpm schema:generate && pnpm db:push` (JSON columns don't need migration, but the config change triggers regeneration).
3. Optionally update `generateStaticParams` in `src/app/(public)/[locale]/[slug]/page.tsx`.
4. Translate content in the admin — the locale switcher in the form header automatically shows the new locale.

---

## 12. Posts, Categories, and Comments

### Listing posts

```typescript
import { getPublishedPosts } from '@/lib/cms';

const { docs: posts, totalDocs, totalPages } = await getPublishedPosts(locale, {
  page: 1,
  limit: 12,
});
```

### Filtering by category

```typescript
import { getPostsByCategory } from '@/lib/cms';

const posts = await getPostsByCategory(locale, 'news', { limit: 10 });
```

### Fetching a single post

```typescript
import { getPublishedPost } from '@/lib/cms';

const post = await getPublishedPost(locale, slug);
// post.title (Json), post.content (Json), post.author, post.category,
// post.featuredImage, post.excerpt (Json)
```

### Listing categories

```typescript
import { getCategories } from '@/lib/cms';

const categories = await getCategories();
// [{ id, name, slug (Json), description (Json), color }]
```

### Rendering post content

Post `content` is stored as a Tiptap/ProseMirror JSON document. To render it in your UI, use a Tiptap read-only renderer:

```typescript
import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import { getLocale } from '@/lib/locale-utils';

const contentJson = getLocale(post.content, locale);
const html = generateHTML(contentJson, [StarterKit]);

return <div dangerouslySetInnerHTML={{ __html: html }} />;
```

---

## 13. Permission-Gated UI

For UI elements that should only appear for authenticated users with specific permissions (e.g. "Edit this page" buttons visible to editors), use `PermissionGate`:

```typescript
// Any client component in the public site
'use client';
import { PermissionGate } from '@/components/admin/PermissionGate/PermissionGate';

export function EditPageButton({ pageId }: { pageId: string }) {
  return (
    <PermissionGate action="update" resource="content">
      <a href={`/admin/pages/${pageId}`} className="edit-button">
        Edit Page
      </a>
    </PermissionGate>
  );
}
```

`PermissionGate` reads permissions from the NextAuth JWT — no extra API requests. It renders `null` (or the `fallback`) when the user lacks the required permission or is not signed in.

---

## 14. Full Walkthrough Example

This example integrates a hotel/hospitality UI that has: a hero section, a featured rooms grid, a testimonials slider, and a contact section.

### Step 1 — Define block manifests for each section

Create manifests for each section:

```
src/blocks/manifests/
├── hero.ts                 ← existing (update if needed)
├── featured-rooms.ts       ← existing (update to use your component)
├── testimonials.ts         ← create new
└── contact-section.ts      ← create new
```

Example — Testimonials:

```typescript
// src/blocks/manifests/testimonials.ts
import type { BlockManifest } from '../types';
import { TestimonialsBlock } from '@/components/blocks/TestimonialsBlock';

export const testimonialsManifest: BlockManifest = {
  type: 'testimonials',
  label: 'Testimonials',
  icon: 'Quote',
  definition: {
    content: [
      { name: 'heading', type: 'text', label: 'Section Heading' },
    ],
    elements: {
      label: 'Testimonial',
      fields: [
        { name: 'quote',  type: 'textarea', label: 'Quote',       required: true },
        { name: 'author', type: 'text',     label: 'Author Name', required: true },
        { name: 'role',   type: 'text',     label: 'Role/Company' },
      ],
    },
  },
  component: TestimonialsBlock,
};
```

### Step 2 — Create the React component

```typescript
// src/components/blocks/TestimonialsBlock.tsx
import type { BlockComponent } from '@/blocks/types';

interface TestimonialsContent {
  heading?: string;
  elements?: Array<{ quote: string; author: string; role?: string }>;
}

export const TestimonialsBlock: BlockComponent = ({ content }) => {
  const c = content as TestimonialsContent;
  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold text-center">{c.heading}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        {(c.elements ?? []).map((item, i) => (
          <blockquote key={i} className="bg-white rounded-lg shadow p-6">
            <p className="italic">&ldquo;{item.quote}&rdquo;</p>
            <footer className="mt-4 font-semibold">
              {item.author}
              {item.role && <span className="text-sm text-gray-500"> — {item.role}</span>}
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
};
```

### Step 3 — Register all manifests

```typescript
// src/blocks/registry.ts
import { testimonialsManifest } from './manifests/testimonials';
import { contactSectionManifest } from './manifests/contact-section';

const BUILT_IN_MANIFESTS: BlockManifest[] = [
  // ...existing...
  testimonialsManifest,
  contactSectionManifest,
];
```

### Step 4 — Add types to the Blocks collection

```typescript
// src/collections/Blocks.ts — in the 'type' field options array
{ label: 'Testimonials', value: 'testimonials' },
{ label: 'Contact Section', value: 'contact-section' },
```

### Step 5 — Build pages in the admin

1. Go to `/admin/blocks` and create a block instance for each section (e.g. "Home Hero", "Home Testimonials").
2. Fill in the content fields for each block.
3. Go to `/admin/pages` and create a new page (e.g. slug `home`).
4. Use the **Page Sections Editor** to:
   - Add a section (e.g. "Hero Section")
   - Add a column (full width)
   - Add your "Home Hero" block to that column
   - Repeat for each section
5. Publish the page.

### Step 6 — Render the page

The page route at `src/app/(public)/[locale]/[slug]/page.tsx` already handles this:

```typescript
import { getPublishedPage } from '@/lib/cms';
import { PageRenderer } from '@/components/blocks/PageRenderer';

export default async function Page({ params }) {
  const page = await getPublishedPage(params.locale, params.slug);
  if (!page) notFound();

  return <PageRenderer page={page} locale={params.locale} />;
}
```

`PageRenderer` reads `page.sections`, loads all referenced blocks in one query, resolves any data sources, and renders your components automatically.

### Step 7 — Connect the navigation

Create the "Primary" menu in `/admin/menus`:

1. Add menu items for Home, Rooms, About, Contact.
2. Set each item's type to `page` and select the corresponding page.

The `layout.tsx` fetches and renders the menu automatically:

```typescript
const primaryMenu = await getMenuByLocation('primary');
<NavMenu menu={primaryMenu} orientation="horizontal" />
```

### Step 8 — Configure site settings

Go to `/admin/settings` and fill in:

- Site name, logo
- Contact information (phone, email, address)
- Footer links and copyright
- Social media URLs

Fetch and use in your layout:

```typescript
const settings = await getSiteSettings();
const contact = settings?.contact as ContactConfig | null;
```

---

*After integrating your UI, run `pnpm build` to verify there are no TypeScript errors. For ongoing content management, use the admin at `/admin`. For documentation updates, run `pnpm docs:generate` after changing collection definitions.*
