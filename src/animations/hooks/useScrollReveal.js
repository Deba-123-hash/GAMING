'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import useReducedMotion from '@/hooks/useReducedMotion';
import { createScrollRevealTween } from '@/animations/gsap/timelineHelpers';

export default function useScrollReveal(options = {}) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion || !ref.current) return;
      createScrollRevealTween(ref.current, options);
    },
    { scope: ref, dependencies: [reducedMotion] }
  );

  return ref;
}
