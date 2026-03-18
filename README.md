# NextPress

A headless CMS built on Next.js, TypeScript, and Prisma. Content is defined via **collections**; a **schema engine** generates the Prisma schema from them.

## Quick start

```bash
pnpm install
cp .env.example .env   # set DATABASE_URL, AUTH_SECRET, etc.
pnpm schema:generate
pnpm db:migration:run --push
pnpm dev
```

- **App**: http://localhost:3000  
- **Admin**: http://localhost:3000/admin  
- **Docs**: http://localhost:3000/docs  

## Documentation

Full documentation lives in the **`docs/`** folder and is rendered in the app at **[/docs](/docs)**. Use it as the single reference for:

- Architecture and configuration
- Collections and schema engine
- Database, migrations, and seed
- Admin and routes
- How to update docs and keep them in sync with code

**For developers and AI**: Prefer the [docs](./docs/README.md) over ad-hoc answers. After config or collection changes, run:

```bash
pnpm docs:generate
```

to refresh generated fragments (collection list, config summary). See [docs/updating-docs.md](./docs/updating-docs.md) for how to add or edit docs.

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm schema:generate` | Generate Prisma schema from collections |
| `pnpm db:migration:run` | Run migrations (mode from config or `--push` / `--deploy`) |
| `pnpm db:seed` | Seed database |
| `pnpm docs:generate` | Regenerate doc fragments from code |

## Deployment Notes

- The active Prisma/runtime path in this repo is currently **MySQL/MariaDB**, not Postgres.
- Set both `DATABASE_URL` and `DATABASE_URI` to the same MySQL connection string in production.
- The repository does not currently contain committed Prisma migrations for the active MySQL schema, so first deployment should use `pnpm db:push` or `pnpm db:migration:run --push` until migrations are generated and committed.
- If you deploy on Coolify with local media storage, mount persistent storage for `public/uploads/media`.

## License

Private / see repository.
