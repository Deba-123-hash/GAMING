'use client';

import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { apiRequest } from '@/lib/api/apiClient';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiRequest('/api/admin/settings', { method: 'GET' });
        if (!cancelled) setSettings(res?.data?.settings || null);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Unable to load settings.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await apiRequest('/api/admin/settings', {
        method: 'PATCH',
        body: {
          platformName: settings.platformName,
          platformDescription: settings.platformDescription,
          defaultLanguage: settings.defaultLanguage,
          defaultTheme: settings.defaultTheme,
        },
      });
      setSettings(res?.data?.settings || settings);
      setMessage('Platform settings updated.');
    } catch (err) {
      setError(err.message || 'Update blocked.');
    }
  }

  return (
    <AdminShell
      title="Platform Settings"
      description="Global universe defaults and runtime metadata."
    >
      {message && (
        <div className="mb-4 rounded-lg border border-[#c6ff3d]/40 bg-[#c6ff3d]/10 p-3 text-xs text-[#f5f7f2]">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-200">
          {error}
        </div>
      )}

      {!settings ? (
        <div className="rounded-xl border border-[#29342d] bg-[#101612] p-8 text-sm text-[#9ba69d]">
          Loading platform settings...
        </div>
      ) : (
        <form
          onSubmit={handleSave}
          className="space-y-4 rounded-xl border border-[#29342d] bg-[#101612] p-6"
        >
          <div>
            <label
              htmlFor="adm-pname"
              className="block text-xs font-semibold uppercase text-[#9ba69d]"
            >
              Platform Name
            </label>
            <input
              id="adm-pname"
              type="text"
              required
              value={settings.platformName}
              onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
              className="mt-1.5 w-full rounded-lg border border-[#29342d] bg-[#080b09] px-3 py-2 text-sm text-[#f5f7f2]"
            />
          </div>

          <div>
            <label
              htmlFor="adm-pdesc"
              className="block text-xs font-semibold uppercase text-[#9ba69d]"
            >
              Platform Description
            </label>
            <textarea
              id="adm-pdesc"
              rows={2}
              value={settings.platformDescription}
              onChange={(e) => setSettings({ ...settings, platformDescription: e.target.value })}
              className="mt-1.5 w-full rounded-lg border border-[#29342d] bg-[#080b09] px-3 py-2 text-sm text-[#f5f7f2]"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="adm-lang"
                className="block text-xs font-semibold uppercase text-[#9ba69d]"
              >
                Default Language
              </label>
              <select
                id="adm-lang"
                value={settings.defaultLanguage}
                onChange={(e) => setSettings({ ...settings, defaultLanguage: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-[#29342d] bg-[#080b09] px-3 py-2 text-sm text-[#f5f7f2]"
              >
                <option value="en">English (en)</option>
                <option value="es">Spanish (es)</option>
                <option value="fr">French (fr)</option>
                <option value="de">German (de)</option>
                <option value="ja">Japanese (ja)</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="adm-theme"
                className="block text-xs font-semibold uppercase text-[#9ba69d]"
              >
                Default Theme
              </label>
              <select
                id="adm-theme"
                value={settings.defaultTheme}
                onChange={(e) => setSettings({ ...settings, defaultTheme: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-[#29342d] bg-[#080b09] px-3 py-2 text-sm text-[#f5f7f2]"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="rounded-lg bg-[#c6ff3d] px-6 py-2.5 text-xs font-bold uppercase text-[#080b09]"
          >
            Save Global Settings
          </button>
        </form>
      )}
    </AdminShell>
  );
}
