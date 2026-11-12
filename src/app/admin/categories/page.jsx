'use client';

import { useCallback, useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { apiRequest } from '@/lib/api/apiClient';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [contentType, setContentType] = useState('news');
  const [error, setError] = useState('');

  const loadCategories = useCallback(async () => {
    try {
      const res = await apiRequest('/api/admin/categories', { method: 'GET' });
      setCategories(res?.data?.categories || []);
    } catch (err) {
      setError(err.message || 'Unable to load categories.');
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiRequest('/api/admin/categories', { method: 'GET' });
        if (!cancelled) setCategories(res?.data?.categories || []);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Unable to load categories.');
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
      await apiRequest('/api/admin/categories', {
        method: 'POST',
        body: { name, contentType, enabled: true },
      });
      setName('');
      await loadCategories();
    } catch (err) {
      setError(err.message || 'Failed to add category.');
    }
  }

  return (
    <AdminShell
      title="Content Categories"
      description="Taxonomy registry across news, events, and media."
    >
      {error && (
        <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-200">
          {error}
        </div>
      )}

      <form
        onSubmit={handleCreate}
        className="mb-6 flex flex-wrap gap-3 rounded-xl border border-[#29342d] bg-[#101612] p-5"
      >
        <input
          type="text"
          required
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 rounded-lg border border-[#29342d] bg-[#080b09] px-3 py-2 text-xs text-[#f5f7f2]"
        />
        <select
          value={contentType}
          onChange={(e) => setContentType(e.target.value)}
          className="rounded-lg border border-[#29342d] bg-[#080b09] px-3 py-2 text-xs text-[#f5f7f2]"
        >
          <option value="news">News</option>
          <option value="events">Events</option>
          <option value="media">Media</option>
        </select>
        <button
          type="submit"
          className="rounded-lg bg-[#c6ff3d] px-4 py-2 text-xs font-bold uppercase text-[#080b09]"
        >
          Add Category
        </button>
      </form>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {categories.map((cat) => (
          <div
            key={cat.id || cat.slug}
            className="rounded-xl border border-[#29342d] bg-[#101612] p-4 text-xs"
          >
            <p className="font-mono text-[10px] uppercase text-[#c6ff3d]">{cat.contentType}</p>
            <p className="mt-1 font-display text-base font-bold uppercase text-[#f5f7f2]">
              {cat.name}
            </p>
            <p className="mt-1 font-mono text-[11px] text-[#9ba69d]">/{cat.slug}</p>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
