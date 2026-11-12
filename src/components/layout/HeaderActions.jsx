'use client';

import Link from 'next/link';
import { Box, Search, Volume2, VolumeX } from 'lucide-react';
import useAudio from '@/hooks/useAudio';
import UserMenu from '@/components/auth/UserMenu';
import { cn } from '@/lib/utils';

export default function HeaderActions({ pathname, onOpenSearch }) {
  const { isEnabled, toggleAudio } = useAudio();

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onOpenSearch}
        aria-label="Open site search"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#29342d] bg-[#151d18] text-[#9ba69d] transition-colors hover:border-[#c6ff3d]/50 hover:text-[#f5f7f2]"
      >
        <Search className="h-4 w-4" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={toggleAudio}
        aria-label={isEnabled ? 'Mute stadium audio' : 'Enable stadium audio'}
        aria-pressed={isEnabled}
        className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[#29342d] bg-[#151d18] px-2.5 text-xs font-medium text-[#9ba69d] transition-colors hover:border-[#c6ff3d]/50 hover:text-[#f5f7f2]"
      >
        {isEnabled ? (
          <Volume2 className="h-4 w-4 text-[#c6ff3d]" aria-hidden="true" />
        ) : (
          <VolumeX className="h-4 w-4" aria-hidden="true" />
        )}
        <span className="hidden xl:inline">{isEnabled ? 'Audio On' : 'Audio Off'}</span>
      </button>

      <UserMenu />

      <Link
        href="/resources/3d"
        className={cn(
          'hidden items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors sm:inline-flex',
          pathname === '/resources/3d'
            ? 'border-[#c6ff3d] bg-[#c6ff3d] text-[#080b09]'
            : 'border-[#c6ff3d]/40 bg-[#c6ff3d]/10 text-[#c6ff3d] hover:bg-[#c6ff3d]/20'
        )}
      >
        <Box className="h-3.5 w-3.5" aria-hidden="true" />
        3D Hub
      </Link>
    </div>
  );
}
