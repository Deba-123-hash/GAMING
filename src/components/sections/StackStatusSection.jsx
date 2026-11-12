import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';

const STACK_CHECKS = [
  {
    layer: 'Framework',
    items: 'Next.js App Router, React 19, JavaScript ES6+, JSX (Zero TypeScript)',
  },
  { layer: 'Styling & UI', items: 'Tailwind CSS v4, Radix UI, shadcn/ui tokens, Lucide React' },
  { layer: '3D Engine', items: 'Three.js, React Three Fiber v9, Drei v10, Postprocessing, Rapier' },
  {
    layer: 'Animation',
    items: 'GSAP + ScrollTrigger + @gsap/react, Motion for React, Lenis, AnimationMixer',
  },
  { layer: 'State & Forms', items: 'Zustand, TanStack React Query, React Hook Form, Zod' },
  {
    layer: 'Audio & Backend',
    items: 'Howler.js (opt-in only), Supabase client ready (.env.example)',
  },
  {
    layer: 'QA & Tooling',
    items: 'ESLint, Prettier, Vitest, Playwright, @gltf-transform/cli, gltf-validator',
  },
];

export default function StackStatusSection() {
  return (
    <section className="border-t border-white/10 py-14 md:py-20">
      <Container className="space-y-8">
        <SectionHeading
          eyebrow="Phase 1 Environment Verification"
          title="Installed Technology Stack"
          description="Modular foundation configured for RIVALRY 90 without TypeScript or conflicting animation layers."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STACK_CHECKS.map((group) => (
            <div key={group.layer} className="rounded-xl border border-white/10 bg-[#12171d] p-5">
              <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#b8ff2c]">
                {group.layer}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#a3aeb8]">{group.items}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
