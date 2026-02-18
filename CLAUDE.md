# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev                    # Start Next.js dev server (localhost:3000)
pnpm build                  # Production build
pnpm lint                   # ESLint

# Database (Prisma)
pnpm db:generate            # Generate Prisma client
pnpm db:migrate             # Create + apply dev migration
pnpm db:push                # Push schema without migration file
pnpm db:deploy              # Apply migrations in production
pnpm db:seed                # Seed database
pnpm db:reset               # Force-reset database

# Code generation
pnpm schema:generate        # Generate Prisma schema from collections (run after collection changes)
pnpm db:migration:run       # Custom migration runner (use --push flag for push mode)
pnpm docs:generate          # Regenerate doc fragments from JSDoc/TSDoc
```

**First-time setup:**
```bash
pnpm install
cp .env.example .env        # Fill in DATABASE_URL, AUTH_SECRET, PAYLOAD_SECRET, DATABASE_URI
pnpm schema:generate
pnpm db:migration:run       # or: pnpm db:migration:run --push
pnpm dev
```

There is no test runner configured. The project has no Jest or Vitest setup.

## Architecture

NextPress is a headless CMS where **collections** define content types, and a **schema engine** converts those definitions into a Prisma schema automatically.

### Key data flow
1. Collections are defined in `src/collections/` (e.g., `Pages.ts`, `Media.ts`)
2. `src/nextpress.config.ts` registers all collections and configures the CMS
3. `pnpm schema:generate` runs `src/scripts/generate-schema.ts`, which uses `src/core/schema-engine/` to produce `src/adapters/prisma-adapter/prisma/schema.prisma`
4. Prisma migrations manage the database from that generated schema
5. The admin UI at `/admin` dynamically renders forms and tables based on collection definitions

### Module map

| Path | Purpose |
|------|---------|
| `src/core/` | CMS kernel — 19 modules for content, schema, permissions, events, etc. |
| `src/adapters/prisma-adapter/` | Prisma ORM integration — repositories and mappers |
| `src/collections/` | Collection definitions (Users, Roles, Permissions, Media, Pages, Settings) |
| `src/lib/nextpress.ts` | NextPress initialization entry point |
| `src/lib/cms.ts` | CMS utility functions used across the app |
| `src/app/admin/` | Admin UI (Next.js App Router, dynamic per-collection pages) |
| `src/app/(public)/[locale]/` | Public content pages with locale routing |
| `src/app/api/` | Content, preview, and publish API routes |
| `src/scripts/` | CLI scripts: schema generation, migrations, doc generation |
| `docs/` | Markdown documentation (rendered in-app at `/docs`) |

### Core patterns

**TypeScript types**: Source types from `src/core/*/types.ts` for kernel types and from `src/adapters/prisma-adapter/mappers/*-mapper.ts` for Prisma ↔ kernel translation types.

**Repository pattern**: All database access goes through repositories in `src/adapters/prisma-adapter/repositories/`. Never query Prisma directly outside the adapter.

**Mappers**: Files in `src/adapters/prisma-adapter/mappers/` translate between Prisma model types and kernel types. Add a mapper when adding a new repository.

**Event bus**: Cross-module communication uses `src/core/events/event-bus.ts`. Prefer events over direct imports between kernel modules.

**RBAC**: Role-Based Access Control is implemented in `src/core/permissions/`. Collections declare their access rules; the admin UI enforces them.

**Content versioning**: Managed by `src/core/content/version-manager.ts`.

**Path alias**: `@/*` maps to `src/*` (configured in `tsconfig.json`).

### Adding a new content type

1. Create a collection definition in `src/collections/YourType.ts`
2. Register it in `src/nextpress.config.ts`
3. Run `pnpm schema:generate` to update the Prisma schema
4. Run `pnpm db:migrate` (or `db:push`) to apply changes
5. Add a repository in `src/adapters/prisma-adapter/repositories/`
6. Add a mapper in `src/adapters/prisma-adapter/mappers/`
7. Run `pnpm docs:generate` to refresh generated doc fragments

### Environment variables

See `.env.example` for all required variables. Key ones:
- `DATABASE_URL` — PostgreSQL connection string (used by Prisma)
- `DATABASE_URI` — PostgreSQL connection string (used by NextPress config)
- `AUTH_SECRET` — NextAuth secret
- `PAYLOAD_SECRET` — NextPress internal secret

### Documentation

Full reference documentation lives in `docs/` and is rendered in-app at `/docs`. Prefer reading the docs over guessing at behavior — especially `docs/schema-engine.md`, `docs/collections.md`, and `docs/configuration.md`. After changing collections or config, run `pnpm docs:generate`.
