'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, ShieldAlert } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ProfileNav from '@/components/profile/ProfileNav';
import useAuth from '@/hooks/useAuth';
import { apiRequest } from '@/lib/api/apiClient';

export default function ProfileSecurityPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [confirmUsername, setConfirmUsername] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSignOut() {
    await logout();
    router.push('/');
  }

  async function handleDeleteRequest(e) {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await apiRequest('/api/profile/delete-request', {
        method: 'POST',
        body: { confirmUsername },
      });
      setMessage(res?.message || 'Account deletion request recorded.');
      setConfirmUsername('');
    } catch (err) {
      setError(err.message || 'Deletion request failed.');
    }
  }

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="font-display text-3xl font-bold uppercase text-[#f5f7f2]">
          Security & Account Lifecycle
        </h1>
        <p className="mt-1 mb-6 text-sm text-[#9ba69d]">
          Inspect your active HttpOnly session or submit a verified account deletion request.
        </p>

        <ProfileNav />

        {message && (
          <div className="mb-4 rounded-lg border border-[#c6ff3d]/40 bg-[#c6ff3d]/10 px-4 py-3 text-xs text-[#f5f7f2]">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs text-red-200">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div className="rounded-xl border border-[#29342d] bg-[#101612] p-6">
            <h2 className="font-display text-lg font-bold uppercase text-[#f5f7f2]">
              Active Session
            </h2>
            <p className="mt-2 text-xs text-[#9ba69d]">
              Authenticated via HMAC-SHA256 signed `HttpOnly` cookie (`r90_session`). Passphrases
              are hashed using Node `crypto.scryptSync`.
            </p>
            <button
              type="button"
              onClick={handleSignOut}
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#29342d] bg-[#151d18] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#f5f7f2] hover:border-[#c6ff3d]/50"
            >
              <LogOut className="h-4 w-4 text-[#c6ff3d]" />
              Sign Out Current Session
            </button>
          </div>

          <form
            onSubmit={handleDeleteRequest}
            className="rounded-xl border border-red-500/30 bg-[#101612] p-6"
          >
            <div className="flex items-center gap-2 text-red-400">
              <ShieldAlert className="h-5 w-5" />
              <h2 className="font-display text-lg font-bold uppercase">Request Account Deletion</h2>
            </div>
            <p className="mt-2 text-xs text-[#9ba69d]">
              Type your username (<strong className="text-[#f5f7f2]">{user?.username}</strong>) to
              log an audited account deletion request.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <input
                type="text"
                required
                value={confirmUsername}
                onChange={(e) => setConfirmUsername(e.target.value)}
                placeholder={user?.username}
                className="rounded-lg border border-[#29342d] bg-[#080b09] px-3.5 py-2 text-sm text-[#f5f7f2]"
              />
              <button
                type="submit"
                className="rounded-lg border border-red-500/50 bg-red-500/15 px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-200 hover:bg-red-500/25"
              >
                Submit Deletion Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
