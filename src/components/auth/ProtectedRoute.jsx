'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShieldAlert } from 'lucide-react';
import useAuth from '@/hooks/useAuth';

export default function ProtectedRoute({ children, allowedRoles = null }) {
  const { loading, authenticated, role } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !authenticated) {
      const next = encodeURIComponent(pathname || '/profile');
      router.replace(`/login?next=${next}`);
    }
  }, [loading, authenticated, pathname, router]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <div className="rounded-xl border border-[#29342d] bg-[#101612] p-10">
          <p className="text-sm uppercase tracking-widest text-[#c6ff3d]">Verifying Session</p>
          <p className="mt-2 text-sm text-[#9ba69d]">Checking secure credentials...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <div className="rounded-xl border border-red-500/40 bg-[#101612] p-8 text-center">
          <ShieldAlert className="mx-auto h-10 w-10 text-red-400" aria-hidden="true" />
          <h1 className="mt-4 font-display text-2xl font-bold uppercase text-[#f5f7f2]">
            Access Restricted
          </h1>
          <p className="mt-2 text-sm text-[#9ba69d]">
            Your current role (<span className="text-[#f5f7f2]">{role}</span>) does not have
            permission to view this operational area.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/profile"
              className="rounded-md border border-[#29342d] bg-[#151d18] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#f5f7f2] hover:border-[#c6ff3d]/50"
            >
              Return to Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
