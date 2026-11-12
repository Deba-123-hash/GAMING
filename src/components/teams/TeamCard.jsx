import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import Badge from '@/components/ui/Badge';

export default function TeamCard({ team }) {
  return (
    <Link
      href={`/teams/${team.id}`}
      className="group flex flex-col justify-between rounded-xl border border-white/10 bg-[#12171d] p-6 transition-all hover:-translate-y-1 hover:border-[#b8ff2c]/50"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-lg font-display text-lg font-extrabold text-[#0b0e11]"
            style={{ backgroundColor: team.primaryColor }}
          >
            {team.shortCode}
          </span>
          <div className="flex items-center gap-2">
            {team.type && <Badge tone="orange">{team.type}</Badge>}
            <Badge tone="neutral">OVR {team.rating}</Badge>
          </div>
        </div>

        <div>
          <h3 className="font-display text-2xl font-extrabold uppercase text-[#f5f4ee] group-hover:text-[#b8ff2c]">
            {team.name}
          </h3>
          <p className="font-mono text-xs uppercase tracking-wider text-[#b8ff2c]">{team.style}</p>
        </div>

        <p className="text-sm leading-relaxed text-[#a3aeb8]">{team.description}</p>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 font-mono text-xs text-[#a3aeb8]">
        <span>
          {team.city}
          {team.country ? `, ${team.country}` : ''}
        </span>
        <span className="inline-flex items-center gap-1 text-[#b8ff2c]">
          Team Profile <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
