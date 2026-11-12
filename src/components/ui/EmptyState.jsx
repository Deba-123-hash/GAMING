import Button from '@/components/ui/Button';

export default function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="rounded-xl border border-[#29342d] bg-[#151d18] p-8 text-center">
      <h3 className="font-display text-2xl font-bold uppercase text-[#f5f7f2]">{title}</h3>
      {description ? (
        <p className="mx-auto mt-2 max-w-md text-sm text-[#9ba69d]">{description}</p>
      ) : null}
      {actionLabel && typeof onAction === 'function' ? (
        <div className="mt-5">
          <Button variant="secondary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
