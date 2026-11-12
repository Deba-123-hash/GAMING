'use client';

import { motion } from 'motion/react';
import { fadeUpVariant } from '@/animations/motion/motionVariants';

export default function ScrollReveal({ children, className }) {
  return (
    <motion.div
      variants={fadeUpVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
