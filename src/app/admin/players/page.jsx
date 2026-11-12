'use client';

import { useCallback, useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import { apiRequest } from '@/lib/api/apiClient';
import { TEAMS } from '@/data/teams';

export default function AdminPlayersPage() {
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState('');
  const [number, setNumber] = useState(99);
  const [position, setPosition] = useState('ST');
  const [teamId, setTeamId] = useState(TEAMS[0]?.id || 'apex-united');
  const [nationality, setNationality] = useState('England');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadPlayers = useCallback(async () => {
    try {
      const res = await apiRequest('/api/players?includeDrafts=true&pageSize=100', {
        method: 'GET',
      });
      setPlayers(res?.data?.players || []);
    } catch (err) {
      setError(err.message || 'Unable to load master players.');
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiRequest('/api/players?includeDrafts=true&pageSize=100', {
          method: 'GET',
        });
        if (!cancelled) setPlayers(res?.data?.players || []);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Unable to load master players.');
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
      await apiRequest('/api/players', {
        method: 'POST',
        body: {
          name,
          number: Number(number),
          position,
          role: 'Squad Prospect',
          teamId,
          nationality,
          bio: `${name} is an original fictional prospect added via the RIVALRY 90 Admin Console.`,
          stats: {
            pace: 84,
            shooting: 82,
            passing: 79,
            dribbling: 83,
            defending: 55,
            physical: 77,
          },
        },
      });
      setName('');
      setMessage('Master player record created.');
      await loadPlayers();
    } catch (err) {
      setError(err.message || 'Player creation failed.');
    }
  }

  async function handleDelete(id) {
    setError('');
    try {
      await apiRequest(`/api/players/${id}`, { method: 'DELETE' });
      await loadPlayers();
    } catch (err) {
      setError(err.message || 'Delete failed.');
    }
  }

  return (
    <AdminShell
      title="Master Players"
      description="Create and manage canonical fictional player profiles."
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

      <form
        onSubmit={handleCreate}
        className="mb-6 grid gap-3 rounded-xl border border-[#29342d] bg-[#101612] p-5 sm:grid-cols-6"
      >
        <input
          type="text"
          required
          placeholder="Player Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-lg border border-[#29342d] bg-[#080b09] px-3 py-2 text-xs text-[#f5f7f2] sm:col-span-2"
        />
        <input
          type="number"
          min={1}
          max={99}
          required
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className="rounded-lg border border-[#29342d] bg-[#080b09] px-3 py-2 text-xs text-[#f5f7f2]"
        />
        <select
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="rounded-lg border border-[#29342d] bg-[#080b09] px-3 py-2 text-xs text-[#f5f7f2]"
        >
          {['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST'].map((pos) => (
            <option key={pos} value={pos}>
              {pos}
            </option>
          ))}
        </select>
        <select
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
          className="rounded-lg border border-[#29342d] bg-[#080b09] px-3 py-2 text-xs text-[#f5f7f2]"
        >
          {TEAMS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg bg-[#c6ff3d] px-3 py-2 text-xs font-bold uppercase text-[#080b09]"
        >
          Add Player
        </button>
        <input
          type="text"
          required
          placeholder="Nationality"
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          className="rounded-lg border border-[#29342d] bg-[#080b09] px-3 py-2 text-xs text-[#f5f7f2] sm:col-span-2"
        />
      </form>

      <div className="overflow-x-auto rounded-xl border border-[#29342d] bg-[#101612] p-4">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#29342d] text-[#9ba69d]">
              <th className="py-2 pr-3">Athlete</th>
              <th className="py-2 pr-3">Pos</th>
              <th className="py-2 pr-3">OVR</th>
              <th className="py-2 pr-3">Club</th>
              <th className="py-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p) => (
              <tr key={p.id} className="border-b border-[#29342d]/40">
                <td className="py-2.5 pr-3 font-semibold text-[#f5f7f2]">
                  {p.name} #{p.number}
                </td>
                <td className="py-2.5 pr-3 font-mono text-[#c6ff3d]">{p.position}</td>
                <td className="py-2.5 pr-3 font-bold text-[#f5f7f2]">{p.ovr}</td>
                <td className="py-2.5 pr-3 text-[#9ba69d]">{p.teamId}</td>
                <td className="py-2.5 text-right">
                  <button
                    type="button"
                    onClick={() => handleDelete(p.id)}
                    aria-label={`Delete ${p.name}`}
                    className="rounded p-1.5 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
