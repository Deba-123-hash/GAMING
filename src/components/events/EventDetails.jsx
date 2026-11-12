'use client';

import { useMemo, useState } from 'react';
import EventCard from '@/components/events/EventCard';
import { computeEventStatus } from '@/data/events';
import { cn } from '@/lib/utils';

const STATUS_TABS = ['ALL', 'Upcoming', 'Live', 'Completed'];

export default function EventDetails({ events = [] }) {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const visibleEvents = useMemo(() => {
    const q = search.trim().toLowerCase();
    return events.filter((ev) => {
      if (ev.publicationStatus && ev.publicationStatus !== 'published') return false;
      const computed = ev.status || computeEventStatus(ev);
      const matchStatus = statusFilter === 'ALL' || computed === statusFilter;
      const matchSearch =
        !q ||
        ev.title.toLowerCase().includes(q) ||
        ev.category.toLowerCase().includes(q) ||
        ev.description.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [events, statusFilter, search]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-xl border border-[#29342d] bg-[#101612] p-3.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={cn(
                'rounded-md px-3 py-1.5 font-mono text-xs uppercase transition-colors',
                statusFilter === tab
                  ? 'bg-[#c6ff3d] font-bold text-[#080b09]'
                  : 'bg-[#151d18] text-[#9ba69d] hover:text-[#f5f7f2]'
              )}
            >
              {tab}
            </button>
          ))}
        </div>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tournaments..."
          aria-label="Search tournaments"
          className="rounded-md border border-[#29342d] bg-[#080b09] px-3 py-1.5 text-xs text-[#f5f7f2] sm:w-56"
        />
      </div>

      {visibleEvents.length === 0 ? (
        <div className="rounded-xl border border-[#29342d] bg-[#151d18] p-8 text-center text-sm text-[#9ba69d]">
          No events match this status filter.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visibleEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
