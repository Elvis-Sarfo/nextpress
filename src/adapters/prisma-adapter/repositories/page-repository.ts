import type { PrismaClient } from '@/adapters/prisma-adapter/prisma-client';
import {
  type PageId,
  type DocumentId,
  type Locale,
  type Page,
  type PageLocale,
  type PageVersion,
  type PageWithLocales,
  type PageRepository,
  type PageVersionRepository,
  type PageListOptions,
  type ContentStatus,
} from '@/kernel';
import { pageMapper } from '../mappers/page-mapper';

export class PrismaPageRepository implements PageRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: PageId): Promise<PageWithLocales | null> {
    const record = await this.prisma.page.findUnique({
      where: { id },
      include: { locales: true },
    });

    return record ? pageMapper.toDomainWithLocales(record) : null;
  }

  async findByDocumentId(
    documentId: DocumentId,
    status?: ContentStatus
  ): Promise<PageWithLocales | null> {
    const record = await this.prisma.page.findFirst({
      where: {
        documentId,
        ...(status ? { status } : {}),
      },
      include: { locales: true },
    });

    return record ? pageMapper.toDomainWithLocales(record) : null;
  }

  async findBySlug(
    locale: Locale,
    slug: string,
    status: ContentStatus = 'PUBLISHED'
  ): Promise<PageWithLocales | null> {
    // Find the locale record first
    const localeRecord = await this.prisma.pageLocale.findUnique({
      where: { locale_slug: { locale, slug } },
    });

    if (!localeRecord) return null;

    // Get the page with all locales
    const record = await this.prisma.page.findFirst({
      where: {
        id: localeRecord.pageId,
        status,
      },
      include: { locales: true },
    });

    return record ? pageMapper.toDomainWithLocales(record) : null;
  }

  async findMany(options?: PageListOptions): Promise<PageWithLocales[]> {
    const records = await this.prisma.page.findMany({
      where: {
        ...(options?.status ? { status: options.status } : {}),
        ...(options?.parentId !== undefined ? { parentId: options.parentId } : {}),
      },
      include: { locales: true },
      take: options?.limit,
      skip: options?.offset,
      orderBy: options?.orderBy
        ? { [options.orderBy]: options.orderDirection ?? 'desc' }
        : { createdAt: 'desc' },
    });

    return records.map((r) => pageMapper.toDomainWithLocales(r));
  }

  async findChildren(
    parentId: PageId,
    options?: PageListOptions
  ): Promise<PageWithLocales[]> {
    const records = await this.prisma.page.findMany({
      where: {
        parentId,
        ...(options?.status ? { status: options.status } : {}),
      },
      include: { locales: true },
      take: options?.limit,
      skip: options?.offset,
      orderBy: { order: 'asc' },
    });

    return records.map((r) => pageMapper.toDomainWithLocales(r));
  }

  async count(options?: PageListOptions): Promise<number> {
    return this.prisma.page.count({
      where: {
        ...(options?.status ? { status: options.status } : {}),
        ...(options?.parentId !== undefined ? { parentId: options.parentId } : {}),
      },
    });
  }

  async save(page: Page, locales: PageLocale[]): Promise<void> {
    const existing = await this.prisma.page.findUnique({
      where: { id: page.id },
    });

    if (existing) {
      // Update page - handle fields directly to avoid Prisma type issues with null values
      await this.prisma.page.update({
        where: { id: page.id },
        data: {
          status: page.status,
          parentId: page.parentId,
          order: page.order,
          template: page.template,
          metadata: (page.metadata as object) ?? undefined,
          publishedAt: page.publishedAt,
          scheduledAt: page.scheduledAt,
        },
      });

      // Upsert locales
      for (const locale of locales) {
        await this.prisma.pageLocale.upsert({
          where: { pageId_locale: { pageId: page.id, locale: locale.locale } },
          update: {
            title: locale.title,
            slug: locale.slug,
            content: locale.content,
            excerpt: locale.excerpt,
          },
          create: pageMapper.localeToCreateInput(locale),
        });
      }
    } else {
      // Create page with locales
      await this.prisma.page.create({
        data: {
          ...pageMapper.toCreateInput(page),
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

  async delete(id: PageId): Promise<void> {
    await this.prisma.page.delete({
      where: { id },
    });
  }

  async deleteByDocumentId(documentId: DocumentId): Promise<void> {
    await this.prisma.page.deleteMany({
      where: { documentId },
    });
  }
}

export class PrismaPageVersionRepository implements PageVersionRepository {
  constructor(private prisma: PrismaClient) {}

  async findByDocumentId(documentId: DocumentId): Promise<PageVersion[]> {
    const records = await this.prisma.pageVersion.findMany({
      where: { documentId },
      orderBy: { version: 'desc' },
    });

    return records.map((r) => pageMapper.versionToDomain(r));
  }

  async findByVersion(
    documentId: DocumentId,
    version: number
  ): Promise<PageVersion | null> {
    const record = await this.prisma.pageVersion.findUnique({
      where: { documentId_version: { documentId, version } },
    });

    return record ? pageMapper.versionToDomain(record) : null;
  }

  async getLatestVersion(documentId: DocumentId): Promise<number> {
    const result = await this.prisma.pageVersion.aggregate({
      where: { documentId },
      _max: { version: true },
    });

    return result._max.version ?? 0;
  }

  async save(version: PageVersion): Promise<void> {
    await this.prisma.pageVersion.create({
      data: pageMapper.versionToCreateInput(version),
    });
  }
}
