import PageContainer from '@/components/layout/PageContainer';
import SectionHeading from '@/components/ui/SectionHeading';
import PlayerFilters from '@/components/players/PlayerFilters';

export const metadata = {
  title: 'Players',
  description: 'Filter and inspect original fictional RIVALRY 90 football athletes in 3D.',
};

export default function PlayersPage() {
  return (
    <PageContainer className="space-y-8">
      <SectionHeading
        eyebrow="Season Zero Roster"
        title="Fictional Athletes"
        description="Filter athletes by position or search role to open their interactive 3D pose and stats profile."
      />
      <PlayerFilters />
    </PageContainer>
  );
}
