/**
 * RBAC Service — loads roles and permissions from the database.
 *
 * Replaces the old static ROLE_MAP approach in cms.ts with a fully
 * database-driven principal lookup. Results are cached per user ID
 * with a 5-minute TTL to avoid a DB hit on every server render.
 *
 * Cache invalidation:
 *   Call invalidatePrincipalCache(userId) after updating a user's roles
 *   or after updating role permissions, so the next request picks up
 *   the fresh data.
 */

import { prisma } from '@/adapters/prisma-adapter';
import { PrincipalId, RoleId } from '@/core/core/types';
import type { Principal, Role, Permission, PermissionScope, ResourceType, Action } from '@/core/permissions/types';

// ============================================================================
// IN-MEMORY CACHE
// ============================================================================

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  principal: Principal;
  expiresAt: number;
}

const principalCache = new Map<string, CacheEntry>();

export function invalidatePrincipalCache(userId: string): void {
  principalCache.delete(userId);
}

export function clearPrincipalCache(): void {
  principalCache.clear();
}

// ============================================================================
// DB → KERNEL MAPPERS
// ============================================================================

function mapScope(scope: string | null | undefined): PermissionScope {
  if (scope === 'own') return { type: 'own' };
  return { type: 'all' };
}

function mapPermission(dbPerm: {
  resource: string;
  action: string;
  scope: string | null;
}): Permission {
  return {
    resource: dbPerm.resource as ResourceType,
    action: dbPerm.action as Action,
    scope: mapScope(dbPerm.scope),
  };
}

function mapRole(dbRole: {
  id: string;
  name: string;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
  permissions: Array<{ resource: string; action: string; scope: string | null }>;
}): Role {
  return {
    id: RoleId(dbRole.id),
    name: dbRole.name,
    displayName: dbRole.displayName,
    permissions: dbRole.permissions.map(mapPermission),
    createdAt: dbRole.createdAt,
    updatedAt: dbRole.updatedAt,
  };
}

// ============================================================================
// PRINCIPAL LOADER
// ============================================================================

/**
 * Load a Principal from the database, including all roles and their permissions.
 * Returns null if the user does not exist or has no active record.
 *
 * Results are cached for CACHE_TTL_MS. Call invalidatePrincipalCache(userId)
 * when a user's roles change.
 */
export async function loadPrincipalFromDB(userId: string): Promise<Principal | null> {
  // Return from cache if still valid
  const cached = principalCache.get(userId);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.principal;
  }

  const user = await prisma.users.findUnique({
    where: { id: userId },
    include: {
      roles: {
        include: {
          permissions: true,
        },
      },
    },
  });

  if (!user) return null;

  const principal: Principal = {
    id: PrincipalId(user.id),
    roles: user.roles.map(mapRole),
  };

  // Store in cache
  principalCache.set(userId, {
    principal,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });

  return principal;
}

/**
 * Get the display name of the user's primary (first) role, or 'user' as fallback.
 * Used to populate session.user.role for backward-compat access checks.
 */
export async function getPrimaryRoleName(userId: string): Promise<string> {
  const user = await prisma.users.findUnique({
    where: { id: userId },
    include: {
      roles: {
        orderBy: { name: 'asc' },
        take: 1,
      },
    },
  });

  if (!user || user.roles.length === 0) return 'user';

  // Give 'admin' role priority if the user holds it
  const allRoles = await prisma.users.findUnique({
    where: { id: userId },
    include: { roles: { select: { name: true } } },
  });

  const roleNames = allRoles?.roles.map((r) => r.name) ?? [];
  if (roleNames.includes('admin')) return 'admin';
  if (roleNames.includes('editor')) return 'editor';
  if (roleNames.includes('author')) return 'author';
  if (roleNames.includes('viewer')) return 'viewer';
  return roleNames[0] ?? 'user';
}
