'use client';

import { useCallback, useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import { apiRequest } from '@/lib/api/apiClient';

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Tournament Announcements');
  const [publicationStatus, setPublicationStatus] = useState('draft');
  const [error, setError] = useState('');

  const loadEvents = useCallback(async () => {
    try {
      const res = await apiRequest('/api/events?includeDrafts=true', { method: 'GET' });
      setEvents(res?.data?.events || []);
    } catch (err) {
      setError(err.message || 'Unable to load events.');
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiRequest('/api/events?includeDrafts=true', { method: 'GET' });
        if (!cancelled) setEvents(res?.data?.events || []);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Unable to load events.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    try {
      const start = new Date(Date.now() + 86400_000 * 7).toISOString();
      const end = new Date(Date.now() + 86400_000 * 10).toISOString();
      await apiRequest('/api/events', {
        method: 'POST',
        body: {
          title,
          category,
          format: 'Knockout Bracket',
          startAt: start,
          endAt: end,
          location: 'Apex Arena Online',
          description: `${title} seasonal football competition managed in RIVALRY 90 CMS.`,
          publicationStatus,
        },
      });
      setTitle('');
      await loadEvents();
    } catch (err) {
      setError(err.message || 'Failed to create event.');
    }
  }

  async function togglePublish(ev) {
    setError('');
    try {
      await apiRequest(`/api/events/${ev.slug}`, {
        method: 'PATCH',
        body: {
          publicationStatus: ev.publicationStatus === 'published' ? 'draft' : 'published',
        },
      });
      await loadEvents();
    } catch (err) {
      setError(err.message || 'Publish update failed.');
    }
  }

  async function handleDelete(slug) {
    try {
      await apiRequest(`/api/events/${slug}`, { method: 'DELETE' });
      await loadEvents();
    } catch (err) {
      setError(err.message || 'Delete failed.');
    }
  }

  return (
    <AdminShell title="Events CMS" description="Create, schedule, publish, or archive tournaments.">
      {error && (
        <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-200">
          {error}
        </div>
      )}

      <form
        onSubmit={handleCreate}
        className="mb-6 grid gap-3 rounded-xl border border-[#29342d] bg-[#101612] p-5 sm:grid-cols-4"
      >
        <input
          type="text"
          required
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-lg border border-[#29342d] bg-[#080b09] px-3 py-2 text-xs text-[#f5f7f2] sm:col-span-2"
        />
        <select
          value={publicationStatus}
          onChange={(e) => setPublicationStatus(e.target.value)}
          className="rounded-lg border border-[#29342d] bg-[#080b09] px-3 py-2 text-xs text-[#f5f7f2]"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <button
          type="submit"
          className="rounded-lg bg-[#c6ff3d] px-3 py-2 text-xs font-bold uppercase text-[#080b09]"
        >
          Create Event
        </button>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-[#29342d] bg-[#080b09] px-3 py-2 text-xs text-[#f5f7f2] sm:col-span-2"
        />
      </form>

      <div className="space-y-3">
        {events.map((ev) => (
          <div
            key={ev.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#29342d] bg-[#101612] p-4 text-xs"
          >
            <div>
              <p className="font-mono text-[10px] uppercase text-[#c6ff3d]">
                {ev.publicationStatus} • {ev.status}
              </p>
              <h2 className="font-display text-lg font-bold uppercase text-[#f5f7f2]">
                {ev.title}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => togglePublish(ev)}
                className="rounded border border-[#29342d] bg-[#151d18] px-3 py-1.5 text-[#c6ff3d]"
              >
                {ev.publicationStatus === 'published' ? 'Move to Draft' : 'Publish'}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(ev.slug)}
                aria-label={`Delete ${ev.title}`}
                className="rounded p-1.5 text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
