import type {
  Menu as PrismaMenu,
  MenuItem as PrismaMenuItem,
} from '@prisma/client';
import {
  MenuId,
  MenuItemId,
  PageId,
  PostId,
  NewsId,
  PrincipalId,
  type Menu,
  type MenuItem,
  type MenuWithItems,
  type MenuItemWithChildren,
} from '@cms/kernel';

type PrismaMenuWithItems = PrismaMenu & { items: PrismaMenuItem[] };

/**
 * Maps between Prisma Menu and kernel Menu.
 */
export class MenuMapper {
  /**
   * Prisma model → Kernel domain object.
   */
  toDomain(prisma: PrismaMenu): Menu {
    return {
      id: MenuId(prisma.id),
      name: prisma.name,
      displayName: prisma.displayName,
      location: prisma.location,
      createdAt: prisma.createdAt,
      updatedAt: prisma.updatedAt,
      createdBy: PrincipalId(prisma.createdBy),
    };
  }

  /**
   * Prisma menu item → Kernel menu item.
   */
  itemToDomain(prisma: PrismaMenuItem): MenuItem {
    return {
      id: MenuItemId(prisma.id),
      menuId: MenuId(prisma.menuId),
      parentId: prisma.parentId ? MenuItemId(prisma.parentId) : null,
      order: prisma.order,
      label: prisma.label as Record<string, string>,
      url: prisma.url,
      pageId: prisma.pageId ? PageId(prisma.pageId) : null,
      postId: prisma.postId ? PostId(prisma.postId) : null,
      newsId: prisma.newsId ? NewsId(prisma.newsId) : null,
      target: prisma.target as '_self' | '_blank',
      cssClass: prisma.cssClass,
      createdAt: prisma.createdAt,
      updatedAt: prisma.updatedAt,
    };
  }

  /**
   * Prisma model with items → Kernel domain object with hierarchical items.
   */
  toDomainWithItems(prisma: PrismaMenuWithItems): MenuWithItems {
    const items = prisma.items.map((i) => this.itemToDomain(i));
    return {
      ...this.toDomain(prisma),
      items: this.buildItemTree(items),
    };
  }

  /**
   * Build hierarchical tree from flat items list.
   */
  private buildItemTree(items: MenuItem[]): MenuItemWithChildren[] {
    const itemMap = new Map<string, MenuItemWithChildren>();
    const roots: MenuItemWithChildren[] = [];

    // First pass: create all nodes
    for (const item of items) {
      itemMap.set(item.id, { ...item, children: [] });
    }

    // Second pass: build tree
    for (const item of items) {
      const node = itemMap.get(item.id)!;
      if (item.parentId) {
        const parent = itemMap.get(item.parentId as string);
        if (parent) {
          parent.children.push(node);
        } else {
          roots.push(node);
        }
      } else {
        roots.push(node);
      }
    }

    // Sort children by order
    const sortChildren = (items: MenuItemWithChildren[]) => {
      items.sort((a, b) => a.order - b.order);
      for (const item of items) {
        if (item.children.length > 0) {
          sortChildren(item.children);
        }
      }
    };
    sortChildren(roots);

    return roots;
  }

  /**
   * Kernel domain object → Prisma create input.
   */
  toCreateInput(domain: Menu): {
    id: string;
    name: string;
    displayName: string;
    location?: string;
    createdBy: string;
  } {
    return {
      id: domain.id,
      name: domain.name,
      displayName: domain.displayName,
      location: domain.location ?? undefined,
      createdBy: domain.createdBy,
    };
  }

  /**
   * Kernel domain object → Prisma update input.
   */
  toUpdateInput(domain: Partial<Menu>): {
    name?: string;
    displayName?: string;
    location?: string | null;
  } {
    const input: ReturnType<typeof this.toUpdateInput> = {};

    if (domain.name !== undefined) input.name = domain.name;
    if (domain.displayName !== undefined) input.displayName = domain.displayName;
    if (domain.location !== undefined) input.location = domain.location;

    return input;
  }

  /**
   * Kernel menu item → Prisma menu item create input.
   */
  itemToCreateInput(domain: MenuItem): {
    id: string;
    menuId: string;
    parentId?: string;
    order: number;
    label: object;
    url?: string;
    pageId?: string;
    postId?: string;
    newsId?: string;
    target: string;
    cssClass?: string;
  } {
    return {
      id: domain.id,
      menuId: domain.menuId,
      parentId: domain.parentId ?? undefined,
      order: domain.order,
      label: domain.label,
      url: domain.url ?? undefined,
      pageId: domain.pageId ?? undefined,
      postId: domain.postId ?? undefined,
      newsId: domain.newsId ?? undefined,
      target: domain.target,
      cssClass: domain.cssClass ?? undefined,
    };
  }

  /**
   * Kernel menu item → Prisma menu item update input.
   */
  itemToUpdateInput(domain: Partial<MenuItem>): {
    parentId?: string | null;
    order?: number;
    label?: object;
    url?: string | null;
    pageId?: string | null;
    postId?: string | null;
    newsId?: string | null;
    target?: string;
    cssClass?: string | null;
  } {
    const input: ReturnType<typeof this.itemToUpdateInput> = {};

    if (domain.parentId !== undefined) input.parentId = domain.parentId;
    if (domain.order !== undefined) input.order = domain.order;
    if (domain.label !== undefined) input.label = domain.label;
    if (domain.url !== undefined) input.url = domain.url;
    if (domain.pageId !== undefined) input.pageId = domain.pageId;
    if (domain.postId !== undefined) input.postId = domain.postId;
    if (domain.newsId !== undefined) input.newsId = domain.newsId;
    if (domain.target !== undefined) input.target = domain.target;
    if (domain.cssClass !== undefined) input.cssClass = domain.cssClass;

    return input;
  }
}

export const menuMapper = new MenuMapper();
