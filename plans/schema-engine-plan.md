# Schema Engine Plan: Collection to Prisma Converter

## Overview

Create a schema engine that converts NextPress CollectionConfig definitions into Prisma schema for database migration.

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ CollectionConfig│────▶│  Schema Engine   │────▶│ Prisma Schema   │
│ (TypeScript)    │     │ (Transformer)    │     │ (.prisma file)  │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

## Key Components

### 1. Field Type Mapper
Maps Collection field types to Prisma types:

| Collection Type | Prisma Type | Notes |
|----------------|-------------|-------|
| `text` | `String` | @db.VarChar(n) |
| `textarea` | `String` | @db.Text |
| `number` | `Int` or `Float` | |
| `email` | `String` | @db.VarChar(255) |
| `checkbox` | `Boolean` | |
| `date` | `DateTime` | |
| `json` | `Json` | |
| `select` | `String` | @db.VarChar(n) |
| `upload` | `String` | Relation to Media |
| `relationship` | `String` | Relation ID |
| `array` | `Json` | Stored as JSON |
| `group` | `Json` | Stored as JSON |
| `richText` | `Json` | Lexical editor JSON |

### 2. Model Generator

For each collection, generates:

```prisma
// Main model
model CollectionName {
  id            String    @id @default(uuid())
  documentId    String
  status        String    @db.VarChar(20)
  // ... field columns
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  createdBy     String?   @db.VarChar(255)

  locales       CollectionNameLocale[]
  versions     CollectionNameVersion[]

  @@unique([documentId, status])
  @@index([status])
  @@map("collection_name")
}

// Locale model (if localization enabled)
model CollectionNameLocale {
  id          String  @id @default(uuid())
  collectionId String
  locale      String  @db.VarChar(10)
  // ... localized fields

  collection  CollectionName @relation(fields: [collectionId], references: [id], onDelete: Cascade)

  @@unique([collectionId, locale])
  @@index([locale])
  @@map("collection_name_locale")
}

// Version model (if versioning enabled)
model CollectionNameVersion {
  id         String   @id @default(uuid())
  documentId String
  version    Int
  data       Json
  createdAt  DateTime @default(now())
  createdBy  String   @db.VarChar(255)

  @@unique([documentId, version])
  @@index([documentId])
  @@map("collection_name_version")
}
```

### 3. Relationship Handler

- **hasMany**: Add relation field to target model
- **belongsTo**: Add foreign key column
- Self-referencing: Handle parent/child relationships

### 4. Index Generator

- Auto-generate indexes for:
  - `status` field
  - `documentId` field  
  - Unique fields (from `unique: true`)
  - Foreign keys
  - `locale` in locale tables

## Implementation Plan

### Step 1: Schema Engine Core
Create `src/core/schema-engine/index.ts`:

```typescript
// Main functions:
- generatePrismaSchema(collections: CollectionConfig[]): string
- generateModel(config: CollectionConfig): PrismaModel
- generateLocaleModel(config: CollectionConfig): PrismaModel
- generateVersionModel(config: CollectionConfig): PrismaModel
```

### Step 2: Field Transformers
Create `src/core/schema-engine/fields.ts`:

```typescript
// Functions:
- mapFieldToPrisma(field: Field): PrismaField
- getPrismaType(field: Field): string
- getPrismaAttributes(field: Field): string[]
```

### Step 3: Relationship Resolver
Create `src/core/schema-engine/relations.ts`:

```typescript
// Functions:
- resolveRelationships(collections: CollectionConfig[]): void
- addRelationField(model: PrismaModel, field: RelationshipField): void
```

### Step 4: Migration Generator
Create `src/core/schema-engine/migration.ts`:

```typescript
// Functions:
- generateMigration(name: string, schema: string): string
- applyMigration(schema: string): Promise<void>
```

## Data Structures

### PrismaModel
```typescript
interface PrismaModel {
  name: string;
  fields: PrismaField[];
  indexes: PrismaIndex[];
  uniqueConstraints: string[];
  map: string; // table name
  relations: PrismaRelation[];
}
```

### PrismaField
```typescript
interface PrismaField {
  name: string;
  type: string;
  isOptional: boolean;
  isList: boolean;
  default?: string;
  attributes: string[]; // @db.VarChar(100), @default(), etc.
  relation?: PrismaRelation;
}
```

### PrismaRelation
```typescript
interface PrismaRelation {
  name: string;
  fields: string[];
  references: string[];
  onDelete?: 'Cascade' | 'SetNull' | 'Restrict';
}
```

## Output

Generates complete `schema.prisma` file with:
- Generator and datasource blocks
- All models with proper relations
- Indexes and unique constraints
- Table mappings

## Usage

```typescript
import { generatePrismaSchema } from './schema-engine';
import { Collections } from './collection/registry';

// Get all registered collections
const collections = Collections.getAll();

// Generate Prisma schema
const schema = generatePrismaSchema(collections);

// Write to file
await writeFile('./prisma/schema.prisma', schema);
```

## Error Handling

- Validate collection before generation
- Check for duplicate slugs
- Validate relationship targets exist
- Warn about unsupported field types
