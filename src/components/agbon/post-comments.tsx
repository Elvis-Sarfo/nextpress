'use client';

import { FormEvent, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { CommentWithReplies } from '@/lib/cms';

interface PostCommentsProps {
  postId: string;
  comments: CommentWithReplies[];
}

function formatDate(value: Date | string | null | undefined): string {
  return new Date(value ?? Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getCommentAuthor(comment: CommentWithReplies): string {
  if (typeof comment.authorName === 'string' && comment.authorName.trim()) {
    return comment.authorName;
  }

  const author = comment.author as { name?: string | null } | undefined;
  return author?.name?.trim() || 'Anonymous';
}

function CommentThread({ comments, depth = 0 }: { comments: CommentWithReplies[]; depth?: number }) {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <article
          key={comment.id}
          className={`rounded-2xl border border-[#e8dcc5] bg-white p-2 shadow-sm ${depth > 0 ? 'ml-4 md:ml-8' : ''}`}
        >
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <span className="font-semibold text-[#1a1a1a]">{getCommentAuthor(comment)}</span>
            <span>{formatDate(comment.createdAt)}</span>
          </div>
          <p className="mt-0 whitespace-pre-wrap text-sm leading-7 text-gray-700">
            {comment.content ?? ''}
          </p>

          {comment.replies.length > 0 ? (
            <div className="mt-4 border-l-2 border-[#f1e4cd] pl-3">
              <CommentThread comments={comment.replies} depth={depth + 1} />
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}

export function PostComments({ postId, comments }: PostCommentsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, name, email, content }),
      });

      const result = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        setError(result.error ?? 'Failed to submit comment.');
        return;
      }

      setName('');
      setEmail('');
      setContent('');
      setSuccess(result.message ?? 'Comment submitted.');
      startTransition(() => router.refresh());
    } catch (submitError) {
      console.error('Comment submit failed:', submitError);
      setError('Failed to submit comment.');
    }
  }

  return (
    <section className="mt-6 rounded-[1rem] bg-[#fcfaf6] p-2 md:p-4">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7A5C00]">
          Discussion
        </p>
        <h2 className="mt-2 text-2xl font-black text-[#1a1a1a]">
          Comments ({comments.length})
        </h2>
        <p className="mt-3 text-sm leading-7 text-gray-600">
          New comments are reviewed before they appear publicly.
        </p>
      </div>

      {comments.length > 0 ? (
        <CommentThread comments={comments} />
      ) : (
        <div className="rounded-2xl border border-dashed border-[#e8dcc5] bg-white p-5 text-sm text-gray-600">
          No approved comments yet. Start the conversation below.
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl border border-[#e8dcc5] bg-white p-5 md:p-6">
        <h3 className="text-lg font-bold text-[#1a1a1a]">Leave a Comment</h3>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-[#1a1a1a]">
            <span>Name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="w-full rounded-xl border border-[#d9d9d9] px-4 py-3 text-sm outline-none transition focus:border-[#FF6B35]"
            />
          </label>

          <label className="space-y-2 text-sm font-medium text-[#1a1a1a]">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-xl border border-[#d9d9d9] px-4 py-3 text-sm outline-none transition focus:border-[#FF6B35]"
            />
          </label>
        </div>

        <label className="block space-y-2 text-sm font-medium text-[#1a1a1a]">
          <span>Comment</span>
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            required
            rows={6}
            className="w-full rounded-xl border border-[#d9d9d9] px-4 py-3 text-sm outline-none transition focus:border-[#FF6B35]"
          />
        </label>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {success ? <p className="text-sm text-green-700">{success}</p> : null}

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center rounded-full bg-[#FF6B35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#e85b29] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? 'Submitting...' : 'Submit Comment'}
        </button>
      </form>
    </section>
  );
}
