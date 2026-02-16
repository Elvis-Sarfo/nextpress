# Payload CMS Collections Integration Plan

## Overview

This plan describes how to integrate Payload CMS-style collections into NextPress, with automatic Prisma schema generation from collection configs.

## Current Implementation Status

### ✅ Completed

| Component | Status |
|-----------|--------|
| CollectionConfig type system | ✅ Done |
| Field types (text, number, relationship, etc.) | ✅ Done |
| Collection registry (CollectionRegistryClass) | ✅ Done |
| Schema engine (generatePrismaSchema) | ✅ Done |
| nextpress.config.ts (central config) | ✅ Done |
| Initialization strategies (once/hash/always) | ✅ Done |

### Collections Implemented

| Collection | Localization | Versioning | Status |
|------------|--------------|------------|--------|
| Users | ❌ No | ❌ No | ✅ Done |
| Roles | ❌ No | ❌ No | ✅ Done |
| Permissions | ❌ No | ❌ No | ✅ Done |
| Media | ✅ Yes (en/fr/de) | ✅ Yes | ✅ Done |
| Pages | ✅ Yes (en/fr/de) | ✅ Yes | ✅ Done |
| Settings | ✅ Yes | ✅ Yes | ✅ Done (existing) |

## Architecture

### Flow: Collection Config → Prisma Schema

```mermaid
flowchart TD
    A[nextpress.config.ts] --> B[initializeNextPress()]
    B --> C[Collections.initFromConfig()]
    C --> D{schema.generateOnStart?}
    D -->|Yes| E[generateSchema()]
    D -->|No| F[Skip]
    E --> G[generatePrismaSchema()]
    G --> H[schema.prisma]
```

### Configuration System

**`src/nextpress.config.ts`** - Central configuration:

```typescript
export default {
  // Collections to register
  collections: [Users, Roles, Permissions, Media, Pages, Settings],
  
  // Database config
  db: {
    provider: 'postgres',
    url: process.env.DATABASE_URI,
  },
  
  // Schema generation settings
  schema: {
    generateOnStart: process.env.NODE_ENV === 'development',
    outputPath: 'src/adapters/prisma-adapter/prisma/schema.prisma',
    strategy: 'once',  // 'once' | 'hash' | 'always'
  },
  
  // Localization
  localization: {
    locales: [{ code: 'en', label: 'English' }, { code: 'fr', label: 'Français' }],
    defaultLocale: 'en',
  },
};
```

### Initialization Strategies

| Strategy | Behavior | Use Case |
|----------|----------|----------|
| `'once'` | Run once per server start (default) | Production & most dev |
| `'hash'` | Run when collection config changes | Precise dev workflow |
| `'always'` | Run every time | Debugging |

## CollectionConfig Type System

### Location
- `src/core/collection/types.ts` - Type definitions
- `src/core/collection/registry.ts` - Collection registry
- `src/core/collection/index.ts` - Exports

### Field Types Supported

```typescript
type FieldType = 
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'checkbox'
  | 'date'
  | 'json'
  | 'select'
  | 'upload'
  | 'relationship'
  | 'array'
  | 'group'
  | 'richText';
```

### Collection Options

```typescript
interface CollectionConfig<T extends CollectionSlug> {
  slug: T;
  labels?: { singular: string; plural: string };
  admin?: { useAsTitle?: string; group?: string; defaultColumns?: string[] };
  access?: {
    create?: AccessCondition;
    read?: AccessCondition;
    update?: AccessCondition;
    delete?: AccessCondition;
  };
  fields: Field[];
  auth?: AuthConfig | boolean;
  versions?: { enabled: boolean; maxPerDoc?: number } | boolean;
  localization?: { locales: string[]; defaultLocale: string; fallback?: boolean } | boolean;
  indexes?: Index[];
  hooks?: Hooks;
}
```

## Schema Engine

### Location
- `src/core/schema-engine/index.ts` - Main engine

### Output Pattern

Each collection generates:

```prisma
// Main table (non-localized fields only)
model CollectionName {
  id        String   @id @default(uuid())
  documentId String  @unique  // For versioning
  status    String   // DRAFT, PUBLISHED
  // ... non-localized fields
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  locales   CollectionNameLocale[]
  versions  CollectionNameVersion[]
}

// Localized fields (if localization enabled)
model CollectionNameLocale {
  id            String  @id @default(uuid())
  collectionId  String
  locale        String  @db.VarChar(10)
  // ... localized fields
  
  collection    CollectionName @relation(...)
}

// Version history (if versioning enabled)
model CollectionNameVersion {
  id         String   @id @default(uuid())
  documentId String
  version    Int
  data       Json     // Full snapshot
  createdAt  DateTime @default(now())
}
```

## Running Schema Generation

### Via Command Line
```bash
npm run schema:generate
# or
pnpm schema:generate
```

### On Project Start
Configured in `nextpress.config.ts`:
```typescript
schema: {
  generateOnStart: process.env.NODE_ENV === 'development',
  strategy: 'once',  // or 'hash' or 'always'
}
```

## Next Steps (Remaining Work)

### 1. Create Remaining Collections
- Products (complex with nested arrays)
- Categories (hierarchical)
- Countries
- HeroSlides
- ContentBlocks

### 2. Database Migration
```bash
npm run db:migrate
# or
cd src/adapters/prisma-adapter && npx prisma migrate dev
```

### 3. Repository Layer
Create repositories in `src/kernel/collection/repositories/`

### 4. Service Layer with RBAC
Integrate with existing RBAC engine

### 5. Admin Dashboard
Create admin pages in `src/app/admin/`

### 6. API Layer
Create REST endpoints in `src/app/api/`

## RBAC Integration

| Collection | Admin | Editor | Author | Viewer |
|------------|-------|--------|--------|--------|
| Users | CRUD | Read | - | - |
| Roles | CRUD | - | - | - |
| Permissions | CRUD | - | - | - |
| Media | CRUD | CRUD | - | Read |
| Pages | CRUD+P | CRUD | Own | Read |
| Products | CRUD+P | CRUD | Own | Read |

## Notes

- Users, Roles, Permissions: No localization (system-wide, not content)
- Media, Pages: Localization enabled for multi-language content
- Schema changes detected via hash or file modification
- Collections are now centrally managed via `nextpress.config.ts`
