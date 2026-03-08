import bcrypt from 'bcryptjs';
import { prisma } from '@/adapters/prisma-adapter';

export class AdminBootstrapError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'AdminBootstrapError';
  }
}

export interface BootstrapAdminInput {
  email: string;
  password: string;
  name?: string;
}

export async function hasAdminUser(): Promise<boolean> {
  const adminCount = await prisma.users.count({
    where: {
      roles: {
        some: {
          name: 'admin',
        },
      },
    },
  });

  return adminCount > 0;
}

export async function createInitialAdmin({
  email,
  password,
  name,
}: BootstrapAdminInput): Promise<{ id: string; email: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedName = name?.trim();

  if (!normalizedEmail) {
    throw new AdminBootstrapError('Email is required.', 400);
  }

  if (password.length < 8) {
    throw new AdminBootstrapError('Password must be at least 8 characters long.', 400);
  }

  return prisma.$transaction(async (tx) => {
    const adminCount = await tx.users.count({
      where: {
        roles: {
          some: {
            name: 'admin',
          },
        },
      },
    });

    if (adminCount > 0) {
      throw new AdminBootstrapError('An admin account already exists.', 409);
    }

    const existingUser = await tx.users.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });

    if (existingUser) {
      throw new AdminBootstrapError('A user with that email already exists.', 409);
    }

    const adminRole = await tx.roles.upsert({
      where: { name: 'admin' },
      update: {},
      create: {
        name: 'admin',
        displayName: 'Administrator',
        description: 'Bootstrap administrator role',
        status: 'published',
        createdBy: 'system',
      },
      select: { id: true },
    });

    const user = await tx.users.create({
      data: {
        email: normalizedEmail,
        name: normalizedName || 'Administrator',
        active: true,
        status: 'published',
        passwordHash: await bcrypt.hash(password, 12),
        loginAttempts: 0,
        lockedUntil: null,
        createdBy: 'system',
        roles: {
          connect: [{ id: adminRole.id }],
        },
      },
      select: {
        id: true,
        email: true,
      },
    });

    return user;
  });
}
