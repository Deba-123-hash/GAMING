import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold uppercase tracking-wider transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c6ff3d] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-[#c6ff3d] text-[#080b09] hover:bg-[#d5ff6b] shadow-[0_0_24px_rgba(198,255,61,0.18)]',
        secondary:
          'bg-[#151d18] text-[#f5f7f2] border border-[#29342d] hover:border-[#c6ff3d]/60 hover:text-[#c6ff3d]',
        outline:
          'bg-transparent text-[#f5f7f2] border border-[#29342d] hover:border-[#c6ff3d] hover:bg-[#c6ff3d]/10',
        accent: 'bg-[#ff6b35] text-[#080b09] hover:bg-[#ff8559]',
        danger: 'bg-red-500/15 text-red-300 border border-red-500/35 hover:bg-red-500/25',
        ghost: 'text-[#9ba69d] hover:text-[#f5f7f2] hover:bg-white/5',
        link: 'text-[#c6ff3d] underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        sm: 'h-9 px-3.5 text-xs',
        md: 'h-11 px-5 text-xs md:text-sm',
        lg: 'h-12 px-7 text-sm',
        xl: 'h-14 px-8 text-base',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export default function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  children,
  ...props
}) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && !asChild ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          <span>{children}</span>
        </>
      ) : (
        children
      )}
    </Comp>
  );
}

export { buttonVariants };
