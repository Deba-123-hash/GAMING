'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import GameModeCard from '@/components/game-modes/GameModeCard';
import Button from '@/components/ui/Button';
import { GAME_MODES } from '@/data/gameModes';
import { useGameModesQuery } from '@/lib/api/hooks';
import { useGameStore } from '@/store/gameStore';

export default function GameModesSection({ showExploreCta = true }) {
  const selectedGameMode = useGameStore((state) => state.selectedGameMode);
  const setSelectedGameMode = useGameStore((state) => state.setSelectedGameMode);
  const { data: modes } = useGameModesQuery({ initialData: GAME_MODES });
  const visibleModes = Array.isArray(modes) && modes.length ? modes : GAME_MODES;

  return (
    <section className="border-b border-[#29342d] py-16 md:py-24">
      <Container className="space-y-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Concept Modes"
            title="YOUR GAME. YOUR RULES."
            description="Select a mode card to inspect its preview concept. All modes are website concepts ahead of future game-engine integration."
          />
          {showExploreCta ? (
            <Button asChild variant="secondary">
              <Link href="/game-modes">
                EXPLORE ALL GAME MODES <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          ) : null}
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visibleModes.map((mode) => (
            <GameModeCard
              key={mode.id}
              mode={mode}
              isSelected={selectedGameMode === mode.id}
              onSelect={() => setSelectedGameMode(mode.id)}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
