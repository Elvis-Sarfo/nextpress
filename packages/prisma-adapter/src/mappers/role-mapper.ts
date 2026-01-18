import type { Role as PrismaRole } from '../../prisma-client/index.js';
import {
  RoleId,
  type Role,
  type Permission,
} from '@cms/kernel';

/**
 * Maps between Prisma Role and kernel Role.
 */
export class RoleMapper {
  /**
   * Prisma model → Kernel domain object.
   */
  toDomain(prisma: PrismaRole): Role {
    return {
      id: RoleId(prisma.id),
      name: prisma.name,
      displayName: prisma.displayName,
      permissions: prisma.permissions as unknown as Permission[],
      createdAt: prisma.createdAt,
      updatedAt: prisma.updatedAt,
    };
  }

  /**
   * Kernel domain object → Prisma create input.
   */
  toCreateInput(domain: Role): {
    id: string;
    name: string;
    displayName: string;
    permissions: object;
  } {
    return {
      id: domain.id,
      name: domain.name,
      displayName: domain.displayName,
      permissions: domain.permissions as object,
    };
  }

  /**
   * Kernel domain object → Prisma update input.
   */
  toUpdateInput(domain: Partial<Role>): {
    name?: string;
    displayName?: string;
    permissions?: object;
  } {
    const input: ReturnType<typeof this.toUpdateInput> = {};

    if (domain.name !== undefined) input.name = domain.name;
    if (domain.displayName !== undefined) input.displayName = domain.displayName;
    if (domain.permissions !== undefined) input.permissions = domain.permissions as object;

    return input;
  }
}

export const roleMapper = new RoleMapper();
