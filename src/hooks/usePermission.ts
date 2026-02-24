'use client';

import { useSession } from 'next-auth/react';
import type { Action, ResourceType } from '@/core/permissions/types';
import type { SerializedPermission } from '@/types/permissions';

/**
 * Client-side permission check using permissions baked into the JWT at sign-in.
 *
 * For 'own' scope permissions: pass ownerId to check if the current user owns the
 * resource. Returns true only if the user has an 'own'-scoped permission AND
 * ownerId equals the current user's id.
 *
 * For 'all' scope permissions: context is ignored.
 *
 * For 'contentType' scope permissions: returns true if the permission's typeId
 * matches context.typeId.
 *
 * Returns false when the session is loading or unavailable.
 *
 * @example
 * // Check if user can delete any content
 * const canDelete = usePermission('delete', 'content');
 *
 * // Check if user can edit their own post
 * const canEdit = usePermission('update', 'content', { ownerId: post.authorId });
 */
export function usePermission(
  action: Action,
  resource: ResourceType,
  context?: { ownerId?: string; typeId?: string }
): boolean {
  const { data: session, status } = useSession();

  if (status !== 'authenticated' || !session?.user) return false;

  const { isAdmin, perms, id: userId } = session.user;

  if (isAdmin) return true;

  for (const perm of (perms as SerializedPermission[])) {
    if (perm.a !== action || perm.r !== resource) continue;

    if (perm.s === 'all') return true;

    if (perm.s === 'own') {
      if (context?.ownerId && context.ownerId === userId) return true;
      continue;
    }

    if (perm.s.startsWith('contentType:')) {
      const permTypeId = perm.s.slice('contentType:'.length);
      if (context?.typeId && context.typeId === permTypeId) return true;
      continue;
    }
  }

  return false;
}
