'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { Lock, UserCheck } from 'lucide-react';
import { apiRequest } from '@/lib/api/apiClient';

export default function PublicUserProfilePage({ params }) {
  const { username } = use(params);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiRequest(`/api/users/${encodeURIComponent(username)}`, {
          method: 'GET',
        });
        if (!cancelled) {
          setProfile(res?.data?.profile || null);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'User profile not found.');
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [username]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      {loading ? (
        <div className="rounded-xl border border-[#29342d] bg-[#101612] p-8 text-sm text-[#9ba69d]">
          Loading public manager card...
        </div>
      ) : error || !profile ? (
        <div className="rounded-xl border border-[#29342d] bg-[#101612] p-10 text-center">
          <h1 className="font-display text-2xl font-bold uppercase text-[#f5f7f2]">
            Manager Not Found
          </h1>
          <p className="mt-2 text-sm text-[#9ba69d]">{error}</p>
          <Link
            href="/"
            className="mt-5 inline-block rounded-lg border border-[#29342d] bg-[#151d18] px-4 py-2 text-xs uppercase text-[#f5f7f2]"
          >
            Back Home
          </Link>
        </div>
      ) : profile.isPrivate ? (
        <div className="rounded-xl border border-[#29342d] bg-[#101612] p-10 text-center">
          <Lock className="mx-auto h-9 w-9 text-[#c6ff3d]" />
          <h1 className="mt-3 font-display text-2xl font-bold uppercase text-[#f5f7f2]">
            @{profile.username}
          </h1>
          <p className="mt-2 text-sm text-[#9ba69d]">
            This manager has set their RIVALRY 90 profile visibility to private.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-[#29342d] bg-[#101612] p-8 shadow-2xl">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#c6ff3d] font-bold text-[#080b09]">
              {(profile.displayName || profile.username).slice(0, 2).toUpperCase()}
            </span>
            <div>
              <h1 className="font-display text-2xl font-bold uppercase text-[#f5f7f2]">
                {profile.displayName}
              </h1>
              <p className="flex items-center gap-1.5 text-xs text-[#9ba69d]">
                <UserCheck className="h-3.5 w-3.5 text-[#c6ff3d]" />@{profile.username} •{' '}
                {profile.profileVisibility}
              </p>
            </div>
          </div>

          {profile.bio && (
            <p className="mt-5 text-sm leading-relaxed text-[#f5f7f2]/90">{profile.bio}</p>
          )}

          {(profile.favouriteTeam || profile.preferredPosition || profile.preferredFormation) && (
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {profile.favouriteTeam && (
                <div className="rounded-lg border border-[#29342d] bg-[#151d18] p-3">
                  <p className="text-[10px] uppercase text-[#9ba69d]">Favourite Team</p>
                  <p className="mt-1 text-sm font-semibold text-[#f5f7f2]">
                    {profile.favouriteTeam}
                  </p>
                </div>
              )}
              {profile.preferredPosition && (
                <div className="rounded-lg border border-[#29342d] bg-[#151d18] p-3">
                  <p className="text-[10px] uppercase text-[#9ba69d]">Position</p>
                  <p className="mt-1 text-sm font-semibold text-[#c6ff3d]">
                    {profile.preferredPosition}
                  </p>
                </div>
              )}
              {profile.preferredFormation && (
                <div className="rounded-lg border border-[#29342d] bg-[#151d18] p-3">
                  <p className="text-[10px] uppercase text-[#9ba69d]">Formation</p>
                  <p className="mt-1 text-sm font-semibold text-[#f5f7f2]">
                    {profile.preferredFormation}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
