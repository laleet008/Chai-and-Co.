'use client';

import {
  motion,
  type HTMLMotionProps,
} from 'framer-motion';
import { useMemo, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { defaultEasing } from '@/lib/motion';

type Props = HTMLMotionProps<'span'> & {
  text: string;
  as?: 'words' | 'chars' | 'both';
  gapPerWord?: number;
  gapPerChar?: number;
  className?: string;
  wrapperClassName?: string;
  children?: ReactNode;
};

export function SplitText({
  text,
  as = 'words',
  gapPerWord = 0.06,
  gapPerChar = 0.02,
  className,
  wrapperClassName,
  ...rest
}: Props) {
  const reduced = useReducedMotion();
  const words = useMemo(() => text.split(' '), [text]);

  if (reduced) {
    return (
      <span className={cn('inline-block', wrapperClassName)}>
        <span className="sr-only">{text}</span>
        <span aria-hidden>{text}</span>
      </span>
    );
  }

  return (
    <motion.span
      className={cn('inline-block', wrapperClassName)}
      {...(rest as any)}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((word, wi) => {
          const chars = [...word];
          const wordDelay = wi * gapPerWord;

          return (
            <span
              key={`${wi}-${word}`}
              className="inline-block overflow-hidden align-top"
              style={{ marginRight: '0.27em' }}
            >
              {(as === 'chars' || as === 'both') ? (
                <motion.span
                  className="inline-block"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ staggerChildren: gapPerChar, delayChildren: wordDelay }}
                >
                  {chars.map((ch, ci) => (
                    <motion.span
                      key={ci}
                      className={cn('inline-block', className)}
                      variants={{
                        hidden: { y: '110%' },
                        show: {
                          y: '0%',
                          transition: { duration: 0.9, ease: defaultEasing },
                        },
                      }}
                    >
                      {ch}
                    </motion.span>
                  ))}
                </motion.span>
              ) : (
                <motion.span
                  className={cn('inline-block', className)}
                  initial={{ y: '110%' }}
                  whileInView={{ y: '0%' }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.9, ease: defaultEasing, delay: wordDelay }}
                >
                  {word}
                </motion.span>
              )}
            </span>
          );
        })}
      </span>
    </motion.span>
  );
}
