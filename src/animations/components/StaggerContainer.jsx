'use client';

import { motion } from 'motion/react';
import { staggerContainerVariant } from '@/animations/motion/motionVariants';

export default function StaggerContainer({ children, className }) {
  return (
    <motion.div
      variants={staggerContainerVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
