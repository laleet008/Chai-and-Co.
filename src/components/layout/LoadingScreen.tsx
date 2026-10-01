'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LeafGlyph } from '@/components/ui/Icons';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { defaultEasing } from '@/lib/motion';

const SESSION_KEY = 'chaiandco_loadscreen_seen_v1';

export function LoadingScreen() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reduced) return;
    try {
      const seen = window.sessionStorage.getItem(SESSION_KEY);
      if (seen === '1') return;
    } catch {
      /* noop */
    }
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      try {
        window.sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        /* noop */
      }
    }, 1800);
    return () => clearTimeout(t);
  }, [reduced]);

  if (reduced) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          aria-hidden
          className="fixed inset-0 z-[120] pointer-events-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, delay: 1.65 }}
        >
          <motion.div
            className="absolute inset-0 origin-top"
            style={{ background: '#1A1714' }}
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{ duration: 0.9, ease: defaultEasing, delay: 0.9 }}
          />
          <motion.div
            className="absolute inset-0 origin-bottom"
            style={{ background: '#F4F0E8' }}
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{ duration: 0.9, ease: defaultEasing, delay: 0.85 }}
          />
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 1.45, ease: defaultEasing }}
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.15, ease: defaultEasing }}
              className="flex flex-col items-center gap-6"
            >
              <motion.div
                animate={{ rotate: [0, 6, -4, 0], y: [0, -2, 1, 0] }}
                transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <LeafGlyph className="w-[68px] h-[68px]" style={{ color: '#B3541E' }} />
              </motion.div>
              <motion.p
                className="small-caps text-[10.5px] tracking-[0.28em]"
                style={{ color: 'rgba(26,23,20,0.5)' }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35, ease: defaultEasing }}
              >
                Chai &amp; Co. · Est. 1971
              </motion.p>
              <motion.div
                style={{ background: 'linear-gradient(to right, transparent, #C9A227, transparent)', height: 1 }}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 220, opacity: 1 }}
                transition={{ duration: 1.1, delay: 0.5, ease: defaultEasing }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
