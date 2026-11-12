'use client';

import { AlertTriangle, RotateCcw } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function ErrorFallback({
  title = 'Scene Unavailable',
  description = 'WebGL rendering is unavailable or encountered a recoverable issue. Standard navigation and controls remain active.',
  onRetry,
}) {
  return (
    <div
      role="alert"
      className="flex min-h-[260px] w-full flex-col items-center justify-center gap-4 rounded-xl border border-[#ff6b1a]/30 bg-[#12171d] p-6 text-center"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ff6b1a]/15 text-[#ff6b1a]">
        <AlertTriangle className="h-6 w-6" aria-hidden="true" />
      </div>
      <div className="max-w-md space-y-1.5">
        <h3 className="font-display text-2xl font-bold uppercase text-[#f5f4ee]">{title}</h3>
        <p className="text-sm text-[#a3aeb8]">{description}</p>
      </div>
      {typeof onRetry === 'function' ? (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Retry Scene
        </Button>
      ) : null}
    </div>
  );
}
