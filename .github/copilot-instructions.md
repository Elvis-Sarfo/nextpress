# Copilot Instructions for NextPress

## Project Overview
- **Monorepo** managed with `pnpm` and `turbo`, containing:
  - `apps/web`: Next.js 14 app (App Router, TypeScript, Tailwind)
  - `packages/kernel`: Core CMS logic (content, roles, permissions, events, etc.)
  - `packages/prisma-adapter`: Prisma ORM integration, DB seed/migrations

## Architecture & Patterns
- **Domain logic** is in `packages/kernel/src/` (e.g., `content/`, `post/`, `page/`, `permissions/`).
- **Prisma** is used for DB access, with a custom adapter in `prisma-adapter`.
- **Multi-locale** content: Pages, posts, and news have `locales` sub-objects for translations.
- **RBAC**: Role-based permissions are defined in `kernel/permissions` and seeded in `prisma-adapter/prisma/seed.ts`.
- **Events**: Event bus in `kernel/events` for cross-module communication.
- **Admin UI**: All admin pages/components are under `apps/web/src/app/admin/`.

## Developer Workflows
- **Install**: `pnpm install` at repo root.
- **Build**: `pnpm build` (uses Turbo for all packages/apps).
- **Dev**: `pnpm dev` (runs Next.js and other dev servers).
- **DB Migrate**: `pnpm --filter prisma-adapter exec prisma migrate dev`
- **DB Seed**: `pnpm --filter prisma-adapter exec tsx packages/prisma-adapter/prisma/seed.ts`

## Conventions
- **TypeScript everywhere**; use branded types for IDs.
- **No direct DB access in apps/web**; always use kernel or adapter APIs.
- **All content is versioned** (see `kernel/content/version-manager.ts`).
- **Permissions**: Always check via kernel RBAC engine before mutating content.
- **Component structure**: UI components in `apps/web/src/components/ui/`, admin-specific in `admin/`.

## Integration Points
- **Prisma**: Custom client in `prisma-adapter/prisma-client/`.
- **Environment**: `.env` at project root for DB and secrets.
- **API routes**: Next.js API handlers in `apps/web/src/app/api/`.

## Examples
- See `prisma-adapter/prisma/seed.ts` for data model and RBAC seeding.
- See `kernel/permissions/rbac-engine.ts` for permission checks.
- See `kernel/content/version-manager.ts` for content versioning logic.

---

For questions or unclear patterns, ask for clarification or check the referenced files.