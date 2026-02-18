# permissions-rbac-engine

*Generated from `src/core/permissions/rbac-engine.ts`. Run `pnpm docs:generate` to update.*

## Exports

### RBACEngine

Role-Based Access Control engine with performance optimizations.
Optimizations:
- Caches computed permissions per principal to avoid repeated aggregation
- Uses early returns to minimize unnecessary iterations
- Pre-computes permission lookups for faster matching

### ADMIN_ROLE

Generate cache key for principal.

### EDITOR_ROLE

Generate cache key for principal.

### AUTHOR_ROLE

Generate cache key for principal.

### VIEWER_ROLE

Generate cache key for principal.