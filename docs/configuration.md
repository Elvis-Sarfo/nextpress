# Configuration

## Entry point

All CMS configuration lives in **`src/nextpress.config.ts`**. It is typed with `NextPressConfig` from `@/core/types`.

## Main sections

### `collections`

Array of collection configs (Users, Roles, Permissions, Media, Pages, Settings). Order controls admin grouping and schema generation order. Each collection has:

- `slug` – unique id (e.g. `users`, `pages`)
- `labels.singular` / `labels.plural`
- `fields` – array of field definitions (text, select, upload, json, etc.)
- `admin` – useAsTitle, defaultColumns, group
- `access` – create/read/update/delete (optional)
- `versions` – `{ enabled: boolean, maxPerDoc?: number }` or `false`
- `localization` – locales and default (or disabled)

### `db`

- `provider`: currently `'mysql'`
- `url`: typically `process.env.DATABASE_URI` or `process.env.DATABASE_URL`

### `schema`

Controls how Prisma schema is generated and when migrations run:

| Option | Description |
|--------|-------------|
| `generateOnStart` | If true, regenerate schema on dev server start (default: `NODE_ENV === 'development'`) |
| `outputPath` | Path to `schema.prisma` (default: `src/adapters/prisma-adapter/prisma/schema.prisma`) |
| `configChangeDetectionStrategy` | `'once'` \| `'hash'` \| `'always'` for when to regenerate |
| `stateBackend` | `'memory'` \| `'file'` for schema-generation state |
| `stateFilePath` | Used when stateBackend is `'file'` |
| `migrationMode` | `'auto'` \| `'manual'` \| `'deploy'` \| `'prompt'`; in prod often `'deploy'` |

### `localization`

- `locales` – array of `{ code, label }`
- `defaultLocale`
- `fallback` – use default when locale missing

### `secret` / `typescript`

- `secret`: auth/env secret
- `typescript.outputFile`: path for generated payload types (if used)

## Environment variables

| Variable | Used by | Purpose |
|----------|---------|---------|
| `DATABASE_URL` | Prisma, seed, adapter | MySQL/MariaDB URL |
| `DATABASE_URI` | nextpress.config `db.url` | Same in many setups |
| `PRISMA_DB_PROVIDER` | Prisma adapter bootstrap | Optional explicit provider override (`mysql`) |
| `AUTH_SECRET` | NextAuth | Session/auth |
| `NEXT_PUBLIC_BASE_URL` | App | Public base URL |
| `PAYLOAD_SECRET` | Config `secret` | Optional |
| `NODE_ENV` | Config (generateOnStart, migrationMode) | Dev vs prod behaviour |

## Prisma schema location

- **Config file**: Root `prisma.config.ts` points to `src/adapters/prisma-adapter/prisma/schema.prisma` so all Prisma CLI commands find the schema.
- **package.json**: `prisma.schema` and `prisma.seed` also point to the adapter paths so `pnpm db:push`, `pnpm db:seed` work from the repo root.
