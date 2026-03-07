# AGBON Website → NextPress Integration Guide

This guide explains how to migrate the AGBON website from Payload CMS to NextPress as its backend.

---

## Overview

The AGBON website is an agricultural machinery e-commerce/catalogue site. Its frontend is a Next.js app using a **service-layer abstraction** that decouples the UI from the backend. The current backend is Payload CMS. NextPress will replace Payload as the CMS.

The integration involves:
1. Creating NextPress collection definitions for all AGBON data types
2. Generating the Prisma schema and running migrations
3. Writing a NextPress service adapter that implements the AGBON `IDataService` interface
4. Replacing Payload API calls with NextPress API calls in the AGBON frontend
5. Uploading static assets into NextPress Media

---

## AGBON Data Model → NextPress Collections

The AGBON website has the following Payload collections. Each maps to a new NextPress collection.

### 1. Products → `src/collections/Products.ts`

Products are the core content type. They have localized fields (name, model, description, etc.), category relationships, a rich media array (images + videos), technical specifications, and optional usage instructions.

**Fields to define:**

| Field | Type | Notes |
|-------|------|-------|
| `name` | `text` | `localized: true` |
| `model` | `text` | `localized: true` |
| `slug` | `text` | Unique; auto-generated from `name.en` |
| `description` | `textarea` | `localized: true` |
| `shortDescription` | `text` | `localized: true` |
| `category` | `relationship → categories` | FK |
| `media` | `json` | Array of `{ type, source, mediaFile, videoUrl, videoCover, isCover, alt }` |
| `specifications` | `json` | Array of `{ key, value }` — both localized |
| `inStock` | `boolean` | Default `true` |
| `featured` | `boolean` | Default `false` |
| `order` | `number` | Display order |
| `instructions` | `json` | Array of `{ stepNumber, title, description, image, videos[] }` |

Because NextPress uses `Json` for arrays and nested objects (unlike Payload's `array` type), the `media`, `specifications`, and `instructions` fields should be stored as `Json?` columns.

**Versioning:** Enable versioning on Products (`versions: { drafts: true }`) since products need draft/publish workflow.

### 2. Categories → `src/collections/Categories.ts`

Hierarchical product categories (self-referencing). Used by the sidebar navigation and product filtering.

**Fields to define:**

| Field | Type | Notes |
|-------|------|-------|
| `name` | `text` | `localized: true` |
| `slug` | `text` | Unique; auto-generated |
| `description` | `textarea` | `localized: true` |
| `image` | `relationship → media` | Category icon/image |
| `icon` | `text` | Emoji or text fallback |
| `parentCategory` | `relationship → categories` | Self-referencing (nullable) |
| `media` | `json` | `[{ type, mediaItem, videoUrl, title }]` |
| `order` | `number` | Required; default `0` |

**Note:** The self-referencing `parentCategory` relationship requires a manual back-relation. After `pnpm schema:generate`, verify the Prisma schema has `parent` and `children` back-relations injected by `injectBackRelations()`.

### 3. Countries → `src/collections/Countries.ts`

Represents each African country where AGBON has a presence, with office locations and geographic coordinates.

**Fields to define:**

| Field | Type | Notes |
|-------|------|-------|
| `name` | `text` | `localized: true` |
| `code` | `text` | ISO country code (e.g. `GH`) |
| `coordinates` | `json` | `{ latitude, longitude }` |
| `flag` | `text` | Emoji flag |
| `color` | `text` | Hex color for map marker |
| `description` | `textarea` | `localized: true` |
| `symbol` | `relationship → media` | Coat of arms / national symbol |
| `background` | `relationship → media` | Card background image |
| `wallpaper` | `relationship → media` | Full-page wallpaper image |
| `offices` | `json` | `[{ city, address, phone, email, type, coordinates }]` — city/address localized |

### 4. HeroSlides → `src/collections/HeroSlides.ts`

Homepage carousel slides. Support image, video file, or YouTube embeds.

**Fields to define:**

| Field | Type | Notes |
|-------|------|-------|
| `title` | `text` | `localized: true` |
| `subtitle` | `textarea` | `localized: true` |
| `mediaType` | `select` | `image \| video \| youtube` |
| `image` | `relationship → media` | Desktop image |
| `mobileImage` | `relationship → media` | Mobile image (optional) |
| `videoUrl` | `text` | Video file URL |
| `youtubeId` | `text` | YouTube video ID |
| `ctaText` | `text` | `localized: true` |
| `ctaLink` | `text` | Internal URL |
| `textPosition` | `json` | `{ desktopAlignment, desktopVerticalPosition, mobileAlignment, mobileVerticalPosition }` |
| `textColor` | `select` | `white \| black \| orange` |
| `overlayOpacity` | `number` | `0-100`; default `30` |
| `order` | `number` | Display order |
| `active` | `boolean` | Default `true` |

### 5. ContentBlocks → map to NextPress `Blocks` collection

AGBON's `content-blocks` are reusable keyed text sections (e.g. `our-story`, `mission-statement`). In NextPress these map to the existing `Blocks` collection.

**Mapping:**

| AGBON field | NextPress Blocks field |
|-------------|----------------------|
| `key` | `name` (unique) |
| `title` | `content` (locale-first JSON, `"title"` key inside) |
| `content` | `content` (locale-first JSON) |
| `images` | store image IDs in `content` JSON or use `featuredImage` |
| `status` | `status` (`draft \| published`) |

Alternatively, add a dedicated `key` field to the Blocks collection if the `name` field does not suit.

### 6. WebsiteConfig → map to NextPress `Settings` collection

AGBON's `website-config` is a singleton that holds logo, navigation, footer, social media, and feature flags. This maps directly to the existing NextPress `Settings` collection (which is also a singleton-style collection).

Add the following to the `Settings` collection (or create a dedicated `SiteConfig` collection):

- `siteName` (text)
- `logo` group: `{ image → media, alt, width, height }`
- `contact` group: `{ phone, email, address }`
- `headerNavigation` (json) — about menu, after-sales href, join-us menu
- `footer` (json) — company name, description, quick links, copyright
- `socialMedia` (json) — facebook, linkedin, twitter, instagram, youtube
- `newsletter` (json) — `{ enabled, placeholder }`
- `legal` (json) — `{ privacyPolicy, termsOfService }`
- `features` (json) — `{ showSearch, showLanguageSwitcher }`

---

## Step-by-Step Integration

### Step 1 — Create Collection Files

Create the following files inside `src/collections/` of the NextPress project:

```
src/collections/Products.ts
src/collections/AgbonCategories.ts   (or rename to avoid conflict with existing Categories.ts)
src/collections/Countries.ts
src/collections/HeroSlides.ts
```

> **Naming note:** NextPress already has a `Categories.ts` (for blog post categories). Rename the AGBON version to `ProductCategories.ts` with slug `product-categories` to avoid conflicts.

Each collection definition follows the NextPress `CollectionConfig` format, NOT Payload's. The key differences are:

| Payload | NextPress |
|---------|-----------|
| `type: 'array'` | Use `type: 'json'` (arrays stored as `Json` in Postgres) |
| `type: 'group'` | Use `type: 'json'` for grouped fields |
| `type: 'upload'` | Use `type: 'relationship', relationTo: 'media'` |
| `localized: true` on a field | Set `localized: true` + `admin.localizedAs: 'text'` |
| Payload hooks (`beforeValidate`) | Not applicable; handle slug generation in the API route |
| `access: { read: () => true }` | Not used in NextPress (auth is session-based) |

**Example — HeroSlides collection (`src/collections/HeroSlides.ts`):**

```typescript
import type { CollectionConfig } from '@/core/collection/types'

export const HeroSlides: CollectionConfig = {
  slug: 'hero-slides',
  label: 'Hero Slides',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'order', 'active'],
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true,
      admin: { localizedAs: 'text' } },
    { name: 'subtitle', type: 'textarea', localized: true,
      admin: { localizedAs: 'textarea' } },
    { name: 'mediaType', type: 'select', required: true, defaultValue: 'image',
      options: [
        { label: 'Image', value: 'image' },
        { label: 'Video', value: 'video' },
        { label: 'YouTube', value: 'youtube' },
      ],
    },
    { name: 'image', type: 'relationship', relationTo: 'media' },
    { name: 'mobileImage', type: 'relationship', relationTo: 'media' },
    { name: 'videoUrl', type: 'text' },
    { name: 'youtubeId', type: 'text' },
    { name: 'ctaText', type: 'text', localized: true,
      admin: { localizedAs: 'text' } },
    { name: 'ctaLink', type: 'text' },
    { name: 'textPosition', type: 'json' },
    { name: 'textColor', type: 'select', defaultValue: 'white',
      options: [
        { label: 'White', value: 'white' },
        { label: 'Black', value: 'black' },
        { label: 'AGBON Orange', value: 'orange' },
      ],
    },
    { name: 'overlayOpacity', type: 'number', defaultValue: 30 },
    { name: 'order', type: 'number', required: true, defaultValue: 0 },
    { name: 'active', type: 'boolean', defaultValue: true },
  ],
}
```

### Step 2 — Register Collections in `nextpress.config.ts`

```typescript
import { HeroSlides } from './collections/HeroSlides'
import { Products } from './collections/Products'
import { ProductCategories } from './collections/ProductCategories'
import { Countries } from './collections/Countries'

export default defineConfig({
  collections: [
    // ... existing collections ...
    HeroSlides,
    Products,
    ProductCategories,
    Countries,
  ],
})
```

### Step 3 — Generate Schema and Migrate

```bash
pnpm schema:generate
pnpm db:migrate   # or pnpm db:push for dev
pnpm db:generate  # regenerate Prisma client
```

Verify the generated `schema.prisma` has models: `HeroSlides`, `Products`, `ProductCategories`, `Countries`.

### Step 4 — Write a NextPress Service Adapter

The AGBON frontend consumes data through the `IDataService` interface (`src/services/data-service.interface.ts`). You need to create a new adapter: `src/services/adapters/nextpress-adapter.ts` inside the AGBON frontend project.

**Connection point:** NextPress exposes a REST API at `/api/admin/collections/[collection]`. This is the same format used by the existing Payload adapter but with different endpoint paths and response shapes.

**NextPress API response shape (collection list):**
```json
{
  "data": [...],
  "pagination": { "page": 1, "pageSize": 20, "total": 45 }
}
```

**Adapter skeleton:**

```typescript
// AGBON website: src/services/adapters/nextpress-adapter.ts

import type { IProductService, ICategoryService, IContentService, ICountryService } from '../data-service.interface'
import type { Product, Category, HeroSlide, ContentBlock, Country, PaginatedResponse, ProductFilters } from '@/types/domain'

const COLLECTIONS = {
  products: 'products',
  categories: 'product-categories',
  heroSlides: 'hero-slides',
  blocks: 'blocks',
  countries: 'countries',
}

async function fetchCollection(baseUrl: string, collection: string, params: Record<string, string> = {}) {
  const url = new URL(`${baseUrl}/api/admin/collections/${collection}`)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url.toString(), { next: { revalidate: 60 } })
  if (!res.ok) throw new Error(`NextPress API error: ${res.status}`)
  return res.json()
}

export class NextPressProductService implements IProductService {
  constructor(private baseUrl: string) {}

  async getProducts(filters: ProductFilters): Promise<PaginatedResponse<Product>> {
    const params: Record<string, string> = {
      page: String(filters.page ?? 1),
      pageSize: String(filters.limit ?? 20),
    }
    if (filters.categoryId) params['categoryId'] = filters.categoryId
    if (filters.searchQuery) params['search'] = filters.searchQuery
    const json = await fetchCollection(this.baseUrl, COLLECTIONS.products, params)
    return {
      docs: json.data.map(transformProduct),
      meta: {
        page: json.pagination.page,
        pageSize: json.pagination.pageSize,
        totalDocs: json.pagination.total,
        totalPages: Math.ceil(json.pagination.total / json.pagination.pageSize),
        hasNextPage: json.pagination.page * json.pagination.pageSize < json.pagination.total,
        hasPrevPage: json.pagination.page > 1,
      },
    }
  }

  async getFeaturedProducts(limit: number, locale?: string): Promise<Product[]> {
    const json = await fetchCollection(this.baseUrl, COLLECTIONS.products, {
      featured: 'true',
      pageSize: String(limit),
    })
    return json.data.map(transformProduct)
  }

  async getProductById(id: string): Promise<Product> {
    const res = await fetch(`${this.baseUrl}/api/admin/collections/${COLLECTIONS.products}/${id}`)
    const json = await res.json()
    return transformProduct(json.data)
  }

  async searchProducts(query: string, locale?: string, limit = 20): Promise<Product[]> {
    const json = await fetchCollection(this.baseUrl, COLLECTIONS.products, {
      search: query,
      pageSize: String(limit),
    })
    return json.data.map(transformProduct)
  }

  async getProductsByCategory(categoryId: string, filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    return this.getProducts({ ...filters, categoryId })
  }
}

// ... implement NextPressCategoryService, NextPressContentService, NextPressCountryService similarly
```

**Data transformer example:**

NextPress stores localized fields as locale-first JSON: `{ "en": "...", "fr": "..." }`. The AGBON domain types expect `string | LocalizedContent`. The transformer maps one format to the other:

```typescript
function transformProduct(raw: any): Product {
  return {
    id: raw.id,
    name: raw.name,           // already locale-first JSON — matches LocalizedContent
    model: raw.model,
    slug: raw.slug,
    description: raw.description,
    shortDescription: raw.shortDescription,
    category: raw.categoryId,
    media: parseProductMedia(raw.media),
    specifications: raw.specifications ?? [],
    inStock: raw.inStock ?? true,
    featured: raw.featured ?? false,
    order: raw.order ?? 0,
    instructions: raw.instructions ?? [],
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    // Derived fields for backward compat
    images: [],
    image: null,
    videos: [],
    specs: [],
  }
}
```

### Step 5 — Register the NextPress Adapter in the Service Factory

In the AGBON frontend's `src/services/service-factory.ts`, add a new `case 'nextpress'` branch and import the NextPress services:

```typescript
import {
  NextPressProductService,
  NextPressCategoryService,
  NextPressContentService,
  NextPressCountryService,
} from './adapters/nextpress-adapter'

// In getDataService():
case 'nextpress':
  dataServiceInstance = new DataService(
    new NextPressProductService(config.baseUrl),
    new NextPressCategoryService(config.baseUrl),
    new NextPressContentService(config.baseUrl),
    new NextPressCountryService(config.baseUrl),
  )
  break
```

Then update `NEXT_PUBLIC_BACKEND_TYPE=nextpress` in the AGBON `.env`.

### Step 6 — Content Migration

Migrate existing Payload content to NextPress via the admin UI or by writing a one-off seed script.

**Priority order:**
1. Upload all images from `AGBON WESITE/public/` to NextPress Media
2. Create product categories (top-level first, then sub-categories)
3. Create countries with office data
4. Create hero slides
5. Create products (reference category IDs from step 2)
6. Create content blocks (`our-story`, `mission-statement`, etc.)
7. Update the `Settings` collection with site config (logo, nav, footer, social links)

**Image URL mapping:** Payload stores media at `/api/media/file/[filename]`. NextPress stores at `/uploads/[filename]` (or via Next.js `public/` depending on your media config). Update `src/lib/media-utils.ts` in the AGBON frontend to resolve URLs from the NextPress media base URL.

### Step 7 — Public API Routes (Optional)

Currently the AGBON frontend calls the NextPress *admin* API. For production, create dedicated **public** API routes in NextPress that mirror what the frontend needs without requiring admin auth:

```
src/app/api/public/products/route.ts
src/app/api/public/product-categories/route.ts
src/app/api/public/hero-slides/route.ts
src/app/api/public/countries/route.ts
src/app/api/public/content-blocks/[key]/route.ts
```

Each route calls the relevant NextPress repository (e.g. `prisma.products.findMany`) and returns data in the shape expected by the AGBON domain types. This keeps admin routes protected and gives you full control over response shaping.

---

## Localization Considerations

Both projects support the same locales (`en`, `fr`, optionally `zh`). However, they store localized content differently:

| Aspect | AGBON (Payload) | NextPress |
|--------|-----------------|-----------|
| Storage | Payload handles locale columns internally | Locale-first JSON: `{ "en": "...", "fr": "..." }` |
| Frontend access | `record.name` (Payload injects locale) | `getLocale(record.name, locale)` from `locale-utils.ts` |
| Slug | Plain `text` (single locale) | `Json` for full locale support |

In the NextPress adapter, pass `locale` params through to `getLocale()` before returning data to the AGBON frontend, OR return the raw locale-first JSON and let the AGBON `getLocalizedValue()` utility resolve it (the shapes are compatible — both are `{ en, fr }` objects).

---

## AGBON-Specific Admin UI Gaps

NextPress's admin UI currently supports: text, textarea, number, boolean, select, relationship, json fields. The following AGBON Payload admin features will need custom work in NextPress:

| AGBON Feature | NextPress equivalent / work needed |
|---------------|-----------------------------------|
| Payload `array` type with sub-fields | Store as `Json`; add a custom admin component (like `menu-items` pattern) for inline editing |
| Conditional field display (`condition:`) | Not yet supported in NextPress — all fields render; work around with clear field labels |
| Slug auto-generation hook | Add a `beforeChange` hook in the collection config or generate slug in the admin form |
| Media upload with cover selection | The `media` array's `isCover` flag must be managed via a JSON editor for now |
| Coordinate group fields | Store as `Json`; render as two number inputs via a custom admin component |

---

## Environment Variables

Add to the AGBON frontend `.env`:

```env
NEXT_PUBLIC_BACKEND_TYPE=nextpress
NEXT_PUBLIC_API_URL=http://localhost:3000   # or production NextPress URL
NEXT_PUBLIC_API_KEY=                        # optional if using public routes
```

Add to NextPress `.env`:

```env
# No AGBON-specific vars needed in NextPress — it's the server
```

---

## File Reference

| File | Purpose |
|------|---------|
| `AGBON WESITE/src/services/data-service.interface.ts` | Contract all backends must implement |
| `AGBON WESITE/src/services/service-factory.ts` | Add `nextpress` case here |
| `AGBON WESITE/src/services/adapters/payload-adapter.ts` | Reference implementation to copy patterns from |
| `AGBON WESITE/src/types/domain.ts` | Domain types the adapter must produce |
| `AGBON WESITE/src/config/backend.config.ts` | Backend type + base URL config |
| `src/collections/` | Create new AGBON collections here |
| `src/nextpress.config.ts` | Register new collections here |
| `src/lib/cms.ts` | Add new query functions for Products, Categories, etc. |
| `src/adapters/prisma-adapter/repositories/` | Add new repositories here |
| `src/adapters/prisma-adapter/mappers/` | Add mappers to translate DB → kernel types |
