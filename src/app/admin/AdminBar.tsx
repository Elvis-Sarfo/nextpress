import Link from 'next/link';
import { auth, signOut } from '@/auth';
import {
  Bell,
  ChevronDown,
  ExternalLink,
  Globe2,
  Home,
  LayoutTemplate,
  Mail,
  Monitor,
  Package,
  Plus,
  Settings,
  Shield,
  Upload,
  User2,
} from 'lucide-react';
import { getNewContactMessagesCount } from '@/lib/cms';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeSwitcher } from '@/components/admin/ThemeSwitcher';
import { LocaleSwitcher } from '@/components/admin/LocaleSwitcher';

type ActionLink = {
  href: string;
  label: string;
  description: string;
  icon: React.ElementType;
};

const createActions: ActionLink[] = [
  {
    href: '/admin/pages/new',
    label: 'New Page',
    description: 'Create a new page',
    icon: LayoutTemplate,
  },
  {
    href: '/admin/posts/new',
    label: 'New Post',
    description: 'Publish editorial content',
    icon: Plus,
  },
  {
    href: '/admin/products/new',
    label: 'New Product',
    description: 'Add a catalogue item',
    icon: Package,
  },
  {
    href: '/admin/jobs/new',
    label: 'New Job',
    description: 'Publish a vacancy',
    icon: Shield,
  },
  {
    href: '/admin/media/new',
    label: 'Upload Media',
    description: 'Add images and assets',
    icon: Upload,
  },
];

const workspaceActions: ActionLink[] = [
  {
    href: '/',
    label: 'View Site',
    description: 'Open the public site',
    icon: Home,
  },
  {
    href: '/admin/contact-messages',
    label: 'Inbox',
    description: 'Review contact enquiries',
    icon: Mail,
  },
  {
    href: '/admin/users',
    label: 'Users',
    description: 'Manage admin access',
    icon: User2,
  },
  {
    href: '/admin/settings',
    label: 'Settings',
    description: 'Configure the site',
    icon: Settings,
  },
];

const compactActions: ActionLink[] = [
  ...createActions,
  ...workspaceActions,
];

function ActionMenu({
  label,
  icon: Icon,
  items,
  align = 'start',
  compact = false,
}: {
  label: string;
  icon: React.ElementType;
  items: ActionLink[];
  align?: 'start' | 'end' | 'center';
  compact?: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={
            compact
              ? 'h-7 rounded-lg border border-white/10 bg-white/[0.04] px-2 text-[11px] font-medium text-slate-100 hover:bg-white/[0.08] hover:text-white'
              : 'h-7 rounded-lg border border-white/10 bg-white/[0.04] px-2 text-[11px] font-medium text-slate-100 hover:bg-white/[0.08] hover:text-white'
          }
        >
          <Icon className="mr-1.5 h-3.5 w-3.5" />
          {label}
          <ChevronDown className="ml-1.5 h-3 w-3 text-slate-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        className="w-72 rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_16px_40px_rgba(15,23,42,0.18)]"
      >
        <DropdownMenuLabel className="px-2.5 py-1.5 text-[10px] uppercase tracking-[0.18em] text-slate-500">
          {label}
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          {items.map((item) => {
            const ItemIcon = item.icon;
            return (
              <DropdownMenuItem key={item.href} asChild className="rounded-lg px-2.5 py-2 focus:bg-slate-100">
                <Link href={item.href} className="flex items-start gap-3">
                  <span className="mt-0.5 rounded-lg bg-slate-100 p-1.5 text-slate-700">
                    <ItemIcon className="h-3.5 w-3.5" />
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="text-[13px] font-medium text-slate-900">{item.label}</span>
                    <span className="text-[11px] text-slate-500">{item.description}</span>
                  </span>
                  {item.href === '/' ? <ExternalLink className="ml-auto h-3 w-3 text-slate-400" /> : null}
                </Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export async function AdminBar() {
  const session = await auth();
  const newContactMessagesCount = await getNewContactMessagesCount();
  const displayName = session?.user?.name ?? session?.user?.email ?? 'User';
  const email = session?.user?.email ?? '';

  return (
    <header className="fixed left-0 right-0 top-0 z-[60] border-b border-slate-800/80 bg-[linear-gradient(180deg,#0f172a_0%,#131d30_100%)] text-white shadow-[0_12px_30px_rgba(2,6,23,0.22)]">
      <div className="flex h-12 items-center justify-between gap-2 px-3 sm:px-4 lg:px-5">
        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
          <Link
            href="/admin"
            className="flex min-w-0 items-center gap-2 rounded-lg px-1.5 py-0.5 transition-colors hover:bg-white/[0.06]"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.08] text-[11px] font-semibold tracking-wide text-white">
              NP
            </span>
            <span className="hidden min-w-0 sm:block">
              <span className="block truncate text-[13px] font-semibold tracking-tight leading-tight">NextPress Admin</span>
              <span className="block truncate text-[9px] leading-tight text-slate-400">Content, catalogue, and operations</span>
            </span>
          </Link>

          <div className="hidden items-center gap-2 lg:flex xl:hidden">
            <ActionMenu label="More" icon={Plus} items={compactActions} />
          </div>

          <div className="hidden items-center gap-2 xl:flex">
            <ActionMenu label="Create" icon={Plus} items={createActions} />
            <ActionMenu label="Open" icon={Home} items={workspaceActions} />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden lg:block">
            <LocaleSwitcher />
          </div>
          <div className="hidden xl:block">
            <ThemeSwitcher />
          </div>

          <Link href="/admin/contact-messages" className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg border border-white/10 bg-white/[0.04] text-slate-100 hover:bg-white/[0.08]"
            >
              <Bell className="h-3.5 w-3.5" />
            </Button>
            {newContactMessagesCount > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex min-w-[18px] items-center justify-center rounded-full bg-[#FF6B35] px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
                {newContactMessagesCount > 9 ? '9+' : newContactMessagesCount}
              </span>
            ) : null}
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-7 rounded-lg border border-white/10 bg-white/[0.04] px-2 text-slate-100 hover:bg-white/[0.08]"
              >
                <span className="mr-1.5 flex h-5 w-5 items-center justify-center rounded-md bg-white/[0.08] text-[10px] font-semibold uppercase">
                  {displayName.slice(0, 1)}
                </span>
                <span className="hidden max-w-28 truncate text-[12px] font-medium md:inline">{displayName}</span>
                <ChevronDown className="ml-1.5 h-3 w-3 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-72 rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_16px_40px_rgba(15,23,42,0.18)]"
            >
              <DropdownMenuLabel className="px-2.5 py-2.5">
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-xs font-semibold uppercase text-slate-700">
                    {displayName.slice(0, 1)}
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate text-[13px] font-semibold text-slate-900">{displayName}</span>
                    {email ? <span className="truncate text-[11px] font-normal text-slate-500">{email}</span> : null}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup className="xl:hidden">
                <DropdownMenuItem asChild className="rounded-lg px-2.5 py-2 focus:bg-slate-100">
                  <span className="flex flex-col gap-2">
                    <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                      <Globe2 className="h-3 w-3" />
                      Locale
                    </span>
                    <LocaleSwitcher />
                  </span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuGroup className="xl:hidden">
                <DropdownMenuItem asChild className="rounded-lg px-2.5 py-2 focus:bg-slate-100">
                  <span className="flex flex-col gap-2">
                    <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                      <Monitor className="h-3 w-3" />
                      Appearance
                    </span>
                    <div className="flex items-center gap-2">
                      <ThemeSwitcher />
                    </div>
                  </span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="xl:hidden" />
              <DropdownMenuItem asChild className="rounded-lg px-2.5 py-2 focus:bg-slate-100">
                <Link href="/admin/settings" className="flex items-center gap-3">
                  <span className="rounded-lg bg-slate-100 p-1.5 text-slate-700">
                    <Settings className="h-3.5 w-3.5" />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-[13px] font-medium text-slate-900">Settings</span>
                    <span className="text-[11px] text-slate-500">Admin and site configuration</span>
                  </span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="rounded-lg px-2.5 py-2 focus:bg-slate-100">
                <Link href="/" className="flex items-center gap-3">
                  <span className="rounded-lg bg-slate-100 p-1.5 text-slate-700">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-[13px] font-medium text-slate-900">View site</span>
                    <span className="text-[11px] text-slate-500">Open the public frontend</span>
                  </span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <form
                action={async () => {
                  'use server';
                  await signOut({ redirectTo: '/auth/signin' });
                }}
                className="px-1 pb-1"
              >
                <button
                  type="submit"
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[13px] font-medium text-rose-600 transition-colors hover:bg-rose-50"
                >
                  <span>Sign out</span>
                  <span className="text-[11px] text-rose-400">end session</span>
                </button>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
