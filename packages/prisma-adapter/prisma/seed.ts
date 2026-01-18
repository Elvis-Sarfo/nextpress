import { PrismaClient } from '../prisma-client/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';

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
  // CONTENT TYPES
  // ============================================================================

  console.log('Creating content types...');

  // Blog Post content type
  const blogPost = await prisma.contentType.upsert({
    where: { name: 'blog-post' },
    update: {},
    create: {
      name: 'blog-post',
      displayName: 'Blog Post',
      description: 'A blog article with title, content, and metadata',
      version: 1,
      schema: [
        {
          name: 'title',
          type: 'text',
          required: true,
          localizable: true,
          validation: { maxLength: 200 },
        },
        {
          name: 'slug',
          type: 'slug',
          required: true,
          localizable: true,
          validation: { pattern: '^[a-z0-9-]+$' },
        },
        {
          name: 'excerpt',
          type: 'textarea',
          required: false,
          localizable: true,
          validation: { maxLength: 500 },
        },
        {
          name: 'content',
          type: 'richtext',
          required: true,
          localizable: true,
        },
        {
          name: 'featuredImage',
          type: 'media',
          required: false,
          localizable: false,
        },
        {
          name: 'tags',
          type: 'tags',
          required: false,
          localizable: false,
        },
        {
          name: 'author',
          type: 'text',
          required: true,
          localizable: false,
        },
      ],
      localization: {
        enabled: true,
        defaultLocale: 'en',
        locales: ['en', 'fr', 'de', 'es'],
        fallbackStrategy: 'default',
      },
      seo: {
        enabled: true,
        titleField: 'title',
        descriptionField: 'excerpt',
        slugField: 'slug',
      },
    },
  });

  // Page content type
  const page = await prisma.contentType.upsert({
    where: { name: 'page' },
    update: {},
    create: {
      name: 'page',
      displayName: 'Page',
      description: 'A static page for the website',
      version: 1,
      schema: [
        {
          name: 'title',
          type: 'text',
          required: true,
          localizable: true,
          validation: { maxLength: 200 },
        },
        {
          name: 'slug',
          type: 'slug',
          required: true,
          localizable: true,
        },
        {
          name: 'content',
          type: 'richtext',
          required: true,
          localizable: true,
        },
        {
          name: 'template',
          type: 'select',
          required: false,
          localizable: false,
          options: ['default', 'landing', 'contact', 'about'],
        },
      ],
      localization: {
        enabled: true,
        defaultLocale: 'en',
        locales: ['en', 'fr', 'de', 'es'],
        fallbackStrategy: 'default',
      },
      seo: {
        enabled: true,
        titleField: 'title',
        descriptionField: null,
        slugField: 'slug',
      },
    },
  });

  console.log(`Created content types: ${blogPost.name}, ${page.name}`);

  // ============================================================================
  // SAMPLE CONTENT
  // ============================================================================

  console.log('Creating sample content...');

  // Sample blog post
  const blogEntry = await prisma.contentEntry.create({
    data: {
      typeId: blogPost.id,
      defaultLocale: 'en',
      createdBy: 'demo-user',
      versions: {
        create: {
          version: 1,
          status: 'PUBLISHED',
          createdBy: 'demo-user',
          publishedAt: new Date(),
          data: {
            locales: {
              en: {
                slug: 'welcome-to-nextpress',
                fields: {
                  title: 'Welcome to NextPress',
                  excerpt: 'Learn about our new headless CMS built with Next.js and TypeScript.',
                  content: '<p>Welcome to <strong>NextPress</strong>, a modern headless CMS designed for developers who value type safety, performance, and flexibility.</p><h2>Key Features</h2><ul><li>Full TypeScript support with branded types</li><li>Multi-locale content management</li><li>Version control and content workflows</li><li>Role-based access control</li><li>Event-driven architecture</li></ul><p>Get started by exploring the admin dashboard and creating your first content!</p>',
                  author: 'NextPress Team',
                  tags: ['cms', 'nextjs', 'typescript'],
                },
                meta: {
                  title: 'Welcome to NextPress - A Modern Headless CMS',
                  description: 'Learn about our new headless CMS built with Next.js and TypeScript.',
                },
              },
              fr: {
                slug: 'bienvenue-sur-nextpress',
                fields: {
                  title: 'Bienvenue sur NextPress',
                  excerpt: 'Découvrez notre nouveau CMS headless construit avec Next.js et TypeScript.',
                  content: '<p>Bienvenue sur <strong>NextPress</strong>, un CMS headless moderne conçu pour les développeurs qui valorisent la sécurité des types, les performances et la flexibilité.</p>',
                  author: 'Équipe NextPress',
                  tags: ['cms', 'nextjs', 'typescript'],
                },
                meta: {
                  title: 'Bienvenue sur NextPress - Un CMS Headless Moderne',
                  description: 'Découvrez notre nouveau CMS headless construit avec Next.js et TypeScript.',
                },
              },
            },
          },
        },
      },
    },
  });

  // Sample page
  const aboutPage = await prisma.contentEntry.create({
    data: {
      typeId: page.id,
      defaultLocale: 'en',
      createdBy: 'demo-user',
      versions: {
        create: {
          version: 1,
          status: 'PUBLISHED',
          createdBy: 'demo-user',
          publishedAt: new Date(),
          data: {
            locales: {
              en: {
                slug: 'about',
                fields: {
                  title: 'About Us',
                  content: '<p>NextPress is a powerful, developer-friendly content management system built with modern technologies.</p><h2>Our Mission</h2><p>To provide developers with a CMS that respects their intelligence and offers complete type safety throughout the stack.</p><h2>Technology Stack</h2><ul><li>Next.js 14 with App Router</li><li>TypeScript with branded types</li><li>Prisma ORM</li><li>PostgreSQL</li><li>Tailwind CSS</li></ul>',
                  template: 'about',
                },
                meta: {
                  title: 'About Us - NextPress',
                },
              },
            },
          },
        },
      },
    },
  });

  // Draft blog post
  const draftPost = await prisma.contentEntry.create({
    data: {
      typeId: blogPost.id,
      defaultLocale: 'en',
      createdBy: 'demo-user',
      versions: {
        create: {
          version: 1,
          status: 'DRAFT',
          createdBy: 'demo-user',
          data: {
            locales: {
              en: {
                slug: 'getting-started-guide',
                fields: {
                  title: 'Getting Started with NextPress',
                  excerpt: 'A comprehensive guide to setting up and using NextPress.',
                  content: '<p>This is a draft post about getting started with NextPress.</p><p>Content coming soon...</p>',
                  author: 'NextPress Team',
                  tags: ['tutorial', 'guide'],
                },
              },
            },
          },
        },
      },
    },
  });

  console.log(`Created sample content: ${blogEntry.id}, ${aboutPage.id}, ${draftPost.id}`);

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
