# Copilot Instructions for NextPress

## Project Overview
- **Monorepo**: Contains a Next.js app, a modular kernel, and a Prisma adapter.
- **Major Components**:
  - `src/app/`: Next.js application (routes, layouts, pages, admin, API endpoints).
  - `src/kernel/`: Core CMS logic (content, comments, navigation, permissions, schema, workflow, etc.).
  - `src/adapters/prisma-adapter/`: Prisma ORM integration (schema, client, repositories, mappers).
  - `src/components/`: Shared React components (UI, admin, etc.).
  - `src/lib/`: Utility and CMS integration helpers.

## Key Patterns & Conventions
- **TypeScript**: All code is TypeScript-first. Use types from `kernel/*/types.ts` and `adapters/prisma-adapter/mappers/*-mapper.ts`.
- **Repository Pattern**: Data access is abstracted via repositories in `adapters/prisma-adapter/repositories/`.
- **Mappers**: Use mappers to translate between Prisma models and kernel types.
- **Event Bus**: Cross-module communication via `kernel/events/event-bus.ts`.
- **RBAC**: Permissions and roles are managed in `kernel/permissions/`.
- **Versioning**: Content versioning logic in `kernel/content/version-manager.ts`.
- **Admin UI**: All admin routes are under `src/app/admin/`.
- **API Routes**: Custom API endpoints in `src/app/api/`.

## Developer Workflows
- **Install**: `pnpm install`
- **Dev Server**: `pnpm run dev` (runs Next.js app)
- **Prisma**:
  - Migrate: `pnpm exec prisma migrate dev --schema=src/adapters/prisma-adapter/prisma/schema.prisma`
  - Generate Client: `pnpm exec prisma generate --schema=src/adapters/prisma-adapter/prisma/schema.prisma`
  - Seed: `pnpm exec tsx src/adapters/prisma-adapter/prisma/seed.ts`
- **Build**: `pnpm run build`

## Integration Points
- **Prisma**: All DB access via Prisma client in `adapters/prisma-adapter/prisma-client/`.
- **External Images**: Next.js image config allows all HTTPS sources.
- **Tailwind**: Config in `tailwind.config.ts`.

## Special Notes
- **.env files**: Not committed, must be created locally.
- **.gitignore**: Covers node_modules, build outputs, Prisma artifacts, and environment files.
- **No test setup**: Add tests in future as needed.

## Examples
- To add a new content type: update `kernel/schema/`, add mappers, update Prisma schema, and expose via repository.
- To add an admin page: create a new route under `src/app/admin/` and use shared UI components.

---
For questions, review the structure above and check referenced files for implementation details.