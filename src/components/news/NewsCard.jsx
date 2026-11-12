import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { formatEventDate } from '@/utils/formatters';

export default function NewsCard({ article }) {
  return (
    <Link
      href={`/news/${article.slug}`}
      className="group flex flex-col justify-between rounded-xl border border-white/10 bg-[#12171d] p-6 transition-all hover:-translate-y-1 hover:border-[#b8ff2c]/50"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Badge tone="neutral">{article.category}</Badge>
          <span className="font-mono text-xs text-[#6f7c87]">
            {formatEventDate(article.publishedAt)}
          </span>
        </div>
        <h3 className="font-display text-2xl font-extrabold uppercase text-[#f5f4ee] group-hover:text-[#b8ff2c]">
          {article.title}
        </h3>
        <p className="text-sm leading-relaxed text-[#a3aeb8]">{article.excerpt}</p>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 font-mono text-xs text-[#a3aeb8]">
        <span>{article.author}</span>
        <span className="inline-flex items-center gap-1 text-[#b8ff2c]">
          Read Dispatch <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
