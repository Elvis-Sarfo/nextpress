# NextPress overview

## What it is

NextPress is a headless CMS built on Next.js. Content is defined via **collections** (Users, Roles, Permissions, Media, Pages, Settings, etc.). A **schema engine** turns those definitions into a Prisma schema; the **Prisma adapter** persists data in PostgreSQL.

## Tech stack

- **Next.js** (App Router) – app, admin, and API routes
- **TypeScript** – strict types; collection configs and kernel are typed
- **Prisma** – ORM and migrations; schema path: `src/adapters/prisma-adapter/prisma/schema.prisma`
- **Tailwind** – styling; Radix UI for admin components

## High-level architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  nextpress.config.ts (collections, schema, db, localization)     │
└────────────────────────────┬────────────────────────────────────┘
                             │
     ┌───────────────────────┼───────────────────────┐
     ▼                       ▼                       ▼
┌─────────────┐    ┌─────────────────┐    ┌─────────────────────┐
│ Schema      │    │ NextPress lib    │    │ Prisma adapter      │
│ engine      │───▶│ (init, schema    │───▶│ (client, schema     │
│ (collection │    │  generation)     │    │  path, migrations)   │
│ → Prisma)   │    └─────────────────┘    └─────────────────────┘
└─────────────┘              │                        │
                             ▼                        ▼
                    ┌────────────────────────────────────────────┐
                    │  App: /admin, /docs, (public), API routes   │
                    └────────────────────────────────────────────┘
```

## Key directories

| Path | Purpose |
|------|---------|
| `src/nextpress.config.ts` | Single config entry: collections, schema, db, localization |
| `src/collections/` | Collection definitions (Users, Roles, Pages, Media, etc.) |
| `src/core/` | Types, collection types, schema engine |
| `src/adapters/prisma-adapter/` | Prisma schema, client, and DB access |
| `src/lib/nextpress.ts` | Init and schema generation wiring |
| `src/app/admin/` | Dynamic admin UI driven by collections |
| `src/scripts/` | `generate-schema.ts`, `run-migration.ts`, `generate-docs.ts` |

## Conventions

- **Collections** define fields, admin labels, access, versioning, and localization. The schema engine adds system fields (e.g. `status`, `metadata`, timestamps) and avoids duplicates (e.g. skips adding `metadata` if the collection already has it).
- **Relations**: Upload/relationship fields become `fieldNameId` (scalar) + `fieldName` (relation) in Prisma; the engine does not add back-relations on the target model.
- **Paths**: Use `@/*` → `./src/*` (see `tsconfig.json`). No `transpilePackages` needed for local code.
