'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AdminSurfaceHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  leading?: ReactNode;
  actions?: ReactNode;
  className?: string;
  bodyClassName?: string;
  sticky?: boolean;
}

export function AdminSurfaceHeader({
  title,
  description,
  leading,
  actions,
  className,
  bodyClassName,
  sticky = false,
}: AdminSurfaceHeaderProps) {
  return (
    <div
      className={cn(
        'border-b bg-background',
        sticky && 'sticky top-0 z-20',
        className,
      )}
    >
      <div className={cn('flex items-start justify-between gap-2 px-2 py-0', bodyClassName)}>
        <div className="flex min-w-0 items-start gap-2">
          {leading}
          <div className="min-w-0">
            <h1 className="font-bold tracking-tight m-0">{title}</h1>
            {description ? <p className="mt-0 text-sm text-muted-foreground m-0">{description}</p> : null}
          </div>
        </div>
        {actions ? <div className="flex flex-wrap items-center justify-end gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}
