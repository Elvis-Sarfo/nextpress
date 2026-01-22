import type { PrismaClient } from '@/adapters/prisma-adapter/prisma-client';
import {
  type MenuId,
  type MenuItemId,
  type Menu,
  type MenuItem,
  type MenuWithItems,
  type MenuRepository,
  type MenuItemRepository,
} from '@/kernel';
import { menuMapper } from '../mappers/menu-mapper.js';

export class PrismaMenuRepository implements MenuRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: MenuId): Promise<MenuWithItems | null> {
    const record = await this.prisma.menu.findUnique({
      where: { id },
      include: { items: true },
    });

    return record ? menuMapper.toDomainWithItems(record) : null;
  }

  async findByName(name: string): Promise<MenuWithItems | null> {
    const record = await this.prisma.menu.findUnique({
      where: { name },
      include: { items: true },
    });

    return record ? menuMapper.toDomainWithItems(record) : null;
  }

  async findByLocation(location: string): Promise<MenuWithItems[]> {
    const records = await this.prisma.menu.findMany({
      where: { location },
      include: { items: true },
    });

    return records.map((r) => menuMapper.toDomainWithItems(r));
  }

  async findAll(): Promise<Menu[]> {
    const records = await this.prisma.menu.findMany({
      orderBy: { name: 'asc' },
    });

    return records.map((r) => menuMapper.toDomain(r));
  }

  async save(menu: Menu): Promise<void> {
    const existing = await this.prisma.menu.findUnique({
      where: { id: menu.id },
    });

    if (existing) {
      await this.prisma.menu.update({
        where: { id: menu.id },
        data: menuMapper.toUpdateInput(menu),
      });
    } else {
      await this.prisma.menu.create({
        data: menuMapper.toCreateInput(menu),
      });
    }
  }

  async delete(id: MenuId): Promise<void> {
    await this.prisma.menu.delete({
      where: { id },
    });
  }
}

export class PrismaMenuItemRepository implements MenuItemRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: MenuItemId): Promise<MenuItem | null> {
    const record = await this.prisma.menuItem.findUnique({
      where: { id },
    });

    return record ? menuMapper.itemToDomain(record) : null;
  }

  async findByMenu(menuId: MenuId): Promise<MenuItem[]> {
    const records = await this.prisma.menuItem.findMany({
      where: { menuId },
      orderBy: { order: 'asc' },
    });

    return records.map((r) => menuMapper.itemToDomain(r));
  }

  async save(item: MenuItem): Promise<void> {
    const existing = await this.prisma.menuItem.findUnique({
      where: { id: item.id },
    });

    if (existing) {
      await this.prisma.menuItem.update({
        where: { id: item.id },
        data: menuMapper.itemToUpdateInput(item),
      });
    } else {
      await this.prisma.menuItem.create({
        data: menuMapper.itemToCreateInput(item),
      });
    }
  }

  async delete(id: MenuItemId): Promise<void> {
    await this.prisma.menuItem.delete({
      where: { id },
    });
  }

  async deleteByMenu(menuId: MenuId): Promise<void> {
    await this.prisma.menuItem.deleteMany({
      where: { menuId },
    });
  }

  async reorder(
    _menuId: MenuId,
    items: { id: MenuItemId; order: number }[]
  ): Promise<void> {
    await this.prisma.$transaction(
      items.map(({ id, order }) =>
        this.prisma.menuItem.update({
          where: { id },
          data: { order },
        })
      )
    );
  }
}
