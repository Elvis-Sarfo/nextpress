import type {
  MenuId,
  MenuItemId,
  LinkCollectionId,
  LinkId,
  PageId,
  PostId,
  NewsId,
  PrincipalId,
  Locale,
} from '../core/types.js';

// ============================================================================
// MENU
// ============================================================================

export interface Menu {
  id: MenuId;
  name: string;
  displayName: string;
  location: string | null; // header, footer, sidebar
  createdAt: Date;
  updatedAt: Date;
  createdBy: PrincipalId;
}

// ============================================================================
// MENU ITEM
// ============================================================================

export interface MenuItem {
  id: MenuItemId;
  menuId: MenuId;
  parentId: MenuItemId | null;
  order: number;
  label: Record<string, string>; // { "en": "About", "fr": "À propos" }
  url: string | null; // External URL
  pageId: PageId | null; // Link to Page
  postId: PostId | null; // Link to Post
  newsId: NewsId | null; // Link to News
  target: '_self' | '_blank';
  cssClass: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// MENU WITH ITEMS (full menu tree)
// ============================================================================

export interface MenuItemWithChildren extends MenuItem {
  children: MenuItemWithChildren[];
}

export interface MenuWithItems extends Menu {
  items: MenuItemWithChildren[];
}

// ============================================================================
// LINK COLLECTION
// ============================================================================

export interface LinkCollection {
  id: LinkCollectionId;
  name: string;
  displayName: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: PrincipalId;
}

// ============================================================================
// LINK
// ============================================================================

export interface Link {
  id: LinkId;
  collectionId: LinkCollectionId;
  order: number;
  title: Record<string, string>; // Localized
  description: Record<string, string> | null; // Localized
  url: string;
  imageUrl: string | null;
  target: '_self' | '_blank';
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// LINK COLLECTION WITH LINKS
// ============================================================================

export interface LinkCollectionWithLinks extends LinkCollection {
  links: Link[];
}

// ============================================================================
// REPOSITORY INTERFACES
// ============================================================================

export interface MenuRepository {
  findById(id: MenuId): Promise<MenuWithItems | null>;
  findByName(name: string): Promise<MenuWithItems | null>;
  findByLocation(location: string): Promise<MenuWithItems[]>;
  findAll(): Promise<Menu[]>;
  save(menu: Menu): Promise<void>;
  delete(id: MenuId): Promise<void>;
}

export interface MenuItemRepository {
  findById(id: MenuItemId): Promise<MenuItem | null>;
  findByMenu(menuId: MenuId): Promise<MenuItem[]>;
  save(item: MenuItem): Promise<void>;
  delete(id: MenuItemId): Promise<void>;
  deleteByMenu(menuId: MenuId): Promise<void>;
  reorder(menuId: MenuId, items: { id: MenuItemId; order: number }[]): Promise<void>;
}

export interface LinkCollectionRepository {
  findById(id: LinkCollectionId): Promise<LinkCollectionWithLinks | null>;
  findByName(name: string): Promise<LinkCollectionWithLinks | null>;
  findAll(): Promise<LinkCollection[]>;
  save(collection: LinkCollection): Promise<void>;
  delete(id: LinkCollectionId): Promise<void>;
}

export interface LinkRepository {
  findById(id: LinkId): Promise<Link | null>;
  findByCollection(collectionId: LinkCollectionId): Promise<Link[]>;
  save(link: Link): Promise<void>;
  delete(id: LinkId): Promise<void>;
  deleteByCollection(collectionId: LinkCollectionId): Promise<void>;
  reorder(collectionId: LinkCollectionId, items: { id: LinkId; order: number }[]): Promise<void>;
}

// ============================================================================
// HELPER: Get localized label
// ============================================================================

export function getLocalizedLabel(
  labels: Record<string, string>,
  locale: Locale,
  fallbackLocale: Locale = 'en' as Locale
): string {
  return labels[locale as string] ?? labels[fallbackLocale as string] ?? Object.values(labels)[0] ?? '';
}
