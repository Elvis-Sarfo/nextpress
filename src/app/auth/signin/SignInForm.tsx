'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface SignInFormProps {
  adminSetupRequired: boolean;
  callbackUrl: string;
  error?: string;
}

const ERROR_MESSAGES: Record<string, string> = {
  CredentialsSignin: 'Invalid email or password.',
  AccountLocked: 'Account is locked. Please try again later.',
  Default: 'Something went wrong. Please try again.',
};

export function SignInForm({ adminSetupRequired, callbackUrl, error }: SignInFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | undefined>(
    error ? (ERROR_MESSAGES[error] ?? ERROR_MESSAGES.Default) : undefined
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setFormError(undefined);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (adminSetupRequired) {
      if (password !== confirmPassword) {
        setFormError('Passwords do not match.');
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/auth/bootstrap-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        setFormError(payload?.error ?? ERROR_MESSAGES.Default);
        setIsLoading(false);
        return;
      }
    }

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setFormError(ERROR_MESSAGES[result.error] ?? ERROR_MESSAGES.Default);
      setIsLoading(false);
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      {formError && (
        <div
          role="alert"
          className="rounded-md bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive"
        >
          {formError}
        </div>
      )}

      <div className="space-y-4">
        {adminSetupRequired && (
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50"
              placeholder="Administrator"
            />
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50"
            placeholder="admin@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={adminSetupRequired ? 'new-password' : 'current-password'}
            required
            className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50"
            placeholder="••••••••"
          />
        </div>

        {adminSetupRequired && (
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading
          ? adminSetupRequired ? 'Creating admin…' : 'Signing in…'
          : adminSetupRequired ? 'Create admin account' : 'Sign in'}
      </button>
    </form>
  );
}
