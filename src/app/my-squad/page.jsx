'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Trophy } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ProfileNav from '@/components/profile/ProfileNav';
import { apiRequest } from '@/lib/api/apiClient';

export default function MySquadPage() {
  const [squads, setSquads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSquads = useCallback(async () => {
    try {
      const res = await apiRequest('/api/squads', { method: 'GET' });
      setSquads(res?.data?.squads || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Unable to load saved squads.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiRequest('/api/squads', { method: 'GET' });
        if (!cancelled) {
          setSquads(res?.data?.squads || []);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Unable to load saved squads.');
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleDelete(id) {
    try {
      await apiRequest(`/api/squads/${id}`, { method: 'DELETE' });
      await fetchSquads();
    } catch (err) {
      setError(err.message || 'Could not delete squad.');
    }
  }

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#c6ff3d]">
              Saved Tactical Lineups
            </p>
            <h1 className="mt-1 font-display text-3xl font-bold uppercase text-[#f5f7f2]">
              My Squads
            </h1>
          </div>
          <Link
            href="/squad"
            className="inline-flex items-center gap-2 rounded-lg bg-[#c6ff3d] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#080b09]"
          >
            <Plus className="h-4 w-4" />
            Open Squad Builder
          </Link>
        </div>

        <div className="mt-6">
          <ProfileNav />
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-xl border border-[#29342d] bg-[#101612] p-8 text-sm text-[#9ba69d]">
            Loading saved squads...
          </div>
        ) : squads.length === 0 ? (
          <div className="rounded-xl border border-[#29342d] bg-[#101612] p-10 text-center">
            <Trophy className="mx-auto h-8 w-8 text-[#c6ff3d]" />
            <h2 className="mt-3 font-display text-xl font-bold uppercase text-[#f5f7f2]">
              No Server-Saved Squads Yet
            </h2>
            <p className="mt-2 text-sm text-[#9ba69d]">
              Build your starting XI in the Squad Builder and save it to your account.
            </p>
            <Link
              href="/squad"
              className="mt-5 inline-flex rounded-lg bg-[#c6ff3d] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#080b09]"
            >
              Launch Squad Builder
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {squads.map((squad) => (
              <div key={squad.id} className="rounded-xl border border-[#29342d] bg-[#101612] p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-[#c6ff3d]">
                      {squad.formation} Formation
                    </p>
                    <h2 className="mt-1 font-display text-xl font-bold uppercase text-[#f5f7f2]">
                      {squad.name}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(squad.id)}
                    aria-label={`Delete ${squad.name}`}
                    className="rounded-md border border-red-500/30 p-2 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="rounded bg-[#151d18] p-2">
                    <p className="text-[10px] text-[#9ba69d]">OVR</p>
                    <p className="font-bold text-[#c6ff3d]">
                      {squad.ratings?.overallRating ?? '--'}
                    </p>
                  </div>
                  <div className="rounded bg-[#151d18] p-2">
                    <p className="text-[10px] text-[#9ba69d]">ATK</p>
                    <p className="font-bold text-[#f5f7f2]">
                      {squad.ratings?.attackRating ?? '--'}
                    </p>
                  </div>
                  <div className="rounded bg-[#151d18] p-2">
                    <p className="text-[10px] text-[#9ba69d]">MID</p>
                    <p className="font-bold text-[#f5f7f2]">
                      {squad.ratings?.midfieldRating ?? '--'}
                    </p>
                  </div>
                  <div className="rounded bg-[#151d18] p-2">
                    <p className="text-[10px] text-[#9ba69d]">DEF</p>
                    <p className="font-bold text-[#f5f7f2]">
                      {squad.ratings?.defenceRating ?? '--'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
