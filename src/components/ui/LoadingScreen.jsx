import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LoadingScreen({
  label = 'Loading RIVALRY 90...',
  fullScreen = false,
  className,
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-xl border border-white/10 bg-[#12171d]/90 p-8 text-center',
        fullScreen ? 'min-h-[60vh]' : 'min-h-[240px] w-full',
        className
      )}
    >
      <Loader2 className="h-7 w-7 animate-spin text-[#b8ff2c]" aria-hidden="true" />
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#a3aeb8]">{label}</p>
    </div>
  );
}
