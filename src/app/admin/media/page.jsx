'use client';

import { useCallback, useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import { apiRequest } from '@/lib/api/apiClient';

export default function AdminMediaPage() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Stadium Images');
  const [mediaType, setMediaType] = useState('image');
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');

  const loadMedia = useCallback(async () => {
    try {
      const res = await apiRequest('/api/media?includeDrafts=true', { method: 'GET' });
      setItems(res?.data?.media || []);
    } catch (err) {
      setError(err.message || 'Unable to load media archive.');
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiRequest('/api/media?includeDrafts=true', { method: 'GET' });
        if (!cancelled) setItems(res?.data?.media || []);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Unable to load media archive.');
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
      await apiRequest('/api/media', {
        method: 'POST',
        body: {
          title,
          category,
          mediaType,
          summary: summary || `${title} — curated media concept in RIVALRY 90.`,
          publicationStatus: 'published',
        },
      });
      setTitle('');
      setSummary('');
      await loadMedia();
    } catch (err) {
      setError(err.message || 'Failed to add media item.');
    }
  }

  async function handleDelete(id) {
    try {
      await apiRequest(`/api/media/${id}`, { method: 'DELETE' });
      await loadMedia();
    } catch (err) {
      setError(err.message || 'Delete failed.');
    }
  }

  return (
    <AdminShell
      title="Media Asset Registry"
      description="Curate showcase renders, concept stills, and video slots."
    >
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
          placeholder="Media Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-lg border border-[#29342d] bg-[#080b09] px-3 py-2 text-xs text-[#f5f7f2] sm:col-span-2"
        />
        <select
          value={mediaType}
          onChange={(e) => setMediaType(e.target.value)}
          className="rounded-lg border border-[#29342d] bg-[#080b09] px-3 py-2 text-xs text-[#f5f7f2]"
        >
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>
        <button
          type="submit"
          className="rounded-lg bg-[#c6ff3d] px-3 py-2 text-xs font-bold uppercase text-[#080b09]"
        >
          Add Media
        </button>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-[#29342d] bg-[#080b09] px-3 py-2 text-xs text-[#f5f7f2]"
        />
        <input
          type="text"
          required
          placeholder="Summary (min 6 chars)"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="rounded-lg border border-[#29342d] bg-[#080b09] px-3 py-2 text-xs text-[#f5f7f2] sm:col-span-3"
        />
      </form>

      <div className="grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start justify-between gap-3 rounded-xl border border-[#29342d] bg-[#101612] p-4 text-xs"
          >
            <div>
              <p className="font-mono text-[10px] uppercase text-[#c6ff3d]">
                {item.mediaType} • {item.category} • {item.publicationStatus}
              </p>
              <h2 className="mt-1 font-display text-base font-bold uppercase text-[#f5f7f2]">
                {item.title}
              </h2>
              <p className="mt-1 text-[#9ba69d]">{item.summary}</p>
            </div>
            <button
              type="button"
              onClick={() => handleDelete(item.id)}
              aria-label={`Delete ${item.title}`}
              className="rounded p-1.5 text-red-400 hover:bg-red-500/10"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
