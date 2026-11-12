'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { MEGA_MENU_GROUPS } from '@/config/navigation';

export default function MegaMenu({ activeGroupId, onClose }) {
  const group = MEGA_MENU_GROUPS.find((item) => item.id === activeGroupId) || null;

  return (
    <AnimatePresence>
      {group ? (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          className="absolute top-full right-0 left-0 z-30 border-b border-[#29342d] bg-[#080b09]/95 shadow-2xl backdrop-blur-xl"
        >
          <div className="mx-auto grid max-w-[1400px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-12 lg:px-10">
            <div className="space-y-2 lg:col-span-4">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#c6ff3d]">
                {group.label}
              </p>
              <p className="text-sm leading-relaxed text-[#9ba69d]">{group.summary}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:col-span-8">
              {group.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="group flex items-center justify-between rounded-xl border border-[#29342d] bg-[#151d18] p-3.5 transition-colors hover:border-[#c6ff3d]/60"
                >
                  <div>
                    <p className="font-display text-lg font-bold uppercase text-[#f5f7f2] group-hover:text-[#c6ff3d]">
                      {link.label}
                    </p>
                    <p className="text-xs text-[#9ba69d]">{link.note}</p>
                  </div>
                  <ArrowRight
                    className="h-4 w-4 text-[#c6ff3d] transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
