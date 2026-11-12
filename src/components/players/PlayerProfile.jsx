'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import LoadingScreen from '@/components/ui/LoadingScreen';
import PlayerStats from '@/components/players/PlayerStats';
import PlayerAnimationSelector from '@/components/players/PlayerAnimationSelector';
import usePlayerAnimation from '@/hooks/usePlayerAnimation';

const PlayerViewer = dynamic(() => import('@/components/3d/PlayerViewer'), {
  ssr: false,
  loading: () => <LoadingScreen label="Loading 3D Player Viewer..." />,
});

export default function PlayerProfile({ player, team }) {
  const { activeAnimation } = usePlayerAnimation();

  return (
    <div className="space-y-8">
      <Link
        href="/players"
        className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#a3aeb8] hover:text-[#b8ff2c]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to Athletes
      </Link>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <PlayerViewer
            playerName={player.name}
            kitColor={player.accentColor}
            activeAnimation={activeAnimation}
          />
        </div>

        <div className="space-y-6 lg:col-span-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="lime">{player.position}</Badge>
              <Badge tone="orange">OVR {player.ovr}</Badge>
              {team ? <Badge tone="neutral">{team.name}</Badge> : null}
            </div>
            <h1 className="font-display text-4xl font-extrabold uppercase text-[#f5f4ee] sm:text-5xl">
              #{player.number} {player.name}
            </h1>
            <p className="text-sm leading-relaxed text-[#a3aeb8]">{player.bio}</p>
          </div>

          <PlayerAnimationSelector />
          <PlayerStats stats={player.stats} />
        </div>
      </div>
    </div>
  );
}
