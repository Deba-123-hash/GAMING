import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs({ items = [] }) {
  if (!items.length) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-4 flex flex-wrap items-center gap-1.5 font-mono text-xs text-[#9ba69d]"
    >
      <Link href="/" className="hover:text-[#c6ff3d]">
        Home
      </Link>
      {items.map((item, idx) => (
        <span key={item.label} className="inline-flex items-center gap-1.5">
          <ChevronRight className="h-3.5 w-3.5 text-[#6e7a71]" aria-hidden="true" />
          {item.href && idx < items.length - 1 ? (
            <Link href={item.href} className="hover:text-[#c6ff3d]">
              {item.label}
            </Link>
          ) : (
            <span className="text-[#f5f7f2]">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
