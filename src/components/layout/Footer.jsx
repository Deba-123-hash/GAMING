'use client';

import Link from 'next/link';
import { ArrowUp } from 'lucide-react';
import { FOOTER_NAV_COLUMNS } from '@/config/navigation';
import { SITE_CONFIG } from '@/config/site';
import Container from '@/components/ui/Container';

export default function Footer() {
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t border-[#29342d] bg-[#080b09] py-14 text-sm text-[#9ba69d]">
      <Container>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 font-display text-2xl font-extrabold uppercase text-[#f5f7f2]"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#c6ff3d] font-display text-base font-extrabold text-[#080b09]">
                90
              </span>
              RIVALRY <span className="text-[#c6ff3d]">90</span>
            </Link>
            <p className="max-w-xs text-xs leading-relaxed text-[#9ba69d]">
              {SITE_CONFIG.description}
            </p>
            <p className="text-[11px] text-[#6e7a71]">{SITE_CONFIG.socialNote}</p>
          </div>

          {FOOTER_NAV_COLUMNS.map((column) => (
            <div key={column.title} className="space-y-3">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#f5f7f2]">
                {column.title}
              </h3>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs text-[#9ba69d] transition-colors hover:text-[#c6ff3d]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-[#29342d] pt-6 text-xs text-[#6e7a71] sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} RIVALRY 90 Studio Showcase. Original fictional football
            universe.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy" className="hover:text-[#c6ff3d]">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[#c6ff3d]">
              Terms
            </Link>
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              className="inline-flex items-center gap-1.5 rounded-md border border-[#29342d] bg-[#151d18] px-3 py-1.5 font-mono text-[11px] uppercase text-[#c6ff3d] hover:border-[#c6ff3d]"
            >
              Top <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </Container>
    </footer>
  );
}
