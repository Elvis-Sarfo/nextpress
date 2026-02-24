/**
 * Minimal NextAuth config safe for the Edge Runtime (middleware).
 * Does NOT import bcrypt, prisma, or any Node.js-only modules.
 * The full auth config (with Credentials provider + bcrypt) lives in src/auth.ts.
 */
import type { NextAuthConfig } from 'next-auth';
import type { SerializedPermission } from '@/types/permissions';

export const authConfig: NextAuthConfig = {
  trustHost: true,
  session: { strategy: 'jwt' },
  providers: [],   // No providers needed for middleware — JWT is verified via callbacks
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role: string }).role;
      }
      return token;
    },
    session({ session, token }) {
      const jwt = token as { id: string; role: string; isAdmin: boolean; perms: SerializedPermission[] };
      session.user.id = jwt.id;
      session.user.role = jwt.role;
      session.user.isAdmin = jwt.isAdmin ?? false;
      session.user.perms = jwt.perms ?? [];
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
};
