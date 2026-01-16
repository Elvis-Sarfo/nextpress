import {
  ContentStore,
  SchemaEngine,
  RBACEngine,
  LocaleEngine,
  EventBus,
  VersionManager,
  LockManager,
  Scheduler,
} from '@cms/kernel';

import {
  PrismaContentRepository,
  PrismaVersionRepository,
  PrismaSchemaRepository,
  PrismaLockRepository,
  prisma,
} from '@cms/prisma-adapter';

// Initialize event bus
const eventBus = new EventBus();

// Initialize repositories
const contentRepository = new PrismaContentRepository(prisma);
const versionRepository = new PrismaVersionRepository(prisma);
const schemaRepository = new PrismaSchemaRepository(prisma);
const lockRepository = new PrismaLockRepository(prisma);

// Initialize engines
export const schemaEngine = new SchemaEngine({
  schemaRepository,
  eventBus,
});

export const rbacEngine = new RBACEngine();

export const localeEngine = new LocaleEngine({
  defaultLocale: 'en',
  fallbackLocale: 'en',
  enabledLocales: ['en', 'es', 'fr', 'de'],
});

// Initialize version manager
const versionManager = new VersionManager({
  versionRepository,
});

// Initialize lock manager
export const lockManager = new LockManager({
  lockRepository,
  defaultLockDuration: 5 * 60 * 1000, // 5 minutes
});

// Initialize content store (main entry point)
export const contentStore = new ContentStore({
  contentRepository,
  versionManager,
  lockRepository,
  schemaEngine,
  rbacEngine,
  localeEngine,
  eventBus,
});

// Initialize scheduler
export const scheduler = new Scheduler({
  versionRepository,
  versionManager,
  eventBus,
  checkIntervalMs: 60 * 1000, // 1 minute
});

// Subscribe to events for cache invalidation
eventBus.on('CONTENT_PUBLISHED', async (event) => {
  // Trigger Next.js revalidation
  try {
    const { revalidatePath } = await import('next/cache');
    // Revalidate the content page
    revalidatePath(`/${event.payload.locale}/${event.payload.slug}`);
    // Revalidate sitemap
    revalidatePath('/sitemap.xml');
  } catch (error) {
    console.error('Failed to revalidate:', error);
  }
});

eventBus.on('CONTENT_UNPUBLISHED', async (event) => {
  try {
    const { revalidatePath } = await import('next/cache');
    revalidatePath(`/${event.payload.locale}`);
    revalidatePath('/sitemap.xml');
  } catch (error) {
    console.error('Failed to revalidate:', error);
  }
});

// Export the event bus for custom subscriptions
export { eventBus };

// Export types
export type { ContentStore, SchemaEngine, RBACEngine, LocaleEngine };
