/**
 * Settings singleton redirect.
 * Fetches the first (only) settings document and redirects to its edit page,
 * or to /admin/settings/new if none exists yet.
 */

import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/adapters/prisma-adapter';

export default async function SettingsPage() {
  const session = await auth();
  if (!session) redirect('/auth/signin');

  const doc = await prisma.settings.findFirst({ select: { id: true } });

  if (doc) {
    redirect(`/admin/settings/${doc.id}`);
  } else {
    redirect('/admin/settings/new');
  }
}
