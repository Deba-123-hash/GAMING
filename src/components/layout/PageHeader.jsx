import Badge from '@/components/ui/Badge';
import Breadcrumbs from '@/components/layout/Breadcrumbs';

export default function PageHeader({ eyebrow, title, description, breadcrumbs = [] }) {
  return (
    <div className="mb-10 space-y-3 border-b border-[#29342d] pb-8">
      <Breadcrumbs items={breadcrumbs} />
      {eyebrow ? <Badge tone="lime">{eyebrow}</Badge> : null}
      <h1 className="font-display text-4xl font-extrabold uppercase leading-[0.95] text-[#f5f7f2] sm:text-5xl lg:text-6xl">
        {title}
      </h1>
      {description ? (
        <p className="max-w-2xl text-sm leading-relaxed text-[#9ba69d] sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
