import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');

export type PrismaProvider = 'postgresql' | 'mysql' | 'sqlite' | 'sqlserver' | 'cockroachdb';

const DEFAULT_PROVIDER: PrismaProvider = 'postgresql';

export function getPrismaProvider(): PrismaProvider {
  const envProvider = process.env.PRISMA_DB_PROVIDER?.trim().toLowerCase();

  if (isPrismaProvider(envProvider)) {
    return envProvider;
  }

  try {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    const match = schema.match(/datasource\s+\w+\s*\{[\s\S]*?provider\s*=\s*"([^"]+)"/m);
    const provider = match?.[1]?.trim().toLowerCase();

    if (isPrismaProvider(provider)) {
      return provider;
    }
  } catch {
    // Fall back to the historical default if the generated schema is unavailable.
  }

  return DEFAULT_PROVIDER;
}

function isPrismaProvider(value: string | undefined): value is PrismaProvider {
  return (
    value === 'postgresql' ||
    value === 'mysql' ||
    value === 'sqlite' ||
    value === 'sqlserver' ||
    value === 'cockroachdb'
  );
}

export function usesPostgresAdapter(provider: PrismaProvider): boolean {
  return provider === 'postgresql' || provider === 'cockroachdb';
}

export function usesMariaDbAdapter(provider: PrismaProvider): boolean {
  return provider === 'mysql';
}
