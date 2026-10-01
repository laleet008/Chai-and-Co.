'use client';

import {
  AnimatePresence,
  motion,
} from 'framer-motion';
import { createContext, useContext, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { useReducedMotion } from '@/lib/useReducedMotion';

type AccordionItemCtx = {
  open: boolean;
  toggle: () => void;
  id: string;
};

const Ctx = createContext<AccordionItemCtx | null>(null);

function useAccordionItem() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('Accordion child used outside AccordionItem');
  return ctx;
}

export function Accordion({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn('divide-y divide-ink/10', className)}>{children}</div>;
}

export function AccordionItem({
  value,
  defaultOpen = false,
  children,
}: {
  value: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Ctx.Provider
      value={{
        open,
        toggle: () => setOpen((v) => !v),
        id: value,
      }}
    >
      <div className="py-1">{children}</div>
    </Ctx.Provider>
  );
}

export function AccordionTrigger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { open, toggle, id } = useAccordionItem();
  return (
    <h3>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={`panel-${id}`}
        id={`trigger-${id}`}
        className={cn(
          'w-full flex items-center justify-between gap-4 py-5 text-left',
          className,
        )}
      >
        <span className="font-serif text-xl md:text-2xl tracking-tight">
          {children}
        </span>
        <span
          aria-hidden
          className="shrink-0 w-8 h-8 rounded-full border border-ink/15 flex items-center justify-center"
        >
          <motion.svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            animate={open ? { rotate: 45 } : { rotate: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <path
              d="M7 2v10M2 7h10"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
            />
          </motion.svg>
        </span>
      </button>
    </h3>
  );
}

export function AccordionContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { open, id } = useAccordionItem();
  const reduced = useReducedMotion();

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          id={`panel-${id}`}
          role="region"
          aria-labelledby={`trigger-${id}`}
          initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
          animate={reduced ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
          exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
          transition={{ duration: reduced ? 0.15 : 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            initial={reduced ? {} : { y: -4, opacity: 0 }}
            animate={reduced ? {} : { y: 0, opacity: 1 }}
            exit={{}}
            className={cn('pb-6 font-sans text-ink/75 text-[15.5px] leading-relaxed max-w-2xl', className)}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
