import { cn } from '@/lib/utils';

export default function SectionHeading({ eyebrow, title, description, align = 'left', className }) {
  return (
    <div
      className={cn('space-y-3', align === 'center' && 'mx-auto max-w-2xl text-center', className)}
    >
      {eyebrow ? (
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#b8ff2c]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-3xl font-extrabold uppercase leading-[0.98] text-[#f5f4ee] sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-sm leading-relaxed text-[#a3aeb8] sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
