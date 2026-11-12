import { cn } from '@/lib/utils';

export default function Textarea({ className, error, ...props }) {
  return (
    <textarea
      className={cn(
        'w-full rounded-md border bg-[#080b09] px-3.5 py-2.5 text-sm text-[#f5f7f2] placeholder:text-[#6e7a71] transition-colors focus:border-[#c6ff3d] focus:outline-none',
        error ? 'border-red-500/70' : 'border-[#29342d]',
        className
      )}
      {...props}
    />
  );
}
