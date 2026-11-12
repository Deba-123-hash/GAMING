'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Lock, Settings, Shield, Sliders, Trophy, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/profile', label: 'Overview', icon: User },
  { href: '/profile/edit', label: 'Edit Profile', icon: Sliders },
  { href: '/profile/settings', label: 'Preferences', icon: Settings },
  { href: '/profile/privacy', label: 'Privacy', icon: Lock },
  { href: '/profile/security', label: 'Security', icon: Shield },
  { href: '/my-squad', label: 'My Squads', icon: Trophy },
];

export default function ProfileNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Profile navigation" className="mb-8 flex flex-wrap gap-2">
      {LINKS.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors',
              active
                ? 'border-[#c6ff3d] bg-[#c6ff3d] text-[#080b09]'
                : 'border-[#29342d] bg-[#101612] text-[#9ba69d] hover:border-[#c6ff3d]/40 hover:text-[#f5f7f2]'
            )}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
