import { PrismaClient } from '../prisma-client/index';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';

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
  // ROLES
  // ============================================================================

  console.log('Creating roles...');

  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      displayName: 'Administrator',
      permissions: [
        { action: 'create', resource: '*' },
        { action: 'read', resource: '*' },
        { action: 'update', resource: '*' },
        { action: 'delete', resource: '*' },
        { action: 'publish', resource: '*' },
      ],
    },
  });

  const editorRole = await prisma.role.upsert({
    where: { name: 'editor' },
    update: {},
    create: {
      name: 'editor',
      displayName: 'Editor',
      permissions: [
        { action: 'create', resource: 'content' },
        { action: 'read', resource: 'content' },
        { action: 'update', resource: 'content' },
        { action: 'publish', resource: 'content' },
      ],
    },
  });

  const authorRole = await prisma.role.upsert({
    where: { name: 'author' },
    update: {},
    create: {
      name: 'author',
      displayName: 'Author',
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

  const homeDocumentId = randomUUID();
  const homePage = await prisma.page.create({
    data: {
      documentId: homeDocumentId,
      status: 'PUBLISHED',
      order: 0,
      template: 'landing',
      publishedAt: new Date(),
      createdBy: 'demo-user',
      locales: {
        create: [
          {
            locale: 'en',
            title: 'Welcome to NextPress',
            slug: 'home',
            content:
              '<h1>Welcome to NextPress</h1><p>A modern headless CMS built with Next and TypeScript.</p><h2>Key Features</h2><ul><li>Full TypeScript support with branded types</li><li>Multi-locale content management</li><li>Version control and content workflows</li><li>Role-based access control</li></ul>',
            excerpt: 'A modern headless CMS for developers',
          },
          {
            locale: 'fr',
            title: 'Bienvenue sur NextPress',
            slug: 'accueil',
            content:
              '<h1>Bienvenue sur NextPress</h1><p>Un CMS headless moderne construit avec Next et TypeScript.</p>',
            excerpt: 'Un CMS headless moderne pour les développeurs',
          },
        ],
      },
    },
  });

  const aboutDocumentId = randomUUID();
  const aboutPage = await prisma.page.create({
    data: {
      documentId: aboutDocumentId,
      status: 'PUBLISHED',
      order: 1,
      template: 'about',
      publishedAt: new Date(),
      createdBy: 'demo-user',
      locales: {
        create: [
          {
            locale: 'en',
            title: 'About Us',
            slug: 'about',
            content:
              '<h1>About NextPress</h1><p>NextPress is a powerful, developer-friendly content management system.</p><h2>Our Mission</h2><p>To provide developers with a CMS that respects their intelligence and offers complete type safety.</p><h2>Technology Stack</h2><ul><li>Next 14 with App Router</li><li>TypeScript with branded types</li><li>Prisma ORM</li><li>PostgreSQL</li></ul>',
            excerpt: 'Learn about NextPress and our mission',
          },
        ],
      },
    },
  });

  console.log(`Created pages: ${homePage.id}, ${aboutPage.id}`);

  // ============================================================================
  // SAMPLE POSTS
  // ============================================================================

  console.log('Creating sample posts...');

  const post1DocumentId = randomUUID();
  const welcomePost = await prisma.post.create({
    data: {
      documentId: post1DocumentId,
      status: 'PUBLISHED',
      featuredImage: '/images/welcome.jpg',
      publishedAt: new Date(),
      createdBy: 'demo-user',
      locales: {
        create: [
          {
            locale: 'en',
            title: 'Getting Started with NextPress',
            slug: 'getting-started',
            content:
              '<p>Welcome to <strong>NextPress</strong>! This guide will help you get up and running with our headless CMS.</p><h2>Installation</h2><p>Start by cloning the repository and installing dependencies:</p><pre><code>pnpm install</code></pre><h2>Configuration</h2><p>Set up your database connection in the .env file and run migrations.</p><h2>Next Steps</h2><p>Explore the admin dashboard to create your first content!</p>',
            excerpt: 'A comprehensive guide to setting up and using NextPress.',
          },
          {
            locale: 'fr',
            title: 'Démarrer avec NextPress',
            slug: 'demarrer',
            content:
              '<p>Bienvenue sur <strong>NextPress</strong> ! Ce guide vous aidera à démarrer avec notre CMS headless.</p>',
            excerpt: 'Un guide complet pour configurer et utiliser NextPress.',
          },
        ],
      },
    },
  });

  const post2DocumentId = randomUUID();
  const draftPost = await prisma.post.create({
    data: {
      documentId: post2DocumentId,
      status: 'DRAFT',
      createdBy: 'demo-user',
      locales: {
        create: [
          {
            locale: 'en',
            title: 'Advanced Features Coming Soon',
            slug: 'advanced-features',
            content:
              '<p>We are working on exciting new features for NextPress.</p><p>Stay tuned for updates!</p>',
            excerpt: 'Upcoming features in NextPress.',
          },
        ],
      },
    },
  });

  console.log(`Created posts: ${welcomePost.id}, ${draftPost.id}`);

  // ============================================================================
  // SAMPLE NEWS
  // ============================================================================

  console.log('Creating sample news...');

  const news1DocumentId = randomUUID();
  const launchNews = await prisma.news.create({
    data: {
      documentId: news1DocumentId,
      status: 'PUBLISHED',
      category: 'announcements',
      featuredImage: '/images/launch.jpg',
      publishedAt: new Date(),
      createdBy: 'demo-user',
      locales: {
        create: [
          {
            locale: 'en',
            title: 'NextPress 1.0 Launched!',
            slug: 'nextpress-launch',
            content:
              '<p>We are excited to announce the official launch of NextPress 1.0!</p><p>After months of development, our headless CMS is ready for production use.</p><h2>Highlights</h2><ul><li>Dedicated tables for Pages, Posts, and News</li><li>Multi-locale support with separate locale tables</li><li>Version history and content workflows</li><li>RBAC permissions system</li></ul>',
            excerpt: 'The official launch of NextPress 1.0 headless CMS.',
          },
        ],
      },
    },
  });

  console.log(`Created news: ${launchNews.id}`);

  // ============================================================================
  // SAMPLE MENUS
  // ============================================================================

  console.log('Creating sample menus...');

  const headerMenu = await prisma.menu.create({
    data: {
      name: 'header',
      displayName: 'Header Navigation',
      location: 'header',
      createdBy: 'demo-user',
      items: {
        create: [
          {
            order: 0,
            label: { en: 'Home', fr: 'Accueil' },
            url: '/en/home',
          },
          {
            order: 1,
            label: { en: 'About', fr: 'À propos' },
            url: '/en/about',
          },
          {
            order: 2,
            label: { en: 'Blog', fr: 'Blog' },
            url: '/en/blog',
          },
          {
            order: 3,
            label: { en: 'News', fr: 'Actualités' },
            url: '/en/news',
          },
        ],
      },
    },
  });

  const footerMenu = await prisma.menu.create({
    data: {
      name: 'footer',
      displayName: 'Footer Navigation',
      location: 'footer',
      createdBy: 'demo-user',
      items: {
        create: [
          {
            order: 0,
            label: { en: 'Privacy Policy', fr: 'Politique de confidentialité' },
            url: '/en/privacy',
          },
          {
            order: 1,
            label: { en: 'Terms of Service', fr: 'Conditions d\'utilisation' },
            url: '/en/terms',
          },
          {
            order: 2,
            label: { en: 'Contact', fr: 'Contact' },
            url: '/en/contact',
          },
        ],
      },
    },
  });

  console.log(`Created menus: ${headerMenu.name}, ${footerMenu.name}`);

  // ============================================================================
  // SAMPLE LINK COLLECTION
  // ============================================================================

  console.log('Creating sample link collections...');

  const socialLinks = await prisma.linkCollection.create({
    data: {
      name: 'social',
      displayName: 'Social Media Links',
      description: 'Links to our social media profiles',
      createdBy: 'demo-user',
      links: {
        create: [
          {
            order: 0,
            title: { en: 'Twitter', fr: 'Twitter' },
            url: 'https://twitter.com/nextpress',
            target: '_blank',
          },
          {
            order: 1,
            title: { en: 'GitHub', fr: 'GitHub' },
            url: 'https://github.com/nextpress',
            target: '_blank',
          },
          {
            order: 2,
            title: { en: 'Discord', fr: 'Discord' },
            url: 'https://discord.gg/nextpress',
            target: '_blank',
          },
        ],
      },
    },
  });

  console.log(`Created link collection: ${socialLinks.name}`);

  // ============================================================================
  // ASSIGN DEMO USER TO ADMIN ROLE
  // ============================================================================

  console.log('Assigning demo user to admin role...');

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: 'demo-user',
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: 'demo-user',
      roleId: adminRole.id,
      assignedBy: 'system',
    },
  });

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
