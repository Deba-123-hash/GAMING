'use client';

import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { apiRequest } from '@/lib/api/apiClient';

export default function AdminRolesPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiRequest('/api/admin/roles', { method: 'GET' });
        if (!cancelled) setData(res?.data || null);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Unable to load roles.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AdminShell
      title="Roles & RBAC Matrix"
      description="Authoritative permission scopes enforced server-side."
    >
      {error && (
        <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-200">
          {error}
        </div>
      )}
      {!data ? (
        <div className="rounded-xl border border-[#29342d] bg-[#101612] p-8 text-sm text-[#9ba69d]">
          Loading RBAC matrix...
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {data.roles.map((role) => (
            <div key={role.id} className="rounded-xl border border-[#29342d] bg-[#101612] p-5">
              <p className="font-mono text-xs uppercase text-[#c6ff3d]">{role.id}</p>
              <h2 className="mt-1 font-display text-xl font-bold uppercase text-[#f5f7f2]">
                {role.label}
              </h2>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {role.permissions.map((perm) => (
                  <span
                    key={perm}
                    className="rounded border border-[#29342d] bg-[#151d18] px-2 py-0.5 font-mono text-[10px] text-[#9ba69d]"
                  >
                    {perm}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
