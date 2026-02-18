# Generating docs from code comments

Docs can be generated from **JSDoc/TSDoc comments** in the codebase so the written docs stay in sync with the code.

## How it works

When you run:

```bash
pnpm docs:generate
```

the script:

1. Writes config and collection data to `docs/generated/` (as before).
2. **Extracts comments** from selected source files and writes one markdown file per file to `docs/generated/from-code/`.

For each selected file it extracts:

- **File-level JSDoc** – the leading `/** ... */` block at the top of the file (module description).
- **Export-level JSDoc** – the `/** ... */` block immediately before each `export function`, `export const`, `export class`, `export interface`, etc.

Comment text is turned into markdown (e.g. `@param` / `@returns` become bullet lists). Output is written to:

- `docs/generated/from-code/<module>.md` – one file per source file
- `docs/generated/from-code/README.md` – index of all from-code docs

## Which files are included

The list of source files is defined in **`src/scripts/extract-jsdoc.ts`** in the `SOURCE_FILES` array. By default it includes:

- `core/schema-engine/index.ts`
- `lib/nextpress.ts`
- `nextpress.config.ts`
- `scripts/generate-schema.ts`
- `scripts/run-migration.ts`
- `scripts/generate-docs.ts`
- `core/collection/types.ts`

## Adding more files

1. Open `src/scripts/extract-jsdoc.ts`.
2. Add the path relative to `src/` to the `SOURCE_FILES` array, e.g. `'lib/admin-utils.ts'`.
3. Run `pnpm docs:generate` again.

New or updated JSDoc in those files will appear in `docs/generated/from-code/` after the next run.

## Comment style

Use standard **JSDoc** (or **TSDoc**-compatible) blocks:

```ts
/**
 * Short description of the module or function.
 *
 * Optional longer description.
 *
 * @param name - Parameter description
 * @returns Return value description
 */
export function myFunction(name: string): string {
  return name;
}
```

- File-level: put one `/** ... */` at the very top of the file (before any import or code).
- Export-level: put `/** ... */` immediately above the `export` line (no other code in between).
- Tags like `@param`, `@returns`, `@example` are supported and rendered as lists in the generated markdown.

## Viewing generated from-code docs

- **On disk**: open any `docs/generated/from-code/*.md` in the repo.
- **In the app**: you can add a "From code" section to the docs sidebar that links to these files, or embed the generated markdown in a docs page. The docs app reads from `docs/`; the from-code files live under `docs/generated/from-code/`, so to expose them in the app you can either copy/symlink or add a route that serves `docs/generated/from-code/*.md` (e.g. `/docs/code/[module]` reading from that folder).

## Full API docs (TypeDoc)

For a full **API reference** (every export, type, and parameter) generated from TSDoc, you can add **TypeDoc** and point it at `src/`:

```bash
pnpm add -D typedoc
```

Then add a script, e.g. `"docs:api": "typedoc --out docs/generated/api src"`, and optionally configure `typedoc.json`. That produces a static site under `docs/generated/api/`. The current extractor is lighter and only includes the files you list in `SOURCE_FILES`.
