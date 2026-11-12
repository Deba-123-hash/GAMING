import { cn } from '@/lib/utils';

export default function Select({ className, children, ...props }) {
  return (
    <select
      className={cn(
        'w-full rounded-md border border-[#29342d] bg-[#080b09] px-3 py-2 text-xs sm:text-sm text-[#f5f7f2] transition-colors focus:border-[#c6ff3d] focus:outline-none',
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
