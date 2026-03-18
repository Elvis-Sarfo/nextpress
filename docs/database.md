# Database

## Adapter and schema path

- **Prisma schema**: `src/adapters/prisma-adapter/prisma/schema.prisma`
- **Prisma config**: Root `prisma.config.ts` points the CLI to that schema and to `DATABASE_URL`.
- **package.json**: `prisma.schema` and `prisma.seed` point to the same adapter paths so `pnpm db:push`, `pnpm db:seed`, etc. work from the repo root.
- **Current provider**: the active generated schema currently uses `provider = "mysql"`.

## Migrations

- **Config-driven**: `pnpm db:migration:run` uses `nextpress.config.ts` `schema.migrationMode` (`auto` \| `manual` \| `deploy` \| `prompt`). With `auto` it runs `npx prisma db push`; with `deploy` it runs `npx prisma migrate deploy`.
- **Override**: `pnpm db:migration:run --push` or `--deploy` forces that command.
- **Direct**: `pnpm db:push`, `pnpm db:migrate`, `pnpm db:deploy` call Prisma CLI; they use the schema path from `prisma.config.ts` or `package.json`.
- **Current repo state**: there are no committed migration directories for the active MySQL schema, and `migration_lock.toml` still reflects an older Postgres setup. For now, use `pnpm db:push` for first-time environment bootstrap and treat `db:deploy` as unavailable until migrations are regenerated and committed.

## Seed

- **Script**: `pnpm db:seed` runs `tsx src/adapters/prisma-adapter/prisma/seed.ts`.
- **Prisma seed**: `prisma db seed` uses the same path via `package.json` `prisma.seed`.
- The current seed file may target an older schema (Post, News, Menu, separate locale tables). If it fails, update it to match the current Prisma models and JSON-based localization layout, or skip seeding.

## Generate client

- `pnpm db:generate` runs `prisma generate`; schema path is resolved by Prisma from config/package.json.
- After changing `schema.prisma` (manually or via `pnpm schema:generate`), run `pnpm db:generate` so the client matches the schema.
