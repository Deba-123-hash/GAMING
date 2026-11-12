import { notFound } from 'next/navigation';
import PageContainer from '@/components/layout/PageContainer';
import TeamProfile from '@/components/teams/TeamProfile';
import { getTeamById } from '@/data/teams';
import { PLAYERS } from '@/data/players';
import { STADIUMS } from '@/data/stadiums';

export async function generateMetadata({ params }) {
  const { teamId } = await params;
  const team = getTeamById(teamId);
  return {
    title: team ? `${team.name} — Club Profile` : 'Club Not Found',
  };
}

export default async function TeamDetailPage({ params }) {
  const { teamId } = await params;
  const team = getTeamById(teamId);

  if (!team) {
    notFound();
  }

  const players = PLAYERS.filter((p) => p.teamId === team.id);
  const stadium = STADIUMS.find((s) => s.id === team.stadiumId) || null;

  return (
    <PageContainer>
      <TeamProfile team={team} players={players} stadium={stadium} />
    </PageContainer>
  );
}
