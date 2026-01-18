import type {
  CommentId,
  PageId,
  PostId,
  NewsId,
  PrincipalId,
} from '../core/types.js';

// ============================================================================
// COMMENT STATUS
// ============================================================================

export type CommentStatus = 'pending' | 'approved' | 'spam' | 'trash';

// ============================================================================
// COMMENT
// ============================================================================

export interface Comment {
  id: CommentId;
  // Polymorphic reference - exactly one should be set
  pageId: PageId | null;
  postId: PostId | null;
  newsId: NewsId | null;
  // Threading
  parentId: CommentId | null;
  // Author info
  authorName: string;
  authorEmail: string;
  authorUrl: string | null;
  authorIp: string | null;
  // Content
  content: string;
  status: CommentStatus;
  // Moderation
  moderatedBy: PrincipalId | null;
  moderatedAt: Date | null;
  userAgent: string | null;
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// COMMENT WITH REPLIES (threaded)
// ============================================================================

export interface CommentWithReplies extends Comment {
  replies: CommentWithReplies[];
}

// ============================================================================
// CONTENT TYPE FOR COMMENTS
// ============================================================================

export type CommentableContentType = 'page' | 'post' | 'news';

// ============================================================================
// REPOSITORY INTERFACES
// ============================================================================

export interface CommentListOptions {
  status?: CommentStatus;
  limit?: number;
  offset?: number;
  orderBy?: 'createdAt';
  orderDirection?: 'asc' | 'desc';
}

export interface CommentRepository {
  // Find operations
  findById(id: CommentId): Promise<Comment | null>;
  findByPage(pageId: PageId, options?: CommentListOptions): Promise<CommentWithReplies[]>;
  findByPost(postId: PostId, options?: CommentListOptions): Promise<CommentWithReplies[]>;
  findByNews(newsId: NewsId, options?: CommentListOptions): Promise<CommentWithReplies[]>;
  findPending(options?: CommentListOptions): Promise<Comment[]>;
  findAll(options?: CommentListOptions): Promise<Comment[]>;
  count(options?: CommentListOptions): Promise<number>;
  countPending(): Promise<number>;

  // Write operations
  save(comment: Comment): Promise<void>;
  updateStatus(id: CommentId, status: CommentStatus, moderatedBy: PrincipalId): Promise<void>;
  delete(id: CommentId): Promise<void>;
  deleteByPage(pageId: PageId): Promise<void>;
  deleteByPost(postId: PostId): Promise<void>;
  deleteByNews(newsId: NewsId): Promise<void>;
}

// ============================================================================
// HELPER: Build comment tree
// ============================================================================

export function buildCommentTree(comments: Comment[]): CommentWithReplies[] {
  const commentMap = new Map<string, CommentWithReplies>();
  const roots: CommentWithReplies[] = [];

  // First pass: create all nodes
  for (const comment of comments) {
    commentMap.set(comment.id, { ...comment, replies: [] });
  }

  // Second pass: build tree
  for (const comment of comments) {
    const node = commentMap.get(comment.id)!;
    if (comment.parentId) {
      const parent = commentMap.get(comment.parentId as string);
      if (parent) {
        parent.replies.push(node);
      } else {
        // Parent not found, treat as root
        roots.push(node);
      }
    } else {
      roots.push(node);
    }
  }

  return roots;
}
