import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/adapters/prisma-adapter';

type CommentPayload = {
  postId?: unknown;
  parentId?: unknown;
  name?: unknown;
  email?: unknown;
  content?: unknown;
};

function asTrimmedString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CommentPayload;

    const postId = asTrimmedString(body.postId);
    const parentId = asTrimmedString(body.parentId);
    const name = asTrimmedString(body.name);
    const email = asTrimmedString(body.email);
    const content = asTrimmedString(body.content);

    if (!postId || !name || !email || !content) {
      return NextResponse.json(
        { error: 'Name, email, and comment are required.' },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const post = await prisma.posts.findFirst({
      where: { id: postId, status: 'published' },
      select: { id: true },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
    }

    if (parentId) {
      const parent = await prisma.comments.findFirst({
        where: {
          id: parentId,
          contentType: 'posts',
          contentId: postId,
        },
        select: { id: true },
      });

      if (!parent) {
        return NextResponse.json({ error: 'Parent comment not found.' }, { status: 404 });
      }
    }

    await prisma.comments.create({
      data: {
        content,
        authorName: name,
        authorEmail: email,
        contentType: 'posts',
        contentId: postId,
        parentId: parentId || null,
        status: 'pending',
        createdBy: 'public',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Your comment has been submitted for review.',
    });
  } catch (error) {
    console.error('Comment submission failed:', error);
    return NextResponse.json({ error: 'Failed to submit comment.' }, { status: 500 });
  }
}
