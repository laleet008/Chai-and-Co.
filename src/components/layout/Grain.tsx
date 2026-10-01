'use client';

import { useMemo } from 'react';
import { useReducedMotion } from '@/lib/useReducedMotion';

export function Grain() {
  const reduced = useReducedMotion();

  const id = useMemo(() => `grain-${Math.random().toString(36).slice(2, 8)}`, []);

  if (reduced) return null;

  return (
    <svg
      aria-hidden
      className="grain-layer"
      width="100%"
      height="100%"
      preserveAspectRatio="none"
    >
      <filter id={id} x="0" y="0" width="100%" height="100%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves="2"
          stitchTiles="stitch"
        />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0
                  0 0 0 0 0
                  0 0 0 0 0
                  0 0 0 0.6 0"
        />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${id})`} />
    </svg>
  );
}
