import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import type { Session } from 'next-auth';
import { getCurrentPrincipal } from '@/lib/cms';

/**
 * Returns the current session or redirects to sign-in if unauthenticated.
 */
export async function requireAuth(): Promise<Session> {
  const session = await auth();
  if (!session) {
    redirect('/auth/signin');
  }
  return session;
}

/**
 * Returns the current session or redirects if the user does not hold one of
 * the allowed roles. Role is matched against role names stored in the DB
 * (admin, editor, author, viewer) via the RBAC principal.
 *
 * @example
 * await requireRole('admin');
 * await requireRole(['admin', 'editor']);
 */
export async function requireRole(
  role: string | string[]
): Promise<Session> {
  const session = await requireAuth();
  const allowed = Array.isArray(role) ? role : [role];

  // Fast path: primary role stored in session (set at login time)
  if (allowed.includes(session.user.role)) {
    return session;
  }

  // Full check: load all roles from DB in case the user has multiple roles
  const principal = await getCurrentPrincipal();
  const hasRole = principal?.roles.some((r) => allowed.includes(r.name)) ?? false;

  if (!hasRole) {
    redirect('/admin');
  }

  return session;
}

/**
 * Returns the current session, or null if unauthenticated. Does not redirect.
 */
export async function getSession(): Promise<Session | null> {
  return auth();
}
