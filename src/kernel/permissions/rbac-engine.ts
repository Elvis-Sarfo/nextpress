import { Result, Ok, Err, DomainError } from '../core/types';
import type {
  Principal, Permission, Action, ResourceType, PermissionContext
} from './types';

/**
 * Role-Based Access Control engine.
 */
export class RBACEngine {
  /**
   * Check if principal can perform action on resource.
   */
  can(
    principal: Principal,
    action: Action,
    resource: ResourceType,
    context?: PermissionContext
  ): boolean {
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
   */
  getEffectivePermissions(principal: Principal): Permission[] {
    const permissions: Permission[] = [];

    for (const role of principal.roles) {
      permissions.push(...role.permissions);
    }

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
