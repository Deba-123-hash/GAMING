'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronDown, LogOut, Settings, Shield, Trophy, User } from 'lucide-react';
import useAuth from '@/hooks/useAuth';

export default function UserMenu() {
  const { loading, authenticated, user, profile, isStaff, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  if (loading) {
    return (
      <span className="hidden h-9 w-20 animate-pulse rounded-md border border-[#29342d] bg-[#151d18] sm:inline-flex" />
    );
  }

  if (!authenticated || !user) {
    return (
      <div className="flex items-center gap-1.5">
        <Link
          href="/login"
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[#29342d] bg-[#151d18] px-3 text-xs font-semibold uppercase tracking-wider text-[#f5f7f2] transition-colors hover:border-[#c6ff3d]/60"
        >
          <User className="h-3.5 w-3.5 text-[#c6ff3d]" aria-hidden="true" />
          <span>Sign In</span>
        </Link>
        <Link
          href="/register"
          className="hidden h-9 items-center rounded-md border border-[#c6ff3d]/50 bg-[#c6ff3d]/10 px-3 text-xs font-semibold uppercase tracking-wider text-[#c6ff3d] transition-colors hover:bg-[#c6ff3d]/20 sm:inline-flex"
        >
          Join
        </Link>
      </div>
    );
  }

  const initials = (profile?.displayName || user.username || 'R9').slice(0, 2).toUpperCase();

  async function handleLogout() {
    setOpen(false);
    await logout();
    router.push('/');
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex h-9 items-center gap-2 rounded-md border border-[#29342d] bg-[#151d18] px-2.5 text-xs font-medium text-[#f5f7f2] transition-colors hover:border-[#c6ff3d]/50"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#c6ff3d] text-[10px] font-bold text-[#080b09]">
          {initials}
        </span>
        <span className="hidden max-w-[96px] truncate xl:inline">{user.username}</span>
        <ChevronDown className="h-3.5 w-3.5 text-[#9ba69d]" aria-hidden="true" />
      </button>

      {open && (
        <div
          onMouseLeave={() => setOpen(false)}
          className="absolute right-0 z-50 mt-2 w-56 rounded-lg border border-[#29342d] bg-[#0e1410] p-2 shadow-2xl"
        >
          <div className="border-b border-[#29342d] px-3 py-2">
            <p className="truncate text-xs font-semibold text-[#f5f7f2]">
              {profile?.displayName || user.fullName}
            </p>
            <p className="truncate text-[11px] text-[#9ba69d]">@{user.username}</p>
            <span className="mt-1 inline-block rounded bg-[#c6ff3d]/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-[#c6ff3d]">
              {user.role}
            </span>
          </div>

          <div className="mt-1 flex flex-col gap-0.5 text-xs">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded px-3 py-2 text-[#f5f7f2] hover:bg-[#151d18]"
            >
              <User className="h-3.5 w-3.5 text-[#c6ff3d]" />
              Profile Hub
            </Link>
            <Link
              href="/my-squad"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded px-3 py-2 text-[#f5f7f2] hover:bg-[#151d18]"
            >
              <Trophy className="h-3.5 w-3.5 text-[#c6ff3d]" />
              My Squads
            </Link>
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded px-3 py-2 text-[#f5f7f2] hover:bg-[#151d18]"
            >
              <Settings className="h-3.5 w-3.5 text-[#c6ff3d]" />
              Account & Settings
            </Link>
            {isStaff && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded px-3 py-2 text-[#c6ff3d] hover:bg-[#151d18]"
              >
                <Shield className="h-3.5 w-3.5" />
                Admin Console
              </Link>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="mt-1 flex w-full items-center gap-2 rounded border-t border-[#29342d] px-3 py-2 text-left text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
