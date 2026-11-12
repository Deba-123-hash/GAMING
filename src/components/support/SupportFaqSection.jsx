'use client';

import { useMemo, useState } from 'react';
import { FAQ_ITEMS } from '@/data/faqData';
import Accordion from '@/components/ui/Accordion';
import Input from '@/components/ui/Input';

export default function SupportFaqSection() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FAQ_ITEMS;
    return FAQ_ITEMS.filter(
      (item) =>
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="space-y-4">
      <Input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search FAQ topics (WebGL, audio, squad, scope)..."
        aria-label="Search frequently asked questions"
      />
      {filtered.length > 0 ? (
        <Accordion items={filtered} />
      ) : (
        <p className="rounded-xl border border-[#29342d] bg-[#151d18] p-5 text-sm text-[#9ba69d]">
          No FAQ entries match &ldquo;{query}&rdquo;.
        </p>
      )}
    </div>
  );
}
