import type { ContentLock as PrismaLock } from '../../prisma-client/index.js';
import {
  ContentEntryId,
  PrincipalId,
  type ContentLock,
} from '@cms/kernel';

/**
 * Maps between Prisma ContentLock and kernel ContentLock.
 */
export class LockMapper {
  /**
   * Prisma model → Kernel domain object.
   */
  toDomain(prisma: PrismaLock): ContentLock {
    return {
      id: prisma.id,
      entryId: ContentEntryId(prisma.entryId),
      lockedBy: PrincipalId(prisma.lockedBy),
      lockedAt: prisma.lockedAt,
      expiresAt: prisma.expiresAt,
    };
  }

  /**
   * Kernel domain object → Prisma create input.
   */
  toCreateInput(domain: ContentLock): {
    id: string;
    entryId: string;
    lockedBy: string;
    lockedAt?: Date;
    expiresAt: Date;
  } {
    return {
      id: domain.id,
      entryId: domain.entryId,
      lockedBy: domain.lockedBy,
      lockedAt: domain.lockedAt,
      expiresAt: domain.expiresAt,
    };
  }

  /**
   * Kernel domain object → Prisma update input.
   */
  toUpdateInput(domain: Partial<ContentLock>): {
    lockedBy?: string;
    lockedAt?: Date;
    expiresAt?: Date;
  } {
    const input: ReturnType<typeof this.toUpdateInput> = {};

    if (domain.lockedBy !== undefined) input.lockedBy = domain.lockedBy;
    if (domain.lockedAt !== undefined) input.lockedAt = domain.lockedAt;
    if (domain.expiresAt !== undefined) input.expiresAt = domain.expiresAt;

    return input;
  }
}

export const lockMapper = new LockMapper();
