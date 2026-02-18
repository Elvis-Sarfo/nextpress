# Updating the docs

## Where things live

- **Curated docs**: Markdown in `docs/*.md`. Edit these by hand when you change behaviour or add features.
- **Generated docs**: Output of `pnpm docs:generate` in `docs/generated/`. Do not edit by hand; regenerate after config or code changes.

## When to update

1. **Config or collections**: After changing `nextpress.config.ts` or any collection (fields, slug, options), run `pnpm docs:generate` so generated references (e.g. collection list) stay correct.
2. **Schema engine**: If you change how the schema engine maps fields or generates models, update `docs/schema-engine.md` and, if needed, `docs/collections.md`.
3. **Scripts or paths**: If you add or rename scripts (e.g. `db:seed`, schema path), update `docs/getting-started.md`, `docs/configuration.md`, and `docs/database.md`.
4. **New surface area**: New routes, API, or env vars → update `docs/admin-and-routes.md` or `docs/configuration.md` and run `docs:generate` if the generator should expose them.

## Adding a new doc page

1. Add `docs/your-topic.md` (e.g. `docs/custom-fields.md`).
2. Link it from `docs/README.md` and, if useful, from related docs.
3. The in-app docs app will pick it up automatically (it lists all `.md` under `docs/`).

## Generator script

- **Script**: `src/scripts/generate-docs.ts`.
- **Run**: `pnpm docs:generate`.
- **Output**: Writes into `docs/generated/` (e.g. collection list, config summary). Extend this script when you want new “from code” fragments (e.g. env vars, route list).

## For AI

- When you change config, collections, or schema behaviour, suggest running `pnpm docs:generate` and mention which doc file to update.
- Prefer linking to a doc section (e.g. “see docs/database.md”) rather than duplicating long lists in chat.
