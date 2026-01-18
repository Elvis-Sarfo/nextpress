import type { SlugRedirect as PrismaRedirect } from '../../prisma-client/index.js';
import {
  ContentTypeId,
  ContentEntryId,
  Locale,
  type SlugRedirect,
} from '@cms/kernel';

/**
 * Maps between Prisma SlugRedirect and kernel SlugRedirect.
 */
export class RedirectMapper {
  /**
   * Prisma model → Kernel domain object.
   */
  toDomain(prisma: PrismaRedirect): SlugRedirect {
    return {
      id: prisma.id,
      contentTypeId: ContentTypeId(prisma.contentTypeId),
      locale: Locale(prisma.locale),
      fromSlug: prisma.fromSlug,
      toEntryId: ContentEntryId(prisma.toEntryId),
      createdAt: prisma.createdAt,
    };
  }

  /**
   * Kernel domain object → Prisma create input.
   */
  toCreateInput(domain: SlugRedirect): {
    id: string;
    contentTypeId: string;
    locale: string;
    fromSlug: string;
    toEntryId: string;
  } {
    return {
      id: domain.id,
      contentTypeId: domain.contentTypeId,
      locale: domain.locale,
      fromSlug: domain.fromSlug,
      toEntryId: domain.toEntryId,
    };
  }
}

export const redirectMapper = new RedirectMapper();
