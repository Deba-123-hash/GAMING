import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';

export const metadata = {
  title: 'Terms & Conditions',
  description: 'RIVALRY 90 frontend showcase terms notice.',
};

export default function TermsPage() {
  return (
    <PageContainer className="max-w-3xl space-y-6">
      <PageHeader
        eyebrow="Legal Notice"
        title="Terms & Conditions"
        description="Original fictional universe and intellectual property policy."
        breadcrumbs={[{ label: 'Terms & Conditions', href: '/terms' }]}
      />
      <p className="text-sm leading-relaxed text-[#9ba69d]">
        All athletes, clubs, stadiums, and competitions presented on RIVALRY 90 are original
        fictional creations for interactive web showcase purposes. External 3D tools and asset
        marketplaces referenced in /resources/3d remain subject to their respective owners&apos;
        licenses.
      </p>
    </PageContainer>
  );
}
