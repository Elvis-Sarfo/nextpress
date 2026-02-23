/**
 * Minimal NextAuth config safe for the Edge Runtime (middleware).
 * Does NOT import bcrypt, prisma, or any Node.js-only modules.
 * The full auth config (with Credentials provider + bcrypt) lives in src/auth.ts.
 */
import type { NextAuthConfig } from 'next-auth';

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
      const jwt = token as { id: string; role: string };
      session.user.id = jwt.id;
      session.user.role = jwt.role;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
};
