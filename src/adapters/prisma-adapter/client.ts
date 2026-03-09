/**
 * Prisma client bootstrap.
 *
 * Uses the PostgreSQL driver adapter only when the generated Prisma schema is
 * configured for a PostgreSQL-compatible provider. Other providers rely on the
 * matching driver adapter.
 */

import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { getPrismaProvider, usesMariaDbAdapter, usesPostgresAdapter } from './provider';

const { Pool } = pg;

dotenv.config();

function getDatabaseUrl(): string | undefined {
  return process.env.DATABASE_URL ?? process.env.DATABASE_URI;
}

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var __pool: pg.Pool | undefined;
}

/**
 * Create PostgreSQL connection pool.
 */
function createPool(): pg.Pool {
  return new Pool({
    connectionString: getDatabaseUrl(),
  });
}

/**
 * Singleton Prisma client with provider-aware adapter configuration.
 * In development, stores in global to survive hot reload.
 */
function createPrismaClient(): PrismaClient {
  const provider = getPrismaProvider();

  if (usesMariaDbAdapter(provider)) {
    const url = getDatabaseUrl();
    if (!url) {
      throw new Error('Missing DATABASE_URL or DATABASE_URI for the MariaDB Prisma adapter.');
    }

    return new PrismaClient({
      adapter: new PrismaMariaDb(url),
    });
  }

  if (!usesPostgresAdapter(provider)) {
    throw new Error(`Unsupported Prisma provider "${provider}" for the configured adapter bootstrap.`);
  }

  const pool = globalThis.__pool ?? createPool();
  if (process.env.NODE_ENV !== 'production') {
    globalThis.__pool = pool;
  }

  const adapter = new PrismaPg(pool);
  const client = new PrismaClient({ adapter });

  return client;
}

export const prisma = globalThis.__prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

/**
 * Disconnect Prisma (for graceful shutdown).
 */
export async function disconnect(): Promise<void> {
  await prisma.$disconnect();
  if (globalThis.__pool) {
    await globalThis.__pool.end();
  }
}

export type { PrismaClient };
