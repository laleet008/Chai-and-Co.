import type { Transition, Variants } from 'framer-motion';

export const defaultEasing = [0.16, 1, 0.3, 1] as const;

export const t = {
  section: { duration: 0.9, ease: defaultEasing } satisfies Transition,
  sectionSlow: { duration: 1.2, ease: defaultEasing } satisfies Transition,
  ui: { duration: 0.28, ease: defaultEasing } satisfies Transition,
  uiFast: { duration: 0.18, ease: defaultEasing } satisfies Transition,
  bounce: { type: 'spring', stiffness: 380, damping: 18, mass: 0.6 } satisfies Transition,
};

export const v = {
  hiddenOpacity: { opacity: 0 },
  showOpacity: { opacity: 1 },

  fadeUp: {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: t.section },
  } satisfies Variants,

  fadeUpSmall: {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: t.ui },
  } satisfies Variants,

  maskUp: {
    hidden: { y: '110%' },
    show: { y: '0%', transition: t.section },
  } satisfies Variants,

  scaleIn: {
    hidden: { opacity: 0, scale: 0.92 },
    show: { opacity: 1, scale: 1, transition: t.section },
  } satisfies Variants,

  staggerChildren: {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  } satisfies Variants,

  staggerChildrenFast: {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.04, delayChildren: 0.02 },
    },
  } satisfies Variants,

  slideInRight: {
    hidden: { x: 40, opacity: 0 },
    show: { x: 0, opacity: 1, transition: t.section },
    exit: { x: -40, opacity: 0, transition: t.section },
  } satisfies Variants,

  slideInLeft: {
    hidden: { x: -40, opacity: 0 },
    show: { x: 0, opacity: 1, transition: t.section },
    exit: { x: 40, opacity: 0, transition: t.section },
  } satisfies Variants,

  wipeUp: {
    hidden: { y: '100%' },
    show: { y: '0%', transition: { duration: 0.7, ease: defaultEasing } },
    exit: { y: '-100%', transition: { duration: 0.6, ease: defaultEasing } },
  } satisfies Variants,
};

export function staggerChildrenFactory(stagger: number, delay: number = 0.05): Variants {
  return {
    hidden: {},
    show: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };
}
