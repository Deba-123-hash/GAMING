'use client';

import { PLAYER_ANIMATION_STATES } from '@/lib/constants';
import usePlayerAnimation from '@/hooks/usePlayerAnimation';
import { cn } from '@/lib/utils';

export default function PlayerAnimationSelector() {
  const { activeAnimation, selectAnimation } = usePlayerAnimation();

  return (
    <div className="space-y-2">
      <p className="font-mono text-xs uppercase tracking-wider text-[#a3aeb8]">3D Animation Clip</p>
      <div className="flex flex-wrap gap-2">
        {PLAYER_ANIMATION_STATES.map((clip) => (
          <button
            key={clip.id}
            type="button"
            onClick={() => selectAnimation(clip.id)}
            className={cn(
              'rounded-md border px-3 py-1.5 font-mono text-xs uppercase transition-colors',
              activeAnimation === clip.id
                ? 'border-[#b8ff2c] bg-[#b8ff2c] text-[#0b0e11] font-bold'
                : 'border-white/15 bg-[#12171d] text-[#a3aeb8] hover:border-white/35 hover:text-[#f5f4ee]'
            )}
          >
            {clip.label}
          </button>
        ))}
      </div>
    </div>
  );
}
