'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { defaultEasing } from '@/lib/motion';

function isCoarsePointer(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(pointer: coarse)').matches;
}

export function CustomCursor() {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [coarse, setCoarse] = useState(true);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const ringX = useSpring(mouseX, { stiffness: 220, damping: 22, mass: 0.4 });
  const ringY = useSpring(mouseY, { stiffness: 220, damping: 22, mass: 0.4 });

  const ringScale = useSpring(1, { stiffness: 260, damping: 20, mass: 0.35 });
  const ringOpacity = useSpring(0, { stiffness: 180, damping: 20 });
  const dotScale = useSpring(1, { stiffness: 320, damping: 22, mass: 0.25 });
  const ringColor = useMotionValue('rgba(26,23,20,0.6)');

  useEffect(() => {
    setMounted(true);
    setCoarse(isCoarsePointer());
    const mq = typeof window !== 'undefined'
      ? window.matchMedia('(pointer: coarse)')
      : null;
    const onChange = () => setCoarse(isCoarsePointer());
    if (mq && typeof (mq as MediaQueryList).addEventListener === 'function') {
      (mq as MediaQueryList).addEventListener('change', onChange);
    }
    return () => {
      if (mq && typeof (mq as MediaQueryList).removeEventListener === 'function') {
        (mq as MediaQueryList).removeEventListener('change', onChange);
      }
    };
  }, []);

  useEffect(() => {
    if (reduced || coarse || !mounted) return;

    let over = false;
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!over) ringOpacity.set(0.55);
    };
    const onDown = () => {
      ringScale.set(over ? 1.3 : 0.6);
      dotScale.set(0.8);
    };
    const onUp = () => {
      ringScale.set(over ? 1.6 : 1);
      dotScale.set(1);
    };
    const onLeave = () => {
      ringOpacity.set(0);
    };
    const onOver = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const interactive = t.closest('a, button, [role="button"], input, select, textarea, [data-cursor-hover], label');
      if (interactive && !over) {
        over = true;
        ringScale.set(1.6);
        ringOpacity.set(0.9);
        ringColor.set('rgba(201,162,39,0.9)');
      } else if (!interactive && over) {
        over = false;
        ringScale.set(1);
        ringOpacity.set(0.55);
        ringColor.set('rgba(26,23,20,0.6)');
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseover', onOver, true);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseover', onOver, true);
    };
  }, [reduced, coarse, mounted, mouseX, mouseY, ringScale, ringOpacity, dotScale, ringColor]);

  if (reduced || coarse || !mounted) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[140]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: defaultEasing }}
    >
      <motion.div
        className="absolute left-0 top-0 rounded-full"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          width: 34,
          height: 34,
          border: '1px solid currentColor',
          color: ringColor,
          opacity: ringOpacity,
          scale: ringScale,
        }}
      />
      <motion.div
        className="absolute left-0 top-0 rounded-full"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
          width: 6,
          height: 6,
          background: '#1A1714',
          scale: dotScale,
        }}
      />
    </motion.div>
  );
}
