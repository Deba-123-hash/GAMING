'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  Calendar,
  FileText,
  FolderTree,
  Image as ImageIcon,
  LayoutDashboard,
  Lock,
  Plug,
  Settings,
  Shield,
  Trophy,
  UserCog,
  Users,
} from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import useAuth from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

const STAFF_ROLES = ['super_admin', 'admin', 'content_manager', 'moderator'];

const NAV_ITEMS = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/players', label: 'Players', icon: UserCog },
  { href: '/admin/teams', label: 'Teams', icon: Trophy },
  { href: '/admin/events', label: 'Events', icon: Calendar },
  { href: '/admin/news', label: 'News', icon: FileText },
  { href: '/admin/media', label: 'Media', icon: ImageIcon },
  { href: '/admin/categories', label: 'Categories', icon: FolderTree },
  { href: '/admin/roles', label: 'Roles', icon: Shield },
  { href: '/admin/audit-logs', label: 'Audit Logs', icon: Activity },
  { href: '/admin/security', label: 'Security', icon: Lock },
  { href: '/admin/integrations', label: 'Integrations', icon: Plug },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminShell({ title, description, children }) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <ProtectedRoute allowedRoles={STAFF_ROLES}>
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#29342d] pb-5">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-[#c6ff3d]">
              RIVALRY 90 Operations • Role: {user?.role}
            </p>
            <h1 className="mt-1 font-display text-3xl font-extrabold uppercase text-[#f5f7f2]">
              {title}
            </h1>
            {description && <p className="mt-1 text-sm text-[#9ba69d]">{description}</p>}
          </div>
          <Link
            href="/"
            className="rounded-lg border border-[#29342d] bg-[#151d18] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#f5f7f2] hover:border-[#c6ff3d]/50"
          >
            Back to Universe
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <nav
              aria-label="Admin Console Navigation"
              className="flex flex-wrap gap-1.5 rounded-xl border border-[#29342d] bg-[#101612] p-3 lg:flex-col"
            >
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active =
                  item.href === '/admin'
                    ? pathname === '/admin'
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors',
                      active
                        ? 'bg-[#c6ff3d] text-[#080b09]'
                        : 'text-[#9ba69d] hover:bg-[#151d18] hover:text-[#f5f7f2]'
                    )}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          <main className="lg:col-span-9">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
