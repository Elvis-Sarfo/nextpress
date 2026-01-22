import type { PrismaClient } from '@/adapters/prisma-adapter/prisma-client';
import {
  type CommentId,
  type PageId,
  type PostId,
  type NewsId,
  type PrincipalId,
  type Comment,
  type CommentWithReplies,
  type CommentRepository,
  type CommentListOptions,
  type CommentStatus,
} from '@/kernel';
import { commentMapper } from '../mappers/comment-mapper.js';

export class PrismaCommentRepository implements CommentRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: CommentId): Promise<Comment | null> {
    const record = await this.prisma.comment.findUnique({
      where: { id },
    });

    return record ? commentMapper.toDomain(record) : null;
  }

  async findByPage(
    pageId: PageId,
    options?: CommentListOptions
  ): Promise<CommentWithReplies[]> {
    const records = await this.prisma.comment.findMany({
      where: {
        pageId,
        ...(options?.status ? { status: options.status } : {}),
      },
      take: options?.limit,
      skip: options?.offset,
      orderBy: { createdAt: options?.orderDirection ?? 'desc' },
    });

    return commentMapper.toThreadedTree(records);
  }

  async findByPost(
    postId: PostId,
    options?: CommentListOptions
  ): Promise<CommentWithReplies[]> {
    const records = await this.prisma.comment.findMany({
      where: {
        postId,
        ...(options?.status ? { status: options.status } : {}),
      },
      take: options?.limit,
      skip: options?.offset,
      orderBy: { createdAt: options?.orderDirection ?? 'desc' },
    });

    return commentMapper.toThreadedTree(records);
  }

  async findByNews(
    newsId: NewsId,
    options?: CommentListOptions
  ): Promise<CommentWithReplies[]> {
    const records = await this.prisma.comment.findMany({
      where: {
        newsId,
        ...(options?.status ? { status: options.status } : {}),
      },
      take: options?.limit,
      skip: options?.offset,
      orderBy: { createdAt: options?.orderDirection ?? 'desc' },
    });

    return commentMapper.toThreadedTree(records);
  }

  async findPending(options?: CommentListOptions): Promise<Comment[]> {
    const records = await this.prisma.comment.findMany({
      where: { status: 'pending' },
      take: options?.limit,
      skip: options?.offset,
      orderBy: { createdAt: options?.orderDirection ?? 'desc' },
    });

    return records.map((r) => commentMapper.toDomain(r));
  }

  async findAll(options?: CommentListOptions): Promise<Comment[]> {
    const records = await this.prisma.comment.findMany({
      where: options?.status ? { status: options.status } : {},
      take: options?.limit,
      skip: options?.offset,
      orderBy: { createdAt: options?.orderDirection ?? 'desc' },
    });

    return records.map((r) => commentMapper.toDomain(r));
  }

  async count(options?: CommentListOptions): Promise<number> {
    return this.prisma.comment.count({
      where: options?.status ? { status: options.status } : {},
    });
  }

  async countPending(): Promise<number> {
    return this.prisma.comment.count({
      where: { status: 'pending' },
    });
  }

  async save(comment: Comment): Promise<void> {
    const existing = await this.prisma.comment.findUnique({
      where: { id: comment.id },
    });

    if (existing) {
      await this.prisma.comment.update({
        where: { id: comment.id },
        data: commentMapper.toUpdateInput(comment),
      });
    } else {
      await this.prisma.comment.create({
        data: commentMapper.toCreateInput(comment),
      });
    }
  }

  async updateStatus(
    id: CommentId,
    status: CommentStatus,
    moderatedBy: PrincipalId
  ): Promise<void> {
    await this.prisma.comment.update({
      where: { id },
      data: {
        status,
        moderatedBy,
        moderatedAt: new Date(),
      },
    });
  }

  async delete(id: CommentId): Promise<void> {
    await this.prisma.comment.delete({
      where: { id },
    });
  }

  async deleteByPage(pageId: PageId): Promise<void> {
    await this.prisma.comment.deleteMany({
      where: { pageId },
    });
  }

  async deleteByPost(postId: PostId): Promise<void> {
    await this.prisma.comment.deleteMany({
      where: { postId },
    });
  }

  async deleteByNews(newsId: NewsId): Promise<void> {
    await this.prisma.comment.deleteMany({
      where: { newsId },
    });
  }
}
