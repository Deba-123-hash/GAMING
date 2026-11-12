'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Search, X } from 'lucide-react';
import { MAIN_NAV_LINKS } from '@/config/navigation';
import { PLAYERS } from '@/data/players';
import { TEAMS } from '@/data/teams';
import { GAME_MODES } from '@/data/gameModes';
import { EVENTS } from '@/data/events';
import { NEWS_ARTICLES } from '@/data/news';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';

export default function SearchDialog({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const indexItems = useMemo(() => {
    const pages = MAIN_NAV_LINKS.map((p) => ({
      id: `page-${p.href}`,
      title: p.label,
      category: 'Page',
      href: p.href,
    }));
    const modes = GAME_MODES.map((m) => ({
      id: `mode-${m.id}`,
      title: m.title,
      category: 'Game Mode',
      href: '/game-modes',
    }));
    const players = PLAYERS.map((p) => ({
      id: `player-${p.id}`,
      title: `${p.name} (${p.position})`,
      category: 'Player',
      href: `/players/${p.id}`,
    }));
    const teams = TEAMS.map((t) => ({
      id: `team-${t.id}`,
      title: t.name,
      category: 'Team',
      href: `/teams/${t.id}`,
    }));
    const events = EVENTS.map((e) => ({
      id: `event-${e.id}`,
      title: e.title,
      category: 'Event',
      href: '/events',
    }));
    const news = NEWS_ARTICLES.map((n) => ({
      id: `news-${n.slug}`,
      title: n.title,
      category: 'News',
      href: `/news/${n.slug}`,
    }));
    return [...pages, ...modes, ...players, ...teams, ...events, ...news];
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return indexItems.slice(0, 8);
    return indexItems
      .filter(
        (item) => item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
      )
      .slice(0, 10);
  }, [indexItems, query]);

  const handleClose = () => {
    setQuery('');
    onClose();
  };

  const navigateTo = (href) => {
    handleClose();
    router.push(href);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Search RIVALRY 90">
      <div className="space-y-4">
        <p className="text-xs text-[#9ba69d]">
          Searches local pages, game modes, fictional athletes, clubs, events, and news dispatches.
        </p>

        <div className="relative flex items-center">
          <Search
            className="pointer-events-none absolute left-3.5 h-4 w-4 text-[#6e7a71]"
            aria-hidden="true"
          />
          <input
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && results[0]) {
                e.preventDefault();
                navigateTo(results[0].href);
              }
            }}
            placeholder="Search players, clubs, modes, pages..."
            aria-label="Search local website content"
            className="w-full rounded-lg border border-[#29342d] bg-[#080b09] py-2.5 pr-10 pl-10 text-sm text-[#f5f7f2] placeholder:text-[#6e7a71] focus:border-[#c6ff3d] focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search query"
              className="absolute right-3 text-[#9ba69d] hover:text-[#f5f7f2]"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        {results.length === 0 ? (
          <div className="rounded-xl border border-[#29342d] bg-[#151d18] p-6 text-center text-sm text-[#9ba69d]">
            No local results found for &ldquo;{query}&rdquo;.
          </div>
        ) : (
          <ul className="divide-y divide-[#29342d] overflow-hidden rounded-xl border border-[#29342d] bg-[#080b09]">
            {results.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => navigateTo(item.href)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-[#151d18]"
                >
                  <div className="flex items-center gap-3">
                    <Badge tone="neutral">{item.category}</Badge>
                    <span className="text-sm font-medium text-[#f5f7f2]">{item.title}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-[#c6ff3d]" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
}
