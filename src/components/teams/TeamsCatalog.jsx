'use client';

import { useMemo, useState } from 'react';
import TeamCard from '@/components/teams/TeamCard';
import { TEAMS } from '@/data/teams';
import { useTeamsQuery } from '@/lib/api/hooks';
import { cn } from '@/lib/utils';

const TEAM_TYPES = ['ALL', 'Club', 'National Team'];

export default function TeamsCatalog() {
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const { data } = useTeamsQuery(
    { type: typeFilter, search },
    { initialData: { teams: TEAMS, total: TEAMS.length } }
  );

  const filtered = useMemo(() => {
    const sourceList = data?.teams || TEAMS;
    const q = search.trim().toLowerCase();
    return sourceList.filter((team) => {
      if (team.status && team.status !== 'published') return false;
      const matchType = typeFilter === 'ALL' || team.type === typeFilter;
      const matchSearch =
        !q ||
        team.name.toLowerCase().includes(q) ||
        team.city.toLowerCase().includes(q) ||
        team.country.toLowerCase().includes(q);
      return matchType && matchSearch;
    });
  }, [data, typeFilter, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-xl border border-[#29342d] bg-[#151d18] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {TEAM_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setTypeFilter(type)}
              className={cn(
                'rounded-md px-3.5 py-1.5 font-mono text-xs uppercase transition-colors',
                typeFilter === type
                  ? 'bg-[#c6ff3d] font-bold text-[#080b09]'
                  : 'bg-[#080b09] text-[#9ba69d] hover:text-[#f5f7f2]'
              )}
            >
              {type === 'ALL' ? `All (${data?.total ?? TEAMS.length})` : type}
            </button>
          ))}
        </div>

        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search clubs or nations..."
          aria-label="Search clubs or national teams"
          className="w-full rounded-md border border-[#29342d] bg-[#080b09] px-3.5 py-2 text-sm text-[#f5f7f2] sm:w-64"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {filtered.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </div>
  );
}
