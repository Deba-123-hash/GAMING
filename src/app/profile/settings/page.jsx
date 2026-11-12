'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ProfileNav from '@/components/profile/ProfileNav';
import useAuth from '@/hooks/useAuth';
import { apiRequest } from '@/lib/api/apiClient';

export default function ProfileSettingsPage() {
  const { refreshSession } = useAuth();
  const [prefs, setPrefs] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiRequest('/api/profile/preferences', { method: 'GET' });
        if (!cancelled) setPrefs(res?.data || {});
      } catch (err) {
        if (!cancelled) setError(err.message || 'Unable to load preferences.');
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
      await apiRequest('/api/profile/preferences', { method: 'PATCH', body: prefs });
      await refreshSession();
      setMessage('Preferences updated.');
    } catch (err) {
      setError(err.message || 'Failed to update preferences.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="font-display text-3xl font-bold uppercase text-[#f5f7f2]">
          Preferences & Notifications
        </h1>
        <p className="mt-1 mb-6 text-sm text-[#9ba69d]">
          Control your theme preference and in-platform alert choices.
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

        {!prefs ? (
          <div className="rounded-xl border border-[#29342d] bg-[#101612] p-8 text-sm text-[#9ba69d]">
            Loading preferences...
          </div>
        ) : (
          <form
            onSubmit={handleSave}
            className="space-y-6 rounded-xl border border-[#29342d] bg-[#101612] p-6"
          >
            <div>
              <label
                htmlFor="pref-theme"
                className="block text-xs font-semibold uppercase text-[#9ba69d]"
              >
                Appearance Theme
              </label>
              <select
                id="pref-theme"
                value={prefs.appearanceTheme || 'dark'}
                onChange={(e) => setPrefs({ ...prefs, appearanceTheme: e.target.value })}
                className="mt-1.5 w-full max-w-xs rounded-lg border border-[#29342d] bg-[#080b09] px-3 py-2 text-sm text-[#f5f7f2]"
              >
                <option value="dark">Stadium Dark (Default)</option>
                <option value="light">High-Contrast Light</option>
                <option value="system">System Preference</option>
              </select>
            </div>

            <div className="space-y-2.5 border-t border-[#29342d] pt-5">
              <p className="text-xs font-semibold uppercase text-[#c6ff3d]">
                Notification Channels
              </p>
              {[
                { key: 'securityAlerts', label: 'Account Security & Session Alerts' },
                { key: 'eventAlerts', label: 'Tournament & Community Event Alerts' },
                { key: 'productAnnouncements', label: 'Patch Notes & Season Updates' },
                { key: 'communityAlerts', label: 'Squad & Community Activity' },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-center justify-between rounded-lg border border-[#29342d] bg-[#151d18] px-4 py-3 text-xs text-[#f5f7f2]"
                >
                  <span>{item.label}</span>
                  <input
                    type="checkbox"
                    checked={Boolean(prefs.notificationPreferences?.[item.key])}
                    onChange={(e) =>
                      setPrefs({
                        ...prefs,
                        notificationPreferences: {
                          ...prefs.notificationPreferences,
                          [item.key]: e.target.checked,
                        },
                      })
                    }
                    className="accent-[#c6ff3d]"
                  />
                </label>
              ))}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#c6ff3d] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#080b09]"
            >
              {saving ? 'Saving...' : 'Save Preferences'}
            </button>
          </form>
        )}
      </div>
    </ProtectedRoute>
  );
}
