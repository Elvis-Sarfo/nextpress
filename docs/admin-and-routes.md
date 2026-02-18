# Admin and routes

## App structure

- **Public**: `(public)/[locale]/`, `(public)/[locale]/[slug]/` – locale and slug-based pages.
- **Admin**: `admin/` – dynamic admin driven by registered collections.
- **Static admin**: `static-admin/` – legacy/demo pages (dashboard, pages, posts, news, media, settings, etc.) if present.
- **Docs**: `docs/` – in-app docs (this content).

## Dynamic admin (`/admin`)

- **List**: `/admin/[collection]` – list view for a collection (from config).
- **New**: `/admin/[collection]/new` – create form.
- **Edit**: `/admin/[collection]/[id]` – edit form.
- Collections and fields come from `nextpress.config.ts` and collection configs; the admin uses shared components and types from `@/core/collection` and `@/lib/collections-data`.

## API

- API routes live under `src/app/api/`. Use them for custom endpoints (e.g. webhooks, external integrations). Auth and permissions should be enforced in handlers.

## Path aliases

- `@/*` → `./src/*` (tsconfig). Use `@/adapters/prisma-adapter`, `@/core/*`, `@/collections/*`, `@/lib/*` for imports. Next.js resolves these without `transpilePackages`.
