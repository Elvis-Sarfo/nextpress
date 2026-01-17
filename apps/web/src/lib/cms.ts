import {
  SchemaEngine,
  RBACEngine,
  VersionManager,
  LockManager,
  WorkflowStateMachine,
  EventBus,
  Locale,
  PrincipalId,
  ContentTypeId,
  type Principal,
  type ContentEntry,
  type ContentVersion,
  type ContentTypeSchema,
  type VersionStatus,
  type ContentPublishedEvent,
} from '@cms/kernel';

import {
  prisma,
  PrismaSchemaRepository,
  PrismaContentEntryRepository,
  PrismaContentVersionRepository,
  PrismaContentLockRepository,
  PrismaRoleRepository,
} from '@cms/prisma-adapter';

import { revalidatePath } from 'next/cache';

// ============================================================================
// EVENT BUS
// ============================================================================

export const eventBus = new EventBus();

// Cache invalidation on publish
eventBus.on<ContentPublishedEvent>('CONTENT_PUBLISHED', async (event) => {
  revalidatePath(`/en/blog`);
  revalidatePath(`/en/blog/${event.payload.slug}`);
  revalidatePath(`/sitemap.xml`);
});

eventBus.on('CONTENT_UNPUBLISHED', async () => {
  revalidatePath(`/en/blog`);
});

eventBus.on('CONTENT_DELETED', async () => {
  revalidatePath(`/en/blog`);
});

// ============================================================================
// REPOSITORIES
// ============================================================================

export const schemaRepository = new PrismaSchemaRepository(prisma);
export const contentEntryRepository = new PrismaContentEntryRepository(prisma);
export const contentVersionRepository = new PrismaContentVersionRepository(prisma);
export const contentLockRepository = new PrismaContentLockRepository(prisma);
export const roleRepository = new PrismaRoleRepository(prisma);

// ============================================================================
// ENGINES
// ============================================================================

export const schemaEngine = new SchemaEngine(schemaRepository);

export const rbacEngine = new RBACEngine();

export const versionManager = new VersionManager(contentVersionRepository);

export const lockManager = new LockManager(contentLockRepository);

export const workflowStateMachine = new WorkflowStateMachine();

// ============================================================================
// LOCALE ENGINE (SIMPLE)
// ============================================================================

const DEFAULT_LOCALE = Locale('en');
const SUPPORTED_LOCALES = [Locale('en'), Locale('fr'), Locale('de'), Locale('es')];

export const localeEngine = {
  getDefaultLocale: () => DEFAULT_LOCALE,
  getSupportedLocales: () => SUPPORTED_LOCALES,
  isSupported: (locale: string) => SUPPORTED_LOCALES.includes(Locale(locale)),
  getFallbackLocale: () => DEFAULT_LOCALE,
};

// ============================================================================
// GET CURRENT PRINCIPAL (placeholder - integrate with auth)
// ============================================================================

export async function getCurrentPrincipal(): Promise<Principal | null> {
  // TODO: Integrate with next-auth session
  // For now, return a demo principal
  const demoRoles = await roleRepository.findAll();
  return {
    id: PrincipalId('demo-user'),
    roles: demoRoles,
  };
}

export async function requirePrincipal(): Promise<Principal> {
  const principal = await getCurrentPrincipal();
  if (!principal) {
    throw new Error('Unauthorized');
  }
  return principal;
}

// ============================================================================
// CONTENT OPERATIONS
// ============================================================================

export async function getContentTypes(): Promise<ContentTypeSchema[]> {
  return schemaRepository.findAll();
}

export async function getContentType(name: string): Promise<ContentTypeSchema | null> {
  return schemaRepository.findByName(name);
}

export async function getContentEntries(
  typeId: string,
  options?: { limit?: number; offset?: number; status?: VersionStatus }
): Promise<{ entries: Array<{ entry: ContentEntry; version: ContentVersion }>; total: number }> {
  const contentTypeId = ContentTypeId(typeId);
  const entries = await contentEntryRepository.findByType(contentTypeId, {
    limit: options?.limit ?? 20,
    offset: options?.offset ?? 0,
  });

  const total = await contentEntryRepository.countByType(contentTypeId);

  const results = await Promise.all(
    entries.map(async (entry: ContentEntry) => {
      // Get draft first, fall back to published
      let version = await contentVersionRepository.findByEntryAndStatus(entry.id, 'DRAFT');
      if (!version) {
        version = await contentVersionRepository.findByEntryAndStatus(entry.id, 'PUBLISHED');
      }
      if (!version) {
        version = await contentVersionRepository.findLatestByEntry(entry.id);
      }
      return { entry, version: version! };
    })
  );

  return {
    entries: results.filter((r: { entry: ContentEntry; version: ContentVersion }) => r.version !== null),
    total,
  };
}

export async function getContentEntry(
  entryId: string
): Promise<{ entry: ContentEntry; version: ContentVersion; schema: ContentTypeSchema } | null> {
  const entry = await contentEntryRepository.findById(entryId as any);
  if (!entry) return null;

  // Prefer draft for editing
  let version = await contentVersionRepository.findByEntryAndStatus(entry.id, 'DRAFT');
  if (!version) {
    version = await contentVersionRepository.findByEntryAndStatus(entry.id, 'PUBLISHED');
  }
  if (!version) {
    version = await contentVersionRepository.findLatestByEntry(entry.id);
  }
  if (!version) return null;

  const schema = await schemaRepository.findById(entry.typeId);
  if (!schema) return null;

  return { entry, version, schema };
}

export async function getPublishedContent(
  typeId: string,
  locale: string,
  slug: string
): Promise<{ entry: ContentEntry; version: ContentVersion } | null> {
  const version = await contentVersionRepository.findPublishedBySlug(
    typeId as any,
    Locale(locale),
    slug
  );
  if (!version) return null;

  const entry = await contentEntryRepository.findById(version.entryId);
  if (!entry) return null;

  return { entry, version };
}

export async function getPublishedList(
  typeId: string,
  locale: string,
  options?: { limit?: number; offset?: number }
): Promise<Array<{ entry: ContentEntry; version: ContentVersion }>> {
  // Get all entries of type
  const entries = await contentEntryRepository.findByType(typeId as any, {
    limit: options?.limit ?? 20,
    offset: options?.offset ?? 0,
  });

  const results: Array<{ entry: ContentEntry; version: ContentVersion }> = [];

  for (const entry of entries) {
    const version = await contentVersionRepository.findByEntryAndStatus(entry.id, 'PUBLISHED');
    if (version) {
      results.push({ entry, version });
    }
  }

  return results;
}
