import type { PrincipalId, RoleId, ContentTypeId, ContentEntryId } from '../core/types.js';

// ============================================================================
// ACTIONS
// ============================================================================

export type ContentAction =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'publish'
  | 'unpublish'
  | 'schedule';

export type SchemaAction = 'create' | 'read' | 'update' | 'delete';
export type UserAction = 'create' | 'read' | 'update' | 'delete';

export type ResourceType = 'content' | 'schema' | 'user';
export type Action = ContentAction | SchemaAction | UserAction;

// ============================================================================
// PERMISSION SCOPE
// ============================================================================

export type PermissionScope =
  | { type: 'all' } // Can act on any resource
  | { type: 'own' } // Can only act on own resources
  | { type: 'contentType'; typeId: ContentTypeId }; // Can only act on specific type

// ============================================================================
// PERMISSION
// ============================================================================

export interface Permission {
  resource: ResourceType;
  action: Action;
  scope: PermissionScope;
}

// ============================================================================
// ROLE
// ============================================================================

export interface Role {
  id: RoleId;
  name: string;
  displayName: string;
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// PRINCIPAL
// ============================================================================

export interface Principal {
  id: PrincipalId;
  roles: Role[];
}

// ============================================================================
// PERMISSION CONTEXT
// ============================================================================

export interface PermissionContext {
  entryId?: ContentEntryId;
  typeId?: ContentTypeId;
  ownerId?: PrincipalId;
}

// ============================================================================
// ROLE REPOSITORY
// ============================================================================

export interface RoleRepository {
  findById(id: RoleId): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
  findAll(): Promise<Role[]>;
  findByUser(userId: PrincipalId): Promise<Role[]>;
  save(role: Role): Promise<void>;
  delete(id: RoleId): Promise<void>;
  assignToUser(userId: PrincipalId, roleId: RoleId): Promise<void>;
  removeFromUser(userId: PrincipalId, roleId: RoleId): Promise<void>;
}
