# scripts-run-migration

*Generated from `src/scripts/run-migration.ts`. Run `pnpm docs:generate` to update.*

Database Migration Runner
Executes Prisma migrations based on the configured migration mode.
Supports manual, auto, deploy, and prompt modes.
Usage:
npx tsx src/scripts/run-migration.ts          # Use config mode
npx tsx src/scripts/run-migration.ts --push    # Force db push
npx tsx src/scripts/run-migration.ts --deploy # Force migrate deploy