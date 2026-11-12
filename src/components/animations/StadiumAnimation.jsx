'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { registerGsapPlugins } from '@/lib/gsap';
import useReducedMotion from '@/hooks/useReducedMotion';

export default function StadiumAnimation({ children, className }) {
  const wrapperRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion || !wrapperRef.current) return;
      const gsap = registerGsapPlugins();
      gsap.from(wrapperRef.current, {
        opacity: 0,
        y: 28,
        duration: 0.75,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top 85%',
          once: true,
        },
        clearProps: 'transform,opacity',
      });
    },
    { scope: wrapperRef, dependencies: [reducedMotion] }
  );

  return (
    <div ref={wrapperRef} className={className}>
      {children}
    </div>
  );
}
