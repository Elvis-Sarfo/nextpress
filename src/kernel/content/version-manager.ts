import {
  Result, Ok, Err, DomainError,
  ContentEntryId, ContentVersionId, PrincipalId
} from '../core/types.js';
import type {
  ContentVersion, ContentVersionRepository, VersionData, VersionStatus
} from './types.js';

/**
 * Manages content version lifecycle with copy-on-write semantics.
 */
export class VersionManager {
  constructor(private repository: ContentVersionRepository) {}

  /**
   * Create the initial version (v1) for a new entry.
   */
  async createInitialVersion(
    entryId: ContentEntryId,
    data: VersionData,
    principalId: PrincipalId
  ): Promise<Result<ContentVersion>> {
    const version: ContentVersion = {
      id: ContentVersionId(crypto.randomUUID()),
      entryId,
      version: 1,
      status: 'DRAFT',
      data: structuredClone(data),
      createdAt: new Date(),
      createdBy: principalId,
    };

    await this.repository.save(version);
    return Ok(version);
  }

  /**
   * Create a new version based on an existing one (copy-on-write).
   */
  async createNewVersion(
    entryId: ContentEntryId,
    baseVersion: ContentVersion,
    changes: Partial<VersionData>,
    principalId: PrincipalId
  ): Promise<Result<ContentVersion>> {
    // Merge changes into base data
    const newData = this.mergeData(baseVersion.data, changes);

    const version: ContentVersion = {
      id: ContentVersionId(crypto.randomUUID()),
      entryId,
      version: baseVersion.version + 1,
      status: 'DRAFT',
      data: newData,
      createdAt: new Date(),
      createdBy: principalId,
    };

    await this.repository.save(version);
    return Ok(version);
  }

  /**
   * Update an existing draft version (no copy needed).
   */
  async updateDraft(
    version: ContentVersion,
    changes: Partial<VersionData>,
    principalId: PrincipalId
  ): Promise<Result<ContentVersion>> {
    if (version.status !== 'DRAFT') {
      return Err(DomainError.invalidState('Can only update draft versions'));
    }

    const updated: ContentVersion = {
      ...version,
      data: this.mergeData(version.data, changes),
      createdBy: principalId, // Track who last modified
    };

    await this.repository.save(updated);
    return Ok(updated);
  }

  /**
   * Transition a version to a new status.
   */
  async transitionStatus(
    version: ContentVersion,
    newStatus: VersionStatus,
    options?: { publishedAt?: Date; scheduledAt?: Date }
  ): Promise<Result<ContentVersion>> {
    const updated: ContentVersion = {
      ...version,
      status: newStatus,
      publishedAt: options?.publishedAt ?? version.publishedAt,
      scheduledAt: options?.scheduledAt ?? version.scheduledAt,
    };

    await this.repository.save(updated);
    return Ok(updated);
  }

  /**
   * Get the current draft for an entry, if any.
   */
  async getDraft(entryId: ContentEntryId): Promise<ContentVersion | null> {
    return this.repository.findByEntryAndStatus(entryId, 'DRAFT');
  }

  /**
   * Get the published version for an entry, if any.
   */
  async getPublished(entryId: ContentEntryId): Promise<ContentVersion | null> {
    return this.repository.findByEntryAndStatus(entryId, 'PUBLISHED');
  }

  /**
   * Get the scheduled version for an entry, if any.
   */
  async getScheduled(entryId: ContentEntryId): Promise<ContentVersion | null> {
    return this.repository.findByEntryAndStatus(entryId, 'SCHEDULED');
  }

  /**
   * Get version history for an entry.
   */
  async getHistory(entryId: ContentEntryId): Promise<ContentVersion[]> {
    return this.repository.findByEntry(entryId);
  }

  /**
   * Get versions scheduled to publish before a given time.
   */
  async getScheduledForPublishing(before: Date): Promise<ContentVersion[]> {
    return this.repository.findScheduledBefore(before);
  }

  /**
   * Deep merge data with locale support.
   */
  private mergeData(base: VersionData, changes: Partial<VersionData>): VersionData {
    const result = structuredClone(base);

    for (const [key, value] of Object.entries(changes)) {
      if (key === 'locales' && typeof value === 'object' && value !== null) {
        // Deep merge locales
        result.locales = result.locales || {};
        for (const [locale, localeData] of Object.entries(value as Record<string, Record<string, unknown>>)) {
          result.locales[locale] = {
            ...result.locales[locale],
            ...localeData,
          };
        }
      } else {
        // Overwrite other fields
        (result as Record<string, unknown>)[key] = value;
      }
    }

    return result;
  }
}
