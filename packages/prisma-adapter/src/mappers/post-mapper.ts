import type {
  Post as PrismaPost,
  PostLocale as PrismaPostLocale,
  PostVersion as PrismaPostVersion,
} from '@prisma/client';
import {
  PostId,
  DocumentId,
  PrincipalId,
  Locale,
  type Post,
  type PostLocale,
  type PostVersion,
  type PostWithLocales,
  type ContentStatus,
} from '@cms/kernel';

type PrismaPostWithLocales = PrismaPost & { locales: PrismaPostLocale[] };

/**
 * Maps between Prisma Post and kernel Post.
 */
export class PostMapper {
  /**
   * Prisma model → Kernel domain object.
   */
  toDomain(prisma: PrismaPost): Post {
    return {
      id: PostId(prisma.id),
      documentId: DocumentId(prisma.documentId),
      status: prisma.status as ContentStatus,
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
  toDomainWithLocales(prisma: PrismaPostWithLocales): PostWithLocales {
    return {
      ...this.toDomain(prisma),
      locales: prisma.locales.map((l) => this.localeToDomain(l)),
    };
  }

  /**
   * Prisma locale → Kernel locale.
   */
  localeToDomain(prisma: PrismaPostLocale): PostLocale {
    return {
      id: prisma.id,
      postId: PostId(prisma.postId),
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
  versionToDomain(prisma: PrismaPostVersion): PostVersion {
    return {
      id: prisma.id,
      documentId: DocumentId(prisma.documentId),
      version: prisma.version,
      data: prisma.data as unknown as PostVersion['data'],
      createdAt: prisma.createdAt,
      createdBy: PrincipalId(prisma.createdBy),
    };
  }

  /**
   * Kernel domain object → Prisma create input.
   */
  toCreateInput(domain: Post): {
    id: string;
    documentId: string;
    status: string;
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
  toUpdateInput(domain: Partial<Post>): {
    status?: string;
    featuredImage?: string | null;
    metadata?: object | null;
    publishedAt?: Date | null;
    scheduledAt?: Date | null;
  } {
    const input: ReturnType<typeof this.toUpdateInput> = {};

    if (domain.status !== undefined) input.status = domain.status;
    if (domain.featuredImage !== undefined) input.featuredImage = domain.featuredImage;
    if (domain.metadata !== undefined) input.metadata = domain.metadata;
    if (domain.publishedAt !== undefined) input.publishedAt = domain.publishedAt;
    if (domain.scheduledAt !== undefined) input.scheduledAt = domain.scheduledAt;

    return input;
  }

  /**
   * Kernel locale → Prisma locale create input.
   */
  localeToCreateInput(domain: PostLocale): {
    id: string;
    postId: string;
    locale: string;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
  } {
    return {
      id: domain.id,
      postId: domain.postId,
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
  versionToCreateInput(domain: PostVersion): {
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

export const postMapper = new PostMapper();
