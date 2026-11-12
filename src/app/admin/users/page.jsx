'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import AdminShell from '@/components/admin/AdminShell';
import { apiRequest } from '@/lib/api/apiClient';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [error, setError] = useState('');

  const fetchUsers = useCallback(
    async (q = search, role = roleFilter) => {
      try {
        const params = new URLSearchParams();
        if (q) params.set('search', q);
        if (role !== 'ALL') params.set('role', role);
        const res = await apiRequest(`/api/admin/users?${params.toString()}`, { method: 'GET' });
        setUsers(res?.data?.users || []);
        setError('');
      } catch (err) {
        setError(err.message || 'Unable to load users.');
      }
    },
    [search, roleFilter]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiRequest('/api/admin/users', { method: 'GET' });
        if (!cancelled) setUsers(res?.data?.users || []);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Unable to load users.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function toggleStatus(u) {
    setError('');
    try {
      if (u.status === 'active') {
        await apiRequest(`/api/admin/users/${u.id}/suspend`, { method: 'POST', body: {} });
      } else {
        await apiRequest(`/api/admin/users/${u.id}/reactivate`, { method: 'POST' });
      }
      await fetchUsers();
    } catch (err) {
      setError(err.message || 'Status change rejected.');
    }
  }

  return (
    <AdminShell
      title="User Administration"
      description="Inspect user accounts, filter by role, and enforce account suspensions."
    >
      {error && (
        <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-200">
          {error}
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-3 rounded-xl border border-[#29342d] bg-[#101612] p-4">
        <input
          type="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            fetchUsers(e.target.value, roleFilter);
          }}
          placeholder="Search name, username, or email..."
          className="rounded-lg border border-[#29342d] bg-[#080b09] px-3 py-2 text-xs text-[#f5f7f2] sm:w-64"
        />
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            fetchUsers(search, e.target.value);
          }}
          className="rounded-lg border border-[#29342d] bg-[#080b09] px-3 py-2 text-xs text-[#f5f7f2]"
        >
          <option value="ALL">All Roles</option>
          <option value="super_admin">Super Admin</option>
          <option value="admin">Admin</option>
          <option value="content_manager">Content Manager</option>
          <option value="moderator">Moderator</option>
          <option value="user">User</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#29342d] bg-[#101612] p-4">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#29342d] text-[#9ba69d]">
              <th className="py-2 pr-3">Username</th>
              <th className="py-2 pr-3">Email</th>
              <th className="py-2 pr-3">Role</th>
              <th className="py-2 pr-3">Status</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-[#29342d]/50">
                <td className="py-3 pr-3 font-semibold text-[#f5f7f2]">@{u.username}</td>
                <td className="py-3 pr-3 text-[#9ba69d]">{u.email}</td>
                <td className="py-3 pr-3 font-mono uppercase text-[#c6ff3d]">{u.role}</td>
                <td className="py-3 pr-3 uppercase text-[#f5f7f2]">{u.status}</td>
                <td className="py-3 text-right">
                  <div className="inline-flex gap-2">
                    <Link
                      href={`/admin/users/${u.id}`}
                      className="rounded border border-[#29342d] bg-[#151d18] px-2.5 py-1 text-[11px] text-[#f5f7f2] hover:border-[#c6ff3d]"
                    >
                      Inspect
                    </Link>
                    <button
                      type="button"
                      onClick={() => toggleStatus(u)}
                      className="rounded border border-[#29342d] bg-[#151d18] px-2.5 py-1 text-[11px] text-[#c6ff3d] hover:border-[#c6ff3d]"
                    >
                      {u.status === 'active' ? 'Suspend' : 'Reactivate'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
