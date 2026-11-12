'use client';

import { motion } from 'motion/react';

export default function MagneticButton({ children, className }) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 420, damping: 24 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
