# Collections

## Concept

Collections define content types and system entities: fields, admin labels, access, versioning, and localization. They are the single source of truth for both the **admin UI** and the **Prisma schema** (via the schema engine).

## Defining a collection

Each collection is a config object satisfying `CollectionConfig<'slug'>`. Example shape:

```ts
// src/collections/MyCollection.ts
import type { CollectionConfig } from '@/core/collection';

export const MyCollection: CollectionConfig<'my-collection'> = {
  slug: 'my-collection',
  labels: { singular: 'Item', plural: 'Items' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'status'], group: 'Content' },
  access: { create: () => true, read: () => true, update: () => true, delete: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'status', type: 'select', defaultValue: 'draft', options: [...] },
    { name: 'featuredImage', type: 'upload', relationTo: 'media' },
  ],
  versions: { enabled: true },
  localization: { locales: [], defaultLocale: 'en' },
}
```

Register it in `nextpress.config.ts` by adding it to the `collections` array.

## Field types

The schema engine maps these to Prisma (see [Schema engine](./schema-engine.md)):

- `text`, `textarea`, `email` → String (VarChar/Text)
- `number` → Int
- `checkbox` → Boolean
- `date` → DateTime
- `json` → Json
- `select` → String
- `upload` → String FK + relation to Media
- `relationship` → String FK + relation to target collection
- `array`, `group`, `richText` → Json

## Reserved / system fields

The engine adds these only if the collection does not define them:

- **status** – one per model (e.g. document status or publish state)
- **metadata** – Json, optional

So if your collection has its own `status` or `metadata` field, the engine will not add a second one.

## Generated collection list

Running `pnpm docs:generate` writes a list of collections (and optionally field summaries) to `docs/generated/collections.json` (or .md). The docs app and other tools can use this for an up-to-date reference.

See **Generated** section below (or the sidebar on `/docs`) for the current list after generation.
