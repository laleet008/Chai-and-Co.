'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { defaultEasing } from '@/lib/motion';
import { cn } from '@/lib/cn';

export type MagneticButtonProps = {
  children: ReactNode;
  strength?: number;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  id?: string;
  role?: string;
  'aria-label'?: string;
};

export function MagneticButton({
  children,
  strength = 18,
  className,
  style,
  onClick,
  id,
  role,
  'aria-label': ariaLabel,
}: MagneticButtonProps) {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const tx = useMotionValue(0);
  const ty = useMotionValue(0);
  const sx = useSpring(tx, { stiffness: 220, damping: 20, mass: 0.5 });
  const sy = useSpring(ty, { stiffness: 220, damping: 20, mass: 0.5 });

  useEffect(() => {
    if (reduced) return;
    const coarse = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
    if (coarse) return;
    const el = containerRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const radius = Math.max(rect.width, rect.height) * 1.1;
      if (dist < radius) {
        const norm = 1 - Math.min(1, dist / radius);
        tx.set(dx * norm * (strength / 100));
        ty.set(dy * norm * (strength / 100));
      } else {
        tx.set(0);
        ty.set(0);
      }
    };
    const onLeave = () => {
      tx.set(0);
      ty.set(0);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [reduced, strength, tx, ty]);

  if (reduced) {
    return (
      <div className={className} style={style} onClick={onClick} id={id} role={role} aria-label={ariaLabel}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      className={cn('inline-block', className)}
      style={{ x: sx, y: sy, ...style }}
      transition={{ ease: defaultEasing, duration: 0.25 }}
      onClick={onClick}
      id={id}
      role={role}
      aria-label={ariaLabel}
    >
      {children}
    </motion.div>
  );
}
