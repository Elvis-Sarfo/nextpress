import { NextRequest, NextResponse } from 'next/server';
import {
  getContentTypes,
  getContentEntries,
  getContentType,
  contentEntryRepository,
  contentVersionRepository,
  requirePrincipal,
  localeEngine,
} from '@/lib/cms';
import {
  ContentTypeId,
  ContentEntryId,
  ContentVersionId,
  Locale,
} from '@cms/kernel';
import { randomUUID } from 'crypto';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const typeId = searchParams.get('typeId');
  const limit = parseInt(searchParams.get('limit') ?? '20', 10);
  const offset = parseInt(searchParams.get('offset') ?? '0', 10);

  try {
    if (typeId) {
      // Get entries for specific type
      const result = await getContentEntries(typeId, { limit, offset });
      return NextResponse.json({
        entries: result.entries.map(({ entry, version }) => ({
          id: entry.id,
          typeId: entry.typeId,
          createdBy: entry.createdBy,
          createdAt: entry.createdAt,
          defaultLocale: entry.defaultLocale,
          version: {
            id: version.id,
            version: version.version,
            status: version.status,
            data: version.data,
          },
        })),
        total: result.total,
        limit,
        offset,
      });
    } else {
      // Get all content types with their entries
      const types = await getContentTypes();
      const allEntries = [];

      for (const type of types) {
        const result = await getContentEntries(type.id, { limit: 10 });
        for (const { entry, version } of result.entries) {
          allEntries.push({
            id: entry.id,
            typeId: entry.typeId,
            typeName: type.name,
            createdBy: entry.createdBy,
            createdAt: entry.createdAt,
            status: version.status,
          });
        }
      }

      return NextResponse.json({
        entries: allEntries.slice(offset, offset + limit),
        total: allEntries.length,
        limit,
        offset,
      });
    }
  } catch (error) {
    console.error('Failed to fetch content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { typeId: typeIdStr, data, locale } = body;

    if (!typeIdStr || !data) {
      return NextResponse.json(
        { error: 'Missing required fields: typeId, data' },
        { status: 400 }
      );
    }

    // Get the current principal (user)
    const principal = await requirePrincipal();

    // Validate content type exists
    const schema = await getContentType(typeIdStr);
    if (!schema) {
      return NextResponse.json(
        { error: `Content type ${typeIdStr} not found` },
        { status: 404 }
      );
    }

    // Create the entry
    const entryId = ContentEntryId(randomUUID());
    const versionId = ContentVersionId(randomUUID());
    const defaultLocale = Locale(locale ?? localeEngine.getDefaultLocale());

    const entry = {
      id: entryId,
      typeId: ContentTypeId(typeIdStr),
      createdBy: principal.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      defaultLocale,
      deletedAt: undefined,
    };

    await contentEntryRepository.save(entry);

    // Create initial draft version
    const version = {
      id: versionId,
      entryId,
      version: 1,
      status: 'DRAFT' as const,
      data: {
        locales: {
          [defaultLocale]: data,
        },
      },
      createdBy: principal.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: undefined,
      scheduledAt: undefined,
    };

    await contentVersionRepository.save(version);

    return NextResponse.json(
      {
        id: entryId,
        typeId: typeIdStr,
        version: {
          id: versionId,
          version: 1,
          status: 'DRAFT',
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create content:', error);
    return NextResponse.json(
      { error: 'Failed to create content' },
      { status: 500 }
    );
  }
}
