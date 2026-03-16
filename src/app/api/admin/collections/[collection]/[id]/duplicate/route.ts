import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { auth } from '@/auth';
import { prisma } from '@/adapters/prisma-adapter';

function createDocumentId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function appendCopySuffix(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return 'copy';
  return /\(copy\)$/i.test(trimmed) ? trimmed : `${trimmed} (Copy)`;
}

function appendCopyToSlug(value: string): string {
  const trimmed = value.trim().replace(/^-+|-+$/g, '');
  if (!trimmed) return 'copy';
  return /-copy$/i.test(trimmed) ? trimmed : `${trimmed}-copy`;
}

async function getUniqueLocalizedSlugs(sourceSlug: unknown): Promise<Record<string, string>> {
  const slugMap =
    sourceSlug && typeof sourceSlug === 'object' && !Array.isArray(sourceSlug)
      ? (sourceSlug as Record<string, unknown>)
      : {};

  const next: Record<string, string> = {};

  for (const [locale, rawValue] of Object.entries(slugMap)) {
    if (typeof rawValue !== 'string') continue;

    const baseSlug = appendCopyToSlug(rawValue);
    let candidate = baseSlug;
    let suffix = 2;

    while (true) {
      const existing = await prisma.pages.findFirst({
        where: { slug: { path: `$.${locale}`, equals: candidate } },
        select: { id: true },
      });

      if (!existing) {
        next[locale] = candidate;
        break;
      }

      candidate = `${baseSlug}-${suffix}`;
      suffix += 1;
    }
  }

  return next;
}

function asInputJson(value: unknown): Prisma.InputJsonValue | typeof Prisma.JsonNull | undefined {
  if (value === undefined) return undefined;
  if (value === null) return Prisma.JsonNull;
  return value as Prisma.InputJsonValue;
}

function asRequiredInputJson(value: unknown): Prisma.InputJsonValue | typeof Prisma.JsonNull {
  if (value === null) return Prisma.JsonNull;
  return value as Prisma.InputJsonValue;
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ collection: string; id: string }> }
) {
  const session = await auth();
  if (!session || (session.user.role !== 'admin' && session.user.role !== 'editor')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { collection, id } = await params;
  if (collection !== 'pages') {
    return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
  }

  const source = await prisma.pages.findUnique({
    where: { id },
  });

  if (!source) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  }

  const sourceTitle =
    source.title && typeof source.title === 'object' && !Array.isArray(source.title)
      ? (source.title as Record<string, unknown>)
      : {};

  const duplicatedTitle = Object.fromEntries(
    Object.entries(sourceTitle).map(([locale, value]) => [
      locale,
      typeof value === 'string' ? appendCopySuffix(value) : value,
    ])
  );

  const duplicatedSlug = await getUniqueLocalizedSlugs(source.slug);

  try {
    const doc = await prisma.pages.create({
      data: {
        documentId: createDocumentId(),
        title: asRequiredInputJson(duplicatedTitle),
        slug: asRequiredInputJson(duplicatedSlug),
        excerpt: asInputJson(source.excerpt),
        sections: asInputJson(source.sections),
        config: asInputJson(source.config),
        parentId: source.parentId,
        order: source.order,
        status: 'draft',
        isIndexPage: false,
        featuredImageId: source.featuredImageId,
        seo: asInputJson(source.seo),
        metadata: asInputJson(source.metadata),
        createdBy: session.user.id,
      },
      select: { id: true },
    });

    return NextResponse.json({ doc }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Duplicate failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
