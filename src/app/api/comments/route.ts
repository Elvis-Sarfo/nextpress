import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/adapters/prisma-adapter';
import { validatePublicCommentPayload, type PublicCommentPayload } from '@/lib/editorial';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as PublicCommentPayload;
    const { postId, parentId, name, email, content, error } = validatePublicCommentPayload(body);

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
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
