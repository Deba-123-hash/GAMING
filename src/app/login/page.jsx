'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, LogIn } from 'lucide-react';
import useAuth from '@/hooks/useAuth';

function LoginFormInner() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawNext = searchParams.get('next');
  const nextPath =
    rawNext && rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/profile';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login({ email, password });
      router.push(nextPath);
    } catch (err) {
      setError(err.message || 'Sign in failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-2xl border border-[#29342d] bg-[#101612] p-8 shadow-2xl">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#c6ff3d]/15 text-[#c6ff3d]">
            <LogIn className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#c6ff3d]">
              RIVALRY 90 Access
            </p>
            <h1 className="font-display text-2xl font-bold uppercase text-[#f5f7f2]">Sign In</h1>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="login-email"
              className="block text-xs font-semibold uppercase tracking-wider text-[#9ba69d]"
            >
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="manager@rivalry90.gg"
              className="mt-1.5 w-full rounded-lg border border-[#29342d] bg-[#080b09] px-3.5 py-2.5 text-sm text-[#f5f7f2] outline-none focus:border-[#c6ff3d]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="login-password"
                className="block text-xs font-semibold uppercase tracking-wider text-[#9ba69d]"
              >
                Password
              </label>
              <Link href="/forgot-password" className="text-xs text-[#c6ff3d] hover:underline">
                Forgot password?
              </Link>
            </div>
            <input
              id="login-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="mt-1.5 w-full rounded-lg border border-[#29342d] bg-[#080b09] px-3.5 py-2.5 text-sm text-[#f5f7f2] outline-none focus:border-[#c6ff3d]"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#c6ff3d] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#080b09] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Lock className="h-4 w-4" aria-hidden="true" />
            {submitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 border-t border-[#29342d] pt-5 text-center text-xs text-[#9ba69d]">
          New to RIVALRY 90?{' '}
          <Link href="/register" className="font-semibold text-[#c6ff3d] hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md px-4 py-16 text-center text-sm text-[#9ba69d]">
          Loading sign-in form...
        </div>
      }
    >
      <LoginFormInner />
    </Suspense>
  );
}
