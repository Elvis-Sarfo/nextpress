import type { PrismaClient } from '../../prisma-client/index.js';
import {
  type ContentEntryId,
  type ContentLock,
  type ContentLockRepository,
} from '@cms/kernel';
import { lockMapper } from '../mappers/lock-mapper.js';

export class PrismaContentLockRepository implements ContentLockRepository {
  constructor(private prisma: PrismaClient) {}

  async findByEntry(entryId: ContentEntryId): Promise<ContentLock | null> {
    const record = await this.prisma.contentLock.findUnique({
      where: { entryId },
    });

    return record ? lockMapper.toDomain(record) : null;
  }

  async save(lock: ContentLock): Promise<void> {
    await this.prisma.contentLock.upsert({
      where: { entryId: lock.entryId },
      create: lockMapper.toCreateInput(lock),
      update: lockMapper.toUpdateInput(lock),
    });
  }

  async delete(entryId: ContentEntryId): Promise<void> {
    await this.prisma.contentLock.deleteMany({
      where: { entryId },
    });
  }

  async deleteExpired(): Promise<number> {
    const result = await this.prisma.contentLock.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });

    return result.count;
  }
}
