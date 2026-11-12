import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wider',
  {
    variants: {
      tone: {
        lime: 'border-[#b8ff2c]/35 bg-[#b8ff2c]/10 text-[#b8ff2c]',
        orange: 'border-[#ff6b1a]/35 bg-[#ff6b1a]/10 text-[#ff6b1a]',
        neutral: 'border-white/15 bg-white/5 text-[#a3aeb8]',
        success: 'border-emerald-400/35 bg-emerald-400/10 text-emerald-300',
        warning: 'border-amber-400/35 bg-amber-400/10 text-amber-300',
      },
    },
    defaultVariants: {
      tone: 'neutral',
    },
  }
);

export default function Badge({ children, tone, className }) {
  return <span className={cn(badgeVariants({ tone, className }))}>{children}</span>;
}
