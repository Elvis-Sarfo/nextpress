import type { PrismaClient, SlugRedirect as PrismaRedirect } from '../../prisma-client/index.js';
import {
  type ContentTypeId,
  type ContentEntryId,
  type Locale,
  type SlugRedirect,
  type SlugRedirectRepository,
} from '@cms/kernel';
import { redirectMapper } from '../mappers/redirect-mapper.js';

export class PrismaSlugRedirectRepository implements SlugRedirectRepository {
  constructor(private prisma: PrismaClient) {}

  async findBySlug(
    typeId: ContentTypeId,
    locale: Locale,
    slug: string
  ): Promise<SlugRedirect | null> {
    const record = await this.prisma.slugRedirect.findUnique({
      where: {
        contentTypeId_locale_fromSlug: {
          contentTypeId: typeId,
          locale,
          fromSlug: slug,
        },
      },
    });

    return record ? redirectMapper.toDomain(record) : null;
  }

  async findByEntry(entryId: ContentEntryId): Promise<SlugRedirect[]> {
    const records = await this.prisma.slugRedirect.findMany({
      where: { toEntryId: entryId },
      orderBy: { createdAt: 'desc' },
    });

    return records.map((r: PrismaRedirect) => redirectMapper.toDomain(r));
  }

  async save(redirect: SlugRedirect): Promise<void> {
    await this.prisma.slugRedirect.upsert({
      where: {
        contentTypeId_locale_fromSlug: {
          contentTypeId: redirect.contentTypeId,
          locale: redirect.locale,
          fromSlug: redirect.fromSlug,
        },
      },
      create: redirectMapper.toCreateInput(redirect),
      update: { toEntryId: redirect.toEntryId },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.slugRedirect.delete({
      where: { id },
    });
  }
}
