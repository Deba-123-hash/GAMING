'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { registerGsapPlugins } from '@/lib/gsap';
import useReducedMotion from '@/hooks/useReducedMotion';

export default function HeroAnimation({ children, className }) {
  const scopeRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;
      const gsap = registerGsapPlugins();
      gsap.from('[data-hero-stagger]', {
        y: 22,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      });
    },
    { scope: scopeRef, dependencies: [reducedMotion] }
  );

  return (
    <div ref={scopeRef} className={className}>
      {children}
    </div>
  );
}
