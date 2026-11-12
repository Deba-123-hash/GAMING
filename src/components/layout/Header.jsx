'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu } from 'lucide-react';
import { MAIN_NAV_LINKS, MEGA_MENU_GROUPS } from '@/config/navigation';
import { cn } from '@/lib/utils';
import { useUiStore } from '@/store/uiStore';
import MobileNavigation from '@/components/layout/MobileNavigation';
import MegaMenu from '@/components/layout/MegaMenu';
import HeaderActions from '@/components/layout/HeaderActions';
import SearchDialog from '@/components/layout/SearchDialog';

export default function Header() {
  const pathname = usePathname();
  const toggleMobileMenu = useUiStore((state) => state.toggleMobileMenu);
  const [megaState, setMegaState] = useState({ pathname: '', groupId: null });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef(null);

  const activeMegaGroup = megaState.pathname === pathname ? megaState.groupId : null;
  const setActiveMegaGroup = useCallback(
    (groupId) => setMegaState({ pathname, groupId }),
    [pathname]
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!activeMegaGroup) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setActiveMegaGroup(null);
    };
    const onPointerDown = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setActiveMegaGroup(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('mousedown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('mousedown', onPointerDown);
    };
  }, [activeMegaGroup, setActiveMegaGroup]);

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          'sticky top-0 z-40 border-b transition-colors duration-200',
          scrolled
            ? 'border-[#29342d] bg-[#080b09]/92 backdrop-blur-md shadow-lg'
            : 'border-white/10 bg-[#080b09]/80 backdrop-blur-sm'
        )}
      >
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-[#f5f7f2] transition-opacity hover:opacity-90"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#c6ff3d] font-display text-lg font-extrabold text-[#080b09]">
                90
              </span>
              <span className="font-display text-2xl font-extrabold uppercase tracking-wider">
                RIVALRY <span className="text-[#c6ff3d]">90</span>
              </span>
            </Link>

            {/* Mega-Menu Group Triggers (Desktop) */}
            <div className="hidden items-center gap-1 xl:flex">
              {MEGA_MENU_GROUPS.map((group) => {
                const open = activeMegaGroup === group.id;
                return (
                  <button
                    key={group.id}
                    type="button"
                    aria-expanded={open}
                    onClick={() => setActiveMegaGroup(open ? null : group.id)}
                    className={cn(
                      'inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider transition-colors',
                      open
                        ? 'bg-[#c6ff3d]/15 text-[#c6ff3d]'
                        : 'text-[#9ba69d] hover:bg-white/5 hover:text-[#f5f7f2]'
                    )}
                  >
                    {group.label}
                    <ChevronDown
                      className={cn('h-3 w-3 transition-transform', open && 'rotate-180')}
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Direct Primary Navigation */}
          <nav aria-label="Main navigation" className="hidden items-center gap-0.5 lg:flex">
            {MAIN_NAV_LINKS.slice(0, 6).map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'rounded-md px-2.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors',
                    active
                      ? 'bg-[#c6ff3d]/15 text-[#c6ff3d]'
                      : 'text-[#9ba69d] hover:bg-white/5 hover:text-[#f5f7f2]'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <HeaderActions pathname={pathname} onOpenSearch={() => setIsSearchOpen(true)} />
            <button
              type="button"
              onClick={toggleMobileMenu}
              aria-label="Open navigation menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#29342d] bg-[#151d18] text-[#f5f7f2] lg:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <MegaMenu activeGroupId={activeMegaGroup} onClose={() => setActiveMegaGroup(null)} />
      </header>

      <MobileNavigation onOpenSearch={() => setIsSearchOpen(true)} />
      <SearchDialog isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
