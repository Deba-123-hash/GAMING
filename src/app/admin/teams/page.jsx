'use client';

import { useCallback, useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import { apiRequest } from '@/lib/api/apiClient';

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState([]);
  const [name, setName] = useState('');
  const [shortCode, setShortCode] = useState('FC');
  const [type, setType] = useState('Club');
  const [country, setCountry] = useState('England');
  const [city, setCity] = useState('Manchester');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadTeams = useCallback(async () => {
    try {
      const res = await apiRequest('/api/teams?includeDrafts=true', { method: 'GET' });
      setTeams(res?.data?.teams || []);
    } catch (err) {
      setError(err.message || 'Unable to load teams.');
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiRequest('/api/teams?includeDrafts=true', { method: 'GET' });
        if (!cancelled) setTeams(res?.data?.teams || []);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Unable to load teams.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await apiRequest('/api/teams', {
        method: 'POST',
        body: {
          name,
          shortCode,
          type,
          country,
          city,
          primaryColor: '#C6FF3D',
          rating: 82,
          style: 'Balanced Press',
          description: `${name} is an original fictional team registered in RIVALRY 90.`,
        },
      });
      setName('');
      setMessage('Team created.');
      await loadTeams();
    } catch (err) {
      setError(err.message || 'Unable to create team.');
    }
  }

  async function handleDelete(id) {
    setError('');
    try {
      await apiRequest(`/api/teams/${id}`, { method: 'DELETE' });
      await loadTeams();
    } catch (err) {
      setError(err.message || 'Delete blocked.');
    }
  }

  return (
    <AdminShell title="Master Teams" description="Manage founding clubs and national squads.">
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

      <form
        onSubmit={handleCreate}
        className="mb-6 grid gap-3 rounded-xl border border-[#29342d] bg-[#101612] p-5 sm:grid-cols-6"
      >
        <input
          type="text"
          required
          placeholder="Team Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-lg border border-[#29342d] bg-[#080b09] px-3 py-2 text-xs text-[#f5f7f2] sm:col-span-2"
        />
        <input
          type="text"
          required
          maxLength={4}
          value={shortCode}
          onChange={(e) => setShortCode(e.target.value.toUpperCase())}
          className="rounded-lg border border-[#29342d] bg-[#080b09] px-3 py-2 text-xs text-[#f5f7f2]"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="rounded-lg border border-[#29342d] bg-[#080b09] px-3 py-2 text-xs text-[#f5f7f2]"
        >
          <option value="Club">Club</option>
          <option value="National Team">National Team</option>
          <option value="Academy">Academy</option>
        </select>
        <input
          type="text"
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="rounded-lg border border-[#29342d] bg-[#080b09] px-3 py-2 text-xs text-[#f5f7f2]"
        />
        <button
          type="submit"
          className="rounded-lg bg-[#c6ff3d] px-3 py-2 text-xs font-bold uppercase text-[#080b09]"
        >
          Add Team
        </button>
        <input
          type="text"
          required
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="rounded-lg border border-[#29342d] bg-[#080b09] px-3 py-2 text-xs text-[#f5f7f2] sm:col-span-2"
        />
      </form>

      <div className="grid gap-3 md:grid-cols-2">
        {teams.map((t) => (
          <div
            key={t.id}
            className="flex items-center justify-between rounded-xl border border-[#29342d] bg-[#101612] p-4"
          >
            <div>
              <p className="font-mono text-[10px] uppercase text-[#c6ff3d]">
                {t.type} • OVR {t.rating}
              </p>
              <h2 className="font-display text-lg font-bold uppercase text-[#f5f7f2]">{t.name}</h2>
              <p className="text-xs text-[#9ba69d]">
                {t.city}, {t.country}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleDelete(t.id)}
              aria-label={`Delete ${t.name}`}
              className="rounded p-2 text-red-400 hover:bg-red-500/10"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
