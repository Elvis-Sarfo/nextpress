import { prisma } from '@/adapters/prisma-adapter';

type ContactMessageNotificationPayload = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  subject: string;
  message: string;
  locale?: string | null;
  sourcePage?: string | null;
  submittedAt: Date;
};

type MailTransportModule = {
  default?: {
    createTransport: (options: Record<string, unknown>) => {
      sendMail: (options: Record<string, unknown>) => Promise<unknown>;
    };
  };
  createTransport?: (options: Record<string, unknown>) => {
    sendMail: (options: Record<string, unknown>) => Promise<unknown>;
  };
};

function parseBooleanEnv(value: string | undefined, fallback = false): boolean {
  if (value === undefined) return fallback;
  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
}

function getNotificationRecipients(): string[] {
  const configured = (process.env.ADMIN_NOTIFICATION_EMAILS ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  return configured;
}

async function getAdminRecipients(): Promise<string[]> {
  const configured = getNotificationRecipients();
  if (configured.length > 0) return configured;

  const admins = await prisma.users.findMany({
    where: {
      roles: {
        some: {
          name: 'admin',
        },
      },
    },
    select: {
      email: true,
    },
  });

  return admins
    .map((admin) => admin.email?.trim())
    .filter((email): email is string => Boolean(email));
}

async function loadMailer() {
  const dynamicImport = new Function('specifier', 'return import(specifier)') as (
    specifier: string
  ) => Promise<MailTransportModule>;

  const module = await dynamicImport('nodemailer');
  return module.default?.createTransport ?? module.createTransport ?? null;
}

function getTransportConfig(): Record<string, unknown> | null {
  const host = process.env.SMTP_HOST?.trim();
  const port = Number.parseInt(process.env.SMTP_PORT ?? '587', 10);
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const secure = parseBooleanEnv(process.env.SMTP_SECURE, port === 465);

  if (!host || !Number.isFinite(port)) {
    return null;
  }

  return {
    host,
    port,
    secure,
    auth: user && pass ? { user, pass } : undefined,
  };
}

function getFromAddress(): string | null {
  const fromEmail = process.env.SMTP_FROM_EMAIL?.trim();
  const fromName = process.env.SMTP_FROM_NAME?.trim();
  if (!fromEmail) return null;
  return fromName ? `${fromName} <${fromEmail}>` : fromEmail;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export async function notifyAdminsOfContactMessage(
  payload: ContactMessageNotificationPayload
): Promise<void> {
  const transportConfig = getTransportConfig();
  const from = getFromAddress();

  if (!transportConfig || !from) {
    console.info('Contact notification email skipped: SMTP not configured.');
    return;
  }

  const recipients = await getAdminRecipients();
  if (recipients.length === 0) {
    console.info('Contact notification email skipped: no admin recipients found.');
    return;
  }

  const createTransport = await loadMailer().catch((error) => {
    console.warn('Contact notification email skipped: nodemailer is unavailable.', error);
    return null;
  });

  if (!createTransport) return;

  const inboxUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/admin/contact-messages`;
  const submittedAt = payload.submittedAt.toLocaleString();
  const messageBody = payload.message.trim();

  const text = [
    'New contact message received',
    '',
    `From: ${payload.name} <${payload.email}>`,
    payload.phone ? `Phone: ${payload.phone}` : null,
    payload.company ? `Company: ${payload.company}` : null,
    `Subject: ${payload.subject}`,
    payload.locale ? `Locale: ${payload.locale}` : null,
    payload.sourcePage ? `Source: ${payload.sourcePage}` : null,
    `Submitted: ${submittedAt}`,
    '',
    'Message:',
    messageBody,
    '',
    `Open in admin: ${inboxUrl}`,
  ]
    .filter(Boolean)
    .join('\n');

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
      <h2 style="margin-bottom: 12px;">New contact message received</h2>
      <p><strong>From:</strong> ${escapeHtml(payload.name)} &lt;${escapeHtml(payload.email)}&gt;</p>
      ${payload.phone ? `<p><strong>Phone:</strong> ${escapeHtml(payload.phone)}</p>` : ''}
      ${payload.company ? `<p><strong>Company:</strong> ${escapeHtml(payload.company)}</p>` : ''}
      <p><strong>Subject:</strong> ${escapeHtml(payload.subject)}</p>
      ${payload.locale ? `<p><strong>Locale:</strong> ${escapeHtml(payload.locale)}</p>` : ''}
      ${payload.sourcePage ? `<p><strong>Source:</strong> ${escapeHtml(payload.sourcePage)}</p>` : ''}
      <p><strong>Submitted:</strong> ${escapeHtml(submittedAt)}</p>
      <div style="margin-top: 16px; padding: 16px; border: 1px solid #e2e8f0; border-radius: 12px; background: #f8fafc;">
        <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; margin-bottom: 8px;">
          Message
        </div>
        <div style="white-space: pre-wrap;">${escapeHtml(messageBody)}</div>
      </div>
      <p style="margin-top: 20px;">
        <a href="${escapeHtml(inboxUrl)}" style="display: inline-block; padding: 10px 14px; border-radius: 8px; background: #ff6b35; color: #fff; text-decoration: none; font-weight: 600;">
          Open contact inbox
        </a>
      </p>
    </div>
  `;

  const transporter = createTransport(transportConfig);
  await transporter.sendMail({
    from,
    to: recipients.join(', '),
    replyTo: payload.email,
    subject: `New contact message: ${payload.subject}`,
    text,
    html,
  });
}
