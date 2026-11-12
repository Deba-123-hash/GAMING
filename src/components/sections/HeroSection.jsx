'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import Container from '@/components/ui/Container';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import LoadingScreen from '@/components/ui/LoadingScreen';
import ScrollIndicator from '@/components/ui/ScrollIndicator';
import HeroAnimation from '@/components/animations/HeroAnimation';
import MagneticButton from '@/components/animations/MagneticButton';

const CanvasWrapper = dynamic(() => import('@/components/3d/CanvasWrapper'), {
  ssr: false,
  loading: () => <LoadingScreen label="Mounting 3D Stadium Scene..." className="h-[440px]" />,
});

const StadiumScene = dynamic(() => import('@/components/3d/StadiumScene'), {
  ssr: false,
});

export default function HeroSection() {
  const [enable3DHero, setEnable3DHero] = useState(false);

  return (
    <section className="relative overflow-hidden border-b border-[#29342d] bg-[radial-gradient(ellipse_at_top,_rgba(198,255,61,0.12),_transparent_52%),radial-gradient(circle_at_80%_70%,_rgba(14,31,24,0.85),_transparent_60%),_#080b09] py-16 md:py-24">
      <Container>
        <HeroAnimation className="grid items-center gap-10 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-6">
            <div data-hero-stagger className="flex flex-wrap items-center gap-2">
              <Badge tone="lime">THE NEXT FOOTBALL EXPERIENCE</Badge>
              <Badge tone="orange">RIVALRY 90 UNIVERSE</Badge>
            </div>

            <h1
              data-hero-stagger
              className="font-display text-5xl font-extrabold uppercase leading-[0.92] text-[#f5f7f2] sm:text-6xl lg:text-7xl"
            >
              THE GAME. <span className="text-[#c6ff3d]">THE GLORY.</span> THE RIVALRY.
            </h1>

            <p
              data-hero-stagger
              className="max-w-xl text-base leading-relaxed text-[#9ba69d] sm:text-lg"
            >
              Step into a new football universe. Build your legacy, create your squad and experience
              the passion of football.
            </p>

            <div data-hero-stagger className="flex flex-wrap items-center gap-3">
              <MagneticButton>
                <Button asChild size="lg">
                  <Link href="/game-modes">
                    EXPLORE THE GAME <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </MagneticButton>

              <Button asChild variant="secondary" size="lg">
                <a href="#experience">DISCOVER RIVALRY 90</a>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-6">
            {enable3DHero ? (
              <CanvasWrapper
                heightClass="h-[360px] sm:h-[420px] lg:h-[460px]"
                hud={
                  <div className="flex items-center justify-between">
                    <Badge tone="lime">Interactive 3D Stadium Prototype</Badge>
                    <button
                      type="button"
                      onClick={() => setEnable3DHero(false)}
                      className="r90-canvas-hud-interactive rounded bg-[#080b09]/80 px-2.5 py-1 font-mono text-[11px] uppercase text-[#9ba69d] hover:text-[#f5f7f2]"
                    >
                      Static View
                    </button>
                  </div>
                }
              >
                <StadiumScene activeAnimation="idle" />
              </CanvasWrapper>
            ) : (
              <div className="r90-pitch-grid relative flex h-[360px] flex-col justify-between overflow-hidden rounded-2xl border border-[#29342d] bg-gradient-to-br from-[#101713] via-[#0e1f18] to-[#080b09] p-6 shadow-2xl sm:h-[420px] lg:h-[460px]">
                <div className="flex items-center justify-between">
                  <Badge tone="lime">Floodlight Atmosphere</Badge>
                  <Badge tone="neutral">WebGL Ready</Badge>
                </div>

                {/* Stylized Floodlight & Pitch Silhouette Fallback */}
                <div className="my-auto space-y-4 text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#c6ff3d]/40 bg-[#c6ff3d]/10 text-[#c6ff3d] shadow-[0_0_48px_rgba(198,255,61,0.22)]">
                    <Sparkles className="h-8 w-8" aria-hidden="true" />
                  </div>
                  <p className="font-display text-3xl font-extrabold uppercase text-[#f5f7f2]">
                    APEX ARENA NIGHT KICKOFF
                  </p>
                  <p className="mx-auto max-w-sm text-xs text-[#9ba69d]">
                    Lightweight CSS stadium stage keeps initial page load instant. Launch the live
                    WebGL stadium prototype on demand.
                  </p>
                  <div>
                    <Button type="button" size="sm" onClick={() => setEnable3DHero(true)}>
                      <Play className="h-3.5 w-3.5" aria-hidden="true" /> Launch 3D Stadium Preview
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-3 font-mono text-[11px] uppercase text-[#9ba69d]">
                  <span>Fictional Showcase Environment</span>
                  <Link href="/stadium" className="text-[#c6ff3d] hover:underline">
                    Full Cinematic Stage →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </HeroAnimation>

        <div className="mt-12 flex justify-center">
          <ScrollIndicator label="Scroll to explore the RIVALRY 90 universe" />
        </div>
      </Container>
    </section>
  );
}
