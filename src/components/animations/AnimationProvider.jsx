'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { registerGsapPlugins, ScrollTrigger } from '@/lib/gsap';
import useReducedMotion from '@/hooks/useReducedMotion';

export default function AnimationProvider({ children, enableSmoothScroll = false }) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    registerGsapPlugins();
  }, []);

  useEffect(() => {
    if (!enableSmoothScroll || reducedMotion || typeof window === 'undefined') {
      return undefined;
    }

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);
    let frameId = null;

    function raf(time) {
      lenis.raf(time);
      frameId = window.requestAnimationFrame(raf);
    }

    frameId = window.requestAnimationFrame(raf);

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      lenis.destroy();
    };
  }, [enableSmoothScroll, reducedMotion]);

  return children;
}
