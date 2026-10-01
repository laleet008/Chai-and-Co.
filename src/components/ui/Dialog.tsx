'use client';

import {
  AnimatePresence,
  motion,
  type HTMLMotionProps,
  type Variants,
} from 'framer-motion';
import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useRef,
  type ReactElement,
  type ReactNode,
} from 'react';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { defaultEasing } from '@/lib/motion';
import { cn } from '@/lib/cn';
import { CloseIcon } from './Icons';

type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  role?: 'dialog' | 'alertdialog';
  labelledby?: string;
  describedby?: string;
  side?: 'right' | 'bottom' | 'center';
  widthClass?: string;
  backdrop?: boolean;
  className?: string;
};

const SIDE_VARIANTS: Record<string, Variants> = {
  right: {
    hidden: { x: '100%' },
    show: { x: '0%' },
  },
  bottom: {
    hidden: { y: '100%' },
    show: { y: '0%' },
  },
  center: {
    hidden: { y: 16, opacity: 0, scale: 0.98 },
    show: { y: 0, opacity: 1, scale: 1 },
  },
};

export function Dialog({
  open,
  onClose,
  children,
  role = 'dialog',
  labelledby,
  describedby,
  side = 'right',
  widthClass = 'w-full md:w-[480px]',
  backdrop = true,
  className,
}: Props) {
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descId = useId();
  const lastFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const active = document.activeElement as HTMLElement | null;
    if (active && active !== document.body) {
      triggerRef.current = active;
      lastFocusRef.current = active;
    }
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    const scrollbarW =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbarW > 0) document.body.style.paddingRight = `${scrollbarW}px`;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
      if (e.key === 'Tab' && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])',
        );
        if (!focusables.length) return;
        const first = focusables[0]!;
        const last = focusables[focusables.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener('keydown', onKey);
    const focusTimer = window.setTimeout(() => {
      const panel = panelRef.current;
      const target =
        panel?.querySelector<HTMLElement>(
          'button:not([disabled]),input,select,textarea,[data-focus-first]',
        ) || panel;
      target?.focus?.();
    }, reduced ? 10 : 60);
    return () => {
      document.removeEventListener('keydown', onKey);
      window.clearTimeout(focusTimer);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
      lastFocusRef.current?.focus?.();
    };
  }, [open, onClose, reduced]);

  const wrapperClass =
    side === 'center'
      ? 'fixed inset-0 z-50 flex items-center justify-center p-4'
      : side === 'right'
        ? 'fixed inset-0 z-50 flex justify-end'
        : 'fixed inset-0 z-50 flex items-end justify-center';

  return (
    <AnimatePresence>
      {open && (
        <div className={wrapperClass} aria-live="polite">
          {backdrop && (
            <motion.div
              key="backdrop"
              className={cn(
                'absolute inset-0',
                'bg-ink/55 backdrop-blur-[4px]',
                side === 'bottom' ? 'md:hidden' : '',
              )}
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: reduced ? 0.12 : 0.3,
                ease: defaultEasing,
              }}
              onClick={onClose}
            />
          )}
          <motion.aside
            key="panel"
            ref={panelRef as any}
            role={role}
            aria-modal="true"
            aria-labelledby={labelledby || titleId}
            aria-describedby={describedby || descId}
            initial={reduced ? {} : 'hidden'}
            animate="show"
            exit={reduced ? { opacity: 0 } : 'hidden'}
            variants={SIDE_VARIANTS[side]}
            transition={{
              duration: reduced ? 0.15 : 0.42,
              ease: defaultEasing,
            }}
            className={cn(
              widthClass,
              'relative h-[100dvh] bg-paper text-ink shadow-[0_20px_80px_-12px_rgba(26,23,20,0.35)]',
              'flex flex-col',
              side === 'bottom' ? 'h-[88dvh] md:h-[100dvh]' : '',
              className,
            )}
          >
            {children}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

export function DialogHeader({
  title,
  onClose,
  eyebrow,
}: {
  title: string;
  onClose: () => void;
  eyebrow?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 md:px-8 md:pt-8 md:pb-6 border-b border-ink/8">
      <div>
        {eyebrow && (
          <p className="small-caps text-[10px] tracking-[0.24em] text-ink/45 mb-1">
            {eyebrow}
          </p>
        )}
        <h2 id="cart-drawer-title" className="font-serif text-2xl md:text-3xl tracking-tight text-ink">
          {title}
        </h2>
      </div>
      <button
        type="button"
        aria-label="Close drawer"
        onClick={onClose}
        className="w-10 h-10 rounded-full flex items-center justify-center border border-ink/10 hover:bg-ink/5 transition-colors shrink-0 -mt-0.5"
      >
        <CloseIcon className="w-5 h-5 text-ink/70" />
      </button>
    </div>
  );
}

type CloseButtonProps = { onClick: () => void } & HTMLMotionProps<'button'>;

export function DialogCloseButton({ onClick, className, ...rest }: CloseButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label="Close"
      className={cn(
        'w-10 h-10 rounded-full flex items-center justify-center border border-ink/10 hover:bg-ink/5 transition-colors shrink-0',
        className,
      )}
      {...rest}
    >
      <CloseIcon className="w-5 h-5 text-ink/70" />
    </motion.button>
  );
}

export function DialogBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex-1 overflow-y-auto overscroll-contain',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function DialogFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'px-6 md:px-8 py-5 md:py-6 border-t border-ink/8 bg-paper',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function TrapFocusTarget({
  children,
  ...props
}: {
  children: ReactElement;
} & HTMLMotionProps<any>) {
  if (!isValidElement(children)) return children;
  return cloneElement<any>(children, { ...props, tabIndex: -1, 'data-focus-first': true });
}
