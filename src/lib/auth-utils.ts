import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import type { Session } from 'next-auth';

/**
 * Returns the current session or redirects to sign-in if unauthenticated.
 * Use this in Server Components and Route Handlers that require a logged-in user.
 */
export async function requireAuth(): Promise<Session> {
  const session = await auth();
  if (!session) {
    redirect('/auth/signin');
  }
  return session;
}

/**
 * Returns the current session or redirects if the user does not have one of the
 * allowed roles. Call this for pages/routes that should be role-restricted.
 *
 * @example
 * const session = await requireRole('admin');
 * const session = await requireRole(['admin', 'editor']);
 */
export async function requireRole(
  role: string | string[]
): Promise<Session> {
  const session = await requireAuth();
  const allowed = Array.isArray(role) ? role : [role];

  if (!allowed.includes(session.user.role)) {
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
