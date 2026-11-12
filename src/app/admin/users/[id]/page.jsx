'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import AdminShell from '@/components/admin/AdminShell';
import { apiRequest } from '@/lib/api/apiClient';

export default function AdminUserDetailPage({ params }) {
  const { id } = use(params);
  const [detail, setDetail] = useState(null);
  const [nextRole, setNextRole] = useState('user');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiRequest(`/api/admin/users/${id}`, { method: 'GET' });
        if (!cancelled) {
          setDetail(res?.data || null);
          setNextRole(res?.data?.user?.role || 'user');
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Unable to load user.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleRoleSave(e) {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await apiRequest(`/api/admin/users/${id}`, {
        method: 'PATCH',
        body: { role: nextRole },
      });
      setDetail((prev) => (prev ? { ...prev, user: res?.data?.user } : prev));
      setMessage('User role updated and audited.');
    } catch (err) {
      setError(err.message || 'Role update blocked.');
    }
  }

  return (
    <AdminShell
      title="User Account Detail"
      description="Inspect profile state and manage RBAC role assignment."
    >
      <Link
        href="/admin/users"
        className="mb-4 inline-block text-xs text-[#c6ff3d] hover:underline"
      >
        ← Back to Users
      </Link>

      {message && (
        <div className="mb-4 rounded-lg border border-[#c6ff3d]/40 bg-[#c6ff3d]/10 p-3 text-xs text-[#f5f7f2]">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-200">
          {error}
        </div>
      )}

      {!detail ? (
        <div className="rounded-xl border border-[#29342d] bg-[#101612] p-8 text-sm text-[#9ba69d]">
          Loading user record...
        </div>
      ) : (
        <div className="space-y-6 rounded-xl border border-[#29342d] bg-[#101612] p-6">
          <div className="grid gap-4 sm:grid-cols-2 text-xs">
            <div>
              <p className="text-[#9ba69d]">Username</p>
              <p className="mt-1 font-semibold text-[#f5f7f2]">@{detail.user.username}</p>
            </div>
            <div>
              <p className="text-[#9ba69d]">Saved Squads</p>
              <p className="mt-1 font-semibold text-[#f5f7f2]">{detail.squadCount}</p>
            </div>
            <div>
              <p className="text-[#9ba69d]">Current Role</p>
              <p className="mt-1 font-mono uppercase text-[#c6ff3d]">{detail.user.role}</p>
            </div>
            <div>
              <p className="text-[#9ba69d]">Account Status</p>
              <p className="mt-1 uppercase text-[#f5f7f2]">{detail.user.status}</p>
            </div>
          </div>

          <form onSubmit={handleRoleSave} className="border-t border-[#29342d] pt-5">
            <label
              htmlFor="adm-role"
              className="block text-xs font-semibold uppercase text-[#9ba69d]"
            >
              Assign Role
            </label>
            <div className="mt-2 flex flex-wrap gap-3">
              <select
                id="adm-role"
                value={nextRole}
                onChange={(e) => setNextRole(e.target.value)}
                className="rounded-lg border border-[#29342d] bg-[#080b09] px-3 py-2 text-xs text-[#f5f7f2]"
              >
                <option value="user">User</option>
                <option value="moderator">Moderator</option>
                <option value="content_manager">Content Manager</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
              <button
                type="submit"
                className="rounded-lg bg-[#c6ff3d] px-4 py-2 text-xs font-bold uppercase text-[#080b09]"
              >
                Apply Role Change
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminShell>
  );
}
