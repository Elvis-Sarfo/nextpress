import Link from 'next/link';
import {
  ArrowRight,
  Bell,
  Blocks,
  BriefcaseBusiness,
  Clock3,
  Database,
  FileText,
  FolderKanban,
  Globe2,
  Image,
  LayoutTemplate,
  Mail,
  MessageSquareWarning,
  Package,
  Plus,
  Settings2,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { prisma } from '@/adapters/prisma-adapter';
import adminConfig from '@/admin.config';
import { getCollections } from '@/lib/collections-data';

type RecentContactMessage = {
  id: string;
  name: string;
  subject: string;
  status: string;
  createdAt: Date;
};

type RecentDocument = {
  id: string;
  title: string;
  href: string;
  status: string;
  updatedAt: Date;
  type: 'page' | 'post' | 'product' | 'job';
};

const DEFAULT_LOCALE = 'en';

const ICONS = {
  pages: LayoutTemplate,
  posts: FileText,
  products: Package,
  media: Image,
  users: Users,
  jobs: BriefcaseBusiness,
  countries: Globe2,
  comments: MessageSquareWarning,
  blocks: Blocks,
  settings: Settings2,
  default: Database,
} as const;

function resolveText(value: unknown, locale: string = DEFAULT_LOCALE): string {
  if (typeof value === 'string') return value;
  if (!value || typeof value !== 'object' || Array.isArray(value)) return '';
  const localized = value as Record<string, unknown>;
  const direct = localized[locale];
  if (typeof direct === 'string' && direct.trim()) return direct;
  const fallback = localized[DEFAULT_LOCALE];
  if (typeof fallback === 'string' && fallback.trim()) return fallback;
  const firstString = Object.values(localized).find(
    (entry): entry is string => typeof entry === 'string' && entry.trim().length > 0
  );
  return firstString ?? '';
}

function formatTimestamp(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function getCollectionIcon(slug: string) {
  return ICONS[slug as keyof typeof ICONS] ?? ICONS.default;
}

function getStatusBadgeClass(status: string): string {
  const normalized = status.toLowerCase();
  if (normalized === 'published' || normalized === 'active' || normalized === 'approved') {
    return 'bg-emerald-100 text-emerald-700';
  }
  if (normalized === 'draft' || normalized === 'pending' || normalized === 'new') {
    return 'bg-amber-100 text-amber-700';
  }
  if (normalized === 'rejected' || normalized === 'spam' || normalized === 'inactive') {
    return 'bg-rose-100 text-rose-700';
  }
  return 'bg-slate-100 text-slate-700';
}

function buildWorkspaceGroups() {
  const collections = getCollections();
  const groups = adminConfig.sidebar?.groups ?? [];
  const collectionConfig = adminConfig.sidebar?.collections ?? {};

  return groups
    .map((group) => {
      const configuredSlugs = new Set(group.items ?? []);

      const items = collections
        .filter((collection) => {
          const config = collectionConfig[collection.slug];
          if (config?.hidden || config?.standalone) return false;
          return (config?.group ?? (typeof collection.admin.group === 'object'
            ? collection.admin.group?.key
            : typeof collection.admin.group === 'string'
              ? collection.admin.group.toLowerCase()
              : 'content')) === group.key;
        })
        .sort((a, b) => {
          const indexA = (group.items ?? []).indexOf(a.slug);
          const indexB = (group.items ?? []).indexOf(b.slug);
          if (indexA !== -1 || indexB !== -1) {
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return indexA - indexB;
          }
          const orderA = collectionConfig[a.slug]?.order ?? Number.MAX_SAFE_INTEGER;
          const orderB = collectionConfig[b.slug]?.order ?? Number.MAX_SAFE_INTEGER;
          if (orderA !== orderB) return orderA - orderB;
          return a.labels.plural.localeCompare(b.labels.plural);
        })
        .filter((collection) => !configuredSlugs.has(collection.slug) || (group.items ?? []).includes(collection.slug));

      if (items.length === 0) return null;

      return {
        key: group.key,
        label: group.label ?? group.key,
        items,
      };
    })
    .filter((group): group is { key: string; label: string; items: ReturnType<typeof getCollections> } => Boolean(group));
}

export default async function AdminDashboard() {
  const [
    pageCount,
    publishedPageCount,
    postCount,
    publishedPostCount,
    productCount,
    featuredProductCount,
    mediaCount,
    userCount,
    activeJobsCount,
    activeCountriesCount,
    pendingCommentCount,
    newContactMessagesCount,
    recentMessages,
    recentPages,
    recentPosts,
    recentProducts,
    recentJobs,
  ] = await Promise.all([
    prisma.pages.count(),
    prisma.pages.count({ where: { status: 'published' } }),
    prisma.posts.count(),
    prisma.posts.count({ where: { status: 'published' } }),
    prisma.products.count(),
    prisma.products.count({ where: { featured: true } }),
    prisma.media.count(),
    prisma.users.count(),
    prisma.jobs.count({ where: { status: 'active' } }),
    prisma.countries.count({ where: { status: 'active' } }),
    prisma.comments.count({ where: { status: 'pending' } }),
    prisma.contactMessages.count({ where: { status: 'new' } }),
    prisma.contactMessages.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, subject: true, status: true, createdAt: true },
    }) as Promise<RecentContactMessage[]>,
    prisma.pages.findMany({
      take: 4,
      orderBy: { updatedAt: 'desc' },
      select: { id: true, title: true, status: true, updatedAt: true },
    }),
    prisma.posts.findMany({
      take: 4,
      orderBy: { updatedAt: 'desc' },
      select: { id: true, title: true, status: true, updatedAt: true },
    }),
    prisma.products.findMany({
      take: 4,
      orderBy: { updatedAt: 'desc' },
      select: { id: true, name: true, status: true, updatedAt: true },
    }),
    prisma.jobs.findMany({
      take: 3,
      orderBy: { updatedAt: 'desc' },
      select: { id: true, title: true, status: true, updatedAt: true },
    }),
  ]);

  const draftPageCount = pageCount - publishedPageCount;
  const draftPostCount = postCount - publishedPostCount;

  const recentContent: RecentDocument[] = [
    ...recentPages.map((page) => ({
      id: page.id,
      title: resolveText(page.title) || 'Untitled page',
      href: `/admin/pages/${page.id}`,
      status: page.status,
      updatedAt: page.updatedAt,
      type: 'page' as const,
    })),
    ...recentPosts.map((post) => ({
      id: post.id,
      title: resolveText(post.title) || 'Untitled post',
      href: `/admin/posts/${post.id}`,
      status: post.status,
      updatedAt: post.updatedAt,
      type: 'post' as const,
    })),
    ...recentProducts.map((product) => ({
      id: product.id,
      title: resolveText(product.name) || 'Untitled product',
      href: `/admin/products/${product.id}`,
      status: product.status,
      updatedAt: product.updatedAt,
      type: 'product' as const,
    })),
    ...recentJobs.map((job) => ({
      id: job.id,
      title: resolveText(job.title) || 'Untitled job',
      href: `/admin/jobs/${job.id}`,
      status: job.status,
      updatedAt: job.updatedAt,
      type: 'job' as const,
    })),
  ]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 8);

  const workspaceGroups = buildWorkspaceGroups();

  const overviewCards = [
    {
      label: 'Content Footprint',
      value: `${pageCount + postCount + productCount}`,
      detail: `${pageCount} pages, ${postCount} posts, ${productCount} products`,
      href: '/admin/pages',
      icon: FolderKanban,
      tone: 'from-[#FFF4EF] to-white',
      badge: `${publishedPageCount + publishedPostCount} live`,
    },
    {
      label: 'Inbox Attention',
      value: `${newContactMessagesCount}`,
      detail: newContactMessagesCount === 1 ? '1 new contact message' : `${newContactMessagesCount} new contact messages`,
      href: '/admin/contact-messages',
      icon: Bell,
      tone: 'from-[#FFF7E8] to-white',
      badge: newContactMessagesCount > 0 ? 'Needs review' : 'Clear',
    },
    {
      label: 'Publishing Queue',
      value: `${draftPageCount + draftPostCount}`,
      detail: `${draftPageCount} draft pages, ${draftPostCount} draft posts`,
      href: '/admin/pages',
      icon: Clock3,
      tone: 'from-[#EEF5FF] to-white',
      badge: draftPageCount + draftPostCount > 0 ? 'In progress' : 'Up to date',
    },
    {
      label: 'Team Access',
      value: `${userCount}`,
      detail: `${pendingCommentCount} pending comments to moderate`,
      href: '/admin/users',
      icon: ShieldCheck,
      tone: 'from-[#F3F0FF] to-white',
      badge: pendingCommentCount > 0 ? 'Moderation open' : 'Stable',
    },
  ];

  const actionCards = [
    { label: 'Create page', href: '/admin/pages/new', icon: LayoutTemplate },
    { label: 'Add product', href: '/admin/products/new', icon: Package },
    { label: 'Upload media', href: '/admin/media', icon: Image },
    { label: 'Open inbox', href: '/admin/contact-messages', icon: Mail },
  ];

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white shadow-xl">
        <div className="grid gap-8 px-6 py-7 lg:grid-cols-[1.3fr_0.9fr] lg:px-8">
          <div className="space-y-5">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-white/80">
              <Sparkles className="h-3.5 w-3.5" />
              Admin overview
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">
                Run content, catalogue, and operations from one control surface.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-300 lg:text-base">
                Monitor publishing, inbound enquiries, products, jobs, and media activity without
                jumping between collections.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {actionCards.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm transition-colors hover:bg-white/10"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="rounded-xl bg-white/10 p-2">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span>{action.label}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 text-white/70 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Published</p>
              <p className="mt-3 text-3xl font-semibold">{publishedPageCount + publishedPostCount}</p>
              <p className="mt-2 text-sm text-slate-300">
                {publishedPageCount} pages and {publishedPostCount} posts are currently live.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Catalogue</p>
              <p className="mt-3 text-3xl font-semibold">{productCount}</p>
              <p className="mt-2 text-sm text-slate-300">
                {featuredProductCount} featured products, {activeCountriesCount} active markets, {activeJobsCount} active jobs.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:col-span-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Operational focus</p>
                  <h2 className="mt-2 text-lg font-semibold">
                    {newContactMessagesCount > 0
                      ? 'New enquiries are waiting for review'
                      : pendingCommentCount > 0
                        ? 'Comments are waiting for moderation'
                        : 'No urgent admin backlog right now'}
                  </h2>
                </div>
                <Link
                  href={newContactMessagesCount > 0 ? '/admin/contact-messages' : '/admin/comments'}
                  className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-white/80 transition-colors hover:bg-white/10"
                >
                  Open queue
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-4">
        {overviewCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className={`group rounded-2xl border border-border bg-gradient-to-br ${card.tone} p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${card.badge === 'Clear' || card.badge === 'Up to date' || card.badge === 'Stable' || card.badge.endsWith('live') ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {card.badge}
                  </span>
                  <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight">{card.value}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{card.detail}</p>
                </div>
                <div className="rounded-2xl border border-white/70 bg-white/80 p-3 shadow-sm">
                  <Icon className="h-5 w-5 text-slate-700" />
                </div>
              </div>
            </Link>
          );
        })}
      </section>

      <section className="grid gap-6 2xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-3xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-6 py-5">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Inbox and moderation</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                What needs attention right now.
              </p>
            </div>
            <Link
              href="/admin/contact-messages"
              className="text-sm font-medium text-primary hover:underline"
            >
              Open inbox
            </Link>
          </div>

          <div className="grid gap-3 px-6 py-5 sm:grid-cols-2">
            <Link
              href="/admin/contact-messages"
              className="rounded-2xl border border-[#FFD9CC] bg-[#FFF4EF] p-4 transition-colors hover:bg-[#FFEDE4]"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FF6B35]">New messages</p>
                <span className="rounded-full bg-[#FF6B35] px-2 py-1 text-[11px] font-semibold text-white">
                  inbox
                </span>
              </div>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{newContactMessagesCount}</p>
              <p className="mt-2 text-sm text-slate-600">Review and assign enquiries.</p>
            </Link>
            <Link
              href="/admin/comments"
              className="rounded-2xl border border-border bg-muted/40 p-4 transition-colors hover:bg-muted/70"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Pending comments</p>
                <span className="rounded-full bg-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-700">
                  moderation
                </span>
              </div>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{pendingCommentCount}</p>
              <p className="mt-2 text-sm text-slate-600">Moderate public discussion.</p>
            </Link>
          </div>

          <div className="divide-y divide-border">
            {recentMessages.length > 0 ? (
              recentMessages.map((message) => (
                <Link
                  key={message.id}
                  href={`/admin/contact-messages/${message.id}`}
                  className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-muted/40"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{message.subject}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>{message.name}</span>
                      <span className={`rounded-full px-2 py-0.5 font-medium ${getStatusBadgeClass(message.status)}`}>
                        {message.status}
                      </span>
                      <span>{formatTimestamp(message.createdAt)}</span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </Link>
              ))
            ) : (
              <div className="px-6 py-8 text-sm text-muted-foreground">
                No recent inbox activity.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-6 py-5">
            <h2 className="text-lg font-semibold tracking-tight">Publishing health</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              A quick read on what is live versus still in progress.
            </p>
          </div>

          <div className="space-y-5 px-6 py-5">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span>Pages published</span>
                <span className="flex items-center gap-2">
                  <span className="font-medium">{publishedPageCount}/{pageCount}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                    {draftPageCount} drafts
                  </span>
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-slate-900"
                  style={{ width: `${pageCount === 0 ? 0 : (publishedPageCount / pageCount) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span>Posts published</span>
                <span className="flex items-center gap-2">
                  <span className="font-medium">{publishedPostCount}/{postCount}</span>
                  <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-semibold text-orange-700">
                    {draftPostCount} drafts
                  </span>
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-[#FF6B35]"
                  style={{ width: `${postCount === 0 ? 0 : (publishedPostCount / postCount) * 100}%` }}
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-muted/50 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Media library</p>
                <p className="mt-2 text-2xl font-semibold">{mediaCount}</p>
              </div>
              <div className="rounded-2xl bg-muted/50 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Featured products</p>
                <p className="mt-2 text-2xl font-semibold">{featuredProductCount}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Workspace map</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Open the main admin areas in the same structure used by the sidebar.
            </p>
          </div>
          <Link href="/admin/settings" className="text-sm font-medium text-primary hover:underline">
            Configure admin
          </Link>
        </div>

        <div className="grid gap-5 px-6 py-6 md:grid-cols-2 xl:grid-cols-3">
          {workspaceGroups.map((group) => (
            <div key={group.key} className="rounded-2xl border border-border bg-background/70 p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold tracking-tight">{group.label}</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">
                      {group.items.length} collection{group.items.length === 1 ? '' : 's'}
                    </p>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                      {group.key}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {group.items.map((collection) => {
                  const Icon = getCollectionIcon(collection.slug);
                  return (
                    <div
                      key={collection.slug}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-3 py-3"
                    >
                      <Link
                        href={`/admin/${collection.slug}`}
                        className="flex min-w-0 flex-1 items-center gap-3"
                      >
                        <div className="rounded-xl bg-muted p-2">
                          <Icon className="h-4 w-4 text-slate-700" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{collection.labels.plural}</p>
                          <p className="text-xs text-muted-foreground">{collection.slug}</p>
                        </div>
                      </Link>
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/admin/${collection.slug}`}
                          className="rounded-lg px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          Open
                        </Link>
                        <Link
                          href={`/admin/${collection.slug}/new`}
                          className="rounded-lg px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        </div>
        <div className="rounded-3xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-6 py-5">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Recent content activity</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Latest updates across pages, posts, products, and jobs.
              </p>
            </div>
            <Link href="/admin/pages" className="text-sm font-medium text-primary hover:underline">
              Open content
            </Link>
          </div>

          <div className="divide-y divide-border">
            {recentContent.map((item) => {
              const Icon = getCollectionIcon(
                item.type === 'page'
                  ? 'pages'
                  : item.type === 'post'
                    ? 'posts'
                    : item.type === 'product'
                      ? 'products'
                      : 'jobs'
              );

              return (
                <Link
                  key={`${item.type}-${item.id}`}
                  href={item.href}
                  className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-muted/40"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="rounded-2xl bg-muted p-2.5">
                      <Icon className="h-4 w-4 text-slate-700" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span className="rounded-full bg-muted px-2 py-0.5 uppercase tracking-wide">
                          {item.type}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 font-medium ${getStatusBadgeClass(item.status)}`}>
                          {item.status}
                        </span>
                        <span>Updated {formatTimestamp(item.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
