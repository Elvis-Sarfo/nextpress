import type { PrismaClient } from '@prisma/client';
import {
  type NewsId,
  type DocumentId,
  type Locale,
  type News,
  type NewsLocale,
  type NewsVersion,
  type NewsWithLocales,
  type NewsRepository,
  type NewsVersionRepository,
  type NewsListOptions,
  type ContentStatus,
} from '@cms/kernel';
import { newsMapper } from '../mappers/news-mapper.js';

export class PrismaNewsRepository implements NewsRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: NewsId): Promise<NewsWithLocales | null> {
    const record = await this.prisma.news.findUnique({
      where: { id },
      include: { locales: true },
    });

    return record ? newsMapper.toDomainWithLocales(record) : null;
  }

  async findByDocumentId(
    documentId: DocumentId,
    status?: ContentStatus
  ): Promise<NewsWithLocales | null> {
    const record = await this.prisma.news.findFirst({
      where: {
        documentId,
        ...(status ? { status } : {}),
      },
      include: { locales: true },
    });

    return record ? newsMapper.toDomainWithLocales(record) : null;
  }

  async findBySlug(
    locale: Locale,
    slug: string,
    status: ContentStatus = 'PUBLISHED'
  ): Promise<NewsWithLocales | null> {
    // Find the locale record first
    const localeRecord = await this.prisma.newsLocale.findUnique({
      where: { locale_slug: { locale, slug } },
    });

    if (!localeRecord) return null;

    // Get the news with all locales
    const record = await this.prisma.news.findFirst({
      where: {
        id: localeRecord.newsId,
        status,
      },
      include: { locales: true },
    });

    return record ? newsMapper.toDomainWithLocales(record) : null;
  }

  async findMany(options?: NewsListOptions): Promise<NewsWithLocales[]> {
    const records = await this.prisma.news.findMany({
      where: {
        ...(options?.status ? { status: options.status } : {}),
        ...(options?.category ? { category: options.category } : {}),
      },
      include: { locales: true },
      take: options?.limit,
      skip: options?.offset,
      orderBy: options?.orderBy
        ? { [options.orderBy]: options.orderDirection ?? 'desc' }
        : { createdAt: 'desc' },
    });

    return records.map((r) => newsMapper.toDomainWithLocales(r));
  }

  async findByCategory(
    category: string,
    options?: NewsListOptions
  ): Promise<NewsWithLocales[]> {
    return this.findMany({ ...options, category });
  }

  async count(options?: NewsListOptions): Promise<number> {
    return this.prisma.news.count({
      where: {
        ...(options?.status ? { status: options.status } : {}),
        ...(options?.category ? { category: options.category } : {}),
      },
    });
  }

  async save(news: News, locales: NewsLocale[]): Promise<void> {
    const existing = await this.prisma.news.findUnique({
      where: { id: news.id },
    });

    if (existing) {
      // Update news - handle fields directly to avoid Prisma type issues with null values
      await this.prisma.news.update({
        where: { id: news.id },
        data: {
          status: news.status,
          category: news.category,
          featuredImage: news.featuredImage,
          metadata: (news.metadata as object) ?? undefined,
          publishedAt: news.publishedAt,
          scheduledAt: news.scheduledAt,
        },
      });

      // Upsert locales
      for (const locale of locales) {
        await this.prisma.newsLocale.upsert({
          where: { newsId_locale: { newsId: news.id, locale: locale.locale } },
          update: {
            title: locale.title,
            slug: locale.slug,
            content: locale.content,
            excerpt: locale.excerpt,
          },
          create: newsMapper.localeToCreateInput(locale),
        });
      }
    } else {
      // Create news with locales
      await this.prisma.news.create({
        data: {
          ...newsMapper.toCreateInput(news),
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

  async delete(id: NewsId): Promise<void> {
    await this.prisma.news.delete({
      where: { id },
    });
  }

  async deleteByDocumentId(documentId: DocumentId): Promise<void> {
    await this.prisma.news.deleteMany({
      where: { documentId },
    });
  }
}

export class PrismaNewsVersionRepository implements NewsVersionRepository {
  constructor(private prisma: PrismaClient) {}

  async findByDocumentId(documentId: DocumentId): Promise<NewsVersion[]> {
    const records = await this.prisma.newsVersion.findMany({
      where: { documentId },
      orderBy: { version: 'desc' },
    });

    return records.map((r) => newsMapper.versionToDomain(r));
  }

  async findByVersion(
    documentId: DocumentId,
    version: number
  ): Promise<NewsVersion | null> {
    const record = await this.prisma.newsVersion.findUnique({
      where: { documentId_version: { documentId, version } },
    });

    return record ? newsMapper.versionToDomain(record) : null;
  }

  async getLatestVersion(documentId: DocumentId): Promise<number> {
    const result = await this.prisma.newsVersion.aggregate({
      where: { documentId },
      _max: { version: true },
    });

    return result._max.version ?? 0;
  }

  async save(version: NewsVersion): Promise<void> {
    await this.prisma.newsVersion.create({
      data: newsMapper.versionToCreateInput(version),
    });
  }
}
