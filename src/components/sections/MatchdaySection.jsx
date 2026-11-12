import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';

export default function MatchdaySection() {
  return (
    <section className="border-t border-white/10 py-14 md:py-20">
      <Container className="space-y-6">
        <SectionHeading
          eyebrow="Cinematic Scroll Architecture"
          title="8-Scene Matchday Sequence"
          description="Planned GSAP ScrollTrigger choreography from aerial floodlights through the tunnel onto the pitch."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            '01 Aerial Stadium Reveal',
            '02 Bowl Descent',
            '03 Tunnel Entrance',
            '04 Athlete Reveal',
            '05 Clip Showcase',
            '06 Crowd Kickoff Wave',
            '07 Tactical Squad View',
            '08 Trophy Finale',
          ].map((beat) => (
            <div
              key={beat}
              className="rounded-xl border border-white/10 bg-[#12171d] p-4 font-mono text-xs text-[#f5f4ee]"
            >
              {beat}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
