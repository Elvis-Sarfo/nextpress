import {
  Result, Ok, Err, DomainError, ContentEntryId, PrincipalId
} from '../core/types';
import type { ContentLock, ContentLockRepository } from '../content/types';

const DEFAULT_LOCK_DURATION_MINUTES = 30;

export class LockManager {
  constructor(private repository: ContentLockRepository) {}

  /**
   * Acquire a lock on an entry.
   */
  async acquire(
    entryId: ContentEntryId,
    principalId: PrincipalId,
    durationMinutes: number = DEFAULT_LOCK_DURATION_MINUTES
  ): Promise<Result<ContentLock>> {
    const existing = await this.repository.findByEntry(entryId);
    const now = new Date();

    // Check if locked by someone else
    if (existing && existing.lockedBy !== principalId && existing.expiresAt > now) {
      return Err(DomainError.locked(`Entry ${entryId}`, existing.lockedBy));
    }

    // Create or update lock
    const lock: ContentLock = {
      id: existing?.id ?? crypto.randomUUID(),
      entryId,
      lockedBy: principalId,
      lockedAt: now,
      expiresAt: new Date(now.getTime() + durationMinutes * 60 * 1000),
    };

    await this.repository.save(lock);
    return Ok(lock);
  }

  /**
   * Release a lock.
   */
  async release(entryId: ContentEntryId, principalId: PrincipalId): Promise<Result<void>> {
    const existing = await this.repository.findByEntry(entryId);

    if (!existing) {
      return Ok(undefined); // Already unlocked
    }

    if (existing.lockedBy !== principalId) {
      return Err(DomainError.permissionDenied('release lock', `Entry ${entryId}`));
    }

    await this.repository.delete(entryId);
    return Ok(undefined);
  }

  /**
   * Extend an existing lock.
   */
  async extend(
    entryId: ContentEntryId,
    principalId: PrincipalId,
    durationMinutes: number = DEFAULT_LOCK_DURATION_MINUTES
  ): Promise<Result<ContentLock>> {
    const existing = await this.repository.findByEntry(entryId);

    if (!existing) {
      return Err(DomainError.notFound('Lock', entryId));
    }

    if (existing.lockedBy !== principalId) {
      return Err(DomainError.permissionDenied('extend lock', `Entry ${entryId}`));
    }

    const now = new Date();
    const lock: ContentLock = {
      ...existing,
      expiresAt: new Date(now.getTime() + durationMinutes * 60 * 1000),
    };

    await this.repository.save(lock);
    return Ok(lock);
  }

  /**
   * Check if content is locked (and by whom).
   */
  async getLock(entryId: ContentEntryId): Promise<ContentLock | null> {
    const lock = await this.repository.findByEntry(entryId);

    // Return null if lock expired
    if (lock && lock.expiresAt <= new Date()) {
      return null;
    }

    return lock;
  }

  /**
   * Check if a principal can edit (not locked, or locked by them).
   */
  async canEdit(entryId: ContentEntryId, principalId: PrincipalId): Promise<boolean> {
    const lock = await this.getLock(entryId);

    if (!lock) {
      return true; // Not locked
    }

    return lock.lockedBy === principalId;
  }

  /**
   * Clean up expired locks.
   */
  async cleanupExpired(): Promise<number> {
    return this.repository.deleteExpired();
  }
}
