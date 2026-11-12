'use client';

import { motion } from 'motion/react';
import { DURATION_PRESETS, EASING_PRESETS } from '@/animations/config/animationTokens';

export default function ImageReveal({ children, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: DURATION_PRESETS.sectionReveal, ease: EASING_PRESETS.smooth }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
