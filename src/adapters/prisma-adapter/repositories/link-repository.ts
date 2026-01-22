import type { PrismaClient } from '@/adapters/prisma-adapter/prisma-client';
import {
  type LinkCollectionId,
  type LinkId,
  type LinkCollection,
  type Link,
  type LinkCollectionWithLinks,
  type LinkCollectionRepository,
  type LinkRepository,
} from '@/kernel';
import { linkMapper } from '../mappers/link-mapper.js';

export class PrismaLinkCollectionRepository implements LinkCollectionRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: LinkCollectionId): Promise<LinkCollectionWithLinks | null> {
    const record = await this.prisma.linkCollection.findUnique({
      where: { id },
      include: { links: true },
    });

    return record ? linkMapper.collectionToDomainWithLinks(record) : null;
  }

  async findByName(name: string): Promise<LinkCollectionWithLinks | null> {
    const record = await this.prisma.linkCollection.findUnique({
      where: { name },
      include: { links: true },
    });

    return record ? linkMapper.collectionToDomainWithLinks(record) : null;
  }

  async findAll(): Promise<LinkCollection[]> {
    const records = await this.prisma.linkCollection.findMany({
      orderBy: { name: 'asc' },
    });

    return records.map((r) => linkMapper.collectionToDomain(r));
  }

  async save(collection: LinkCollection): Promise<void> {
    const existing = await this.prisma.linkCollection.findUnique({
      where: { id: collection.id },
    });

    if (existing) {
      await this.prisma.linkCollection.update({
        where: { id: collection.id },
        data: {
          name: collection.name,
          displayName: collection.displayName,
          description: collection.description,
        },
      });
    } else {
      await this.prisma.linkCollection.create({
        data: linkMapper.collectionToCreateInput(collection),
      });
    }
  }

  async delete(id: LinkCollectionId): Promise<void> {
    await this.prisma.linkCollection.delete({
      where: { id },
    });
  }
}

export class PrismaLinkRepository implements LinkRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: LinkId): Promise<Link | null> {
    const record = await this.prisma.link.findUnique({
      where: { id },
    });

    return record ? linkMapper.linkToDomain(record) : null;
  }

  async findByCollection(collectionId: LinkCollectionId): Promise<Link[]> {
    const records = await this.prisma.link.findMany({
      where: { collectionId },
      orderBy: { order: 'asc' },
    });

    return records.map((r) => linkMapper.linkToDomain(r));
  }

  async save(link: Link): Promise<void> {
    const existing = await this.prisma.link.findUnique({
      where: { id: link.id },
    });

    if (existing) {
      await this.prisma.link.update({
        where: { id: link.id },
        data: {
          order: link.order,
          title: link.title,
          description: link.description ?? undefined,
          url: link.url,
          imageUrl: link.imageUrl,
          target: link.target,
        },
      });
    } else {
      await this.prisma.link.create({
        data: linkMapper.linkToCreateInput(link),
      });
    }
  }

  async delete(id: LinkId): Promise<void> {
    await this.prisma.link.delete({
      where: { id },
    });
  }

  async deleteByCollection(collectionId: LinkCollectionId): Promise<void> {
    await this.prisma.link.deleteMany({
      where: { collectionId },
    });
  }

  async reorder(
    _collectionId: LinkCollectionId,
    items: { id: LinkId; order: number }[]
  ): Promise<void> {
    await this.prisma.$transaction(
      items.map(({ id, order }) =>
        this.prisma.link.update({
          where: { id },
          data: { order },
        })
      )
    );
  }
}
