'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import { apiRequest } from '@/lib/api/apiClient';

function ResetPasswordInner() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState(searchParams.get('token') || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await apiRequest('/api/auth/reset-password', {
        method: 'POST',
        body: { token, newPassword, confirmPassword },
      });
      setDone(true);
    } catch (err) {
      setError(err.message || 'Password reset failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-2xl border border-[#29342d] bg-[#101612] p-8 shadow-2xl">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#c6ff3d]/15 text-[#c6ff3d]">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#c6ff3d]">
              Credential Rotation
            </p>
            <h1 className="font-display text-2xl font-bold uppercase text-[#f5f7f2]">
              Reset Password
            </h1>
          </div>
        </div>

        {done ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-[#c6ff3d]/40 bg-[#c6ff3d]/10 p-4 text-xs text-[#f5f7f2]">
              Password updated successfully. All active sessions have been signed out.
            </div>
            <Link
              href="/login"
              className="block w-full rounded-lg bg-[#c6ff3d] px-4 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-[#080b09]"
            >
              Sign In with New Password
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs text-red-200">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="reset-token"
                className="block text-xs font-semibold uppercase tracking-wider text-[#9ba69d]"
              >
                Reset Token
              </label>
              <input
                id="reset-token"
                type="text"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste one-time reset token"
                className="mt-1.5 w-full rounded-lg border border-[#29342d] bg-[#080b09] px-3.5 py-2.5 text-sm text-[#f5f7f2] outline-none focus:border-[#c6ff3d]"
              />
            </div>

            <div>
              <label
                htmlFor="reset-password"
                className="block text-xs font-semibold uppercase tracking-wider text-[#9ba69d]"
              >
                New Password
              </label>
              <input
                id="reset-password"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 8 chars, Aa1"
                className="mt-1.5 w-full rounded-lg border border-[#29342d] bg-[#080b09] px-3.5 py-2.5 text-sm text-[#f5f7f2] outline-none focus:border-[#c6ff3d]"
              />
            </div>

            <div>
              <label
                htmlFor="reset-confirm"
                className="block text-xs font-semibold uppercase tracking-wider text-[#9ba69d]"
              >
                Confirm New Password
              </label>
              <input
                id="reset-confirm"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="mt-1.5 w-full rounded-lg border border-[#29342d] bg-[#080b09] px-3.5 py-2.5 text-sm text-[#f5f7f2] outline-none focus:border-[#c6ff3d]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-[#c6ff3d] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#080b09] disabled:opacity-50"
            >
              {submitting ? 'Updating Password...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md px-4 py-16 text-center text-sm text-[#9ba69d]">
          Loading recovery screen...
        </div>
      }
    >
      <ResetPasswordInner />
    </Suspense>
  );
}
