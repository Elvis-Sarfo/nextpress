'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Loader2,
  Mail,
  MailOpen,
  Phone,
  RefreshCw,
  Search,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CollectionMeta } from '@/lib/collections-data';
import { useCollectionTable } from '@/components/admin/data-table/useCollectionTable';
import { CollectionEditorOverlay } from '@/components/admin/CollectionList/CollectionEditorOverlay';
import { cn } from '@/lib/utils';

type Doc = Record<string, unknown>;
type UserOption = {
  id: string;
  name?: string | null;
  email?: string | null;
};

function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function toMailtoLink(email: string, subject: string): string {
  const params = new URLSearchParams();
  if (subject) {
    params.set('subject', `Re: ${subject}`);
  }
  const query = params.toString();
  return `mailto:${email}${query ? `?${query}` : ''}`;
}

function toTelLink(phone: string): string {
  return `tel:${phone.replace(/\s+/g, '')}`;
}

function formatDate(value: unknown): string {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString();
}

function statusTone(status: string): string {
  switch (status) {
    case 'resolved':
      return 'bg-green-100 text-green-700';
    case 'in_progress':
      return 'bg-blue-100 text-blue-700';
    case 'spam':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-amber-100 text-amber-700';
  }
}

export function ContactMessagesInbox({ collection }: { collection: CollectionMeta }) {
  const {
    docs,
    total,
    searchQuery,
    setSearchQuery,
    isLoading,
    fetchError,
    fetchDocs,
    columnFilters,
    onColumnFiltersChange,
  } = useCollectionTable({
    collection,
    initialSortField: 'submittedAt',
    initialSortDir: 'desc',
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorExpanded, setEditorExpanded] = useState(true);
  const [statusAction, setStatusAction] = useState<string | null>(null);
  const [selectedBulkIds, setSelectedBulkIds] = useState<string[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [notesDraft, setNotesDraft] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [savingAssignee, setSavingAssignee] = useState(false);
  const [bulkAction, setBulkAction] = useState<string | null>(null);

  const statusFilter = useMemo(() => {
    const filter = columnFilters.find((item) => item.id === 'status');
    return typeof filter?.value === 'string' ? filter.value : '';
  }, [columnFilters]);

  useEffect(() => {
    if (docs.length === 0) {
      setSelectedId(null);
      setSelectedBulkIds([]);
      return;
    }

    const hasSelected = docs.some((doc) => String(doc.id) === selectedId);
    if (!hasSelected && selectedId !== null) {
      setSelectedId(null);
    }
  }, [docs, selectedId]);

  useEffect(() => {
    const validIds = new Set(docs.map((doc) => String(doc.id)));
    setSelectedBulkIds((current) => current.filter((id) => validIds.has(id)));
  }, [docs]);

  useEffect(() => {
    let cancelled = false;

    async function loadUsers() {
      try {
        const response = await fetch('/api/admin/collections/users?limit=100&sortField=name&sortDir=asc');
        if (!response.ok) {
          throw new Error('Failed to load users');
        }
        const data = await response.json();
        if (!cancelled) {
          setUsers(Array.isArray(data.docs) ? data.docs : []);
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setUsers([]);
        }
      } finally {
        if (!cancelled) {
          setUsersLoading(false);
        }
      }
    }

    void loadUsers();
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedMessage = docs.find((doc) => String(doc.id) === selectedId) ?? null;
  const selectedIndex = docs.findIndex((doc) => String(doc.id) === selectedId);
  const previousMessage = selectedIndex > 0 ? docs[selectedIndex - 1] : null;
  const nextMessage = selectedIndex >= 0 && selectedIndex < docs.length - 1 ? docs[selectedIndex + 1] : null;
  const newMessagesCount = docs.filter((doc) => (asString(doc.status) || 'new') === 'new').length;
  const inProgressCount = docs.filter((doc) => asString(doc.status) === 'in_progress').length;
  const resolvedCount = docs.filter((doc) => asString(doc.status) === 'resolved').length;
  const spamCount = docs.filter((doc) => asString(doc.status) === 'spam').length;

  useEffect(() => {
    setNotesDraft(asString(selectedMessage?.notes));
  }, [selectedId, selectedMessage]);

  const setStatusFilter = (value: string) => {
    const nextFilters = value
      ? [{ id: 'status', value }]
      : [];
    onColumnFiltersChange(nextFilters);
  };

  const updateMessageStatus = async (status: string) => {
    if (!selectedId) return;

    setStatusAction(status);
    try {
      const response = await fetch(`/api/admin/collections/${collection.slug}/${selectedId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update message status');
      }

      await fetchDocs();
    } catch (error) {
      console.error(error);
    } finally {
      setStatusAction(null);
    }
  };

  const toggleBulkSelection = (id: string) => {
    setSelectedBulkIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const toggleSelectAllVisible = () => {
    const visibleIds = docs.map((doc) => String(doc.id));
    const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedBulkIds.includes(id));
    setSelectedBulkIds(allSelected ? [] : visibleIds);
  };

  const bulkUpdateStatus = async (status: string) => {
    if (selectedBulkIds.length === 0) return;

    setBulkAction(status);
    try {
      await Promise.all(
        selectedBulkIds.map(async (id) => {
          const response = await fetch(`/api/admin/collections/${collection.slug}/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
          });

          if (!response.ok) {
            throw new Error(`Failed to update message ${id}`);
          }
        })
      );

      setSelectedBulkIds([]);
      await fetchDocs();
    } catch (error) {
      console.error(error);
    } finally {
      setBulkAction(null);
    }
  };

  useEffect(() => {
    if (!selectedMessage) return;
    const currentStatus = asString(selectedMessage.status) || 'new';
    if (currentStatus !== 'new' || statusAction !== null) return;

    const timeout = window.setTimeout(() => {
      void updateMessageStatus('in_progress');
    }, 1200);

    return () => window.clearTimeout(timeout);
  }, [selectedId, selectedMessage, statusAction]);

  const saveNotes = async () => {
    if (!selectedId) return;
    setSavingNotes(true);
    try {
      const response = await fetch(`/api/admin/collections/${collection.slug}/${selectedId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes: notesDraft }),
      });
      if (!response.ok) {
        throw new Error('Failed to save notes');
      }
      await fetchDocs();
    } catch (error) {
      console.error(error);
    } finally {
      setSavingNotes(false);
    }
  };

  const updateAssignee = async (userId: string) => {
    if (!selectedId) return;
    setSavingAssignee(true);
    try {
      const response = await fetch(`/api/admin/collections/${collection.slug}/${selectedId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignedTo: userId ? userId : null,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to update assignee');
      }
      await fetchDocs();
    } catch (error) {
      console.error(error);
    } finally {
      setSavingAssignee(false);
    }
  };

  return (
    <div className="flex min-h-0 flex-col gap-4 xl:h-[calc(100vh-var(--admin-topbar-height)-2.5rem)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contact Messages</h1>
          <p className="text-muted-foreground mt-1">{total} messages total</p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={() => void fetchDocs()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground"
          title="Filter by status"
        >
          <option value="">All statuses</option>
          <option value="new">New</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="spam">Spam</option>
        </select>
      </div>

      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">New</div>
              <div className="truncate text-xs text-slate-500">Awaiting first follow-up</div>
            </div>
            <div className="shrink-0 text-2xl font-bold leading-none text-[#FF6B35]">{newMessagesCount}</div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">In Progress</div>
              <div className="truncate text-xs text-slate-500">Currently being handled</div>
            </div>
            <div className="shrink-0 text-2xl font-bold leading-none text-[#1677ff]">{inProgressCount}</div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Resolved</div>
              <div className="truncate text-xs text-slate-500">Closed successfully</div>
            </div>
            <div className="shrink-0 text-2xl font-bold leading-none text-green-600">{resolvedCount}</div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Spam</div>
              <div className="truncate text-xs text-slate-500">Filtered from follow-up</div>
            </div>
            <div className="shrink-0 text-2xl font-bold leading-none text-red-600">{spamCount}</div>
          </div>
        </div>
      </div>

      {selectedBulkIds.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <span className="mr-1 text-sm font-semibold text-slate-900">
            {selectedBulkIds.length} selected
          </span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => void bulkUpdateStatus('in_progress')}
            disabled={bulkAction !== null}
          >
            {bulkAction === 'in_progress' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MailOpen className="mr-2 h-4 w-4" />}
            Mark In Progress
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => void bulkUpdateStatus('resolved')}
            disabled={bulkAction !== null}
          >
            {bulkAction === 'resolved' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCheck className="mr-2 h-4 w-4" />}
            Resolve
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => void bulkUpdateStatus('spam')}
            disabled={bulkAction !== null}
          >
            {bulkAction === 'spam' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
            Spam
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setSelectedBulkIds([])}
            disabled={bulkAction !== null}
          >
            Clear
          </Button>
        </div>
      ) : null}

      {fetchError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-600">
          {fetchError}
        </div>
      ) : null}

      {selectedMessage ? (
        <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:flex xl:flex-col">
          <div className="border-b border-slate-200 px-5 py-3 xl:shrink-0">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => setSelectedId(null)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => previousMessage && setSelectedId(String(previousMessage.id))}
                  disabled={!previousMessage}
                  aria-label="Previous message"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => nextMessage && setSelectedId(String(nextMessage.id))}
                  disabled={!nextMessage}
                  aria-label="Next message"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <span className="ml-1 text-xs text-slate-400">
                  {selectedIndex + 1} of {docs.length}
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-1.5">
                {asString(selectedMessage.email) ? (
                  <Button asChild type="button" variant="outline" size="sm" className="h-8 px-3 text-xs">
                    <a
                      href={toMailtoLink(asString(selectedMessage.email), asString(selectedMessage.subject))}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Reply
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                ) : null}
                {asString(selectedMessage.phone) ? (
                  <Button asChild type="button" variant="outline" size="sm" className="h-8 px-3 text-xs">
                    <a href={toTelLink(asString(selectedMessage.phone))}>
                      <Phone className="mr-2 h-4 w-4" />
                      Call
                    </a>
                  </Button>
                ) : null}
                <Button
                  type="button"
                  size="sm"
                  className="h-8 px-3 text-xs"
                  variant={asString(selectedMessage.status) === 'new' ? 'default' : 'outline'}
                  onClick={() => void updateMessageStatus('new')}
                  disabled={statusAction !== null}
                >
                  {statusAction === 'new' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                  New
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="h-8 px-3 text-xs"
                  variant={asString(selectedMessage.status) === 'in_progress' ? 'default' : 'outline'}
                  onClick={() => void updateMessageStatus('in_progress')}
                  disabled={statusAction !== null}
                >
                  {statusAction === 'in_progress' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MailOpen className="mr-2 h-4 w-4" />}
                  Progress
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="h-8 px-3 text-xs"
                  variant={asString(selectedMessage.status) === 'resolved' ? 'default' : 'outline'}
                  onClick={() => void updateMessageStatus('resolved')}
                  disabled={statusAction !== null}
                >
                  {statusAction === 'resolved' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCheck className="mr-2 h-4 w-4" />}
                  Resolve
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="h-8 px-3 text-xs"
                  variant={asString(selectedMessage.status) === 'spam' ? 'default' : 'outline'}
                  onClick={() => void updateMessageStatus('spam')}
                  disabled={statusAction !== null}
                >
                  {statusAction === 'spam' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                  Spam
                </Button>
                <span className={cn('rounded-full px-3 py-1 text-xs font-semibold capitalize', statusTone(asString(selectedMessage.status) || 'new'))}>
                  {(asString(selectedMessage.status) || 'new').replace('_', ' ')}
                </span>
                <Button type="button" size="sm" className="h-8 px-3 text-xs" onClick={() => setEditorOpen(true)}>
                  Manage
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 px-6 py-5 xl:min-h-0 xl:overflow-y-auto">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-5">
              <div className="min-w-0">
                <h2 className="truncate text-2xl font-semibold text-slate-900">
                  {asString(selectedMessage.subject) || 'No subject'}
                </h2>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  <span className="inline-flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {asString(selectedMessage.name) || 'Unknown sender'}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <MailOpen className="h-4 w-4" />
                    {asString(selectedMessage.email)}
                  </span>
                </div>
              </div>
              <div className="text-xs text-slate-400">
                {formatDate(selectedMessage.submittedAt)}
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Assigned To
                </div>
                <select
                  title='select'
                  value={
                    selectedMessage.assignedTo &&
                      typeof selectedMessage.assignedTo === 'object' &&
                      'id' in (selectedMessage.assignedTo as Record<string, unknown>)
                      ? String((selectedMessage.assignedTo as Record<string, unknown>).id)
                      : ''
                  }
                  onChange={(e) => void updateAssignee(e.target.value)}
                  disabled={usersLoading || savingAssignee}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
                >
                  <option value="">Unassigned</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name || user.email || 'Unnamed user'}
                    </option>
                  ))}
                </select>
                <div className="mt-2 text-xs text-slate-400">
                  {savingAssignee ? 'Saving assignment...' : 'Choose the admin responsible for follow-up.'}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Internal Notes
                </div>
                <textarea
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  placeholder="Add internal notes, follow-up context, or outcome details..."
                  className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
                />
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="text-xs text-slate-400">Notes are only visible in admin.</p>
                  <Button type="button" size="sm" onClick={() => void saveNotes()} disabled={savingNotes}>
                    {savingNotes ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Save Notes
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {asString(selectedMessage.phone) ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <Phone className="h-4 w-4 text-[#FF6B35]" />
                    Phone
                  </div>
                  <p className="text-sm text-slate-900">{asString(selectedMessage.phone)}</p>
                </div>
              ) : null}
              {asString(selectedMessage.company) ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Company
                  </div>
                  <p className="text-sm text-slate-900">{asString(selectedMessage.company)}</p>
                </div>
              ) : null}
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Message
              </div>
              <div className="whitespace-pre-wrap text-sm leading-7 text-slate-800">
                {asString(selectedMessage.message)}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:flex xl:flex-col">
          <div className="border-b border-slate-200 px-4 py-3 xl:shrink-0">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Mail className="h-4 w-4 text-[#FF6B35]" />
                Primary
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <button
                  type="button"
                  onClick={toggleSelectAllVisible}
                  className="rounded-md border border-slate-200 px-2 py-1 font-semibold transition-colors hover:bg-slate-50"
                >
                  {docs.length > 0 && docs.every((doc) => selectedBulkIds.includes(String(doc.id)))
                    ? 'Clear all'
                    : 'Select all'}
                </button>
                <span>{docs.length > 0 ? `1-${docs.length} of ${total}` : `0 of ${total}`}</span>
              </div>
            </div>
          </div>

          <div className="xl:min-h-0 xl:flex-1 xl:overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-[#1677ff]" />
              </div>
            ) : docs.length === 0 ? (
              <div className="px-6 py-16 text-center text-sm text-slate-500">
                No messages found.
              </div>
            ) : (
              docs.map((doc) => {
                const id = String(doc.id);
                const status = asString(doc.status) || 'new';
                const isUnread = status === 'new';

                return (
                  <Button
                    key={id}
                    type="button"
                    onClick={() => setSelectedId(id)}
                    className={cn(
                      'grid w-full grid-cols-[auto_minmax(9rem,14rem)_minmax(0,1fr)_auto] items-center gap-3 border-b border-slate-200 px-4 py-2 text-left text-sm transition-colors hover:bg-slate-50',
                      isUnread ? 'bg-[#fffaf7]' : 'bg-white'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedBulkIds.includes(id)}
                        onChange={() => toggleBulkSelection(id)}
                        onClick={(event) => event.stopPropagation()}
                        className="h-4 w-4 rounded border-slate-300 text-[#FF6B35] focus:ring-[#FF6B35]"
                        aria-label={`Select message from ${asString(doc.name) || 'Unknown sender'}`}
                      />
                      {isUnread ? <span className="h-2.5 w-2.5 rounded-full bg-[#FF6B35]" /> : <span className="h-2.5 w-2.5 rounded-full bg-transparent" />}
                    </div>
                    <div className={cn('truncate pr-2 text-sm text-slate-900', isUnread ? 'font-bold' : 'font-medium')}>
                      {asString(doc.name) || 'Unknown sender'}
                    </div>
                    <div className="min-w-0 truncate text-sm text-slate-700">
                      <span className={cn(isUnread ? 'font-semibold text-slate-900' : 'font-medium')}>
                        {asString(doc.subject) || 'No subject'}
                      </span>
                      <span className="mx-2 text-slate-300">-</span>
                      <span className="text-slate-500">{asString(doc.message)}</span>
                    </div>
                    <div className="flex items-center gap-3 pl-2 text-xs text-slate-400">
                      <span className={cn('rounded-full px-2 py-0.5 font-semibold capitalize', statusTone(status))}>
                        {status.replace('_', ' ')}
                      </span>
                      <span className={cn(isUnread ? 'font-semibold text-slate-600' : '')}>
                        {formatDate(doc.submittedAt)}
                      </span>
                    </div>
                  </Button>
                );
              })
            )}
          </div>
        </div>
      )}

      <CollectionEditorOverlay
        collection={collection}
        open={editorOpen}
        editorView="slider"
        editorIntent="edit"
        editorDocId={selectedId}
        editorExpanded={editorExpanded}
        onClose={() => setEditorOpen(false)}
        onToggleExpanded={() => setEditorExpanded((prev) => !prev)}
        onOpenInPage={() => {
          if (!selectedId) return;
          window.location.href = `/admin/${collection.slug}/${selectedId}`;
        }}
        onSaved={async () => {
          setEditorOpen(false);
          await fetchDocs();
        }}
        onDeleted={async () => {
          setEditorOpen(false);
          setSelectedId(null);
          await fetchDocs();
        }}
      />
    </div>
  );
}
