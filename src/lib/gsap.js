import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let isRegistered = false;

export function registerGsapPlugins() {
  if (typeof window === 'undefined' || isRegistered) {
    return gsap;
  }

  gsap.registerPlugin(ScrollTrigger);
  isRegistered = true;
  return gsap;
}

export { gsap, ScrollTrigger };
