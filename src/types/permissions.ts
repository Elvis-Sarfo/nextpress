import type { ResourceType, Action } from '@/core/permissions/types';

/**
 * Compact permission entry stored in the JWT / session.
 * Uses abbreviated keys (r/a/s) to minimize JWT size.
 *
 * scope string forms:
 *   'all'                   — can act on any resource
 *   'own'                   — can only act on own resources (userId check at runtime)
 *   'contentType:<typeId>'  — can only act on specific content type
 */
export interface SerializedPermission {
  r: ResourceType;
  a: Action;
  s: 'all' | 'own' | string; // string covers 'contentType:<typeId>'
}
