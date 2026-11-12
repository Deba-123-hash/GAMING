import { ChevronDown } from 'lucide-react';

export default function ScrollIndicator({ label = 'Scroll to descend into stadium' }) {
  return (
    <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[#a3aeb8]">
      <span>{label}</span>
      <ChevronDown className="h-4 w-4 animate-bounce text-[#b8ff2c]" aria-hidden="true" />
    </div>
  );
}
