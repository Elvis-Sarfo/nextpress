/**
 * Settings admin page — singleton, schema-driven tabbed UI.
 *
 * Renders the SettingsEditor component which auto-generates tabs from
 * the Settings collection's group fields and renders native inputs for
 * each sub-field — no manual hardcoding of form fields needed.
 *
 * If no settings document exists yet it is auto-created via the API.
 */

import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/adapters/prisma-adapter';
import { getCollection } from '@/lib/collections-data';
import { SettingsEditor } from '@/components/admin/SettingsEditor/SettingsEditor';
import { randomUUID } from 'crypto';

export default async function SettingsPage() {
  const session = await auth();
  if (!session) redirect('/auth/signin');

  // Auto-provision the settings document directly via Prisma — no HTTP roundtrip
  let doc = await prisma.settings.findFirst({ select: { id: true } });

  if (!doc) {
    doc = await prisma.settings.create({
      data: {
        id: randomUUID(),
        siteName: 'My Site',
        status: 'published',
      },
      select: { id: true },
    });
  }

  const meta = getCollection('settings');
  if (!meta) {
    return <div className="p-8 text-muted-foreground">Settings collection not found.</div>;
  }

  return <SettingsEditor meta={meta} documentId={doc.id} />;
}
