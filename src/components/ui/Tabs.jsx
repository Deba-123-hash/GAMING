'use client';

import { cn } from '@/lib/utils';

export default function Tabs({ tabs = [], activeTab, onChange, className }) {
  return (
    <div role="tablist" className={cn('flex flex-wrap gap-2', className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              'min-h-[40px] rounded-md border px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors',
              isActive
                ? 'border-[#c6ff3d] bg-[#c6ff3d] text-[#080b09] font-bold'
                : 'border-[#29342d] bg-[#151d18] text-[#9ba69d] hover:border-white/30 hover:text-[#f5f7f2]'
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
