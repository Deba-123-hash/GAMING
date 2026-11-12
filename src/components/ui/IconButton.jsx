import Button from '@/components/ui/Button';

export default function IconButton({
  label,
  children,
  className,
  variant = 'secondary',
  ...props
}) {
  return (
    <Button
      type="button"
      variant={variant}
      size="icon"
      aria-label={label}
      className={className}
      {...props}
    >
      {children}
    </Button>
  );
}
