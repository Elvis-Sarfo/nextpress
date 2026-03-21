import { NextRequest, NextResponse } from 'next/server';
import { getPublishedPageByPath, localeEngine } from '@/lib/cms';
import { replaceLocaleInPath } from '@/lib/agbon-routes';

export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.searchParams.get('pathname');
  const targetLocale = request.nextUrl.searchParams.get('locale');

  if (!pathname || !targetLocale || !localeEngine.isSupported(targetLocale)) {
    return NextResponse.json({ error: 'Invalid localization path request.' }, { status: 400 });
  }

  const parts = pathname.split('/').filter(Boolean);
  const currentLocale = parts[0] ?? null;
  const slugParts = parts.slice(1);

  if (!currentLocale || !localeEngine.isSupported(currentLocale)) {
    return NextResponse.json({ path: replaceLocaleInPath(pathname, targetLocale) });
  }

  if (slugParts.length === 0) {
    return NextResponse.json({ path: `/${targetLocale}` });
  }

  const match = await getPublishedPageByPath(currentLocale, slugParts);
  if (!match) {
    return NextResponse.json({ path: replaceLocaleInPath(pathname, targetLocale) });
  }

  const targetPath = match.pathByLocale[targetLocale];
  if (!targetPath) {
    return NextResponse.json({ path: replaceLocaleInPath(pathname, targetLocale) });
  }

  return NextResponse.json({ path: `/${targetLocale}/${targetPath}` });
}
