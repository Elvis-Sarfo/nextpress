import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/adapters/prisma-adapter';
import { notifyAdminsOfContactMessage } from '@/lib/contact-notifications';

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  company?: unknown;
  subject?: unknown;
  message?: unknown;
  locale?: unknown;
  sourcePage?: unknown;
};

function asTrimmedString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ContactPayload;

    const name = asTrimmedString(body.name);
    const email = asTrimmedString(body.email);
    const phone = asTrimmedString(body.phone);
    const company = asTrimmedString(body.company);
    const subject = asTrimmedString(body.subject);
    const message = asTrimmedString(body.message);
    const locale = asTrimmedString(body.locale);
    const sourcePage = asTrimmedString(body.sourcePage || request.headers.get('referer'));

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Name, email, subject, and message are required.' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const createdMessage = await prisma.contactMessages.create({
      data: {
        status: 'new',
        name,
        email,
        phone: phone || null,
        company: company || null,
        subject,
        message,
        sourcePage: sourcePage || null,
        locale: locale || null,
        submittedAt: new Date(),
        createdBy: 'public',
      },
    });

    void notifyAdminsOfContactMessage({
      id: createdMessage.id,
      name,
      email,
      phone: phone || null,
      company: company || null,
      subject,
      message,
      sourcePage: sourcePage || null,
      locale: locale || null,
      submittedAt: createdMessage.submittedAt ?? new Date(),
    }).catch((error) => {
      console.error('Contact notification failed:', error);
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact submission failed:', error);
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}
