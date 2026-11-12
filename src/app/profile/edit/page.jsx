'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ProfileNav from '@/components/profile/ProfileNav';
import useAuth from '@/hooks/useAuth';
import { apiRequest } from '@/lib/api/apiClient';
import { SUPPORTED_FORMATION_CODES } from '@/lib/formations';
import { TEAMS } from '@/data/teams';

const POSITIONS = ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'CF', 'ST'];

export default function EditProfilePage() {
  const { refreshSession } = useAuth();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiRequest('/api/profile', { method: 'GET' });
        if (cancelled) return;
        const p = res?.data?.profile || {};
        setForm({
          displayName: p.displayName || '',
          username: p.username || '',
          bio: p.bio || '',
          country: p.country || '',
          preferredLanguage: p.preferredLanguage || 'en',
          favouriteTeamId: p.favouriteTeamId || 'apex-united',
          preferredPosition: p.preferredPosition || 'ST',
          preferredFormation: p.preferredFormation || '4-3-3',
          favouriteGameMode: p.favouriteGameMode || 'quick-match',
        });
      } catch (err) {
        if (!cancelled) setError(err.message || 'Unable to load profile.');
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
      await apiRequest('/api/profile', { method: 'PATCH', body: form });
      await refreshSession();
      setMessage('Profile saved successfully.');
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  }

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setMessage('');
    try {
      const fd = new FormData();
      fd.append('avatar', file);
      await apiRequest('/api/profile/avatar', { method: 'POST', body: fd });
      await refreshSession();
      setMessage('Avatar validated and attached to your profile.');
    } catch (err) {
      setError(err.message || 'Invalid avatar file.');
    }
  }

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="font-display text-3xl font-bold uppercase text-[#f5f7f2]">Edit Profile</h1>
        <p className="mt-1 mb-6 text-sm text-[#9ba69d]">
          Customize your public manager profile and football universe preferences.
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

        {!form ? (
          <div className="rounded-xl border border-[#29342d] bg-[#101612] p-8 text-sm text-[#9ba69d]">
            Loading profile editor...
          </div>
        ) : (
          <form
            onSubmit={handleSave}
            className="space-y-6 rounded-xl border border-[#29342d] bg-[#101612] p-6"
          >
            <div className="rounded-lg border border-[#29342d] bg-[#151d18] p-4">
              <label
                htmlFor="avatar-file"
                className="block text-xs font-semibold uppercase tracking-wider text-[#9ba69d]"
              >
                Avatar Validation (JPEG, PNG, WebP under 2 MB)
              </label>
              <input
                id="avatar-file"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleAvatarChange}
                className="mt-2 block text-xs text-[#9ba69d] file:mr-3 file:rounded-md file:border-0 file:bg-[#c6ff3d] file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-[#080b09]"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="p-display"
                  className="block text-xs font-semibold uppercase text-[#9ba69d]"
                >
                  Display Name
                </label>
                <input
                  id="p-display"
                  type="text"
                  required
                  value={form.displayName}
                  onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-[#29342d] bg-[#080b09] px-3 py-2 text-sm text-[#f5f7f2]"
                />
              </div>

              <div>
                <label
                  htmlFor="p-username"
                  className="block text-xs font-semibold uppercase text-[#9ba69d]"
                >
                  Username
                </label>
                <input
                  id="p-username"
                  type="text"
                  required
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-[#29342d] bg-[#080b09] px-3 py-2 text-sm text-[#f5f7f2]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="p-bio"
                className="block text-xs font-semibold uppercase text-[#9ba69d]"
              >
                Manager Bio
              </label>
              <textarea
                id="p-bio"
                rows={3}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-[#29342d] bg-[#080b09] px-3 py-2 text-sm text-[#f5f7f2]"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label
                  htmlFor="p-team"
                  className="block text-xs font-semibold uppercase text-[#9ba69d]"
                >
                  Favourite Team
                </label>
                <select
                  id="p-team"
                  value={form.favouriteTeamId}
                  onChange={(e) => setForm({ ...form, favouriteTeamId: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-[#29342d] bg-[#080b09] px-3 py-2 text-sm text-[#f5f7f2]"
                >
                  {TEAMS.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="p-pos"
                  className="block text-xs font-semibold uppercase text-[#9ba69d]"
                >
                  Preferred Position
                </label>
                <select
                  id="p-pos"
                  value={form.preferredPosition}
                  onChange={(e) => setForm({ ...form, preferredPosition: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-[#29342d] bg-[#080b09] px-3 py-2 text-sm text-[#f5f7f2]"
                >
                  {POSITIONS.map((pos) => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="p-form"
                  className="block text-xs font-semibold uppercase text-[#9ba69d]"
                >
                  Preferred Formation
                </label>
                <select
                  id="p-form"
                  value={form.preferredFormation}
                  onChange={(e) => setForm({ ...form, preferredFormation: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-[#29342d] bg-[#080b09] px-3 py-2 text-sm text-[#f5f7f2]"
                >
                  {SUPPORTED_FORMATION_CODES.map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="p-country"
                  className="block text-xs font-semibold uppercase text-[#9ba69d]"
                >
                  Country / Region
                </label>
                <input
                  id="p-country"
                  type="text"
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-[#29342d] bg-[#080b09] px-3 py-2 text-sm text-[#f5f7f2]"
                />
              </div>

              <div>
                <label
                  htmlFor="p-lang"
                  className="block text-xs font-semibold uppercase text-[#9ba69d]"
                >
                  Language
                </label>
                <select
                  id="p-lang"
                  value={form.preferredLanguage}
                  onChange={(e) => setForm({ ...form, preferredLanguage: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-[#29342d] bg-[#080b09] px-3 py-2 text-sm text-[#f5f7f2]"
                >
                  <option value="en">English (en)</option>
                  <option value="es">Spanish (es)</option>
                  <option value="fr">French (fr)</option>
                  <option value="de">German (de)</option>
                  <option value="ja">Japanese (ja)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#c6ff3d] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#080b09] disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        )}
      </div>
    </ProtectedRoute>
  );
}
