'use client';

import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { apiRequest } from '@/lib/api/apiClient';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

export default function AdminIntegrationsPage() {
  const [providers, setProviders] = useState([]);
  const [recentAiUsageCount, setRecentAiUsageCount] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiRequest(API_ENDPOINTS.ADMIN.INTEGRATIONS, { method: 'GET' });
        if (!cancelled) {
          setProviders(res?.data?.providers || []);
          setRecentAiUsageCount(res?.data?.recentAiUsageCount || 0);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Unable to load integrations.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleAction(action, providerId, enabled) {
    setError('');
    setMessage('');
    try {
      const res = await apiRequest(API_ENDPOINTS.ADMIN.INTEGRATIONS, {
        method: 'POST',
        body: { action, providerId, enabled },
      });
      setProviders(res?.data?.providers || []);
      if (res?.data?.probeResult?.message) {
        setMessage(res.data.probeResult.message);
      } else {
        setMessage(`Updated ${providerId} configuration.`);
      }
    } catch (err) {
      setError(err.message || 'Integration action failed.');
    }
  }

  return (
    <AdminShell
      title="External Integrations"
      description="Monitor third-party provider configuration, rate limits, and connection verification (secrets stay masked)."
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

      <div className="mb-5 rounded-xl border border-[#29342d] bg-[#101612] p-4 text-xs">
        <span className="text-[#9ba69d]">Logged AI Invocations (Current Runtime): </span>
        <strong className="font-mono text-[#c6ff3d]">{recentAiUsageCount}</strong>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {providers.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded-xl border border-[#29342d] bg-[#101612] p-5 text-xs"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] uppercase text-[#c6ff3d]">
                  {item.category}
                </span>
                <span className="rounded border border-[#29342d] bg-[#151d18] px-2 py-0.5 font-mono text-[10px] uppercase text-[#f5f7f2]">
                  {item.connectionStatus}
                </span>
              </div>
              <h2 className="mt-1.5 font-display text-lg font-bold uppercase text-[#f5f7f2]">
                {item.name}
              </h2>
              <p className="mt-1 text-[#9ba69d]">{item.rateLimitNote}</p>
              <p className="mt-2 font-mono text-[11px] text-[#6e7a71]">
                Env Keys: {item.requiredEnvKeys.join(', ')} ({item.configured ? 'Present' : 'Unset'}
                )
              </p>
              {item.lastError && (
                <p className="mt-2 text-[11px] text-red-300">Last error: {item.lastError}</p>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2 border-t border-[#29342d] pt-3">
              <button
                type="button"
                onClick={() => handleAction('probe', item.id)}
                className="rounded border border-[#c6ff3d]/40 bg-[#c6ff3d]/10 px-3 py-1.5 font-mono text-[11px] uppercase text-[#c6ff3d] hover:bg-[#c6ff3d]/20"
              >
                Verify Connection
              </button>
              <button
                type="button"
                onClick={() => handleAction('toggle', item.id, !item.enabled)}
                className="rounded border border-[#29342d] bg-[#151d18] px-3 py-1.5 font-mono text-[11px] uppercase text-[#f5f7f2]"
              >
                {item.enabled ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
