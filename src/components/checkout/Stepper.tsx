'use client';

import { motion } from 'framer-motion';
import { defaultEasing } from '@/lib/motion';
import { useReducedMotion } from '@/lib/useReducedMotion';

type Step = { no: 1 | 2 | 3; label: string };

export function CheckoutStepper({ steps, step }: { steps: Step[]; step: 1 | 2 | 3 }) {
  const reduced = useReducedMotion();
  return (
    <ol className="flex items-center gap-2 w-full">
      {steps.map((s, i) => {
        const done = step > s.no;
        const active = step === s.no;
        const progress = done ? 1 : 0;
        return (
          <li key={s.no} className="flex items-center gap-3 flex-1 min-w-0">
            <div className="shrink-0 relative">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: done ? '#C9A227' : 'transparent',
                  borderColor: done || active ? '#C9A227' : 'rgba(26,23,20,0.2)',
                  color: done ? '#1A1714' : active ? '#C9A227' : 'rgba(26,23,20,0.45)',
                }}
                transition={{ duration: reduced ? 0.1 : 0.5, ease: defaultEasing }}
                className="w-10 h-10 rounded-full border-2 flex items-center justify-center font-serif bg-paper"
              >
                {done ? (
                  <motion.svg
                    key="check"
                    initial={reduced ? {} : { opacity: 0, scale: 0.6, y: 2 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: reduced ? 0.12 : 0.35, ease: defaultEasing }}
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-5 h-5"
                    aria-hidden
                  >
                    <motion.path
                      d="M6 12.5 L10.3 16.8 L18.2 8.6"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: reduced ? 0.1 : 0.55, delay: reduced ? 0 : 0.05, ease: defaultEasing }}
                    />
                  </motion.svg>
                ) : (
                  <span aria-hidden>{s.no}</span>
                )}
              </motion.div>
              {active && !reduced && (
                <motion.span
                  aria-hidden
                  className="absolute inset-0 rounded-full border-2 border-gold/70"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: [0.7, 0, 0], scale: [0.95, 1.4, 1.4] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: defaultEasing }}
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="small-caps text-[10px] tracking-[0.16em] text-ink/40">Step {s.no}</p>
              <p className="font-serif text-base md:text-lg leading-tight truncate">{s.label}</p>
            </div>
            {i < steps.length - 1 ? (
              <div className="relative flex-1 h-px bg-ink/10 ml-2 rounded-full overflow-hidden">
                <motion.div
                  initial={false}
                  aria-hidden
                  className="absolute inset-y-0 left-0 bg-gold"
                  animate={{ width: progress * 100 + '%' }}
                  transition={{ duration: reduced ? 0.1 : 0.6, ease: defaultEasing }}
                />
              </div>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
