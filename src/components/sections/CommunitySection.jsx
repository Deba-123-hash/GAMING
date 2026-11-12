import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export default function CommunitySection({ showExploreCta = true }) {
  return (
    <section id="esports" className="border-b border-[#29342d] py-16 md:py-24">
      <Container className="space-y-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Community Preview"
            title="THE GAME IS BETTER TOGETHER."
            description="Friends and rivals concepts, creator showcases, and competitive tournament formats."
          />
          {showExploreCta ? (
            <Button asChild variant="secondary">
              <Link href="/community">
                JOIN THE COMMUNITY <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          ) : null}
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              badge: 'Creator Concept',
              title: 'Matchday Highlight Partners',
              copy: 'Toolkit vision for original RIVALRY 90 video creators, casters, and tactical analysts.',
            },
            {
              badge: 'Friends & Rivals',
              title: 'Club Rivalry Brackets',
              copy: 'Head-to-head club leaderboard and custom squad sharing concepts arriving in backend phases.',
            },
            {
              badge: 'Esports Concept',
              title: 'Apex Continental Qualifiers',
              copy: 'Seasonal floodlight competition format built around original fictional clubs.',
            },
          ].map((card) => (
            <div key={card.title} className="rounded-xl border border-[#29342d] bg-[#151d18] p-6">
              <Badge tone="lime">{card.badge}</Badge>
              <h3 className="mt-3 font-display text-2xl font-bold uppercase text-[#f5f7f2]">
                {card.title}
              </h3>
              <p className="mt-2 text-sm text-[#9ba69d]">{card.copy}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
