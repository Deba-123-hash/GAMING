'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, Search, X } from 'lucide-react';
import { MEGA_MENU_GROUPS } from '@/config/navigation';
import { useUiStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';

export default function MobileNavigation({ onOpenSearch }) {
  const pathname = usePathname();
  const isOpen = useUiStore((state) => state.isMobileMenuOpen);
  const closeMobileMenu = useUiStore((state) => state.closeMobileMenu);
  const [expandedGroup, setExpandedGroup] = useState('PLAY');

  useEffect(() => {
    closeMobileMenu();
  }, [pathname, closeMobileMenu]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeMobileMenu();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, closeMobileMenu]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobileMenu}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed top-0 right-0 bottom-0 flex w-full max-w-sm flex-col border-l border-[#29342d] bg-[#080b09] p-5"
          >
            <div className="mb-5 flex items-center justify-between border-b border-[#29342d] pb-4">
              <span className="font-display text-xl font-extrabold uppercase tracking-wider text-[#f5f7f2]">
                RIVALRY <span className="text-[#c6ff3d]">90</span>
              </span>
              <button
                type="button"
                onClick={closeMobileMenu}
                aria-label="Close navigation menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#29342d] bg-[#151d18] text-[#f5f7f2]"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {typeof onOpenSearch === 'function' ? (
              <button
                type="button"
                onClick={() => {
                  closeMobileMenu();
                  onOpenSearch();
                }}
                className="mb-4 flex min-h-[44px] w-full items-center gap-2 rounded-lg border border-[#29342d] bg-[#151d18] px-3.5 text-xs font-semibold uppercase tracking-wider text-[#9ba69d]"
              >
                <Search className="h-4 w-4 text-[#c6ff3d]" aria-hidden="true" />
                Search RIVALRY 90...
              </button>
            ) : null}

            <nav aria-label="Mobile navigation links" className="flex-1 space-y-2 overflow-y-auto">
              {MEGA_MENU_GROUPS.map((group) => {
                const isGroupOpen = expandedGroup === group.id;
                return (
                  <div key={group.id} className="rounded-xl border border-[#29342d] bg-[#101713]">
                    <button
                      type="button"
                      aria-expanded={isGroupOpen}
                      onClick={() => setExpandedGroup(isGroupOpen ? null : group.id)}
                      className="flex min-h-[44px] w-full items-center justify-between px-4 py-3 text-left font-mono text-xs font-bold uppercase tracking-wider text-[#f5f7f2]"
                    >
                      {group.label}
                      <ChevronDown
                        className={cn(
                          'h-4 w-4 text-[#c6ff3d] transition-transform',
                          isGroupOpen && 'rotate-180'
                        )}
                        aria-hidden="true"
                      />
                    </button>
                    {isGroupOpen ? (
                      <div className="space-y-1 border-t border-[#29342d] p-2">
                        {group.links.map((item) => {
                          const active = pathname === item.href;
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={closeMobileMenu}
                              className={cn(
                                'flex min-h-[40px] items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                active
                                  ? 'bg-[#c6ff3d]/15 text-[#c6ff3d]'
                                  : 'text-[#9ba69d] hover:bg-white/5 hover:text-[#f5f7f2]'
                              )}
                            >
                              {item.label}
                            </Link>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </nav>
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
