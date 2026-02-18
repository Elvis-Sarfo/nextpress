import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/adapters/prisma-adapter';
import { Users } from '@/collections/Users';
import type { CollectionAuth } from '@/core/collection/types';

// Users.auth can be boolean | CollectionAuth — extract safely
const authConfig: CollectionAuth =
  typeof Users.auth === 'object' && Users.auth !== null ? Users.auth : {};
const MAX_LOGIN_ATTEMPTS = authConfig.maxLoginAttempts ?? 5;
const LOCK_TIME_MS = authConfig.lockTime ?? 600_000; // 10 minutes

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },

  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) return null;

        const user = await prisma.users.findUnique({ where: { email } });

        if (!user || !user.active || !user.passwordHash) return null;

        // Check account lockout
        if (user.lockedUntil && user.lockedUntil > new Date()) {
          return null;
        }

        const passwordValid = await bcrypt.compare(password, user.passwordHash);

        if (!passwordValid) {
          // Increment failed attempts and potentially lock the account
          const newAttempts = (user.loginAttempts ?? 0) + 1;
          const shouldLock = newAttempts >= MAX_LOGIN_ATTEMPTS;

          await prisma.users.update({
            where: { id: user.id },
            data: {
              loginAttempts: newAttempts,
              ...(shouldLock
                ? { lockedUntil: new Date(Date.now() + LOCK_TIME_MS) }
                : {}),
            },
          });

          return null;
        }

        // Successful login — reset counter
        await prisma.users.update({
          where: { id: user.id },
          data: { loginAttempts: 0, lockedUntil: null },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role: string }).role;
      }
      return token;
    },

    session({ session, token }) {
      // token properties are Record<string, unknown> — cast to our extended shape
      const jwt = token as { id: string; role: string };
      session.user.id = jwt.id;
      session.user.role = jwt.role;
      return session;
    },
  },

  pages: {
    signIn: '/auth/signin',
  },
});
