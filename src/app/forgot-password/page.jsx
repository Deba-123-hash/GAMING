'use client';

import { useState } from 'react';
import Link from 'next/link';
import { KeyRound } from 'lucide-react';
import { apiRequest } from '@/lib/api/apiClient';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setStatusMessage('');
    setSubmitting(true);
    try {
      const res = await apiRequest('/api/auth/forgot-password', {
        method: 'POST',
        body: { email },
      });
      setStatusMessage(
        res?.message ||
          'If an account matches that email, recovery instructions have been prepared.'
      );
    } catch (err) {
      setError(err.message || 'Unable to process recovery request.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-2xl border border-[#29342d] bg-[#101612] p-8 shadow-2xl">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#c6ff3d]/15 text-[#c6ff3d]">
            <KeyRound className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#c6ff3d]">
              Account Recovery
            </p>
            <h1 className="font-display text-2xl font-bold uppercase text-[#f5f7f2]">
              Forgot Password
            </h1>
          </div>
        </div>

        {statusMessage && (
          <div className="mb-4 rounded-lg border border-[#c6ff3d]/40 bg-[#c6ff3d]/10 px-4 py-3 text-xs text-[#f5f7f2]">
            {statusMessage}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="forgot-email"
              className="block text-xs font-semibold uppercase tracking-wider text-[#9ba69d]"
            >
              Registered Email
            </label>
            <input
              id="forgot-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="manager@rivalry90.gg"
              className="mt-1.5 w-full rounded-lg border border-[#29342d] bg-[#080b09] px-3.5 py-2.5 text-sm text-[#f5f7f2] outline-none focus:border-[#c6ff3d]"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-[#c6ff3d] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#080b09] disabled:opacity-50"
          >
            {submitting ? 'Preparing Token...' : 'Request Reset Link'}
          </button>
        </form>

        <div className="mt-6 border-t border-[#29342d] pt-4 text-center text-xs text-[#9ba69d]">
          <Link href="/login" className="text-[#c6ff3d] hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
