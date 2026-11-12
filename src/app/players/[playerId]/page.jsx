import { notFound } from 'next/navigation';
import PageContainer from '@/components/layout/PageContainer';
import PlayerProfile from '@/components/players/PlayerProfile';
import { getPlayerById } from '@/data/players';
import { getTeamById } from '@/data/teams';

export async function generateMetadata({ params }) {
  const { playerId } = await params;
  const player = getPlayerById(playerId);
  return {
    title: player ? `${player.name} — Athlete Profile` : 'Athlete Not Found',
  };
}

export default async function PlayerDetailPage({ params }) {
  const { playerId } = await params;
  const player = getPlayerById(playerId);

  if (!player) {
    notFound();
  }

  const team = getTeamById(player.teamId);

  return (
    <PageContainer>
      <PlayerProfile player={player} team={team} />
    </PageContainer>
  );
}
