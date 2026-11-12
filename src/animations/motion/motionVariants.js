import { DURATION_PRESETS, EASING_PRESETS } from '@/animations/config/animationTokens';

export const fadeUpVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION_PRESETS.sectionReveal,
      ease: EASING_PRESETS.smooth,
    },
  },
};

export const staggerContainerVariant = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export const cardHoverMotion = {
  whileHover: { y: -4 },
  transition: { duration: DURATION_PRESETS.cardHover, ease: EASING_PRESETS.sporty },
};
