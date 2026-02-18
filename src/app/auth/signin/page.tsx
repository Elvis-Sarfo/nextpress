import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { SignInForm } from './SignInForm';
import { Menu } from 'lucide-react';

interface SignInPageProps {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const session = await auth();

  // Already logged in — send to admin or callbackUrl
  if (session) {
    const params = await searchParams;
    redirect(params.callbackUrl ?? '/admin');
  }

  const params = await searchParams;
  const callbackUrl = params.callbackUrl ?? '/admin';
  const error = params.error;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Menu className="w-6 h-6 text-primary" />
          <span className="text-2xl font-bold">NextPress</span>
        </div>

        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
          <h1 className="text-xl font-semibold text-card-foreground">
            Sign in to your account
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Use your admin credentials to access the dashboard.
          </p>

          <SignInForm callbackUrl={callbackUrl} error={error} />
        </div>
      </div>
    </div>
  );
}
