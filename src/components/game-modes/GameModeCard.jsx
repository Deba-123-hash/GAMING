'use client';

import Badge from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

export default function GameModeCard({ mode, isSelected = false, onSelect }) {
  return (
    <article
      className={cn(
        'flex flex-col justify-between rounded-xl border p-6 transition-all duration-200',
        isSelected
          ? 'border-[#c6ff3d] bg-[#1b2620] shadow-[0_0_24px_rgba(198,255,61,0.12)]'
          : 'border-[#29342d] bg-[#151d18] hover:-translate-y-1 hover:border-[#c6ff3d]/50'
      )}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <Badge tone="lime">{mode.tag}</Badge>
          <span className="font-mono text-[11px] uppercase text-[#9ba69d]">
            {mode.availability}
          </span>
        </div>
        <h3 className="font-display text-2xl font-extrabold uppercase text-[#f5f7f2]">
          {mode.title}
        </h3>
        <p className="text-sm leading-relaxed text-[#9ba69d]">{mode.summary}</p>
      </div>

      <div className="mt-5 space-y-4 border-t border-[#29342d] pt-4">
        <ul className="space-y-1.5 text-xs text-[#9ba69d]">
          {mode.highlights.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c6ff3d]" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>

        {typeof onSelect === 'function' ? (
          <button
            type="button"
            onClick={onSelect}
            className="font-mono text-xs font-semibold uppercase tracking-wider text-[#c6ff3d] hover:underline"
          >
            {isSelected ? 'Selected Concept ✓' : 'Inspect Mode Concept →'}
          </button>
        ) : null}
      </div>
    </article>
  );
}
