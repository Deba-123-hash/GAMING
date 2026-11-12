import EventsSection from '@/components/sections/EventsSection';
import ExternalFootballFeed from '@/components/events/ExternalFootballFeed';

export const metadata = {
  title: 'Events',
  description: 'Upcoming RIVALRY 90 tournaments, qualifiers, and seasonal cups.',
};

export default function EventsPage() {
  return (
    <>
      <EventsSection />
      <ExternalFootballFeed />
    </>
  );
}
