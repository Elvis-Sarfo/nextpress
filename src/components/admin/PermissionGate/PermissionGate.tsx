'use client';

import type { ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import type { Action, ResourceType } from '@/core/permissions/types';
import { usePermission } from '@/hooks/usePermission';

interface PermissionGateProps {
  /** The action to check (e.g. 'delete', 'update', 'publish') */
  action?: Action;
  /** The resource type to check against */
  resource?: ResourceType;
  /** Optional: the owner's user ID for 'own'-scoped permissions */
  ownerId?: string;
  /** Optional: content type id for 'contentType'-scoped permissions */
  typeId?: string;
  /**
   * Shortcut: require admin role regardless of action/resource.
   * When true, action and resource are ignored.
   */
  requireAdmin?: boolean;
  /** Content rendered when permission is granted */
  children: ReactNode;
  /** Content rendered when permission is denied (default: null) */
  fallback?: ReactNode;
}

/**
 * Conditionally renders children based on the current user's permissions.
 * Uses permissions baked into the session JWT — no extra API requests.
 *
 * @example
 * // Show delete button only for users with content:delete permission
 * <PermissionGate action="delete" resource="content">
 *   <Button onClick={handleDelete}>Delete</Button>
 * </PermissionGate>
 *
 * @example
 * // Show edit button only for the post's own author
 * <PermissionGate action="update" resource="content" ownerId={post.authorId}>
 *   <Button onClick={handleEdit}>Edit</Button>
 * </PermissionGate>
 *
 * @example
 * // Admin-only panel with a fallback message
 * <PermissionGate requireAdmin fallback={<span>Admins only</span>}>
 *   <SettingsPanel />
 * </PermissionGate>
 */
export function PermissionGate({
  action,
  resource,
  ownerId,
  typeId,
  requireAdmin = false,
  children,
  fallback = null,
}: PermissionGateProps) {
  const { data: session } = useSession();
  const hasPermission = usePermission(
    action ?? 'read',
    resource ?? 'content',
    { ownerId, typeId }
  );

  // While session is loading, render nothing to avoid a flash
  if (!session) return null;

  if (requireAdmin) {
    return session.user.isAdmin ? <>{children}</> : <>{fallback}</>;
  }

  return hasPermission ? <>{children}</> : <>{fallback}</>;
}
