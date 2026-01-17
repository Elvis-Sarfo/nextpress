import type { PrismaClient } from '@prisma/client';
import type { ContentEntryId, ContentLock, ContentLockRepository } from '@cms/kernel';
import { ContentEntryId as createContentEntryId, PrincipalId } from '@cms/kernel';

/**
 * Prisma implementation of ContentLockRepository
 */
export class PrismaContentLockRepository implements ContentLockRepository {
  constructor(private prisma: PrismaClient) {}

  async findByEntry(entryId: ContentEntryId): Promise<ContentLock | null> {
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
      entryId: createContentEntryId(lock.entryId),
      lockedBy: PrincipalId(lock.lockedBy),
      lockedAt: lock.lockedAt,
      expiresAt: lock.expiresAt,
    };
  }

  async save(lock: ContentLock): Promise<void> {
    await this.prisma.contentLock.upsert({
      where: { entryId: lock.entryId },
      create: {
        id: lock.id,
        entryId: lock.entryId,
        lockedBy: lock.lockedBy,
        lockedAt: lock.lockedAt,
        expiresAt: lock.expiresAt,
      },
      update: {
        lockedBy: lock.lockedBy,
        lockedAt: lock.lockedAt,
        expiresAt: lock.expiresAt,
      },
    });
  }

  async delete(entryId: ContentEntryId): Promise<void> {
    await this.prisma.contentLock.delete({
      where: { entryId },
    }).catch(() => {
      // Ignore if lock doesn't exist
    });
  }

  async deleteExpired(): Promise<number> {
    const result = await this.prisma.contentLock.deleteMany({
      where: {
        expiresAt: {
          lte: new Date(),
        },
      },
    });

    return result.count;
  }

  // Additional helper methods (not in interface but useful)

  async acquire(
    entryId: ContentEntryId,
    userId: string,
    durationMs: number
  ): Promise<ContentLock | null> {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + durationMs);

    // Check if lock exists and is held by another user
    const existingLock = await this.prisma.contentLock.findUnique({
      where: { entryId },
    });

    if (existingLock && existingLock.lockedBy !== userId && existingLock.expiresAt > now) {
      return null; // Lock held by someone else
    }

    try {
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

      return {
        id: lock.id,
        entryId: createContentEntryId(lock.entryId),
        lockedBy: PrincipalId(lock.lockedBy),
        lockedAt: lock.lockedAt,
        expiresAt: lock.expiresAt,
      };
    } catch {
      return null;
    }
  }

  async release(entryId: ContentEntryId, userId: string): Promise<boolean> {
    const lock = await this.prisma.contentLock.findUnique({
      where: { entryId },
    });

    if (!lock) return true;
    if (lock.lockedBy !== userId) return false;

    await this.prisma.contentLock.delete({
      where: { entryId },
    });

    return true;
  }

  async isLocked(entryId: ContentEntryId): Promise<boolean> {
    const lock = await this.prisma.contentLock.findUnique({
      where: { entryId },
    });

    if (!lock) return false;

    return lock.expiresAt > new Date();
  }
}
