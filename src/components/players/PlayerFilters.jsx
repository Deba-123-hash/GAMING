'use client';

import { useMemo, useState } from 'react';
import { PLAYERS } from '@/data/players';
import { TEAMS } from '@/data/teams';
import { usePlayersQuery } from '@/lib/api/hooks';
import { usePlayerStore } from '@/store/playerStore';
import PlayerCard from '@/components/players/PlayerCard';
import EmptyState from '@/components/ui/EmptyState';
import { cn } from '@/lib/utils';

const POSITION_GROUPS = [
  { id: 'ALL', label: 'All' },
  { id: 'GK', label: 'Goalkeepers' },
  { id: 'DEF', label: 'Defenders' },
  { id: 'MID', label: 'Midfielders' },
  { id: 'FWD', label: 'Forwards' },
];

const PAGE_SIZE = 12;

export default function PlayerFilters() {
  const positionFilter = usePlayerStore((state) => state.positionFilter);
  const searchQuery = usePlayerStore((state) => state.searchQuery);
  const setPositionFilter = usePlayerStore((state) => state.setPositionFilter);
  const setSearchQuery = usePlayerStore((state) => state.setSearchQuery);
  const [teamFilter, setTeamFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('ovr-desc');
  const [page, setPage] = useState(1);

  const { data: apiPlayersData } = usePlayersQuery(
    {
      position: positionFilter,
      teamId: teamFilter,
      search: searchQuery,
      sort: sortBy,
      page,
      pageSize: PAGE_SIZE,
    },
    { initialData: null }
  );

  const filteredPlayers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = PLAYERS.filter((player) => {
      if (player.status && player.status !== 'published') return false;
      const matchPos =
        positionFilter === 'ALL' ||
        player.positionGroup === positionFilter ||
        player.position === positionFilter;
      const matchTeam = teamFilter === 'ALL' || player.teamId === teamFilter;
      const matchSearch =
        !q ||
        player.name.toLowerCase().includes(q) ||
        player.role.toLowerCase().includes(q) ||
        player.position.toLowerCase().includes(q) ||
        player.nationality.toLowerCase().includes(q);
      return matchPos && matchTeam && matchSearch;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'ovr-asc') return a.ovr - b.ovr;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      return b.ovr - a.ovr;
    });
  }, [positionFilter, teamFilter, searchQuery, sortBy]);

  const totalCount = apiPlayersData?.total ?? filteredPlayers.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedPlayers =
    apiPlayersData?.players ||
    filteredPlayers.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const clearFilters = () => {
    setPositionFilter('ALL');
    setTeamFilter('ALL');
    setSearchQuery('');
    setSortBy('ovr-desc');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border border-[#29342d] bg-[#151d18] p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {POSITION_GROUPS.map((group) => (
            <button
              key={group.id}
              type="button"
              onClick={() => {
                setPositionFilter(group.id);
                setPage(1);
              }}
              className={cn(
                'rounded-md px-3 py-1.5 font-mono text-xs uppercase transition-colors',
                positionFilter === group.id
                  ? 'bg-[#c6ff3d] font-bold text-[#080b09]'
                  : 'bg-[#080b09] text-[#9ba69d] hover:text-[#f5f7f2]'
              )}
            >
              {group.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <select
            aria-label="Filter by team"
            value={teamFilter}
            onChange={(e) => {
              setTeamFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-md border border-[#29342d] bg-[#080b09] px-3 py-2 text-xs text-[#f5f7f2]"
          >
            <option value="ALL">All Clubs & Nations ({TEAMS.length})</option>
            {TEAMS.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>

          <select
            aria-label="Sort players"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-md border border-[#29342d] bg-[#080b09] px-3 py-2 text-xs text-[#f5f7f2]"
          >
            <option value="ovr-desc">Rating: High to Low</option>
            <option value="ovr-asc">Rating: Low to High</option>
            <option value="name-asc">Name: A–Z</option>
            <option value="name-desc">Name: Z–A</option>
          </select>

          <input
            type="search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search fictional athletes..."
            aria-label="Search fictional athletes"
            className="w-full rounded-md border border-[#29342d] bg-[#080b09] px-3.5 py-2 text-sm text-[#f5f7f2] placeholder:text-[#6e7a71] sm:w-52"
          />

          {positionFilter !== 'ALL' ||
          teamFilter !== 'ALL' ||
          searchQuery ||
          sortBy !== 'ovr-desc' ? (
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-md border border-[#29342d] bg-[#080b09] px-3 py-2 font-mono text-xs uppercase text-[#c6ff3d] hover:border-[#c6ff3d]"
            >
              Clear
            </button>
          ) : null}
        </div>
      </div>

      {pagedPlayers.length === 0 ? (
        <EmptyState
          title="No Athletes Found"
          description="Try clearing your search or switching position/team filters."
          actionLabel="Reset Filters"
          onAction={clearFilters}
        />
      ) : (
        <>
          <p className="font-mono text-xs text-[#9ba69d]">
            Showing {pagedPlayers.length} of {totalCount} fictional athletes
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pagedPlayers.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-md border border-[#29342d] bg-[#151d18] px-3 py-1.5 font-mono text-xs uppercase text-[#f5f7f2] disabled:opacity-40"
              >
                Prev
              </button>
              <span className="font-mono text-xs text-[#9ba69d]">
                Page {safePage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-md border border-[#29342d] bg-[#151d18] px-3 py-1.5 font-mono text-xs uppercase text-[#f5f7f2] disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
