import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

/**
 * Prisma client singleton
 * In development, we reuse the client to avoid too many connections
 */
export const prisma = global.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

/**
 * Create a new Prisma client instance
 * Use this if you need a separate client for specific operations
 */
export function createPrismaClient(): PrismaClient {
  return new PrismaClient();
}

/**
 * Disconnect the Prisma client
 */
export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect();
}

export type { PrismaClient };
