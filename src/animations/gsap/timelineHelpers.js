import { registerGsapPlugins } from '@/lib/gsap';
import { DURATION_PRESETS, EASING_PRESETS } from '@/animations/config/animationTokens';

export function createScrollRevealTween(element, options = {}) {
  if (!element || typeof window === 'undefined') return null;
  const gsap = registerGsapPlugins();
  return gsap.from(element, {
    opacity: 0,
    y: options.y ?? 24,
    duration: options.duration ?? DURATION_PRESETS.sectionReveal,
    ease: options.ease ?? EASING_PRESETS.gsapPower,
    clearProps: 'transform,opacity',
    scrollTrigger: {
      trigger: element,
      start: options.start ?? 'top 86%',
      once: true,
    },
  });
}
