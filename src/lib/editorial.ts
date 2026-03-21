import { buildPostItemPath } from '@/lib/agbon-routes';
import type { PostWithLocales } from '@/lib/cms';

export function getTagNames(tags: unknown): string[] {
  if (!Array.isArray(tags)) return [];

  return tags
    .map((tag) => {
      if (typeof tag === 'string') return tag.trim().toLowerCase();
      if (tag && typeof tag === 'object' && 'tag' in tag) {
        const value = (tag as { tag?: unknown }).tag;
        return typeof value === 'string' ? value.trim().toLowerCase() : '';
      }
      return '';
    })
    .filter((tag): tag is string => Boolean(tag));
}

export function scoreRelatedPost(candidate: PostWithLocales, currentPost: PostWithLocales): number {
  const candidateTags = new Set(getTagNames(candidate.tags));
  const currentTags = getTagNames(currentPost.tags);
  const sharedTagCount = currentTags.filter((tag) => candidateTags.has(tag)).length;
  const sameCategory = candidate.category?.id && currentPost.category?.id
    ? candidate.category.id === currentPost.category.id
    : false;
  const timestamp = new Date(candidate.publishedAt ?? candidate.createdAt).getTime();

  return (sameCategory ? 1000 : 0) + sharedTagCount * 100 + timestamp / 1_000_000_000_000;
}

export function buildArticleStructuredData(params: {
  locale: string;
  categorySlug: string;
  title: string;
  description?: string | null;
  authorName: string;
  categoryName: string;
  publishedAt: Date;
  updatedAt: Date;
  slug: string;
  imageUrl?: string | null;
}): Record<string, unknown> {
  const {
    locale,
    categorySlug,
    title,
    description,
    authorName,
    categoryName,
    publishedAt,
    updatedAt,
    slug,
    imageUrl,
  } = params;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description ?? undefined,
    datePublished: publishedAt.toISOString(),
    dateModified: updatedAt.toISOString(),
    articleSection: categoryName,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': buildPostItemPath(locale, categorySlug, slug),
    },
    image: imageUrl ? [imageUrl] : undefined,
  };
}

export type PublicCommentPayload = {
  postId?: unknown;
  parentId?: unknown;
  name?: unknown;
  email?: unknown;
  content?: unknown;
};

export function asTrimmedString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePublicCommentPayload(body: PublicCommentPayload): {
  postId: string;
  parentId: string;
  name: string;
  email: string;
  content: string;
  error?: string;
} {
  const postId = asTrimmedString(body.postId);
  const parentId = asTrimmedString(body.parentId);
  const name = asTrimmedString(body.name);
  const email = asTrimmedString(body.email);
  const content = asTrimmedString(body.content);

  if (!postId || !name || !email || !content) {
    return {
      postId,
      parentId,
      name,
      email,
      content,
      error: 'Name, email, and comment are required.',
    };
  }

  if (!isValidEmail(email)) {
    return {
      postId,
      parentId,
      name,
      email,
      content,
      error: 'Please enter a valid email address.',
    };
  }

  return { postId, parentId, name, email, content };
}
