/**
 * Prisma PostgreSQL Client
 * 
 * Singleton Prisma client with PostgreSQL adapter and connection pooling.
 * In development, stores in global to survive hot module replacement (HMR).
 * 
 * @module prisma-adapter/client
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const { Pool } = pg;

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
    connectionString: process.env.DATABASE_URL,
  });
}

/**
 * Singleton Prisma client with PostgreSQL adapter.
 * In development, stores in global to survive hot reload.
 */
function createPrismaClient(): PrismaClient {
  const pool = globalThis.__pool ?? createPool();

  if (process.env.NODE_ENV !== 'production') {
    globalThis.__pool = pool;
  }

  const adapter = new PrismaPg(pool);

  const client = new PrismaClient({
    adapter,
  });

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
