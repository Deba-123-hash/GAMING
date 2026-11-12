import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import SupportForm from '@/components/support/SupportForm';
import SupportFaqSection from '@/components/support/SupportFaqSection';
import Badge from '@/components/ui/Badge';

export const metadata = {
  title: 'Support',
  description: 'Searchable FAQ, WebGL troubleshooting, and frontend-validated support form demo.',
};

export default function SupportPage() {
  return (
    <PageContainer className="space-y-10">
      <PageHeader
        eyebrow="Help Desk"
        title="WE ARE HERE TO HELP."
        description="Search frequently asked questions about RIVALRY 90 WebGL fallbacks, audio controls, and upcoming backend phases."
        breadcrumbs={[{ label: 'Support', href: '/support' }]}
      />

      <div
        id="account-future"
        className="rounded-xl border border-[#29342d] bg-[#151d18] p-5 text-xs text-[#9ba69d]"
      >
        <Badge tone="orange">Roadmap Notice · Phase 12</Badge>
        <p className="mt-2">
          User accounts, sign-in, and cloud-persisted squads are scheduled for Phases 11–13 (Backend
          Foundation & Authentication). No live account backend is active during Phases 01–10.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-6">
          <h2 className="font-display text-2xl font-extrabold uppercase text-[#f5f7f2]">
            Frequently Asked Questions
          </h2>
          <SupportFaqSection />
        </div>

        <div className="lg:col-span-6">
          <SupportForm />
        </div>
      </div>
    </PageContainer>
  );
}
