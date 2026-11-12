import PageContainer from '@/components/layout/PageContainer';
import SectionHeading from '@/components/ui/SectionHeading';
import MatchdaySection from '@/components/sections/MatchdaySection';
import Badge from '@/components/ui/Badge';

export const metadata = {
  title: 'Overview',
  description: 'RIVALRY 90 universe overview, technical architecture, and visual direction.',
};

export default function OverviewPage() {
  return (
    <>
      <PageContainer className="space-y-8">
        <Badge tone="lime">RIVALRY 90 Universe</Badge>
        <SectionHeading
          eyebrow="Project Vision"
          title="Cinematic Football Gaming Showcase"
          description="RIVALRY 90 unites real-time React Three Fiber stadium rendering, fictional football athletes, and GSAP scroll storytelling into an original interactive web experience."
        />

        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              title: 'Original Fictional Roster',
              body: 'Custom clubs, kits, crests, and athletes built exclusively for RIVALRY 90 with zero third-party likeness infringement.',
            },
            {
              title: 'Progressive 3D Architecture',
              body: 'Hero-first loading, instanced crowd geometry, Draco/KTX2 asset pipelines, and clean WebGL fallback modes.',
            },
            {
              title: 'Backend-Ready Core',
              body: 'Frontend-first MVP backed by structured data modules, with TanStack Query, Zod, and Supabase client ready for Phase 11.',
            },
          ].map((pillar) => (
            <div key={pillar.title} className="rounded-xl border border-white/10 bg-[#12171d] p-6">
              <h2 className="font-display text-2xl font-bold uppercase text-[#f5f4ee]">
                {pillar.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#a3aeb8]">{pillar.body}</p>
            </div>
          ))}
        </div>
      </PageContainer>
      <MatchdaySection />
    </>
  );
}
