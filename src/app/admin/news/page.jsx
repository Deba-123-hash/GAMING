'use client';

import { useCallback, useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import { apiRequest } from '@/lib/api/apiClient';

export default function AdminNewsPage() {
  const [articles, setArticles] = useState([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Studio Dispatches');
  const [excerpt, setExcerpt] = useState('');
  const [publicationStatus, setPublicationStatus] = useState('draft');
  const [error, setError] = useState('');

  const loadNews = useCallback(async () => {
    try {
      const res = await apiRequest('/api/news?includeDrafts=true', { method: 'GET' });
      setArticles(res?.data?.news || []);
    } catch (err) {
      setError(err.message || 'Unable to load news articles.');
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiRequest('/api/news?includeDrafts=true', { method: 'GET' });
        if (!cancelled) setArticles(res?.data?.news || []);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Unable to load news articles.');
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
      await apiRequest('/api/news', {
        method: 'POST',
        body: {
          title,
          category,
          excerpt: excerpt || `${title} — official studio dispatch from RIVALRY 90.`,
          body: [excerpt || `${title} — official studio dispatch from RIVALRY 90.`],
          publicationStatus,
        },
      });
      setTitle('');
      setExcerpt('');
      await loadNews();
    } catch (err) {
      setError(err.message || 'Unable to create news article.');
    }
  }

  async function togglePublish(article) {
    try {
      await apiRequest(`/api/news/${article.slug}`, {
        method: 'PATCH',
        body: {
          publicationStatus: article.publicationStatus === 'published' ? 'draft' : 'published',
        },
      });
      await loadNews();
    } catch (err) {
      setError(err.message || 'Failed to update status.');
    }
  }

  async function handleDelete(slug) {
    try {
      await apiRequest(`/api/news/${slug}`, { method: 'DELETE' });
      await loadNews();
    } catch (err) {
      setError(err.message || 'Delete failed.');
    }
  }

  return (
    <AdminShell
      title="News & Editorial CMS"
      description="Author drafts and publish RIVALRY 90 news dispatches."
    >
      {error && (
        <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-200">
          {error}
        </div>
      )}

      <form
        onSubmit={handleCreate}
        className="mb-6 space-y-3 rounded-xl border border-[#29342d] bg-[#101612] p-5"
      >
        <div className="grid gap-3 sm:grid-cols-4">
          <input
            type="text"
            required
            placeholder="Headline"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-lg border border-[#29342d] bg-[#080b09] px-3 py-2 text-xs text-[#f5f7f2] sm:col-span-2"
          />
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-[#29342d] bg-[#080b09] px-3 py-2 text-xs text-[#f5f7f2]"
          />
          <select
            value={publicationStatus}
            onChange={(e) => setPublicationStatus(e.target.value)}
            className="rounded-lg border border-[#29342d] bg-[#080b09] px-3 py-2 text-xs text-[#f5f7f2]"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            required
            placeholder="Excerpt summary (min 10 chars)"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="flex-1 rounded-lg border border-[#29342d] bg-[#080b09] px-3 py-2 text-xs text-[#f5f7f2]"
          />
          <button
            type="submit"
            className="rounded-lg bg-[#c6ff3d] px-4 py-2 text-xs font-bold uppercase text-[#080b09]"
          >
            Save Article
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {articles.map((article) => (
          <div
            key={article.slug}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#29342d] bg-[#101612] p-4 text-xs"
          >
            <div>
              <p className="font-mono text-[10px] uppercase text-[#c6ff3d]">
                {article.publicationStatus} • {article.category}
              </p>
              <h2 className="font-display text-lg font-bold uppercase text-[#f5f7f2]">
                {article.title}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => togglePublish(article)}
                className="rounded border border-[#29342d] bg-[#151d18] px-3 py-1.5 text-[#c6ff3d]"
              >
                {article.publicationStatus === 'published' ? 'Unpublish' : 'Publish'}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(article.slug)}
                aria-label={`Delete ${article.title}`}
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
