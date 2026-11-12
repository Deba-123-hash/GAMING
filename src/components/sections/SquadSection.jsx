import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import SquadBuilder from '@/components/squad/SquadBuilder';
import Button from '@/components/ui/Button';

export default function SquadSection({ showExploreCta = true }) {
  return (
    <section className="border-b border-[#29342d] py-16 md:py-24">
      <Container className="space-y-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Frontend Interactive Prototype"
            title="BUILD YOUR ULTIMATE XI."
            description="Test formations, assign fictional athletes to tactical slots, and review live squad rating previews."
          />
          {showExploreCta ? (
            <Button asChild variant="secondary">
              <Link href="/squad">
                BUILD YOUR SQUAD <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          ) : null}
        </div>
        <SquadBuilder />
      </Container>
    </section>
  );
}
