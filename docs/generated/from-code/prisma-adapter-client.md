# prisma-adapter-client

*Generated from `src/adapters/prisma-adapter/client.ts`. Run `pnpm docs:generate` to update.*

Prisma PostgreSQL Client
Singleton Prisma client with PostgreSQL adapter and connection pooling.
In development, stores in global to survive hot module replacement (HMR).

- **@module** prisma-adapter/client

## Exports

### prisma

Singleton Prisma client with PostgreSQL adapter.
In development, stores in global to survive hot reload.

### disconnect

Disconnect Prisma (for graceful shutdown).