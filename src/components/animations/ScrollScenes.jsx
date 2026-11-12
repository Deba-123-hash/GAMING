'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { registerGsapPlugins } from '@/lib/gsap';
import useReducedMotion from '@/hooks/useReducedMotion';

/**
 * ScrollScenes orchestrates ScrollTrigger progress callbacks for future
 * 8-scene GSAP camera choreography without conflicting with Motion UI elements.
 */
export default function ScrollScenes({ children, onProgress, className }) {
  const containerRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion || !containerRef.current) return;
      const gsap = registerGsapPlugins();
      gsap.to(containerRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          onUpdate: (self) => {
            if (typeof onProgress === 'function') {
              onProgress(self.progress);
            }
          },
        },
      });
    },
    { scope: containerRef, dependencies: [reducedMotion] }
  );

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
