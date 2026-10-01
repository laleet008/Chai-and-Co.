'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';

type Props = {
  value: number;
  formatter?: (n: number) => string;
  className?: string;
};

function splitDigits(v: number): string[] {
  const formatted = v.toLocaleString('en-NP');
  return [...formatted];
}

export function NumberRoll({ value, formatter, className }: Props) {
  const reduced = useReducedMotion();
  const digits = splitDigits(value);

  if (reduced || !formatter) {
    return (
      <motion.span
        key={value}
        initial={reduced ? {} : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className={className}
      >
        {formatter ? formatter(value) : value}
      </motion.span>
    );
  }

  return (
    <span className={className} aria-label={formatter?.(value) ?? String(value)}>
      {digits.map((d, i) => {
        const isNumber = /^\d$/.test(d);
        if (!isNumber) {
          return (
            <span key={`${i}-${d}`} aria-hidden>
              {d}
            </span>
          );
        }
        const num = parseInt(d, 10);
        return (
          <span
            key={`${i}-${d}-${value}`}
            className="inline-block overflow-hidden align-bottom h-[1em] leading-[1]"
            aria-hidden
          >
            <motion.span
              className="inline-block"
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              transition={{
                duration: 0.55,
                delay: i * 0.03,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <span className="block h-[1em] leading-[1]" aria-hidden>
                {num}
              </span>
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}
