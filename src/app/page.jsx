import HeroSection from '@/components/sections/HeroSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import GameModesSection from '@/components/sections/GameModesSection';
import PlayerShowcase from '@/components/sections/PlayerShowcase';
import StadiumSection from '@/components/sections/StadiumSection';
import TeamsSection from '@/components/sections/TeamsSection';
import SquadSection from '@/components/sections/SquadSection';
import EventsSection from '@/components/sections/EventsSection';
import NewsSection from '@/components/sections/NewsSection';
import CommunitySection from '@/components/sections/CommunitySection';
import FinalCTASection from '@/components/sections/FinalCTASection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ExperienceSection />
      <GameModesSection />
      <PlayerShowcase />
      <StadiumSection />
      <TeamsSection />
      <SquadSection />
      <EventsSection />
      <NewsSection />
      <CommunitySection />
      <FinalCTASection />
    </>
  );
}
