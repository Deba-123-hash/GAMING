'use client';

import Link from 'next/link';
import { ShieldCheck, Sliders, Trophy, UserCheck } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ProfileNav from '@/components/profile/ProfileNav';
import useAuth from '@/hooks/useAuth';

export default function AccountPage() {
  const { user, profile } = useAuth();

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-5xl px-4 py-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#c6ff3d]">
          Account Command
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold uppercase text-[#f5f7f2]">
          Manager Account Hub
        </h1>
        <p className="mt-2 mb-6 text-sm text-[#9ba69d]">
          Manage your RIVALRY 90 identity, saved squads, privacy rules, and account security.
        </p>

        <ProfileNav />

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-xl border border-[#29342d] bg-[#101612] p-6">
            <div className="flex items-center gap-2 text-[#c6ff3d]">
              <UserCheck className="h-5 w-5" aria-hidden="true" />
              <h2 className="font-display text-lg font-bold uppercase text-[#f5f7f2]">
                Session & Identity
              </h2>
            </div>
            <dl className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <dt className="text-[#9ba69d]">Display Name</dt>
                <dd className="font-semibold text-[#f5f7f2]">
                  {profile?.displayName || user?.fullName}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#9ba69d]">Username</dt>
                <dd className="font-semibold text-[#f5f7f2]">@{user?.username}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#9ba69d]">Email</dt>
                <dd className="text-[#f5f7f2]">{user?.email}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#9ba69d]">Role</dt>
                <dd className="uppercase text-[#c6ff3d]">{user?.role}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#9ba69d]">Email Verification</dt>
                <dd className="text-[#f5f7f2]">
                  {user?.emailVerified ? 'Verified' : 'Pending email provider setup'}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-[#29342d] bg-[#101612] p-6">
            <div className="flex items-center gap-2 text-[#c6ff3d]">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              <h2 className="font-display text-lg font-bold uppercase text-[#f5f7f2]">
                Quick Actions
              </h2>
            </div>
            <div className="mt-4 grid gap-2.5 text-xs">
              <Link
                href="/profile/edit"
                className="flex items-center justify-between rounded-lg border border-[#29342d] bg-[#151d18] px-4 py-3 text-[#f5f7f2] hover:border-[#c6ff3d]/50"
              >
                <span className="flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-[#c6ff3d]" />
                  Update Football Bio & Team Affinity
                </span>
                <span>Edit</span>
              </Link>
              <Link
                href="/my-squad"
                className="flex items-center justify-between rounded-lg border border-[#29342d] bg-[#151d18] px-4 py-3 text-[#f5f7f2] hover:border-[#c6ff3d]/50"
              >
                <span className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-[#c6ff3d]" />
                  Open Saved Lineups & Squad Builder
                </span>
                <span>Open</span>
              </Link>
              <Link
                href={`/users/${user?.username}`}
                className="flex items-center justify-between rounded-lg border border-[#29342d] bg-[#151d18] px-4 py-3 text-[#f5f7f2] hover:border-[#c6ff3d]/50"
              >
                <span>Preview Public Profile Card</span>
                <span>View</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
