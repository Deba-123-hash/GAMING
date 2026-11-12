import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { computeEventStatus } from '@/data/events';

export default function EventCard({ event }) {
  const status = event.status || computeEventStatus(event);
  const slug = event.slug || event.id;

  return (
    <Link
      href={`/events/${slug}`}
      className="group flex flex-col justify-between rounded-xl border border-[#29342d] bg-[#151d18] p-6 transition-all hover:-translate-y-1 hover:border-[#c6ff3d]/60"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Badge tone={status === 'UPCOMING' || status === 'LIVE' ? 'lime' : 'orange'}>
            {status}
          </Badge>
          <span className="font-mono text-xs text-[#9ba69d]">{event.category}</span>
        </div>
        <h3 className="font-display text-2xl font-extrabold uppercase text-[#f5f7f2] group-hover:text-[#c6ff3d]">
          {event.title}
        </h3>
        <p className="text-sm text-[#9ba69d]">{event.description}</p>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-[#29342d] pt-4 font-mono text-xs text-[#9ba69d]">
        <span>Format: {event.format}</span>
        <span className="inline-flex items-center gap-1 text-[#c6ff3d]">
          Details <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
