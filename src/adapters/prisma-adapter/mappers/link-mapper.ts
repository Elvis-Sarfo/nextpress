import type {
  LinkCollection as PrismaLinkCollection,
  Link as PrismaLink,
} from '@/adapters/prisma-adapter/prisma-client';
import {
  LinkCollectionId,
  LinkId,
  PrincipalId,
  type LinkCollection,
  type Link,
  type LinkCollectionWithLinks,
} from '@/kernel';

type PrismaLinkCollectionWithLinks = PrismaLinkCollection & { links: PrismaLink[] };

/**
 * Maps between Prisma LinkCollection/Link and kernel types.
 */
export class LinkMapper {
  /**
   * Prisma collection → Kernel collection.
   */
  collectionToDomain(prisma: PrismaLinkCollection): LinkCollection {
    return {
      id: LinkCollectionId(prisma.id),
      name: prisma.name,
      displayName: prisma.displayName,
      description: prisma.description,
      createdAt: prisma.createdAt,
      updatedAt: prisma.updatedAt,
      createdBy: PrincipalId(prisma.createdBy),
    };
  }

  /**
   * Prisma link → Kernel link.
   */
  linkToDomain(prisma: PrismaLink): Link {
    return {
      id: LinkId(prisma.id),
      collectionId: LinkCollectionId(prisma.collectionId),
      order: prisma.order,
      title: prisma.title as Record<string, string>,
      description: prisma.description as Record<string, string> | null,
      url: prisma.url,
      imageUrl: prisma.imageUrl,
      target: prisma.target as '_self' | '_blank',
      createdAt: prisma.createdAt,
      updatedAt: prisma.updatedAt,
    };
  }

  /**
   * Prisma collection with links → Kernel collection with links.
   */
  collectionToDomainWithLinks(prisma: PrismaLinkCollectionWithLinks): LinkCollectionWithLinks {
    return {
      ...this.collectionToDomain(prisma),
      links: prisma.links
        .map((l) => this.linkToDomain(l))
        .sort((a, b) => a.order - b.order),
    };
  }

  /**
   * Kernel collection → Prisma create input.
   */
  collectionToCreateInput(domain: LinkCollection): {
    id: string;
    name: string;
    displayName: string;
    description?: string;
    createdBy: string;
  } {
    return {
      id: domain.id,
      name: domain.name,
      displayName: domain.displayName,
      description: domain.description ?? undefined,
      createdBy: domain.createdBy,
    };
  }

  /**
   * Kernel collection → Prisma update input.
   */
  collectionToUpdateInput(domain: Partial<LinkCollection>): {
    name?: string;
    displayName?: string;
    description?: string | null;
  } {
    const input: ReturnType<typeof this.collectionToUpdateInput> = {};

    if (domain.name !== undefined) input.name = domain.name;
    if (domain.displayName !== undefined) input.displayName = domain.displayName;
    if (domain.description !== undefined) input.description = domain.description;

    return input;
  }

  /**
   * Kernel link → Prisma link create input.
   */
  linkToCreateInput(domain: Link): {
    id: string;
    collectionId: string;
    order: number;
    title: object;
    description?: object;
    url: string;
    imageUrl?: string;
    target: string;
  } {
    return {
      id: domain.id,
      collectionId: domain.collectionId,
      order: domain.order,
      title: domain.title,
      description: domain.description ?? undefined,
      url: domain.url,
      imageUrl: domain.imageUrl ?? undefined,
      target: domain.target,
    };
  }

  /**
   * Kernel link → Prisma link update input.
   */
  linkToUpdateInput(domain: Partial<Link>): {
    order?: number;
    title?: object;
    description?: object | null;
    url?: string;
    imageUrl?: string | null;
    target?: string;
  } {
    const input: ReturnType<typeof this.linkToUpdateInput> = {};

    if (domain.order !== undefined) input.order = domain.order;
    if (domain.title !== undefined) input.title = domain.title;
    if (domain.description !== undefined) input.description = domain.description;
    if (domain.url !== undefined) input.url = domain.url;
    if (domain.imageUrl !== undefined) input.imageUrl = domain.imageUrl;
    if (domain.target !== undefined) input.target = domain.target;

    return input;
  }
}

export const linkMapper = new LinkMapper();
