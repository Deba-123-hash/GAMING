import Link from 'next/link';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

export default function FinalCTASection() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="rounded-2xl border border-[#c6ff3d]/35 bg-gradient-to-br from-[#101713] via-[#151d18] to-[#080b09] p-8 text-center md:p-14">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#c6ff3d]">
            THE NEXT FOOTBALL UNIVERSE
          </p>
          <h2 className="mt-3 font-display text-4xl font-extrabold uppercase text-[#f5f7f2] sm:text-5xl">
            YOUR FOOTBALL STORY STARTS HERE.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-[#9ba69d] sm:text-base">
            Step into RIVALRY 90 and discover a football universe built around passion, competition
            and ambition.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/overview">ENTER RIVALRY 90</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/stadium">EXPLORE THE EXPERIENCE</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
