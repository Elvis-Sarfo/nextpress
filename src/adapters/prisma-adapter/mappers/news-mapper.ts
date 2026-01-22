import type {
  News as PrismaNews,
  NewsLocale as PrismaNewsLocale,
  NewsVersion as PrismaNewsVersion,
} from '@/adapters/prisma-adapter/prisma-client';
import {
  NewsId,
  DocumentId,
  PrincipalId,
  Locale,
  type News,
  type NewsLocale,
  type NewsVersion,
  type NewsWithLocales,
  type ContentStatus,
} from '@/kernel';

type PrismaNewsWithLocales = PrismaNews & { locales: PrismaNewsLocale[] };

/**
 * Maps between Prisma News and kernel News.
 */
export class NewsMapper {
  /**
   * Prisma model → Kernel domain object.
   */
  toDomain(prisma: PrismaNews): News {
    return {
      id: NewsId(prisma.id),
      documentId: DocumentId(prisma.documentId),
      status: prisma.status as ContentStatus,
      category: prisma.category,
      featuredImage: prisma.featuredImage,
      metadata: prisma.metadata as Record<string, unknown> | null,
      publishedAt: prisma.publishedAt,
      scheduledAt: prisma.scheduledAt,
      createdAt: prisma.createdAt,
      updatedAt: prisma.updatedAt,
      createdBy: PrincipalId(prisma.createdBy),
    };
  }

  /**
   * Prisma model with locales → Kernel domain object with locales.
   */
  toDomainWithLocales(prisma: PrismaNewsWithLocales): NewsWithLocales {
    return {
      ...this.toDomain(prisma),
      locales: prisma.locales.map((l) => this.localeToDomain(l)),
    };
  }

  /**
   * Prisma locale → Kernel locale.
   */
  localeToDomain(prisma: PrismaNewsLocale): NewsLocale {
    return {
      id: prisma.id,
      newsId: NewsId(prisma.newsId),
      locale: Locale(prisma.locale),
      title: prisma.title,
      slug: prisma.slug,
      content: prisma.content,
      excerpt: prisma.excerpt,
    };
  }

  /**
   * Prisma version → Kernel version.
   */
  versionToDomain(prisma: PrismaNewsVersion): NewsVersion {
    return {
      id: prisma.id,
      documentId: DocumentId(prisma.documentId),
      version: prisma.version,
      data: prisma.data as unknown as NewsVersion['data'],
      createdAt: prisma.createdAt,
      createdBy: PrincipalId(prisma.createdBy),
    };
  }

  /**
   * Kernel domain object → Prisma create input.
   */
  toCreateInput(domain: News): {
    id: string;
    documentId: string;
    status: string;
    category?: string;
    featuredImage?: string;
    metadata?: object;
    publishedAt?: Date;
    scheduledAt?: Date;
    createdBy: string;
  } {
    return {
      id: domain.id,
      documentId: domain.documentId,
      status: domain.status,
      category: domain.category ?? undefined,
      featuredImage: domain.featuredImage ?? undefined,
      metadata: domain.metadata ?? undefined,
      publishedAt: domain.publishedAt ?? undefined,
      scheduledAt: domain.scheduledAt ?? undefined,
      createdBy: domain.createdBy,
    };
  }

  /**
   * Kernel domain object → Prisma update input.
   */
  toUpdateInput(domain: Partial<News>): {
    status?: string;
    category?: string | null;
    featuredImage?: string | null;
    metadata?: object | null;
    publishedAt?: Date | null;
    scheduledAt?: Date | null;
  } {
    const input: ReturnType<typeof this.toUpdateInput> = {};

    if (domain.status !== undefined) input.status = domain.status;
    if (domain.category !== undefined) input.category = domain.category;
    if (domain.featuredImage !== undefined) input.featuredImage = domain.featuredImage;
    if (domain.metadata !== undefined) input.metadata = domain.metadata;
    if (domain.publishedAt !== undefined) input.publishedAt = domain.publishedAt;
    if (domain.scheduledAt !== undefined) input.scheduledAt = domain.scheduledAt;

    return input;
  }

  /**
   * Kernel locale → Prisma locale create input.
   */
  localeToCreateInput(domain: NewsLocale): {
    id: string;
    newsId: string;
    locale: string;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
  } {
    return {
      id: domain.id,
      newsId: domain.newsId,
      locale: domain.locale,
      title: domain.title,
      slug: domain.slug,
      content: domain.content,
      excerpt: domain.excerpt ?? undefined,
    };
  }

  /**
   * Kernel version → Prisma version create input.
   */
  versionToCreateInput(domain: NewsVersion): {
    id: string;
    documentId: string;
    version: number;
    data: object;
    createdBy: string;
  } {
    return {
      id: domain.id,
      documentId: domain.documentId,
      version: domain.version,
      data: domain.data as object,
      createdBy: domain.createdBy,
    };
  }
}

export const newsMapper = new NewsMapper();
