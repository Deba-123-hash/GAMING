import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import PlayerCard from '@/components/players/PlayerCard';

export default function TeamProfile({ team, players, stadium }) {
  return (
    <div className="space-y-10">
      <Link
        href="/teams"
        className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#a3aeb8] hover:text-[#b8ff2c]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to Clubs
      </Link>

      <div className="rounded-2xl border border-white/10 bg-[#12171d] p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-4">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-xl font-display text-2xl font-extrabold text-[#0b0e11]"
            style={{ backgroundColor: team.primaryColor }}
          >
            {team.shortCode}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="lime">{team.city}</Badge>
              <Badge tone="orange">Rating {team.rating}</Badge>
            </div>
            <h1 className="mt-1 font-display text-4xl font-extrabold uppercase text-[#f5f4ee]">
              {team.name}
            </h1>
            <p className="text-sm text-[#a3aeb8]">
              {team.style} {stadium ? `· Home: ${stadium.name}` : ''}
            </p>
          </div>
        </div>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[#a3aeb8]">{team.description}</p>
      </div>

      <div className="space-y-4">
        <h2 className="font-display text-2xl font-bold uppercase text-[#f5f4ee]">Club Roster</h2>
        {players.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {players.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#a3aeb8]">
            Additional fictional club signings arriving in Phase 8.
          </p>
        )}
      </div>
    </div>
  );
}
