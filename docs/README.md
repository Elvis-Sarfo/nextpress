# NextPress Documentation

Reference for developers and AI: architecture, configuration, and how to extend the CMS.

## How to use

- **In the app**: Open [/docs](/docs) to browse and search these docs.
- **From code**: Run `pnpm docs:generate` to regenerate generated fragments (collections, config reference) from the codebase. The docs page and any tooling can then use `docs/generated/`.

## Doc structure

| Document | Description |
|----------|-------------|
| [Overview](./overview.md) | Project goals, stack, and high-level architecture |
| [Getting started](./getting-started.md) | Install, env, first run, and common commands |
| [Configuration](./configuration.md) | `nextpress.config.ts`, env vars, and schema options |
| [Collections](./collections.md) | Defining and using collections (plus generated list) |
| [Schema engine](./schema-engine.md) | How collection config becomes Prisma schema |
| [Database](./database.md) | Prisma adapter, migrations, seed, and schema path |
| [Admin & routes](./admin-and-routes.md) | App routes, admin UI, and API surface |
| [Docs from code comments](./docs-from-code.md) | Generate doc pages from JSDoc/TSDoc in source files |
| [Updating docs](./updating-docs.md) | How to add or change docs and keep them in sync |

## For AI assistants

- Prefer these docs over guessing. Paths and scripts are authoritative.
- After config or collection changes, suggest running `pnpm docs:generate` so generated docs stay current.
- When adding features, update the relevant doc and, if needed, extend `scripts/generate-docs.ts`.
