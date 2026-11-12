'use client';

import { useEffect, useState } from 'react';
import useReducedMotion from '@/hooks/useReducedMotion';

export default function AnimatedCounter({ value = 0, durationMs = 700, suffix = '' }) {
  const reducedMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (reducedMotion || typeof window === 'undefined') {
      return undefined;
    }

    let frameId = null;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / durationMs);
      setDisplayValue(Math.round(value * progress));
      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
      }
    };
    frameId = window.requestAnimationFrame(tick);

    return () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, [value, durationMs, reducedMotion]);

  return (
    <span>
      {reducedMotion ? value : displayValue}
      {suffix}
    </span>
  );
}
