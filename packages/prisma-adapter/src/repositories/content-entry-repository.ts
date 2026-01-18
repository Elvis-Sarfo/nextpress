import type { PrismaClient, ContentEntry as PrismaEntry } from '../../prisma-client/index.js';
import {
  type ContentEntryId,
  type ContentTypeId,
  type ContentEntry,
  type ContentEntryRepository,
  type ListOptions,
} from '@cms/kernel';
import { contentMapper } from '../mappers/content-mapper.js';

export class PrismaContentEntryRepository implements ContentEntryRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: ContentEntryId): Promise<ContentEntry | null> {
    const record = await this.prisma.contentEntry.findUnique({
      where: { id },
    });

    return record ? contentMapper.toDomain(record) : null;
  }

  async findByType(typeId: ContentTypeId, options?: ListOptions): Promise<ContentEntry[]> {
    const records = await this.prisma.contentEntry.findMany({
      where: {
        typeId,
        deletedAt: null,
        ...(options?.createdBy && { createdBy: options.createdBy }),
      },
      orderBy: {
        [options?.orderBy ?? 'createdAt']: options?.orderDirection ?? 'desc',
      },
      skip: options?.offset ?? 0,
      take: options?.limit ?? 20,
    });

    return records.map((r: PrismaEntry) => contentMapper.toDomain(r));
  }

  async countByType(typeId: ContentTypeId): Promise<number> {
    return this.prisma.contentEntry.count({
      where: {
        typeId,
        deletedAt: null,
      },
    });
  }

  async save(entry: ContentEntry): Promise<void> {
    const existing = await this.prisma.contentEntry.findUnique({
      where: { id: entry.id },
    });

    if (existing) {
      await this.prisma.contentEntry.update({
        where: { id: entry.id },
        data: contentMapper.toUpdateInput(entry),
      });
    } else {
      await this.prisma.contentEntry.create({
        data: contentMapper.toCreateInput(entry),
      });
    }
  }

  async delete(id: ContentEntryId): Promise<void> {
    // Soft delete
    await this.prisma.contentEntry.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
