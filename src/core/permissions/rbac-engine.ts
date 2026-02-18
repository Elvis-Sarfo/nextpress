import { Result, Ok, Err, DomainError } from '../core/types';
import type {
  Principal, Permission, Action, ResourceType, PermissionContext
} from './types';

/**
 * Role-Based Access Control engine with performance optimizations.
 * 
 * Optimizations:
 * - Caches computed permissions per principal to avoid repeated aggregation
 * - Uses early returns to minimize unnecessary iterations
 * - Pre-computes permission lookups for faster matching
 */
export class RBACEngine {
  // Cache for effective permissions per principal ID
  private permissionCache = new Map<string, WeakRef<Permission[]>>();
  // Cache timestamp for cache invalidation
  private cacheTimestamps = new Map<string, number>();
  // Cache TTL in milliseconds (5 minutes)
  private readonly CACHE_TTL = 5 * 60 * 1000;

  /**
   * Check if principal can perform action on resource.
   * Uses cached permissions for performance.
   */
  can(
    principal: Principal,
    action: Action,
    resource: ResourceType,
    context?: PermissionContext
  ): boolean {
    // Early return for admin role (always allowed)
    if (this.hasAdminRole(principal)) {
      return true;
    }

    const permissions = this.getEffectivePermissions(principal);

    for (const permission of permissions) {
      if (this.matchesPermission(permission, action, resource, context, principal)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Assert permission, returning Result.
   */
  assertCan(
    principal: Principal,
    action: Action,
    resource: ResourceType,
    context?: PermissionContext
  ): Result<void> {
    if (this.can(principal, action, resource, context)) {
      return Ok(undefined);
    }
    return Err(DomainError.permissionDenied(action, resource));
  }

  /**
   * Get all permissions for a principal (from all roles).
   * Uses caching to avoid repeated aggregation.
   */
  getEffectivePermissions(principal: Principal): Permission[] {
    const cacheKey = this.getCacheKey(principal);
    const now = Date.now();

    // Check cache validity
    const cachedTime = this.cacheTimestamps.get(cacheKey);
    if (cachedTime && (now - cachedTime) < this.CACHE_TTL) {
      const cached = this.permissionCache.get(cacheKey)?.deref();
      if (cached) {
        return cached;
      }
    }

    // Compute permissions
    const permissions: Permission[] = [];

    for (const role of principal.roles) {
      permissions.push(...role.permissions);
    }

    // Cache the result
    this.permissionCache.set(cacheKey, new WeakRef(permissions));
    this.cacheTimestamps.set(cacheKey, now);

    return permissions;
  }

  /**
   * Get all allowed actions for a resource type.
   */
  getAllowedActions(
    principal: Principal,
    resource: ResourceType,
    context?: PermissionContext
  ): Action[] {
    // Early return for admin role
    if (this.hasAdminRole(principal)) {
      return this.getAllActionsForResource(resource);
    }

    const permissions = this.getEffectivePermissions(principal);
    const allowed = new Set<Action>();

    for (const permission of permissions) {
      if (permission.resource === resource) {
        if (this.matchesScope(permission, context, principal)) {
          allowed.add(permission.action);
        }
      }
    }

    return Array.from(allowed);
  }

  /**
   * Clear the permission cache (useful for testing or after role changes).
   */
  clearCache(): void {
    this.permissionCache.clear();
    this.cacheTimestamps.clear();
  }

  /**
   * Invalidate cache for a specific principal.
   */
  invalidateCache(principal: Principal): void {
    const cacheKey = this.getCacheKey(principal);
    this.permissionCache.delete(cacheKey);
    this.cacheTimestamps.delete(cacheKey);
  }

  // Private helper methods

  /**
   * Check if principal has admin role (fast path).
   */
  private hasAdminRole(principal: Principal): boolean {
    return principal.roles.some(role => role.name === 'admin');
  }

  /**
   * Get all possible actions for a resource type.
   */
  private getAllActionsForResource(resource: ResourceType): Action[] {
    switch (resource) {
      case 'content':
        return ['create', 'read', 'update', 'delete', 'publish', 'unpublish', 'schedule', 'manage'];
      case 'schema':
        return ['create', 'read', 'update', 'delete', 'manage'];
      case 'user':
        return ['create', 'read', 'update', 'delete', 'manage'];
      case 'media':
        return ['create', 'read', 'update', 'delete', 'manage'];
      case 'settings':
        return ['read', 'update', 'manage'];
      default:
        return [];
    }
  }

  /**
   * Generate cache key for principal.
   */
  private getCacheKey(principal: Principal): string {
    return `${principal.id}:${principal.roles.map(r => r.id).join(',')}`;
  }

  private matchesPermission(
    permission: Permission,
    action: Action,
    resource: ResourceType,
    context: PermissionContext | undefined,
    principal: Principal
  ): boolean {
    // Resource must match
    if (permission.resource !== resource) {
      return false;
    }

    // Action must match
    if (permission.action !== action) {
      return false;
    }

    // Scope must match
    return this.matchesScope(permission, context, principal);
  }

  private matchesScope(
    permission: Permission,
    context: PermissionContext | undefined,
    principal: Principal
  ): boolean {
    switch (permission.scope.type) {
      case 'all':
        // Can act on anything
        return true;

      case 'own':
        // Can only act on own resources
        if (!context?.ownerId) {
          return false;
        }
        return context.ownerId === principal.id;

      case 'contentType':
        // Can only act on specific content type
        if (!context?.typeId) {
          return false;
        }
        return context.typeId === permission.scope.typeId;

      default:
        return false;
    }
  }
}

// ============================================================================
// PREDEFINED ROLES
// ============================================================================

import { RoleId } from '../core/types';
import type { Role } from './types';

export const ADMIN_ROLE: Role = {
  id: RoleId('role-admin'),
  name: 'admin',
  displayName: 'Administrator',
  permissions: [
    { resource: 'content', action: 'create', scope: { type: 'all' } },
    { resource: 'content', action: 'read', scope: { type: 'all' } },
    { resource: 'content', action: 'update', scope: { type: 'all' } },
    { resource: 'content', action: 'delete', scope: { type: 'all' } },
    { resource: 'content', action: 'publish', scope: { type: 'all' } },
    { resource: 'content', action: 'unpublish', scope: { type: 'all' } },
    { resource: 'content', action: 'schedule', scope: { type: 'all' } },
    { resource: 'schema', action: 'create', scope: { type: 'all' } },
    { resource: 'schema', action: 'read', scope: { type: 'all' } },
    { resource: 'schema', action: 'update', scope: { type: 'all' } },
    { resource: 'schema', action: 'delete', scope: { type: 'all' } },
    { resource: 'user', action: 'create', scope: { type: 'all' } },
    { resource: 'user', action: 'read', scope: { type: 'all' } },
    { resource: 'user', action: 'update', scope: { type: 'all' } },
    { resource: 'user', action: 'delete', scope: { type: 'all' } },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const EDITOR_ROLE: Role = {
  id: RoleId('role-editor'),
  name: 'editor',
  displayName: 'Editor',
  permissions: [
    { resource: 'content', action: 'create', scope: { type: 'all' } },
    { resource: 'content', action: 'read', scope: { type: 'all' } },
    { resource: 'content', action: 'update', scope: { type: 'all' } },
    { resource: 'content', action: 'delete', scope: { type: 'all' } },
    { resource: 'content', action: 'publish', scope: { type: 'all' } },
    { resource: 'content', action: 'unpublish', scope: { type: 'all' } },
    { resource: 'content', action: 'schedule', scope: { type: 'all' } },
    { resource: 'schema', action: 'read', scope: { type: 'all' } },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const AUTHOR_ROLE: Role = {
  id: RoleId('role-author'),
  name: 'author',
  displayName: 'Author',
  permissions: [
    { resource: 'content', action: 'create', scope: { type: 'all' } },
    { resource: 'content', action: 'read', scope: { type: 'all' } },
    { resource: 'content', action: 'update', scope: { type: 'own' } },
    { resource: 'content', action: 'delete', scope: { type: 'own' } },
    { resource: 'schema', action: 'read', scope: { type: 'all' } },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const VIEWER_ROLE: Role = {
  id: RoleId('role-viewer'),
  name: 'viewer',
  displayName: 'Viewer',
  permissions: [
    { resource: 'content', action: 'read', scope: { type: 'all' } },
    { resource: 'schema', action: 'read', scope: { type: 'all' } },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};
