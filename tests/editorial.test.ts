import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildArticleStructuredData,
  scoreRelatedPost,
  validatePublicCommentPayload,
} from '@/lib/editorial';
import { buildPostCategoryPath, buildPostItemPath, buildPostsListingPath } from '@/lib/agbon-routes';
import type { PostWithLocales } from '@/lib/cms';

function createPost(overrides: Partial<PostWithLocales> = {}): PostWithLocales {
  return {
    id: overrides.id ?? 'post-1',
    title: overrides.title ?? { en: 'Post Title' },
    slug: overrides.slug ?? { en: 'post-title' },
    excerpt: overrides.excerpt ?? { en: 'Excerpt' },
    content: overrides.content ?? { en: '<p>Body</p>' },
    categoryId: overrides.categoryId ?? 'cat-1',
    category: overrides.category ?? { id: 'cat-1', name: 'News', slug: { en: 'news' }, createdAt: new Date(), updatedAt: new Date() },
    featuredImageId: overrides.featuredImageId ?? null,
    featuredImage: overrides.featuredImage ?? null,
    authorId: overrides.authorId ?? null,
    author: overrides.author ?? null,
    tags: overrides.tags ?? [{ tag: 'agbon' }],
    publishedAt: overrides.publishedAt ?? new Date('2026-03-21T00:00:00.000Z'),
    status: overrides.status ?? 'published',
    seo: overrides.seo ?? null,
    createdAt: overrides.createdAt ?? new Date('2026-03-20T00:00:00.000Z'),
    updatedAt: overrides.updatedAt ?? new Date('2026-03-22T00:00:00.000Z'),
    documentId: overrides.documentId ?? null,
  };
}

test('builds editorial routes with category segments', () => {
  assert.equal(buildPostsListingPath('en'), '/en/posts');
  assert.equal(buildPostCategoryPath('en', 'news'), '/en/posts/news');
  assert.equal(buildPostItemPath('en', 'news', 'welcome'), '/en/posts/news/welcome');
});

test('builds article structured data with canonical post URL', () => {
  const jsonLd = buildArticleStructuredData({
    locale: 'en',
    categorySlug: 'news',
    title: 'Welcome to NextPress',
    description: 'Latest release notes',
    authorName: 'Admin',
    categoryName: 'News',
    publishedAt: new Date('2026-03-21T00:00:00.000Z'),
    updatedAt: new Date('2026-03-22T00:00:00.000Z'),
    slug: 'welcome-to-nextpress',
    imageUrl: '/uploads/post.jpg',
  });

  assert.equal(jsonLd['@type'], 'Article');
  assert.equal(jsonLd.headline, 'Welcome to NextPress');
  assert.deepEqual(jsonLd.mainEntityOfPage, {
    '@type': 'WebPage',
    '@id': '/en/posts/news/welcome-to-nextpress',
  });
});

test('related post scoring prefers shared tags over plain recency', () => {
  const current = createPost({ tags: [{ tag: 'agbon' }, { tag: 'launch' }] });
  const strongMatch = createPost({
    id: 'post-2',
    tags: [{ tag: 'launch' }, { tag: 'agbon' }],
    publishedAt: new Date('2026-03-19T00:00:00.000Z'),
  });
  const recentWeakMatch = createPost({
    id: 'post-3',
    tags: [{ tag: 'other' }],
    publishedAt: new Date('2026-03-25T00:00:00.000Z'),
  });

  assert.ok(scoreRelatedPost(strongMatch, current) > scoreRelatedPost(recentWeakMatch, current));
});

test('validates public comment payloads', () => {
  const invalid = validatePublicCommentPayload({
    postId: 'post-1',
    name: 'Jane',
    email: 'not-an-email',
    content: 'Hello',
  });
  assert.equal(invalid.error, 'Please enter a valid email address.');

  const valid = validatePublicCommentPayload({
    postId: 'post-1',
    parentId: 'comment-1',
    name: 'Jane',
    email: 'jane@example.com',
    content: 'Hello',
  });
  assert.equal(valid.error, undefined);
  assert.equal(valid.postId, 'post-1');
  assert.equal(valid.parentId, 'comment-1');
});
