'use client';

import { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';
import { apiRequest } from '@/lib/api/apiClient';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import Container from '@/components/ui/Container';

export default function ExternalFootballFeed() {
  const [feed, setFeed] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiRequest(API_ENDPOINTS.EXTERNAL.FOOTBALL_COMPETITIONS, {
          method: 'GET',
        });
        if (!cancelled) setFeed(res?.data || null);
      } catch {
        if (!cancelled) setFeed(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="py-12">
      <Container>
        <div className="rounded-2xl border border-[#29342d] bg-[#101612] p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#29342d] pb-4">
            <div className="flex items-center gap-2 text-[#c6ff3d]">
              <Globe className="h-4 w-4" aria-hidden="true" />
              <h2 className="font-display text-lg font-bold uppercase text-[#f5f7f2]">
                Real-World Football Feed (Optional External API)
              </h2>
            </div>
            <span className="rounded border border-[#29342d] bg-[#151d18] px-2.5 py-1 font-mono text-[10px] uppercase text-[#9ba69d]">
              {feed?.live ? 'Live football-data.org' : 'Separate from Fictional Universe'}
            </span>
          </div>

          {!feed ? (
            <p className="mt-4 text-xs text-[#9ba69d]">Checking external football feed status...</p>
          ) : !feed.live || !feed.items?.length ? (
            <p className="mt-4 text-xs text-[#9ba69d]">
              {feed.message ||
                'No live competitions retrieved. Fictional RIVALRY 90 tournaments above remain isolated and unaffected.'}
            </p>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {feed.items.slice(0, 8).map((comp) => (
                <div
                  key={comp.externalId}
                  className="rounded-lg border border-[#29342d] bg-[#151d18] p-3 text-xs"
                >
                  <p className="font-mono text-[10px] uppercase text-[#c6ff3d]">
                    {comp.areaName} ({comp.code})
                  </p>
                  <p className="mt-1 font-semibold text-[#f5f7f2]">{comp.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

