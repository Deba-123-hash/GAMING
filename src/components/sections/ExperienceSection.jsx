import Link from 'next/link';
import { ArrowRight, Gamepad2, Layers, MapPin } from 'lucide-react';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

const EXPERIENCE_CARDS = [
  {
    title: 'GAME MODES',
    description:
      'Discover different football experiences from quick kickoffs to tactical dynasties.',
    cta: 'EXPLORE MODES',
    href: '/game-modes',
    badge: '6 Mode Concepts',
    icon: Gamepad2,
  },
  {
    title: 'BUILD YOUR SQUAD',
    description:
      'Create your dream football lineup with interactive formations and fictional athletes.',
    cta: 'BUILD YOUR SQUAD',
    href: '/squad',
    badge: 'Interactive Prototype',
    icon: Layers,
  },
  {
    title: 'STADIUM EXPERIENCE',
    description: 'Discover immersive floodlit stadium environments and 3D camera cinematics.',
    cta: 'EXPLORE STADIUM',
    href: '/stadium',
    badge: '3D Showcase',
    icon: MapPin,
  },
];

export default function ExperienceSection() {
  return (
    <section id="experience" className="border-b border-[#29342d] py-16 md:py-24">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow="Core Pillars"
          title="FOOTBALL. WITHOUT LIMITS."
          description="Explore the systems, experiences and possibilities that make every football journey different."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {EXPERIENCE_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <Card
                key={card.title}
                variant="interactive"
                className="flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#c6ff3d]/30 bg-[#c6ff3d]/10 text-[#c6ff3d]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <Badge tone="neutral">{card.badge}</Badge>
                  </div>
                  <h3 className="font-display text-3xl font-extrabold uppercase text-[#f5f7f2]">
                    {card.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#9ba69d]">{card.description}</p>
                </div>

                <Link
                  href={card.href}
                  className="mt-6 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#c6ff3d] hover:underline"
                >
                  {card.cta} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
