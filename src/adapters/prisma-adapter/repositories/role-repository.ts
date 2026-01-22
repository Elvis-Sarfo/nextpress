import type { PrismaClient, Role as PrismaRole, UserRole } from '@/adapters/prisma-adapter/prisma-client';
import {
  type RoleId,
  type PrincipalId,
  type Role,
  type RoleRepository,
} from '@/kernel';
import { roleMapper } from '../mappers/role-mapper.js';

export class PrismaRoleRepository implements RoleRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: RoleId): Promise<Role | null> {
    const record = await this.prisma.role.findUnique({
      where: { id },
    });

    return record ? roleMapper.toDomain(record) : null;
  }

  async findByName(name: string): Promise<Role | null> {
    const record = await this.prisma.role.findUnique({
      where: { name },
    });

    return record ? roleMapper.toDomain(record) : null;
  }

  async findAll(): Promise<Role[]> {
    const records = await this.prisma.role.findMany({
      orderBy: { name: 'asc' },
    });

    return records.map((r: PrismaRole) => roleMapper.toDomain(r));
  }

  async findByUser(userId: PrincipalId): Promise<Role[]> {
    const userRoles = await this.prisma.userRole.findMany({
      where: { userId },
      include: { role: true },
    });

    return userRoles.map((ur: UserRole & { role: PrismaRole }) => roleMapper.toDomain(ur.role));
  }

  async save(role: Role): Promise<void> {
    const existing = await this.prisma.role.findUnique({
      where: { id: role.id },
    });

    if (existing) {
      await this.prisma.role.update({
        where: { id: role.id },
        data: roleMapper.toUpdateInput(role),
      });
    } else {
      await this.prisma.role.create({
        data: roleMapper.toCreateInput(role),
      });
    }
  }

  async delete(id: RoleId): Promise<void> {
    await this.prisma.role.delete({
      where: { id },
    });
  }

  async assignToUser(userId: PrincipalId, roleId: RoleId): Promise<void> {
    await this.prisma.userRole.upsert({
      where: { userId_roleId: { userId, roleId } },
      create: {
        userId,
        roleId,
        assignedBy: 'system',
      },
      update: {},
    });
  }

  async removeFromUser(userId: PrincipalId, roleId: RoleId): Promise<void> {
    await this.prisma.userRole.deleteMany({
      where: { userId, roleId },
    });
  }
}
