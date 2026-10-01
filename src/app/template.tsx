'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { LeafGlyph } from '@/components/ui/Icons';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { defaultEasing } from '@/lib/motion';

type Dir = 1 | -1;

export default function Template({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const router = useRouter();
  const lastPathRef = useRef<string | null>(null);
  const [dir, setDir] = useState<Dir>(1);

  useEffect(() => {
    if (lastPathRef.current && lastPathRef.current !== pathname) {
      const prev = lastPathRef.current;
      const next = pathname ?? '';
      const history = window.history;
      const action: any = (history as any).action;
      if (action === 'POP') {
        setDir(-1);
      } else {
        const depthPrev = prev.split('/').filter(Boolean).length;
        const depthNext = next.split('/').filter(Boolean).length;
        setDir(depthNext >= depthPrev ? 1 : -1);
      }
    }
    lastPathRef.current = pathname ?? null;
  }, [pathname]);

  useEffect(() => {
    if (reduced) return;
    let startX = 0;
    let startY = 0;
    let tracking = false;
    const threshold = 90;
    const maxRatio = 0.45;

    const onStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      tracking = true;
    };
    const onEnd = (e: TouchEvent) => {
      if (!tracking) return;
      tracking = false;
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if (Math.abs(dx) < threshold) return;
      if (Math.abs(dy) > Math.abs(dx) * maxRatio) return;
      if (dx > 0 && startX < Math.min(window.innerWidth * 0.22, 60)) {
        try {
          window.history.back();
          void router;
        } catch {
          /* noop */
        }
      } else if (dx < 0 && startX > window.innerWidth - Math.min(window.innerWidth * 0.22, 60)) {
        try {
          window.history.forward();
        } catch {
          /* noop */
        }
      }
    };
    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchend', onEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchend', onEnd);
    };
  }, [reduced, router]);

  if (reduced) return <>{children}</>;

  const fromX = dir === 1 ? 32 : -32;
  const toX = dir === 1 ? -32 : 32;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname ?? 'root'}
        initial={{ opacity: 0, x: fromX }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: toX }}
        transition={{ duration: 0.45, ease: defaultEasing }}
        className="relative min-h-[100svh]"
      >
        <motion.div
          className="fixed inset-0 z-[60] bg-paper pointer-events-none"
          style={{ transformOrigin: dir === 1 ? 'left bottom' : 'right top' }}
          initial={{ scaleY: 1, opacity: 0.98 }}
          animate={{ scaleY: 0, opacity: 0.6 }}
          exit={{ scaleY: 0 }}
          transition={{ duration: 0.72, ease: defaultEasing }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.9, 1, 1],
                transition: { duration: 0.55, times: [0, 0.42, 1] },
              }}
            >
              <LeafGlyph className="w-12 h-12" style={{ color: '#B3541E' }} />
            </motion.div>
          </div>
        </motion.div>
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
