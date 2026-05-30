import Link from 'next/link';
import { getCommentsByStatus } from '@/lib/cms';
import { MessageSquare, Check, X, Clock } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

export default async function CommentsListPage() {
  // Get comments grouped by status
  const [pendingComments, approvedComments, spamComments] = await Promise.all([
    getCommentsByStatus('pending', { limit: 50 }),
    getCommentsByStatus('approved', { limit: 50 }),
    getCommentsByStatus('spam', { limit: 50 }),
  ]);

  const allComments = [
    ...pendingComments.map((c) => ({ ...c, statusGroup: 'pending' as const })),
    ...approvedComments.map((c) => ({ ...c, statusGroup: 'approved' as const })),
    ...spamComments.map((c) => ({ ...c, statusGroup: 'spam' as const })),
  ].sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'spam':
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'spam':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Comments</h1>
          <p className="text-muted-foreground mt-1">
            {pendingComments.length} pending • {approvedComments.length} approved •{' '}
            {spamComments.length} spam
          </p>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 mb-6">
        <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium">
          Pending ({pendingComments.length})
        </span>
        <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
          Approved ({approvedComments.length})
        </span>
        <span className="px-4 py-2 bg-red-100 text-red-800 rounded-lg text-sm font-medium">
          Spam ({spamComments.length})
        </span>
      </div>

      {allComments.length === 0 ? (
        <div className="text-center py-12 bg-secondary/30 rounded-lg">
          <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No comments yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {allComments.map((comment) => (
            <div
              key={comment.id}
              className="bg-secondary/30 rounded-lg p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold">
                      {(comment.authorName ?? '?').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{comment.authorName}</p>
                    <p className="text-sm text-muted-foreground">
                      {comment.authorEmail}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${getStatusBadgeColor(comment.status)}`}
                  >
                    {getStatusIcon(comment.status)}
                    {comment.status}
                  </span>
                </div>
              </div>

              <p className="text-sm mb-4">{comment.content}</p>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{comment.createdAt ? formatDateTime(comment.createdAt) : ''}</span>
                <div className="flex gap-2">
                  {comment.status === 'pending' && (
                    <>
                      <button
                        type="button"
                        className="px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
                      >
                        Mark as Spam
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    className="px-3 py-1 bg-secondary text-secondary-foreground rounded hover:opacity-90 transition-opacity"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
