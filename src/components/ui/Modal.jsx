'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.2 }}
            className={`relative z-10 w-full ${maxWidth} max-h-[88vh] overflow-y-auto rounded-2xl border border-[#29342d] bg-[#101713] p-5 shadow-2xl md:p-6`}
          >
            <div className="mb-4 flex items-center justify-between gap-4 border-b border-[#29342d] pb-3">
              <h2 className="font-display text-2xl font-extrabold uppercase text-[#f5f7f2]">
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label={`Close ${title}`}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#29342d] bg-[#151d18] text-[#f5f7f2] hover:border-[#c6ff3d]"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
