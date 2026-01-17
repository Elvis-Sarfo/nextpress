import { NextRequest, NextResponse } from 'next/server';
import {
  getContentEntry,
  contentVersionRepository,
  eventBus,
  requirePrincipal,
} from '@/lib/cms';
import { createEvent, type ContentPublishedEvent, type ContentUnpublishedEvent } from '@cms/kernel';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contentId: contentIdStr } = body;

    if (!contentIdStr) {
      return NextResponse.json(
        { error: 'Missing required field: contentId' },
        { status: 400 }
      );
    }

    // Get the current principal (user)
    const principal = await requirePrincipal();

    // Get the content entry
    const result = await getContentEntry(contentIdStr);
    if (!result) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    const { entry, version } = result;

    // Check if already published
    if (version.status === 'PUBLISHED') {
      return NextResponse.json(
        { error: 'Content is already published' },
        { status: 400 }
      );
    }

    // Archive any existing published version
    const existingPublished = await contentVersionRepository.findByEntryAndStatus(
      entry.id,
      'PUBLISHED'
    );
    if (existingPublished) {
      await contentVersionRepository.save({
        ...existingPublished,
        status: 'ARCHIVED',
      });
    }

    // Update the current version to published
    const publishedVersion = {
      ...version,
      status: 'PUBLISHED' as const,
      publishedAt: new Date(),
    };

    await contentVersionRepository.save(publishedVersion);

    // Get slug from version data for event
    const versionData = version.data as {
      locales?: Record<string, { slug?: string }>;
    };
    const slug = versionData?.locales?.[entry.defaultLocale]?.slug ?? entry.id;

    // Emit publish event
    const event = createEvent<ContentPublishedEvent>(
      'CONTENT_PUBLISHED',
      principal.id,
      {
        entryId: entry.id,
        versionId: version.id,
        typeId: entry.typeId,
        locale: entry.defaultLocale,
        slug,
        previousVersionId: existingPublished?.id,
      }
    );
    eventBus.emit(event);

    return NextResponse.json({
      success: true,
      entry: {
        id: entry.id,
        status: 'PUBLISHED',
        publishedAt: publishedVersion.publishedAt,
      },
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
    const { contentId: contentIdStr } = body;

    if (!contentIdStr) {
      return NextResponse.json(
        { error: 'Missing required field: contentId' },
        { status: 400 }
      );
    }

    // Get the current principal (user)
    const principal = await requirePrincipal();

    // Get the content entry
    const result = await getContentEntry(contentIdStr);
    if (!result) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    const { entry } = result;

    // Find published version
    const publishedVersion = await contentVersionRepository.findByEntryAndStatus(
      entry.id,
      'PUBLISHED'
    );

    if (!publishedVersion) {
      return NextResponse.json(
        { error: 'Content is not published' },
        { status: 400 }
      );
    }

    // Archive the published version
    await contentVersionRepository.save({
      ...publishedVersion,
      status: 'ARCHIVED',
    });

    // Emit unpublish event
    const event = createEvent<ContentUnpublishedEvent>(
      'CONTENT_UNPUBLISHED',
      principal.id,
      {
        entryId: entry.id,
        versionId: publishedVersion.id,
        typeId: entry.typeId,
      }
    );
    eventBus.emit(event);

    return NextResponse.json({
      success: true,
      entry: {
        id: entry.id,
        status: 'ARCHIVED',
      },
    });
  } catch (error) {
    console.error('Failed to unpublish content:', error);
    return NextResponse.json(
      { error: 'Failed to unpublish content' },
      { status: 500 }
    );
  }
}
