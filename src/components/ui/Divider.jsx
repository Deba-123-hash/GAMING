import { cn } from '@/lib/utils';

export default function Divider({ className }) {
  return <hr className={cn('border-0 border-t border-[#29342d]', className)} />;
}
