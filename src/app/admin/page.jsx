'use client';

import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { apiRequest } from '@/lib/api/apiClient';

export default function AdminOverviewPage() {
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiRequest('/api/admin/dashboard', { method: 'GET' });
        if (!cancelled) setMetrics(res?.data?.metrics || null);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Unable to load dashboard telemetry.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AdminShell
      title="Admin Console"
      description="Platform operational telemetry, draft queue counts, and recent audit activity."
    >
      {error && (
        <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-xs text-red-200">
          {error}
        </div>
      )}

      {!metrics ? (
        <div className="rounded-xl border border-[#29342d] bg-[#101612] p-8 text-sm text-[#9ba69d]">
          Loading dashboard metrics...
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Registered Users', value: metrics.totalUsers },
              { label: 'Active Accounts', value: metrics.activeUsers },
              { label: 'Master Players', value: metrics.totalPlayers },
              { label: 'Master Teams', value: metrics.totalTeams },
              { label: 'Saved Squads', value: metrics.totalSquads },
              { label: 'Published Events', value: metrics.publishedEvents },
              { label: 'Published News', value: metrics.publishedNews },
              { label: 'Pending Drafts', value: metrics.draftContentCount },
            ].map((card) => (
              <div key={card.label} className="rounded-xl border border-[#29342d] bg-[#101612] p-5">
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#9ba69d]">
                  {card.label}
                </p>
                <p className="mt-2 font-display text-3xl font-extrabold text-[#c6ff3d]">
                  {card.value}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-[#29342d] bg-[#101612] p-6">
            <h2 className="font-display text-lg font-bold uppercase text-[#f5f7f2]">
              Recent Audit Events
            </h2>
            {metrics.recentAuditLogs?.length ? (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#29342d] text-[#9ba69d]">
                      <th className="py-2 pr-4">Action</th>
                      <th className="py-2 pr-4">Role</th>
                      <th className="py-2 pr-4">Target</th>
                      <th className="py-2">Outcome</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.recentAuditLogs.map((log) => (
                      <tr key={log.id} className="border-b border-[#29342d]/50">
                        <td className="py-2 pr-4 font-mono text-[#c6ff3d]">{log.action}</td>
                        <td className="py-2 pr-4 text-[#f5f7f2]">{log.actorRole}</td>
                        <td className="py-2 pr-4 text-[#9ba69d]">
                          {log.targetType} {log.targetId || ''}
                        </td>
                        <td className="py-2 text-[#f5f7f2]">{log.outcome}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-3 text-xs text-[#9ba69d]">No audit events recorded yet.</p>
            )}
          </div>
        </div>
      )}
    </AdminShell>
  );
}
