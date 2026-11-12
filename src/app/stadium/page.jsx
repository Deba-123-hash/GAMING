import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import StadiumSection from '@/components/sections/StadiumSection';
import CinematicDirectorStage from '@/cinematic/components/CinematicDirectorStage';
import { STADIUMS } from '@/data/stadiums';

export const metadata = {
  title: 'Stadium',
  description: 'Interactive 3D stadium showcase, arena specifications, and cinematic sequences.',
};

export default function StadiumPage() {
  return (
    <>
      <PageContainer className="pb-4">
        <PageHeader
          eyebrow="Arena & Cinematics"
          title="ENTER THE ATMOSPHERE."
          description="Explore fictional stadium concepts, procedural 3D floodlights, and the Phase 10 Cinematic Camera Director."
          breadcrumbs={[{ label: 'Stadium', href: '/stadium' }]}
        />
        <CinematicDirectorStage />
      </PageContainer>
      <StadiumSection stadiums={STADIUMS} showExploreCta={false} />
    </>
  );
}
