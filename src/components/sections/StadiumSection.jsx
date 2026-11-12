'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import LoadingScreen from '@/components/ui/LoadingScreen';
import StadiumAnimation from '@/components/animations/StadiumAnimation';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

const CanvasWrapper = dynamic(() => import('@/components/3d/CanvasWrapper'), {
  ssr: false,
  loading: () => <LoadingScreen label="Loading Stadium Viewport..." className="h-[460px]" />,
});

const StadiumScene = dynamic(() => import('@/components/3d/StadiumScene'), { ssr: false });

export default function StadiumSection({ stadiums = [], showExploreCta = true }) {
  return (
    <section className="border-b border-[#29342d] py-16 md:py-24">
      <Container className="space-y-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="3D Arena Prototype"
            title="WHERE LEGENDS ARE MADE."
            description="From the tunnel to the final whistle, experience the atmosphere of football like never before."
          />
          {showExploreCta ? (
            <Button asChild variant="secondary">
              <Link href="/stadium">
                EXPLORE STADIUMS <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          ) : null}
        </div>

        <StadiumAnimation>
          <CanvasWrapper
            heightClass="h-[380px] md:h-[480px]"
            hud={
              <div className="flex items-center justify-between">
                <Badge tone="lime">Apex Arena (Procedural Prototype)</Badge>
                <Badge tone="neutral">Orbit & Zoom Enabled</Badge>
              </div>
            }
          >
            <StadiumScene showPlayer={false} />
          </CanvasWrapper>
        </StadiumAnimation>

        {stadiums.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-3">
            {stadiums.map((stadium) => (
              <div key={stadium.id} className="rounded-xl border border-[#29342d] bg-[#151d18] p-5">
                <p className="font-mono text-xs uppercase text-[#c6ff3d]">{stadium.city}</p>
                <h3 className="mt-1 font-display text-2xl font-bold uppercase text-[#f5f7f2]">
                  {stadium.name}
                </h3>
                <p className="mt-2 text-xs text-[#9ba69d]">{stadium.description}</p>
                <p className="mt-4 font-mono text-xs text-[#6e7a71]">
                  Sample Capacity: {stadium.capacity.toLocaleString()} · {stadium.surface}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
