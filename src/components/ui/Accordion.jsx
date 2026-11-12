'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Accordion({ items = [] }) {
  const [openId, setOpenId] = useState(items[0]?.id || null);

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isOpen = openId === item.id;
        const panelId = `accordion-panel-${item.id}`;
        const buttonId = `accordion-btn-${item.id}`;
        return (
          <div
            key={item.id}
            className="overflow-hidden rounded-xl border border-[#29342d] bg-[#151d18]"
          >
            <button
              id={buttonId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-white/5"
            >
              <span className="font-display text-lg font-bold uppercase text-[#f5f7f2]">
                {item.question}
              </span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 shrink-0 text-[#c6ff3d] transition-transform',
                  isOpen && 'rotate-180'
                )}
                aria-hidden="true"
              />
            </button>
            {isOpen ? (
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className="border-t border-[#29342d] px-5 py-4 text-sm leading-relaxed text-[#9ba69d]"
              >
                {item.answer}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
