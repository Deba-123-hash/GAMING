'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { registerGsapPlugins } from '@/lib/gsap';
import useReducedMotion from '@/hooks/useReducedMotion';

export default function useScrollScene(setupFn, deps = []) {
  const containerRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion || !containerRef.current || typeof setupFn !== 'function') {
        return undefined;
      }
      const gsap = registerGsapPlugins();
      return setupFn({ gsap, container: containerRef.current });
    },
    { scope: containerRef, dependencies: [reducedMotion, ...deps] }
  );

  return containerRef;
}
