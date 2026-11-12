'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PLAYERS } from '@/data/players';
import { usePlayersQuery } from '@/lib/api/hooks';
import { usePlayerStore } from '@/store/playerStore';
import usePlayerAnimation from '@/hooks/usePlayerAnimation';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import LoadingScreen from '@/components/ui/LoadingScreen';
import PlayerAnimationSelector from '@/components/players/PlayerAnimationSelector';
import PlayerStats from '@/components/players/PlayerStats';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

const PlayerViewer = dynamic(() => import('@/components/3d/PlayerViewer'), {
  ssr: false,
  loading: () => <LoadingScreen label="Loading 3D Athlete Stage..." className="h-[380px]" />,
});

export default function PlayerShowcase() {
  const selectedPlayerId = usePlayerStore((state) => state.selectedPlayerId);
  const setSelectedPlayerId = usePlayerStore((state) => state.setSelectedPlayerId);
  const { activeAnimation } = usePlayerAnimation();
  const { data } = usePlayersQuery(
    { page: 1, pageSize: 4, sort: 'ovr-desc' },
    { initialData: { players: PLAYERS.slice(0, 4) } }
  );
  const featuredPlayers = data?.players?.length ? data.players : PLAYERS.slice(0, 4);
  const activePlayer = featuredPlayers.find((p) => p.id === selectedPlayerId) || featuredPlayers[0];

  return (
    <section className="border-b border-[#29342d] py-16 md:py-24">
      <Container className="space-y-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Demonstration Roster · Fictional Athletes"
            title="MORE THAN PLAYERS. LEGACIES."
            description="Inspect fictional RIVALRY 90 athletes, sample attributes, and procedural AnimationMixer states."
          />
          <Button asChild variant="secondary">
            <Link href="/players">
              DISCOVER PLAYERS <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {featuredPlayers.map((player) => (
            <button
              key={player.id}
              type="button"
              onClick={() => setSelectedPlayerId(player.id)}
              className={cn(
                'rounded-md border px-3.5 py-2 font-mono text-xs uppercase transition-colors',
                activePlayer.id === player.id
                  ? 'border-[#c6ff3d] bg-[#c6ff3d] font-bold text-[#080b09]'
                  : 'border-[#29342d] bg-[#151d18] text-[#9ba69d] hover:text-[#f5f7f2]'
              )}
            >
              #{player.number} {player.name}
            </button>
          ))}
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <PlayerViewer
              playerName={activePlayer.name}
              kitColor={activePlayer.accentColor}
              activeAnimation={activeAnimation}
            />
          </div>

          <div className="space-y-6 lg:col-span-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="lime">{activePlayer.position}</Badge>
                <Badge tone="orange">OVR {activePlayer.ovr}</Badge>
                <Badge tone="neutral">Sample Athlete Data</Badge>
              </div>
              <h3 className="font-display text-3xl font-extrabold uppercase text-[#f5f7f2]">
                {activePlayer.name}
              </h3>
              <p className="font-mono text-xs text-[#9ba69d]">
                {activePlayer.role} · {activePlayer.nationality}
              </p>
              <p className="text-sm leading-relaxed text-[#9ba69d]">{activePlayer.bio}</p>
            </div>

            <PlayerAnimationSelector />
            <PlayerStats stats={activePlayer.stats} />

            <Button asChild variant="secondary">
              <Link href={`/players/${activePlayer.id}`}>View Full Athlete Profile</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
