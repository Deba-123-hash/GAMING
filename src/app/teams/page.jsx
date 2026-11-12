import PageContainer from '@/components/layout/PageContainer';
import SectionHeading from '@/components/ui/SectionHeading';
import TeamsCatalog from '@/components/teams/TeamsCatalog';

export const metadata = {
  title: 'Teams',
  description: 'Explore the founding fictional clubs and national teams of RIVALRY 90.',
};

export default function TeamsPage() {
  return (
    <PageContainer className="space-y-8">
      <SectionHeading
        eyebrow="Founding Universe"
        title="RIVALRY 90 Clubs & Nations"
        description="Ten original clubs and national teams with distinct tactical philosophies competing beneath the floodlights."
      />
      <TeamsCatalog />
    </PageContainer>
  );
}
