import { PrismaClient } from '../prisma-client/index';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ── Permission definitions ────────────────────────────────────────────────────
// Each entry produces one row in the permissions table.
// name is auto-derived as "<resource>:<action>:<scope>".

const PERMISSIONS = [
  // content
  { resource: 'content', action: 'create', scope: 'all' },
  { resource: 'content', action: 'read',   scope: 'all' },
  { resource: 'content', action: 'update', scope: 'all' },
  { resource: 'content', action: 'delete', scope: 'all' },
  { resource: 'content', action: 'publish',   scope: 'all' },
  { resource: 'content', action: 'unpublish', scope: 'all' },
  { resource: 'content', action: 'schedule',  scope: 'all' },
  { resource: 'content', action: 'update', scope: 'own' },
  { resource: 'content', action: 'delete', scope: 'own' },
  // schema
  { resource: 'schema', action: 'create', scope: 'all' },
  { resource: 'schema', action: 'read',   scope: 'all' },
  { resource: 'schema', action: 'update', scope: 'all' },
  { resource: 'schema', action: 'delete', scope: 'all' },
  // user
  { resource: 'user', action: 'create', scope: 'all' },
  { resource: 'user', action: 'read',   scope: 'all' },
  { resource: 'user', action: 'update', scope: 'all' },
  { resource: 'user', action: 'delete', scope: 'all' },
  // media
  { resource: 'media', action: 'create', scope: 'all' },
  { resource: 'media', action: 'read',   scope: 'all' },
  { resource: 'media', action: 'update', scope: 'all' },
  { resource: 'media', action: 'delete', scope: 'all' },
  // settings
  { resource: 'settings', action: 'read',   scope: 'all' },
  { resource: 'settings', action: 'update', scope: 'all' },
] as const;

function permName(p: { resource: string; action: string; scope: string }) {
  return `${p.resource}:${p.action}:${p.scope}`;
}

// ── Role → permission name sets ───────────────────────────────────────────────

const ADMIN_PERMS = PERMISSIONS.map(permName); // every permission

const EDITOR_PERMS = [
  'content:create:all',
  'content:read:all',
  'content:update:all',
  'content:delete:all',
  'content:publish:all',
  'content:unpublish:all',
  'content:schedule:all',
  'schema:read:all',
  'media:create:all',
  'media:read:all',
  'media:update:all',
  'media:delete:all',
];

const AUTHOR_PERMS = [
  'content:create:all',
  'content:read:all',
  'content:update:own',
  'content:delete:own',
  'schema:read:all',
  'media:read:all',
];

const VIEWER_PERMS = [
  'content:read:all',
  'schema:read:all',
  'media:read:all',
];

async function main() {
  console.log('Seeding database…');

  // ── 1. Permissions ────────────────────────────────────────────────────────
  console.log('Creating permissions…');

  const permMap: Record<string, string> = {}; // name → id

  for (const perm of PERMISSIONS) {
    const name = permName(perm);
    const row = await prisma.permissions.upsert({
      where: { name },
      update: { resource: perm.resource, action: perm.action, scope: perm.scope },
      create: {
        name,
        resource: perm.resource,
        action: perm.action,
        scope: perm.scope,
        status: 'published',
        description: `Allow ${perm.action} on ${perm.resource} (${perm.scope})`,
      },
    });
    permMap[name] = row.id;
  }

  console.log(`  ${Object.keys(permMap).length} permissions ready`);

  // ── 2. Roles ──────────────────────────────────────────────────────────────
  console.log('Creating roles…');

  const makeRoleData = (names: string[]) => ({
    permissions: {
      connect: names
        .filter((n) => permMap[n])
        .map((n) => ({ id: permMap[n] })),
    },
  });

  const adminRole = await prisma.roles.upsert({
    where: { name: 'admin' },
    update: {
      displayName: 'Administrator',
      ...makeRoleData(ADMIN_PERMS),
    },
    create: {
      name: 'admin',
      displayName: 'Administrator',
      description: 'Full access to all resources',
      status: 'published',
      ...makeRoleData(ADMIN_PERMS),
    },
  });

  const editorRole = await prisma.roles.upsert({
    where: { name: 'editor' },
    update: {
      displayName: 'Editor',
      ...makeRoleData(EDITOR_PERMS),
    },
    create: {
      name: 'editor',
      displayName: 'Editor',
      description: 'Full content management, read schema and media',
      status: 'published',
      ...makeRoleData(EDITOR_PERMS),
    },
  });

  const authorRole = await prisma.roles.upsert({
    where: { name: 'author' },
    update: {
      displayName: 'Author',
      ...makeRoleData(AUTHOR_PERMS),
    },
    create: {
      name: 'author',
      displayName: 'Author',
      description: 'Create content, edit/delete own content',
      status: 'published',
      ...makeRoleData(AUTHOR_PERMS),
    },
  });

  const viewerRole = await prisma.roles.upsert({
    where: { name: 'viewer' },
    update: {
      displayName: 'Viewer',
      ...makeRoleData(VIEWER_PERMS),
    },
    create: {
      name: 'viewer',
      displayName: 'Viewer',
      description: 'Read-only access to content and media',
      status: 'published',
      ...makeRoleData(VIEWER_PERMS),
    },
  });

  console.log(
    `  Roles: ${adminRole.name}, ${editorRole.name}, ${authorRole.name}, ${viewerRole.name}`
  );

  // ── 3. Admin user ─────────────────────────────────────────────────────────
  console.log('Creating default admin user…');

  const adminPassword = process.env.ADMIN_PASSWORD ?? 'Admin1234!';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.users.upsert({
    where: { email: 'admin@example.com' },
    update: {
      roles: { set: [{ id: adminRole.id }] },
    },
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      active: true,
      status: 'published',
      passwordHash,
      loginAttempts: 0,
      roles: { connect: [{ id: adminRole.id }] },
    },
  });

  console.log(
    `  Admin user ready: admin@example.com / ${adminPassword}`
  );

  // ── 4. Sample pages ───────────────────────────────────────────────────────
  console.log('Creating sample pages…');

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
        html: '<h1>Welcome to NextPress</h1><p>A modern headless CMS built with Next.js and TypeScript.</p>',
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
        html: '<h1>About NextPress</h1><p>NextPress is a powerful, developer-friendly CMS.</p>',
      },
      createdBy: 'system',
    },
  });

  console.log(`  Pages: ${homePage.slug}, ${aboutPage.slug}`);
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
