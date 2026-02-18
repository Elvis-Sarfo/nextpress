import { PrismaClient } from '../prisma-client/index';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config();

const { Pool } = pg;

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create Prisma adapter
const adapter = new PrismaPg(pool);

// Create Prisma client with adapter
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // ============================================================================
  // DEFAULT ADMIN USER
  // ============================================================================

  console.log('Creating default admin user...');

  const adminPassword = process.env.ADMIN_PASSWORD ?? 'Admin1234!';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.users.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      role: 'admin',
      active: true,
      status: 'published',
      passwordHash,
      loginAttempts: 0,
    },
  });

  console.log('Default admin user created: admin@example.com / ' + adminPassword);

  // ============================================================================
  // ROLES
  // ============================================================================

  console.log('Creating roles...');

  const adminRole = await prisma.roles.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      displayName: 'Administrator',
      status: 'published',
      permissions: [
        { action: 'create', resource: '*' },
        { action: 'read', resource: '*' },
        { action: 'update', resource: '*' },
        { action: 'delete', resource: '*' },
        { action: 'publish', resource: '*' },
      ],
    },
  });

  const editorRole = await prisma.roles.upsert({
    where: { name: 'editor' },
    update: {},
    create: {
      name: 'editor',
      displayName: 'Editor',
      status: 'published',
      permissions: [
        { action: 'create', resource: 'content' },
        { action: 'read', resource: 'content' },
        { action: 'update', resource: 'content' },
        { action: 'publish', resource: 'content' },
      ],
    },
  });

  const authorRole = await prisma.roles.upsert({
    where: { name: 'author' },
    update: {},
    create: {
      name: 'author',
      displayName: 'Author',
      status: 'published',
      permissions: [
        { action: 'create', resource: 'content' },
        { action: 'read', resource: 'content' },
        { action: 'update', resource: 'content', condition: 'own' },
      ],
    },
  });

  console.log(`Created roles: ${adminRole.name}, ${editorRole.name}, ${authorRole.name}`);

  // ============================================================================
  // SAMPLE PAGES
  // ============================================================================

  console.log('Creating sample pages...');

  const homePage = await prisma.pages.upsert({
    where: { slug: 'home' },
    update: {},
    create: {
      documentId: randomUUID(),
      status: 'PUBLISHED',
      title: 'Welcome to NextPress',
      slug: 'home',
      excerpt: 'A modern headless CMS for developers',
      content: {
        html: '<h1>Welcome to NextPress</h1><p>A modern headless CMS built with Next and TypeScript.</p>',
      },
      createdBy: 'system',
    },
  });

  const aboutPage = await prisma.pages.upsert({
    where: { slug: 'about' },
    update: {},
    create: {
      documentId: randomUUID(),
      status: 'PUBLISHED',
      title: 'About Us',
      slug: 'about',
      excerpt: 'Learn about NextPress and our mission',
      content: {
        html: '<h1>About NextPress</h1><p>NextPress is a powerful, developer-friendly content management system.</p>',
      },
      createdBy: 'system',
    },
  });

  console.log(`Created pages: ${homePage.id}, ${aboutPage.id}`);

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
