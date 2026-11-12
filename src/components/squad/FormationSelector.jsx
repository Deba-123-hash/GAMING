'use client';

import { FORMATIONS } from '@/lib/constants';
import { useGameStore } from '@/store/gameStore';
import { cn } from '@/lib/utils';

export default function FormationSelector() {
  const formation = useGameStore((state) => state.formation);
  const setFormation = useGameStore((state) => state.setFormation);

  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(FORMATIONS).map(([key, item]) => (
        <button
          key={key}
          type="button"
          onClick={() => setFormation(key)}
          className={cn(
            'rounded-md border px-3.5 py-2 font-mono text-xs uppercase transition-colors',
            formation === key
              ? 'border-[#b8ff2c] bg-[#b8ff2c] text-[#0b0e11] font-bold'
              : 'border-white/15 bg-[#12171d] text-[#a3aeb8] hover:border-white/35 hover:text-[#f5f4ee]'
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
