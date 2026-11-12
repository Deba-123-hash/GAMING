import { cn } from '@/lib/utils';

export default function Skeleton({ className }) {
  return (
    <div aria-hidden="true" className={cn('animate-pulse rounded-lg bg-[#1b2620]', className)} />
  );
}
