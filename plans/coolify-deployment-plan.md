# Coolify Deployment Plan

## Current deployment shape

This repository is a **Next.js 16** app that runs as a long-lived Node server.

- Package manager: `pnpm`
- Runtime: Node `20` from `.nvmrc`
- Start command: `pnpm start`
- Build command: `pnpm build`
- ORM: Prisma
- Auth: NextAuth v5 credentials flow
- File storage: local disk by default, with optional `s3`, `supabase`, or `cloudinary`

## Important findings before deployment

### 1. Database config is inconsistent

The repo currently points to **MySQL/MariaDB** in the active runtime paths:

- `src/adapters/prisma-adapter/prisma/schema.prisma` uses `provider = "mysql"`
- `src/nextpress.config.ts` sets `db.provider: 'mysql'`

But other project defaults still mention Postgres:

- `.env.example` uses PostgreSQL URLs
- `docs/configuration.md` and `docs/database.md` describe Postgres

For a first Coolify deployment, the safest path is:

1. Deploy with **MariaDB/MySQL**
2. Use the same connection string for both `DATABASE_URL` and `DATABASE_URI`
3. Treat Postgres support as a separate cleanup task, not part of deployment

### 2. Local uploads are not safe without persistence

Default media storage writes to `public/uploads/media`.

On Coolify, local disk inside the app container is not durable across rebuilds/redeploys unless a persistent volume is mounted. Production should use one of:

- A Coolify persistent volume mounted for `public/uploads/media`
- External object storage (`s3`, `supabase`, or `cloudinary`)

### 3. There is no deployment artifact yet

The repo currently has no:

- `Dockerfile`
- `docker-compose.yml`
- `.coolify` config

That means Coolify will need either:

- A **Nixpacks-based Node app** configuration, or
- A new explicit Dockerfile

Start with Nixpacks unless deployment constraints force Docker.

## Recommended Coolify architecture

Create two services in the same Coolify project:

1. `nextpress-web`
   - Type: Application
   - Build strategy: Nixpacks
   - Exposed port: `3000`
   - Domain: production app domain

2. `nextpress-db`
   - Type: Managed database
   - Engine: **MariaDB/MySQL**
   - Version: current Coolify-supported stable release

Optional third service:

3. `nextpress-redis`
   - Only needed later if caching/queues are introduced
   - Not required for the current codebase

## Coolify application settings

Use these values for the web service:

- Install command: `pnpm install --frozen-lockfile`
- Build command: `pnpm db:generate && pnpm build`
- Start command: `pnpm start`
- Port: `3000`

Recommended persistent storage if keeping local uploads:

- Mount a volume to `/app/public/uploads/media`

## Required environment variables

Set these in Coolify for the web service:

```env
NODE_ENV=production

DATABASE_URL=mysql://USER:PASSWORD@HOST:3306/DB_NAME
DATABASE_URI=mysql://USER:PASSWORD@HOST:3306/DB_NAME
PRISMA_DB_PROVIDER=mysql

AUTH_SECRET=<long-random-secret>
PAYLOAD_SECRET=<long-random-secret>
PREVIEW_SECRET=<long-random-secret>

NEXT_PUBLIC_BASE_URL=https://your-domain.example

NEXTPRESS_STORAGE_PROVIDER=local
NEXTPRESS_LOCAL_UPLOAD_DIR=public/uploads/media
NEXTPRESS_LOCAL_PUBLIC_PATH=/uploads/media
```

If using external storage, replace the local storage variables with the matching provider variables already defined in `.env.example`.

## First deployment sequence

### Phase 1: Infrastructure

1. Provision the MariaDB/MySQL service in Coolify.
2. Copy the generated DB connection string.
3. Create the web service from this repository and branch.
4. Configure the environment variables.
5. Attach a persistent volume for uploads if staying on local storage.

### Phase 2: Database bootstrap

Before the first production release, run:

```bash
pnpm db:generate
pnpm db:push
```

Notes:

- The project also includes `pnpm db:migration:run`, but production mode currently resolves to `deploy`, which is not usable yet because the repo has no committed MySQL migrations.
- Until proper MySQL migrations exist in version control, use `pnpm db:push` or `pnpm db:migration:run --push` for initial schema bootstrap.
- `pnpm db:seed` exists, but `docs/database.md` explicitly warns the seed may target an older schema. Treat seeding as optional until verified.

### Phase 3: App release

1. Trigger the first build/deploy.
2. Verify `/`, `/admin`, `/auth/signin`, and `/docs`.
3. Verify login works against the production DB.
4. Upload a media item and confirm it remains after a redeploy.

## Recommended operational checks

After first deploy, verify:

- App boot completes without Prisma initialization errors
- The admin panel loads
- Authentication session cookies work behind the Coolify proxy
- Image and media URLs resolve correctly
- Preview route secret validation works
- A rebuild does not delete uploaded media

## Risks and follow-up tasks

### High priority

- Normalize the database story across code, docs, and env samples
- Generate and commit Prisma migrations for the active MySQL schema
- Decide whether production media stays local or moves to object storage
- Verify the seed script against the current Prisma schema before using it

### Medium priority

- Add a `Dockerfile` for deterministic deployments if Nixpacks becomes limiting
- Add a health check route for cleaner readiness monitoring
- Add a post-deploy migration step if you want migrations automated by platform workflow

## Suggested next implementation tasks

1. Fix the docs and `.env.example` to match the actual MySQL/MariaDB runtime.
2. Add a production deployment artifact:
   - either a `Dockerfile`
   - or documented Coolify Nixpacks settings in `README.md`
3. Decide and implement the production media storage strategy.
4. Dry-run a production build locally with production env values.
