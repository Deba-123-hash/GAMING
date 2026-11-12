'use client';

import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { apiRequest } from '@/lib/api/apiClient';

export default function AdminSecurityPage() {
  const [overview, setOverview] = useState(null);
  const [dbHealth, setDbHealth] = useState(null);
  const [targetUserId, setTargetUserId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiRequest('/api/admin/security', { method: 'GET' });
        if (!cancelled) {
          setOverview(res?.data?.overview || null);
          setDbHealth(res?.data?.databaseHealth || null);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Unable to load security telemetry.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleRevoke(e) {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await apiRequest('/api/admin/security', {
        method: 'POST',
        body: { userId: targetUserId },
      });
      setMessage(`All active sessions revoked for ${targetUserId}.`);
      setTargetUserId('');
    } catch (err) {
      setError(err.message || 'Revocation blocked.');
    }
  }

  return (
    <AdminShell
      title="Security Operations"
      description="Active session telemetry and emergency session revocation."
    >
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

      {overview && (
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[#29342d] bg-[#101612] p-5">
            <p className="font-mono text-[10px] uppercase text-[#9ba69d]">Active Sessions</p>
            <p className="mt-2 font-display text-3xl font-extrabold text-[#c6ff3d]">
              {overview.activeSessions}
            </p>
          </div>
          <div className="rounded-xl border border-[#29342d] bg-[#101612] p-5">
            <p className="font-mono text-[10px] uppercase text-[#9ba69d]">Suspended Accounts</p>
            <p className="mt-2 font-display text-3xl font-extrabold text-[#f5f7f2]">
              {overview.suspendedAccounts}
            </p>
          </div>
          <div className="rounded-xl border border-[#29342d] bg-[#101612] p-5">
            <p className="font-mono text-[10px] uppercase text-[#9ba69d]">Banned Accounts</p>
            <p className="mt-2 font-display text-3xl font-extrabold text-red-400">
              {overview.bannedAccounts}
            </p>
          </div>
        </div>
      )}

      {dbHealth && (
        <div className="mb-6 rounded-xl border border-[#29342d] bg-[#101612] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#29342d] pb-4">
            <div>
              <p className="font-mono text-[10px] uppercase text-[#c6ff3d]">
                Phase 20 Database Operations
              </p>
              <h2 className="font-display text-lg font-bold uppercase text-[#f5f7f2]">
                Database Health, Migrations & Integrity
              </h2>
            </div>
            <span className="rounded border border-[#29342d] bg-[#151d18] px-3 py-1 font-mono text-xs uppercase text-[#f5f7f2]">
              {dbHealth.status}
            </span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
            <div className="rounded-lg border border-[#29342d] bg-[#151d18] p-3">
              <p className="text-[#9ba69d]">Provider & Mode</p>
              <p className="mt-1 font-semibold text-[#f5f7f2]">{dbHealth.mode}</p>
            </div>
            <div className="rounded-lg border border-[#29342d] bg-[#151d18] p-3">
              <p className="text-[#9ba69d]">Pooling Strategy</p>
              <p className="mt-1 font-semibold text-[#f5f7f2]">{dbHealth.pooling?.mode}</p>
            </div>
            <div className="rounded-lg border border-[#29342d] bg-[#151d18] p-3">
              <p className="text-[#9ba69d]">Verified Migrations</p>
              <p className="mt-1 font-semibold text-[#c6ff3d]">
                {dbHealth.migrationManifestCount} files
              </p>
            </div>
            <div className="rounded-lg border border-[#29342d] bg-[#151d18] p-3">
              <p className="text-[#9ba69d]">Integrity Anomalies</p>
              <p className="mt-1 font-semibold text-[#c6ff3d]">
                {dbHealth.diagnostics?.integrity?.anomalyCount ?? '--'}
              </p>
            </div>
          </div>

          <p className="mt-3 text-[11px] text-[#9ba69d]">
            Backup status: {dbHealth.diagnostics?.backupStatus}
          </p>
        </div>
      )}

      <form onSubmit={handleRevoke} className="rounded-xl border border-[#29342d] bg-[#101612] p-6">
        <h2 className="font-display text-lg font-bold uppercase text-[#f5f7f2]">
          Force Revoke User Sessions
        </h2>
        <p className="mt-1 text-xs text-[#9ba69d]">
          Requires `security.manage` (Super Admin permission).
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <input
            type="text"
            required
            placeholder="Target User ID"
            value={targetUserId}
            onChange={(e) => setTargetUserId(e.target.value)}
            className="rounded-lg border border-[#29342d] bg-[#080b09] px-3 py-2 text-xs text-[#f5f7f2] sm:w-80"
          />
          <button
            type="submit"
            className="rounded-lg bg-[#c6ff3d] px-4 py-2 text-xs font-bold uppercase text-[#080b09]"
          >
            Revoke Sessions
          </button>
        </div>
      </form>
    </AdminShell>
  );
}
