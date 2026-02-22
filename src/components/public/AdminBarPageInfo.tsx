'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { getPageInfoForPath, type PageInfo } from './admin-bar-actions';

/**
 * Client sub-component of AdminBar.
 * Uses usePathname() so it updates on every client-side navigation,
 * then calls a server action to look up the matching page in the DB.
 */
export function AdminBarPageInfo() {
  const pathname = usePathname();
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);

  useEffect(() => {
    setPageInfo(null); // clear while loading
    getPageInfoForPath(pathname).then(setPageInfo);
  }, [pathname]);

  if (!pageInfo) return null;

  return (
    <>
      <span className="text-white/30 shrink-0">|</span>
      <span className="truncate text-white/70 max-w-[240px]">{pageInfo.title}</span>
      <Link
        href={pageInfo.editHref}
        className="shrink-0 rounded bg-white/10 px-2 py-0.5 text-white hover:bg-white/20 transition-colors"
      >
        Edit Page
      </Link>
    </>
  );
}
