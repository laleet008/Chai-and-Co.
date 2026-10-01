'use client';

import {
  motion,
  useInView,
  AnimatePresence,
  type HTMLMotionProps,
  type Variants,
} from 'framer-motion';
import { forwardRef, useRef, type ReactNode, type ElementType } from 'react';
import { cn } from '@/lib/cn';
import { v, t } from '@/lib/motion';
import { useReducedMotion } from '@/lib/useReducedMotion';

type Variant = 'fadeUp' | 'fadeUpSmall' | 'maskUp' | 'scaleIn';

type Props = HTMLMotionProps<'div'> & {
  as?: ElementType;
  variant?: Variant;
  delay?: number;
  staggerChildren?: boolean;
  childVariant?: Variant;
  threshold?: number;
  once?: boolean;
  className?: string;
  children?: ReactNode;
  amount?: number;
};

const variantMap: Record<Variant, Variants> = {
  fadeUp: v.fadeUp,
  fadeUpSmall: v.fadeUpSmall,
  maskUp: v.maskUp,
  scaleIn: v.scaleIn,
};

export const Reveal = forwardRef<HTMLDivElement, Props>(function Reveal(
  {
    as: Tag = 'div',
    variant = 'fadeUp',
    delay = 0,
    staggerChildren = false,
    childVariant,
    threshold = 0.25,
    once = true,
    className,
    children,
    amount,
    ...rest
  },
  ref,
) {
  const reduced = useReducedMotion();
  const localRef = useRef<HTMLDivElement | null>(null);

  const setRefs = (node: HTMLDivElement | null) => {
    localRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    }
  };

  const inView = useInView(localRef, {
    amount: amount ?? 'some',
    once,
    margin: `0px 0px -${Math.round(threshold * 100)}% 0px` as any,
  });

  if (reduced) {
    return (
      <Tag ref={setRefs} className={className} {...rest}>
        {children}
      </Tag>
    );
  }

  const MotionTag = motion(Tag as any);

  const baseVariants: Variants = staggerChildren
    ? { ...v.staggerChildren }
    : { hidden: {}, show: {} };

  const chosenVariant = variantMap[variant];

  const finalVariants: Variants = {
    hidden: { ...(baseVariants.hidden ?? {}), ...(chosenVariant.hidden ?? {}) },
    show: {
      ...(baseVariants.show ?? {}),
      ...(chosenVariant.show ?? {}),
      transition: {
        ...(chosenVariant.show as any)?.transition,
        delay,
      },
    },
  };

  const inner = childVariant ? (
    <motion.div
      variants={variantMap[childVariant]}
      className={variant === 'maskUp' ? 'overflow-hidden inline-block' : ''}
    >
      {children}
    </motion.div>
  ) : (
    variant === 'maskUp' ? (
      <span className="inline-block overflow-hidden">{children}</span>
    ) : (
      children
    )
  );

  return (
    <AnimatePresence>
      <MotionTag
        ref={setRefs}
        initial="hidden"
        animate={inView ? 'show' : 'hidden'}
        variants={finalVariants}
        className={cn(variant === 'maskUp' && 'overflow-hidden', className)}
        transition={t.section}
        {...rest}
      >
        {inner}
      </MotionTag>
    </AnimatePresence>
  );
});
