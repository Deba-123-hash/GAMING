import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { formatRating } from '@/utils/formatters';

export default function PlayerCard({ player }) {
  return (
    <Link
      href={`/players/${player.id}`}
      className="group flex flex-col justify-between rounded-xl border border-white/10 bg-[#12171d] p-5 transition-all hover:-translate-y-1 hover:border-[#b8ff2c]/50"
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <Badge tone="lime">{player.position}</Badge>
            <h3 className="mt-2 font-display text-2xl font-extrabold uppercase text-[#f5f4ee] group-hover:text-[#b8ff2c]">
              {player.name}
            </h3>
            <p className="text-xs text-[#a3aeb8]">{player.role}</p>
          </div>
          <div className="text-right">
            <span className="font-mono text-2xl font-bold text-[#b8ff2c]">
              {formatRating(player.ovr)}
            </span>
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#6f7c87]">OVR</p>
          </div>
        </div>

        <p className="text-xs leading-relaxed text-[#a3aeb8]">{player.bio}</p>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3 font-mono text-xs text-[#a3aeb8]">
        <span>
          #{player.number} · {player.nationality}
        </span>
        <span className="inline-flex items-center gap-1 text-[#b8ff2c]">
          Inspect 3D <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
