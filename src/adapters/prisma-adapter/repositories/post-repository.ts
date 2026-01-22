import type { PrismaClient } from '@/adapters/prisma-adapter/prisma-client';
import {
  type PostId,
  type DocumentId,
  type Locale,
  type Post,
  type PostLocale,
  type PostVersion,
  type PostWithLocales,
  type PostRepository,
  type PostVersionRepository,
  type PostListOptions,
  type ContentStatus,
} from '@/kernel';
import { postMapper } from '../mappers/post-mapper.js';

export class PrismaPostRepository implements PostRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: PostId): Promise<PostWithLocales | null> {
    const record = await this.prisma.post.findUnique({
      where: { id },
      include: { locales: true },
    });

    return record ? postMapper.toDomainWithLocales(record) : null;
  }

  async findByDocumentId(
    documentId: DocumentId,
    status?: ContentStatus
  ): Promise<PostWithLocales | null> {
    const record = await this.prisma.post.findFirst({
      where: {
        documentId,
        ...(status ? { status } : {}),
      },
      include: { locales: true },
    });

    return record ? postMapper.toDomainWithLocales(record) : null;
  }

  async findBySlug(
    locale: Locale,
    slug: string,
    status: ContentStatus = 'PUBLISHED'
  ): Promise<PostWithLocales | null> {
    // Find the locale record first
    const localeRecord = await this.prisma.postLocale.findUnique({
      where: { locale_slug: { locale, slug } },
    });

    if (!localeRecord) return null;

    // Get the post with all locales
    const record = await this.prisma.post.findFirst({
      where: {
        id: localeRecord.postId,
        status,
      },
      include: { locales: true },
    });

    return record ? postMapper.toDomainWithLocales(record) : null;
  }

  async findMany(options?: PostListOptions): Promise<PostWithLocales[]> {
    const records = await this.prisma.post.findMany({
      where: {
        ...(options?.status ? { status: options.status } : {}),
      },
      include: { locales: true },
      take: options?.limit,
      skip: options?.offset,
      orderBy: options?.orderBy
        ? { [options.orderBy]: options.orderDirection ?? 'desc' }
        : { createdAt: 'desc' },
    });

    return records.map((r) => postMapper.toDomainWithLocales(r));
  }

  async count(options?: PostListOptions): Promise<number> {
    return this.prisma.post.count({
      where: {
        ...(options?.status ? { status: options.status } : {}),
      },
    });
  }

  async save(post: Post, locales: PostLocale[]): Promise<void> {
    const existing = await this.prisma.post.findUnique({
      where: { id: post.id },
    });

    if (existing) {
      // Update post - handle fields directly to avoid Prisma type issues with null values
      await this.prisma.post.update({
        where: { id: post.id },
        data: {
          status: post.status,
          featuredImage: post.featuredImage,
          metadata: (post.metadata as object) ?? undefined,
          publishedAt: post.publishedAt,
          scheduledAt: post.scheduledAt,
        },
      });

      // Upsert locales
      for (const locale of locales) {
        await this.prisma.postLocale.upsert({
          where: { postId_locale: { postId: post.id, locale: locale.locale } },
          update: {
            title: locale.title,
            slug: locale.slug,
            content: locale.content,
            excerpt: locale.excerpt,
          },
          create: postMapper.localeToCreateInput(locale),
        });
      }
    } else {
      // Create post with locales
      await this.prisma.post.create({
        data: {
          ...postMapper.toCreateInput(post),
          locales: {
            create: locales.map((l) => ({
              id: l.id,
              locale: l.locale,
              title: l.title,
              slug: l.slug,
              content: l.content,
              excerpt: l.excerpt,
            })),
          },
        },
      });
    }
  }

  async delete(id: PostId): Promise<void> {
    await this.prisma.post.delete({
      where: { id },
    });
  }

  async deleteByDocumentId(documentId: DocumentId): Promise<void> {
    await this.prisma.post.deleteMany({
      where: { documentId },
    });
  }
}

export class PrismaPostVersionRepository implements PostVersionRepository {
  constructor(private prisma: PrismaClient) {}

  async findByDocumentId(documentId: DocumentId): Promise<PostVersion[]> {
    const records = await this.prisma.postVersion.findMany({
      where: { documentId },
      orderBy: { version: 'desc' },
    });

    return records.map((r) => postMapper.versionToDomain(r));
  }

  async findByVersion(
    documentId: DocumentId,
    version: number
  ): Promise<PostVersion | null> {
    const record = await this.prisma.postVersion.findUnique({
      where: { documentId_version: { documentId, version } },
    });

    return record ? postMapper.versionToDomain(record) : null;
  }

  async getLatestVersion(documentId: DocumentId): Promise<number> {
    const result = await this.prisma.postVersion.aggregate({
      where: { documentId },
      _max: { version: true },
    });

    return result._max.version ?? 0;
  }

  async save(version: PostVersion): Promise<void> {
    await this.prisma.postVersion.create({
      data: postMapper.versionToCreateInput(version),
    });
  }
}
