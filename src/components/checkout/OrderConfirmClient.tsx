'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';

type Props = {
  steps: { label: string }[];
};

export default function OrderConfirmClient({ steps }: Props) {
  const reduced = useReducedMotion();
  return (
    <div className="grid grid-cols-4 gap-3 items-start">
      {steps.map((s, i) => {
        const active = i === 0;
        return (
          <div key={s.label} className="relative flex flex-col items-center">
            <div className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center border border-ink/15 bg-paper shrink-0">
              {active ? (
                <motion.div
                  initial={reduced ? {} : { scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.3,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={
                    'absolute inset-0 rounded-full order-ring-active'
                  }
                />
              ) : null}
              <span
                className={
                  'font-serif text-lg ' + (active ? 'text-gold' : 'text-ink/40')
                }
              >
                {i + 1}
              </span>
            </div>
            <p className="small-caps text-[10px] mt-3 text-center">
              {s.label}
            </p>
            {i < steps.length - 1 ? (
              <div className="absolute left-[calc(50%+24px)] top-6 h-px w-full bg-ink/10">
                <div className="h-full" />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
