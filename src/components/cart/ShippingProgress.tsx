'use client';

import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';
import { formatPrice } from '@/lib/format';
import { FREE_SHIPPING_THRESHOLD, useCartStore } from '@/store/cart';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { defaultEasing } from '@/lib/motion';

export function ShippingProgress() {
  const reduced = useReducedMotion();
  const subtotal = useCartStore((s) => s.subtotal());
  const progress = useCartStore((s) => s.progressToFreeShipping());
  const distance = useCartStore((s) => s.distanceToFreeShipping());
  const reached = progress >= 1;
  void subtotal;

  const spring = useSpring(0, { stiffness: 65, damping: 22, mass: 0.85 });
  useEffect(() => {
    spring.set(progress);
  }, [progress, spring]);

  const pct = useTransform(spring, (v) => {
    const val = Math.min(100, Math.max(0, v * 100));
    return val.toFixed(2) + '%';
  });

  const distText = reached ? '—' : formatPrice(Math.max(0, distance)) + ' more';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[12px] font-sans">
        <span className={reached ? 'text-gold font-medium' : 'text-ink/65'}>
          {reached ? 'Complimentary shipping unlocked' : 'Complimentary shipping'}
        </span>
        <span className="tabular-nums text-ink/60">{distText}</span>
      </div>
      <div className="relative h-1.5 rounded-full bg-ink/8 overflow-hidden">
        <motion.div
          aria-hidden
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: pct,
            backgroundColor: reached ? '#C9A227' : '#6B8F5E',
          }}
          transition={{ duration: reduced ? 0.1 : 0.5, ease: defaultEasing }}
        />
      </div>
      <p className="text-[11px] text-ink/40 small-caps tracking-[0.18em]">
        Orders over {formatPrice(FREE_SHIPPING_THRESHOLD)} ship free within Nepal
      </p>
    </div>
  );
}

export function EmptyCupSVG() {
  return (
    <div className="mx-auto flex flex-col items-center justify-center py-20 px-10 text-center">
      <svg width="148" height="148" viewBox="0 0 148 148" aria-hidden>
        <defs>
          <linearGradient id="cup-bd" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#1A1714" stopOpacity="0.1" />
            <stop offset="1" stopColor="#1A1714" stopOpacity="0.35" />
          </linearGradient>
          <linearGradient id="cup-liq" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#C9A227" stopOpacity="0.9" />
            <stop offset="1" stopColor="#B3541E" stopOpacity="0.95" />
          </linearGradient>
        </defs>
        <g>
          <motion.path
            d="M30 76 C 32 105 48 114 74 114 C 100 114 116 105 118 76 Z"
            fill="#F4F0E8"
            stroke="url(#cup-bd)"
            strokeWidth="2"
          />
          <path d="M30 76 Q 36 72 74 72 Q 112 72 118 76 Q 116 80 74 80 Q 32 80 30 76 Z" fill="url(#cup-liq)" />
          <path d="M118 82 Q 138 82 138 98 Q 138 114 116 114" fill="none" stroke="#1A1714" strokeOpacity="0.35" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="74" cy="122" rx="40" ry="4" fill="#1A1714" opacity="0.12" />
          <motion.path
            d="M52 64 Q 48 48 56 38 Q 50 54 60 44 Q 56 56 68 42"
            fill="none"
            stroke="#1A1714"
            strokeOpacity="0.3"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: [0.1, 0.55, 0.1], y: [0, -4, -10] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.path
            d="M78 62 Q 76 44 84 32 Q 78 52 88 40 Q 84 54 94 38"
            fill="none"
            stroke="#C9A227"
            strokeOpacity="0.55"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: [0, 0.5, 0.15], y: [0, -6, -14] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
          />
        </g>
      </svg>
      <p className="font-serif text-xl text-ink/75 mt-6">No teas in your cup.</p>
      <p className="font-sans text-[14px] text-ink/50 mt-2 max-w-[28ch]">
        Your tin awaits. Fill it from the shop, and let it rest for a moment longer before steeping.
      </p>
    </div>
  );
}
