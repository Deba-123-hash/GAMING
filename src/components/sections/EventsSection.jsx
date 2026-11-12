import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import EventDetails from '@/components/events/EventDetails';
import Button from '@/components/ui/Button';
import { EVENTS } from '@/data/events';

export default function EventsSection({ showExploreCta = true }) {
  return (
    <section className="border-b border-[#29342d] py-16 md:py-24">
      <Container className="space-y-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Tournament Concepts"
            title="EVERY MATCH HAS A STORY."
            description="Sample seasonal tournament concepts demonstrating future competitive brackets."
          />
          {showExploreCta ? (
            <Button asChild variant="secondary">
              <Link href="/events">
                VIEW ALL EVENTS <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          ) : null}
        </div>
        <EventDetails events={EVENTS} />
      </Container>
    </section>
  );
}
