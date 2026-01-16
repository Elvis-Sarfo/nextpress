import type { PrismaClient } from '@prisma/client';
import type { ContentId, ContentLock, LockRepository } from '@cms/kernel';
import { contentId } from '@cms/kernel';

/**
 * Prisma implementation of LockRepository
 */
export class PrismaLockRepository implements LockRepository {
  constructor(private prisma: PrismaClient) {}

  async acquire(
    entryId: ContentId,
    userId: string,
    durationMs: number
  ): Promise<ContentLock | null> {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + durationMs);

    try {
      // Use upsert to handle both new locks and extending existing locks
      const lock = await this.prisma.contentLock.upsert({
        where: { entryId },
        create: {
          entryId,
          lockedBy: userId,
          lockedAt: now,
          expiresAt,
        },
        update: {
          lockedBy: userId,
          lockedAt: now,
          expiresAt,
        },
      });

      // If the lock was held by another user and not expired, reject
      // This check happens after upsert to handle race conditions
      const existingLock = await this.prisma.contentLock.findUnique({
        where: { entryId },
      });

      if (
        existingLock &&
        existingLock.lockedBy !== userId &&
        existingLock.expiresAt > now
      ) {
        return null;
      }

      return {
        id: lock.id,
        entryId: contentId(lock.entryId),
        lockedBy: lock.lockedBy,
        lockedAt: lock.lockedAt,
        expiresAt: lock.expiresAt,
      };
    } catch {
      // Lock acquisition failed (likely due to constraint)
      return null;
    }
  }

  async release(entryId: ContentId, userId: string): Promise<boolean> {
    try {
      const lock = await this.prisma.contentLock.findUnique({
        where: { entryId },
      });

      if (!lock) return true; // No lock to release

      if (lock.lockedBy !== userId) {
        return false; // Not the owner
      }

      await this.prisma.contentLock.delete({
        where: { entryId },
      });

      return true;
    } catch {
      return false;
    }
  }

  async isLocked(entryId: ContentId): Promise<boolean> {
    const lock = await this.prisma.contentLock.findUnique({
      where: { entryId },
    });

    if (!lock) return false;

    return lock.expiresAt > new Date();
  }

  async getLock(entryId: ContentId): Promise<ContentLock | null> {
    const lock = await this.prisma.contentLock.findUnique({
      where: { entryId },
    });

    if (!lock) return null;

    // Return null if expired
    if (lock.expiresAt <= new Date()) {
      // Clean up expired lock
      await this.prisma.contentLock.delete({
        where: { entryId },
      }).catch(() => {
        // Ignore errors from concurrent deletion
      });
      return null;
    }

    return {
      id: lock.id,
      entryId: contentId(lock.entryId),
      lockedBy: lock.lockedBy,
      lockedAt: lock.lockedAt,
      expiresAt: lock.expiresAt,
    };
  }

  async releaseExpired(): Promise<number> {
    const result = await this.prisma.contentLock.deleteMany({
      where: {
        expiresAt: {
          lte: new Date(),
        },
      },
    });

    return result.count;
  }
}
