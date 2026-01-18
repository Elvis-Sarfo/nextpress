import type {
  Page as PrismaPage,
  PageLocale as PrismaPageLocale,
  PageVersion as PrismaPageVersion,
} from '@prisma/client';
import {
  PageId,
  DocumentId,
  PrincipalId,
  Locale,
  type Page,
  type PageLocale,
  type PageVersion,
  type PageWithLocales,
  type ContentStatus,
} from '@cms/kernel';

type PrismaPageWithLocales = PrismaPage & { locales: PrismaPageLocale[] };

/**
 * Maps between Prisma Page and kernel Page.
 */
export class PageMapper {
  /**
   * Prisma model → Kernel domain object.
   */
  toDomain(prisma: PrismaPage): Page {
    return {
      id: PageId(prisma.id),
      documentId: DocumentId(prisma.documentId),
      status: prisma.status as ContentStatus,
      parentId: prisma.parentId ? PageId(prisma.parentId) : null,
      order: prisma.order,
      template: prisma.template,
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
  toDomainWithLocales(prisma: PrismaPageWithLocales): PageWithLocales {
    return {
      ...this.toDomain(prisma),
      locales: prisma.locales.map((l) => this.localeToDomain(l)),
    };
  }

  /**
   * Prisma locale → Kernel locale.
   */
  localeToDomain(prisma: PrismaPageLocale): PageLocale {
    return {
      id: prisma.id,
      pageId: PageId(prisma.pageId),
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
  versionToDomain(prisma: PrismaPageVersion): PageVersion {
    return {
      id: prisma.id,
      documentId: DocumentId(prisma.documentId),
      version: prisma.version,
      data: prisma.data as unknown as PageVersion['data'],
      createdAt: prisma.createdAt,
      createdBy: PrincipalId(prisma.createdBy),
    };
  }

  /**
   * Kernel domain object → Prisma create input.
   */
  toCreateInput(domain: Page): {
    id: string;
    documentId: string;
    status: string;
    parentId?: string;
    order: number;
    template?: string;
    metadata?: object;
    publishedAt?: Date;
    scheduledAt?: Date;
    createdBy: string;
  } {
    return {
      id: domain.id,
      documentId: domain.documentId,
      status: domain.status,
      parentId: domain.parentId ?? undefined,
      order: domain.order,
      template: domain.template ?? undefined,
      metadata: domain.metadata ?? undefined,
      publishedAt: domain.publishedAt ?? undefined,
      scheduledAt: domain.scheduledAt ?? undefined,
      createdBy: domain.createdBy,
    };
  }

  /**
   * Kernel domain object → Prisma update input.
   */
  toUpdateInput(domain: Partial<Page>): {
    status?: string;
    parentId?: string | null;
    order?: number;
    template?: string | null;
    metadata?: object | null;
    publishedAt?: Date | null;
    scheduledAt?: Date | null;
  } {
    const input: ReturnType<typeof this.toUpdateInput> = {};

    if (domain.status !== undefined) input.status = domain.status;
    if (domain.parentId !== undefined) input.parentId = domain.parentId;
    if (domain.order !== undefined) input.order = domain.order;
    if (domain.template !== undefined) input.template = domain.template;
    if (domain.metadata !== undefined) input.metadata = domain.metadata;
    if (domain.publishedAt !== undefined) input.publishedAt = domain.publishedAt;
    if (domain.scheduledAt !== undefined) input.scheduledAt = domain.scheduledAt;

    return input;
  }

  /**
   * Kernel locale → Prisma locale create input.
   */
  localeToCreateInput(domain: PageLocale): {
    id: string;
    pageId: string;
    locale: string;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
  } {
    return {
      id: domain.id,
      pageId: domain.pageId,
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
  versionToCreateInput(domain: PageVersion): {
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

export const pageMapper = new PageMapper();
