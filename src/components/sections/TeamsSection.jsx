'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import TeamCard from '@/components/teams/TeamCard';
import Button from '@/components/ui/Button';
import { TEAMS } from '@/data/teams';
import { useTeamsQuery } from '@/lib/api/hooks';

export default function TeamsSection() {
  const { data } = useTeamsQuery(
    {},
    {
      initialData: { teams: TEAMS },
    }
  );
  const visibleTeams = (data?.teams || TEAMS).slice(0, 4);

  return (
    <section className="border-b border-[#29342d] py-16 md:py-24">
      <Container className="space-y-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Original Fictional Universe"
            title="CHOOSE YOUR COLOURS."
            description="Featured clubs from the 10-team RIVALRY 90 universe built with custom tactical identities."
          />
          <Button asChild variant="secondary">
            <Link href="/teams">
              EXPLORE TEAMS <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {visibleTeams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      </Container>
    </section>
  );
}
