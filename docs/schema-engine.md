# Schema engine

## Role

The **schema engine** (`src/core/schema-engine/index.ts`) turns `CollectionConfig[]` into a single Prisma schema string. It is used by:

- `src/scripts/generate-schema.ts` – writes `src/adapters/prisma-adapter/prisma/schema.prisma`
- NextPress init (when `schema.generateOnStart` is true) – to keep schema in sync in dev

## Flow

1. **Input**: Collections from `nextpress.config.ts` and options (provider, versioning, localization, tablePrefix).
2. **Per collection**:
   - **Main model** – id, documentId (if versioning), status (if not in fields), config fields, relationship FK + relation fields, metadata (if not in fields), createdAt, updatedAt, createdBy, indexes.
   - **Localized fields** – when `localized: true`, the field is stored on the main model as a locale-keyed `Json` column.
   - **Version model** – only if versioning enabled (e.g. `*Version` table).
3. **Output**: Concatenated Prisma model blocks plus generator and datasource.

## Field mapping (summary)

| Collection type | Prisma | Notes |
|-----------------|--------|-------|
| localized: true | Json | Stored as `{ "en": "...", "fr": "..." }` on the main table |
| text, email | String | @db.VarChar(255) or maxLength |
| textarea | String | @db.Text |
| number | Int | |
| checkbox | Boolean | |
| date | DateTime | |
| json | Json | |
| select | String | @db.VarChar(100) or maxLength |
| upload / relationship | String FK + relation | `fieldNameId` + `fieldName` relation; target model has no back-relation by default |

## Relationship handling

- Upload and relationship fields produce:
  - A scalar: `featuredImageId String? @db.VarChar(255)`
  - A relation: `featuredImage Media? @relation(fields: [featuredImageId], references: [id], onDelete: SetNull)`
- The engine does **not** add the opposite side (e.g. `featuredInPages` on Media); add those manually in the schema if needed.

## Avoiding duplicate fields

- **status**: Added only when the collection has no field named `status`.
- **metadata**: Added only when the collection has no field named `metadata`.

This prevents duplicate column errors when a collection defines its own status or metadata.
