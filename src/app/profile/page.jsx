'use client';

import Link from 'next/link';
import { Award, Edit3, Shield, Users } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ProfileNav from '@/components/profile/ProfileNav';
import useAuth from '@/hooks/useAuth';
import { TEAMS } from '@/data/teams';

export default function ProfilePage() {
  const { user, profile } = useAuth();
  const team = TEAMS.find((t) => t.id === profile?.favouriteTeamId);

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#c6ff3d]">
              Player & Manager Dossier
            </p>
            <h1 className="mt-1 font-display text-3xl font-bold uppercase text-[#f5f7f2]">
              {profile?.displayName || user?.fullName}
            </h1>
            <p className="text-sm text-[#9ba69d]">
              @{user?.username} • Visibility:{' '}
              <span className="uppercase text-[#f5f7f2]">
                {profile?.profileVisibility || 'public'}
              </span>
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/users/${user?.username}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#29342d] bg-[#151d18] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#f5f7f2] hover:border-[#c6ff3d]/50"
            >
              <Users className="h-3.5 w-3.5 text-[#c6ff3d]" />
              Public View
            </Link>
            <Link
              href="/profile/edit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#c6ff3d] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#080b09]"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit Profile
            </Link>
          </div>
        </div>

        <div className="mt-6">
          <ProfileNav />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-[#29342d] bg-[#101612] p-6 md:col-span-2">
            <h2 className="font-display text-lg font-bold uppercase text-[#f5f7f2]">
              Football Identity
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#9ba69d]">
              {profile?.bio || 'No manager bio written yet. Add tactical notes in Edit Profile.'}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-[#29342d] bg-[#151d18] p-3">
                <p className="text-[11px] uppercase text-[#9ba69d]">Favourite Team</p>
                <p className="mt-1 text-sm font-semibold text-[#f5f7f2]">
                  {team?.name || 'Apex United FC'}
                </p>
              </div>
              <div className="rounded-lg border border-[#29342d] bg-[#151d18] p-3">
                <p className="text-[11px] uppercase text-[#9ba69d]">Preferred Position</p>
                <p className="mt-1 text-sm font-semibold text-[#c6ff3d]">
                  {profile?.preferredPosition || 'ST'}
                </p>
              </div>
              <div className="rounded-lg border border-[#29342d] bg-[#151d18] p-3">
                <p className="text-[11px] uppercase text-[#9ba69d]">Preferred Formation</p>
                <p className="mt-1 text-sm font-semibold text-[#f5f7f2]">
                  {profile?.preferredFormation || '4-3-3'}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-[#29342d] bg-[#101612] p-6">
              <div className="flex items-center gap-2 text-[#c6ff3d]">
                <Award className="h-4 w-4" />
                <h2 className="font-display text-base font-bold uppercase text-[#f5f7f2]">
                  Status
                </h2>
              </div>
              <p className="mt-3 text-xs text-[#9ba69d]">
                Account Role:{' '}
                <span className="font-semibold uppercase text-[#f5f7f2]">{user?.role}</span>
              </p>
              <p className="mt-1.5 text-xs text-[#9ba69d]">
                Language:{' '}
                <span className="uppercase text-[#f5f7f2]">
                  {profile?.preferredLanguage || 'en'}
                </span>
              </p>
            </div>

            <div className="rounded-xl border border-[#29342d] bg-[#101612] p-6">
              <div className="flex items-center gap-2 text-[#c6ff3d]">
                <Shield className="h-4 w-4" />
                <h2 className="font-display text-base font-bold uppercase text-[#f5f7f2]">
                  Privacy Summary
                </h2>
              </div>
              <p className="mt-2 text-xs text-[#9ba69d]">
                Public Bio:{' '}
                <strong className="text-[#f5f7f2]">
                  {profile?.showBioPublic ? 'Shown' : 'Hidden'}
                </strong>
              </p>
              <p className="mt-1 text-xs text-[#9ba69d]">
                Tactical Preferences:{' '}
                <strong className="text-[#f5f7f2]">
                  {profile?.showPreferencesPublic ? 'Shown' : 'Hidden'}
                </strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
