import { NextRequest, NextResponse } from 'next/server';
import { contentStore, schemaEngine } from '@/lib/cms';
import { contentTypeId, userId } from '@cms/kernel';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const typeId = searchParams.get('typeId');
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') ?? '20', 10);

  try {
    const result = await contentStore.query({
      filter: typeId ? { typeId: contentTypeId(typeId) } : undefined,
      page,
      pageSize,
      sort: { field: 'createdAt', direction: 'desc' },
    });

    return NextResponse.json(result);
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
    const { typeId: typeIdStr, data, createdBy } = body;

    if (!typeIdStr || !data || !createdBy) {
      return NextResponse.json(
        { error: 'Missing required fields: typeId, data, createdBy' },
        { status: 400 }
      );
    }

    // Validate content type exists
    const schema = await schemaEngine.getSchema(contentTypeId(typeIdStr));
    if (!schema) {
      return NextResponse.json(
        { error: `Content type ${typeIdStr} not found` },
        { status: 404 }
      );
    }

    const result = await contentStore.create({
      typeId: contentTypeId(typeIdStr),
      data,
      createdBy: userId(createdBy),
    });

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error.message, details: result.error.details },
        { status: 400 }
      );
    }

    return NextResponse.json(result.value, { status: 201 });
  } catch (error) {
    console.error('Failed to create content:', error);
    return NextResponse.json(
      { error: 'Failed to create content' },
      { status: 500 }
    );
  }
}
