# Getting started

## Prerequisites

- Node 20+
- pnpm
- PostgreSQL (for DB)

## Install

```bash
pnpm install
```

## Environment

Copy `.env.example` to `.env` and set at least:

- `DATABASE_URL` – Postgres connection string (Prisma and app)
- `AUTH_SECRET` – for NextAuth
- `NEXT_PUBLIC_BASE_URL` – e.g. `http://localhost:3000`

Optional: `DATABASE_URI` (used by config; can mirror `DATABASE_URL`), `PAYLOAD_SECRET`, `PREVIEW_SECRET`.

## First run

1. **Database**: Ensure Postgres is running and the DB exists.

2. **Schema & migrations**:
   ```bash
   pnpm schema:generate   # regenerate Prisma schema from collections
   pnpm db:migration:run  # or: pnpm db:migration:run --push
   ```
   Or use `prisma.config.ts` (root) and run `pnpm db:push` / `pnpm db:migrate` as needed.

3. **Seed** (optional; seed script must match current schema):
   ```bash
   pnpm db:seed
   ```

4. **App**:
   ```bash
   pnpm dev
   ```
   Open http://localhost:3000. Admin: `/admin`. Docs: `/docs`.

## Common commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Next.js dev server |
| `pnpm build` | Production build |
| `pnpm schema:generate` | Generate Prisma schema from collections |
| `pnpm db:migration:run` | Run migrations (mode from config or `--push` / `--deploy`) |
| `pnpm db:seed` | Seed DB (see [Database](./database.md)) |
| `pnpm docs:generate` | Regenerate doc fragments from code |
| `pnpm lint` | Run ESLint |
