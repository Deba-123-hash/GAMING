'use client';

import { useMemo, useState } from 'react';
import NewsCard from '@/components/news/NewsCard';
import { cn } from '@/lib/utils';

export default function NewsGrid({ articles = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [search, setSearch] = useState('');

  const categories = useMemo(() => {
    const set = new Set(articles.map((a) => a.category).filter(Boolean));
    return ['ALL', ...Array.from(set)];
  }, [articles]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return articles.filter((article) => {
      if (article.publicationStatus && article.publicationStatus !== 'published') return false;
      const matchCat = selectedCategory === 'ALL' || article.category === selectedCategory;
      const matchSearch =
        !q || article.title.toLowerCase().includes(q) || article.excerpt.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [articles, selectedCategory, search]);

  if (articles.length === 0) return null;
  const [featured, ...rest] = filtered;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-xl border border-[#29342d] bg-[#101612] p-3.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'rounded-md px-3 py-1.5 font-mono text-xs uppercase transition-colors',
                selectedCategory === cat
                  ? 'bg-[#c6ff3d] font-bold text-[#080b09]'
                  : 'bg-[#151d18] text-[#9ba69d] hover:text-[#f5f7f2]'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search dispatches..."
          aria-label="Search news dispatches"
          className="rounded-md border border-[#29342d] bg-[#080b09] px-3 py-1.5 text-xs text-[#f5f7f2] sm:w-56"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-[#29342d] bg-[#151d18] p-8 text-center text-sm text-[#9ba69d]">
          No articles match your filter.
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <NewsCard article={featured} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:col-span-6 lg:grid-cols-1">
            {rest.map((article) => (
              <NewsCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
