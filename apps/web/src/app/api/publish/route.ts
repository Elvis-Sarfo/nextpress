import { NextRequest, NextResponse } from 'next/server';
import { contentStore } from '@/lib/cms';
import { contentId, userId } from '@cms/kernel';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contentId: contentIdStr, actor } = body;

    if (!contentIdStr || !actor) {
      return NextResponse.json(
        { error: 'Missing required fields: contentId, actor' },
        { status: 400 }
      );
    }

    const result = await contentStore.publish(
      contentId(contentIdStr),
      userId(actor)
    );

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error.message, details: result.error.details },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      entry: result.value,
    });
  } catch (error) {
    console.error('Failed to publish content:', error);
    return NextResponse.json(
      { error: 'Failed to publish content' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { contentId: contentIdStr, actor } = body;

    if (!contentIdStr || !actor) {
      return NextResponse.json(
        { error: 'Missing required fields: contentId, actor' },
        { status: 400 }
      );
    }

    const result = await contentStore.unpublish(
      contentId(contentIdStr),
      userId(actor)
    );

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error.message, details: result.error.details },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      entry: result.value,
    });
  } catch (error) {
    console.error('Failed to unpublish content:', error);
    return NextResponse.json(
      { error: 'Failed to unpublish content' },
      { status: 500 }
    );
  }
}
