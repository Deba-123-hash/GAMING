'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Pause, Play, RotateCcw, SkipForward } from 'lucide-react';
import { CINEMATIC_SEQUENCES } from '@/cinematic/config/cinematicConfig';
import LoadingScreen from '@/components/ui/LoadingScreen';
import Badge from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

const CanvasWrapper = dynamic(() => import('@/components/3d/CanvasWrapper'), {
  ssr: false,
  loading: () => (
    <LoadingScreen label="Initializing Cinematic Camera Director..." className="h-[440px]" />
  ),
});

const CinematicSequences = dynamic(() => import('@/cinematic/sequences/CinematicSequences'), {
  ssr: false,
});

export default function CinematicDirectorStage({ onSkip }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const activeSequence = CINEMATIC_SEQUENCES[activeIndex] || CINEMATIC_SEQUENCES[0];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % CINEMATIC_SEQUENCES.length);
  };

  const handleReplay = () => {
    setIsPlaying(true);
    setActiveIndex(0);
  };

  return (
    <div id="cinematics" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {CINEMATIC_SEQUENCES.map((seq, idx) => (
            <button
              key={seq.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={cn(
                'rounded-md border px-3 py-1.5 font-mono text-xs uppercase transition-colors',
                idx === activeIndex
                  ? 'border-[#c6ff3d] bg-[#c6ff3d] text-[#080b09] font-bold'
                  : 'border-[#29342d] bg-[#151d18] text-[#9ba69d] hover:text-[#f5f7f2]'
              )}
            >
              {seq.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying((v) => !v)}
            aria-label={isPlaying ? 'Pause cinematic camera' : 'Resume cinematic camera'}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[#29342d] bg-[#151d18] px-3 font-mono text-xs uppercase text-[#f5f7f2] hover:border-[#c6ff3d]"
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next cinematic sequence"
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[#29342d] bg-[#151d18] px-3 font-mono text-xs uppercase text-[#f5f7f2] hover:border-[#c6ff3d]"
          >
            <SkipForward className="h-3.5 w-3.5" /> Next
          </button>

          <button
            type="button"
            onClick={handleReplay}
            aria-label="Replay cinematic sequence"
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[#29342d] bg-[#151d18] px-3 font-mono text-xs uppercase text-[#c6ff3d] hover:border-[#c6ff3d]"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Replay
          </button>

          {typeof onSkip === 'function' ? (
            <button
              type="button"
              onClick={onSkip}
              className="inline-flex h-9 items-center rounded-md border border-[#29342d] bg-[#080b09] px-3 font-mono text-xs uppercase text-[#9ba69d] hover:text-[#f5f7f2]"
            >
              Skip
            </button>
          ) : null}
        </div>
      </div>

      <CanvasWrapper
        heightClass="h-[380px] sm:h-[440px] lg:h-[500px]"
        hud={
          <div className="flex h-full flex-col justify-between">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Badge tone="lime">{activeSequence.label}</Badge>
              <Badge tone="orange">Procedural Prototype Stage</Badge>
            </div>
            <div className="max-w-lg rounded-xl border border-white/10 bg-[#080b09]/80 p-4 backdrop-blur-md">
              <h3 className="font-display text-2xl font-extrabold uppercase text-[#f5f7f2]">
                {activeSequence.headline}
              </h3>
              <p className="mt-1 text-xs text-[#9ba69d]">{activeSequence.caption}</p>
            </div>
          </div>
        }
      >
        <CinematicSequences sequence={activeSequence} isPlaying={isPlaying} />
      </CanvasWrapper>
    </div>
  );
}
