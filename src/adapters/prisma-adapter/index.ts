/**
 * Prisma Database Adapter
 * 
 * Provides PostgreSQL connectivity using the Prisma ORM with connection pooling.
 * This adapter uses the Prisma PostgreSQL adapter for better performance.
 */

// Client
export { prisma, disconnect } from './client';
export type { PrismaClient } from './client';
