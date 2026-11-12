'use client';

import { useCallback, useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { apiRequest } from '@/lib/api/apiClient';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [actionFilter, setActionFilter] = useState('');
  const [error, setError] = useState('');

  const loadLogs = useCallback(
    async (action = actionFilter) => {
      try {
        const q = action ? `?action=${encodeURIComponent(action)}` : '';
        const res = await apiRequest(`/api/admin/audit-logs${q}`, { method: 'GET' });
        setLogs(res?.data?.items || []);
      } catch (err) {
        setError(err.message || 'Unable to load audit logs.');
      }
    },
    [actionFilter]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiRequest('/api/admin/audit-logs', { method: 'GET' });
        if (!cancelled) setLogs(res?.data?.items || []);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Unable to load audit logs.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AdminShell
      title="Immutable Audit Logs"
      description="Append-only security and governance events (cannot be edited or deleted)."
    >
      {error && (
        <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-200">
          {error}
        </div>
      )}

      <div className="mb-4 flex gap-3 rounded-xl border border-[#29342d] bg-[#101612] p-4">
        <input
          type="search"
          value={actionFilter}
          onChange={(e) => {
            setActionFilter(e.target.value);
            loadLogs(e.target.value);
          }}
          placeholder="Filter by action prefix (e.g. auth., admin., player.)"
          className="w-full max-w-md rounded-lg border border-[#29342d] bg-[#080b09] px-3 py-2 text-xs text-[#f5f7f2]"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#29342d] bg-[#101612] p-4">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#29342d] text-[#9ba69d]">
              <th className="py-2 pr-3">Timestamp</th>
              <th className="py-2 pr-3">Action</th>
              <th className="py-2 pr-3">Actor Role</th>
              <th className="py-2 pr-3">Target</th>
              <th className="py-2">Outcome</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-[#29342d]/40">
                <td className="py-2 pr-3 font-mono text-[11px] text-[#9ba69d]">{log.timestamp}</td>
                <td className="py-2 pr-3 font-mono text-[#c6ff3d]">{log.action}</td>
                <td className="py-2 pr-3 text-[#f5f7f2]">{log.actorRole}</td>
                <td className="py-2 pr-3 text-[#9ba69d]">
                  {log.targetType} {log.targetId || ''}
                </td>
                <td className="py-2 text-[#f5f7f2]">{log.outcome}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
