import type { Comment as PrismaComment } from '@prisma/client';
import {
  CommentId,
  PageId,
  PostId,
  NewsId,
  PrincipalId,
  type Comment,
  type CommentStatus,
  type CommentWithReplies,
  buildCommentTree,
} from '@cms/kernel';

/**
 * Maps between Prisma Comment and kernel Comment.
 */
export class CommentMapper {
  /**
   * Prisma model → Kernel domain object.
   */
  toDomain(prisma: PrismaComment): Comment {
    return {
      id: CommentId(prisma.id),
      pageId: prisma.pageId ? PageId(prisma.pageId) : null,
      postId: prisma.postId ? PostId(prisma.postId) : null,
      newsId: prisma.newsId ? NewsId(prisma.newsId) : null,
      parentId: prisma.parentId ? CommentId(prisma.parentId) : null,
      authorName: prisma.authorName,
      authorEmail: prisma.authorEmail,
      authorUrl: prisma.authorUrl,
      authorIp: prisma.authorIp,
      content: prisma.content,
      status: prisma.status as CommentStatus,
      moderatedBy: prisma.moderatedBy ? PrincipalId(prisma.moderatedBy) : null,
      moderatedAt: prisma.moderatedAt,
      userAgent: prisma.userAgent,
      createdAt: prisma.createdAt,
      updatedAt: prisma.updatedAt,
    };
  }

  /**
   * Convert flat comments list to threaded tree.
   */
  toThreadedTree(prismaComments: PrismaComment[]): CommentWithReplies[] {
    const comments = prismaComments.map((c) => this.toDomain(c));
    return buildCommentTree(comments);
  }

  /**
   * Kernel domain object → Prisma create input.
   */
  toCreateInput(domain: Comment): {
    id: string;
    pageId?: string;
    postId?: string;
    newsId?: string;
    parentId?: string;
    authorName: string;
    authorEmail: string;
    authorUrl?: string;
    authorIp?: string;
    content: string;
    status: string;
    userAgent?: string;
  } {
    return {
      id: domain.id,
      pageId: domain.pageId ?? undefined,
      postId: domain.postId ?? undefined,
      newsId: domain.newsId ?? undefined,
      parentId: domain.parentId ?? undefined,
      authorName: domain.authorName,
      authorEmail: domain.authorEmail,
      authorUrl: domain.authorUrl ?? undefined,
      authorIp: domain.authorIp ?? undefined,
      content: domain.content,
      status: domain.status,
      userAgent: domain.userAgent ?? undefined,
    };
  }

  /**
   * Kernel domain object → Prisma update input.
   */
  toUpdateInput(domain: Partial<Comment>): {
    content?: string;
    status?: string;
    moderatedBy?: string;
    moderatedAt?: Date;
  } {
    const input: ReturnType<typeof this.toUpdateInput> = {};

    if (domain.content !== undefined) input.content = domain.content;
    if (domain.status !== undefined) input.status = domain.status;
    if (domain.moderatedBy !== undefined) input.moderatedBy = domain.moderatedBy ?? undefined;
    if (domain.moderatedAt !== undefined) input.moderatedAt = domain.moderatedAt ?? undefined;

    return input;
  }
}

export const commentMapper = new CommentMapper();
