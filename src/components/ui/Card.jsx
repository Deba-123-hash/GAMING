import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva('rounded-xl border transition-all duration-200', {
  variants: {
    variant: {
      standard: 'border-[#29342d] bg-[#151d18]',
      elevated: 'border-[#29342d] bg-[#1b2620] shadow-[0_18px_42px_rgba(0,0,0,0.45)]',
      interactive: 'border-[#29342d] bg-[#151d18] hover:-translate-y-1 hover:border-[#c6ff3d]/55',
      featured: 'border-[#c6ff3d]/35 bg-gradient-to-br from-[#101713] via-[#151d18] to-[#080b09]',
      glass: 'border-white/10 bg-[#101713]/80 backdrop-blur-md',
    },
    padding: {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-5 md:p-6',
      lg: 'p-6 md:p-8',
    },
  },
  defaultVariants: {
    variant: 'standard',
    padding: 'md',
  },
});

export default function Card({ children, variant, padding, className, ...props }) {
  return (
    <div className={cn(cardVariants({ variant, padding, className }))} {...props}>
      {children}
    </div>
  );
}
