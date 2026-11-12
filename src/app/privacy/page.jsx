import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';

export const metadata = {
  title: 'Privacy Policy',
  description: 'RIVALRY 90 frontend showcase privacy notice.',
};

export default function PrivacyPage() {
  return (
    <PageContainer className="max-w-3xl space-y-6">
      <PageHeader
        eyebrow="Legal Notice"
        title="Privacy Policy"
        description="Frontend showcase privacy statement for RIVALRY 90."
        breadcrumbs={[{ label: 'Privacy Policy', href: '/privacy' }]}
      />
      <p className="text-sm leading-relaxed text-[#9ba69d]">
        During Phases 01–10 (frontend showcase), RIVALRY 90 does not collect or transmit personal
        account data to external servers. Local preferences such as the 3D Development Hub checklist
        are stored solely inside your browser&apos;s localStorage.
      </p>
    </PageContainer>
  );
}
