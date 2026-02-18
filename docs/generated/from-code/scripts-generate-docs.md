# scripts-generate-docs

*Generated from `src/scripts/generate-docs.ts`. Run `pnpm docs:generate` to update.*

Generate docs fragments from the codebase.
Run: pnpm docs:generate
Writes into docs/generated/ so the docs app and other tools can stay in sync
with config and collections. Also extracts JSDoc from selected source files
into docs/generated/from-code/. Re-run after changing config, collections, or comments.