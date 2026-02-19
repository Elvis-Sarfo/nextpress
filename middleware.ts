import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // API routes — return JSON 401 (never redirect, clients expect JSON)
  if ((pathname.startsWith('/api/admin') || pathname.startsWith('/api/media')) && !isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // UI routes — redirect to sign-in with callbackUrl
  if ((pathname.startsWith('/admin') || pathname.startsWith('/media')) && !isLoggedIn) {
    const signInUrl = new URL('/auth/signin', req.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  // Cover both the admin UI and the admin API surface
  matcher: ['/admin', '/admin/:path*', '/api/admin/:path*', '/media', '/media/:path*', '/api/media/:path*'],
};
