'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus } from 'lucide-react';
import useAuth from '@/hooks/useAuth';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(form);
      router.push('/profile');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-14">
      <div className="rounded-2xl border border-[#29342d] bg-[#101612] p-8 shadow-2xl">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#c6ff3d]/15 text-[#c6ff3d]">
            <UserPlus className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#c6ff3d]">
              Join the Universe
            </p>
            <h1 className="font-display text-2xl font-bold uppercase text-[#f5f7f2]">
              Create Account
            </h1>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="reg-name"
                className="block text-xs font-semibold uppercase tracking-wider text-[#9ba69d]"
              >
                Full Name
              </label>
              <input
                id="reg-name"
                type="text"
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="Alex Vance"
                className="mt-1.5 w-full rounded-lg border border-[#29342d] bg-[#080b09] px-3.5 py-2.5 text-sm text-[#f5f7f2] outline-none focus:border-[#c6ff3d]"
              />
            </div>

            <div>
              <label
                htmlFor="reg-username"
                className="block text-xs font-semibold uppercase tracking-wider text-[#9ba69d]"
              >
                Username
              </label>
              <input
                id="reg-username"
                type="text"
                required
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="alex_vance90"
                className="mt-1.5 w-full rounded-lg border border-[#29342d] bg-[#080b09] px-3.5 py-2.5 text-sm text-[#f5f7f2] outline-none focus:border-[#c6ff3d]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="reg-email"
              className="block text-xs font-semibold uppercase tracking-wider text-[#9ba69d]"
            >
              Email Address
            </label>
            <input
              id="reg-email"
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="alex@example.com"
              className="mt-1.5 w-full rounded-lg border border-[#29342d] bg-[#080b09] px-3.5 py-2.5 text-sm text-[#f5f7f2] outline-none focus:border-[#c6ff3d]"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="reg-password"
                className="block text-xs font-semibold uppercase tracking-wider text-[#9ba69d]"
              >
                Password
              </label>
              <input
                id="reg-password"
                type="password"
                required
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min 8 chars, Aa1"
                className="mt-1.5 w-full rounded-lg border border-[#29342d] bg-[#080b09] px-3.5 py-2.5 text-sm text-[#f5f7f2] outline-none focus:border-[#c6ff3d]"
              />
            </div>

            <div>
              <label
                htmlFor="reg-confirm"
                className="block text-xs font-semibold uppercase tracking-wider text-[#9ba69d]"
              >
                Confirm Password
              </label>
              <input
                id="reg-confirm"
                type="password"
                required
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="Repeat password"
                className="mt-1.5 w-full rounded-lg border border-[#29342d] bg-[#080b09] px-3.5 py-2.5 text-sm text-[#f5f7f2] outline-none focus:border-[#c6ff3d]"
              />
            </div>
          </div>

          <p className="text-[11px] text-[#9ba69d]">
            Password requires at least 8 characters, one uppercase letter, one lowercase letter, and
            one number.
          </p>

          <label className="flex items-start gap-2.5 rounded-lg border border-[#29342d] bg-[#080b09] p-3 text-xs text-[#9ba69d]">
            <input
              type="checkbox"
              checked={form.acceptTerms}
              onChange={(e) => setForm({ ...form, acceptTerms: e.target.checked })}
              className="mt-0.5 accent-[#c6ff3d]"
            />
            <span>
              I accept the RIVALRY 90 Terms of Play and Privacy Notice (scrypt password hashing &
              HttpOnly session cookie).
            </span>
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-[#c6ff3d] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#080b09] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 border-t border-[#29342d] pt-5 text-center text-xs text-[#9ba69d]">
          Already registered?{' '}
          <Link href="/login" className="font-semibold text-[#c6ff3d] hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
