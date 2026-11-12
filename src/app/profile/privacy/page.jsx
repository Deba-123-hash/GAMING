'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ProfileNav from '@/components/profile/ProfileNav';
import useAuth from '@/hooks/useAuth';
import { apiRequest } from '@/lib/api/apiClient';

export default function ProfilePrivacyPage() {
  const { refreshSession } = useAuth();
  const [privacy, setPrivacy] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiRequest('/api/profile/preferences', { method: 'GET' });
        if (!cancelled) {
          const data = res?.data || {};
          setPrivacy({
            profileVisibility: data.profileVisibility || 'public',
            showBioPublic: data.showBioPublic ?? true,
            showPreferencesPublic: data.showPreferencesPublic ?? true,
          });
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load privacy controls.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
    try {
      await apiRequest('/api/profile/preferences', { method: 'PATCH', body: privacy });
      await refreshSession();
      setMessage('Privacy rules saved.');
    } catch (err) {
      setError(err.message || 'Could not update privacy rules.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="font-display text-3xl font-bold uppercase text-[#f5f7f2]">
          Privacy Controls
        </h1>
        <p className="mt-1 mb-6 text-sm text-[#9ba69d]">
          Control what other managers see on your public profile URL. Email and security details are
          never shown publicly.
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

        {!privacy ? (
          <div className="rounded-xl border border-[#29342d] bg-[#101612] p-8 text-sm text-[#9ba69d]">
            Loading privacy controls...
          </div>
        ) : (
          <form
            onSubmit={handleSave}
            className="space-y-5 rounded-xl border border-[#29342d] bg-[#101612] p-6"
          >
            <div>
              <label
                htmlFor="priv-vis"
                className="block text-xs font-semibold uppercase text-[#9ba69d]"
              >
                Profile Visibility
              </label>
              <select
                id="priv-vis"
                value={privacy.profileVisibility}
                onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value })}
                className="mt-1.5 w-full max-w-sm rounded-lg border border-[#29342d] bg-[#080b09] px-3 py-2 text-sm text-[#f5f7f2]"
              >
                <option value="public">Public (Full allowed profile card)</option>
                <option value="limited">Limited (Hide join date & extended fields)</option>
                <option value="private">Private (Show locked notice only)</option>
              </select>
            </div>

            <label className="flex items-center justify-between rounded-lg border border-[#29342d] bg-[#151d18] px-4 py-3 text-xs text-[#f5f7f2]">
              <span>Show Manager Bio Publicly</span>
              <input
                type="checkbox"
                checked={Boolean(privacy.showBioPublic)}
                onChange={(e) => setPrivacy({ ...privacy, showBioPublic: e.target.checked })}
                className="accent-[#c6ff3d]"
              />
            </label>

            <label className="flex items-center justify-between rounded-lg border border-[#29342d] bg-[#151d18] px-4 py-3 text-xs text-[#f5f7f2]">
              <span>Show Favourite Team, Position & Formation Publicly</span>
              <input
                type="checkbox"
                checked={Boolean(privacy.showPreferencesPublic)}
                onChange={(e) =>
                  setPrivacy({ ...privacy, showPreferencesPublic: e.target.checked })
                }
                className="accent-[#c6ff3d]"
              />
            </label>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#c6ff3d] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#080b09]"
            >
              {saving ? 'Saving...' : 'Update Privacy'}
            </button>
          </form>
        )}
      </div>
    </ProtectedRoute>
  );
}
