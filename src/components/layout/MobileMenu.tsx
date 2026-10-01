'use client';

import {
  AnimatePresence,
  motion,
} from 'framer-motion';
import Link from 'next/link';
import { useEffect } from 'react';
import { CloseIcon, LeafGlyph } from '../ui/Icons';
import { useReducedMotion } from '@/lib/useReducedMotion';

const links = [
  { href: '/shop', label: 'Shop', sub: 'Four single-estate teas' },
  { href: '/story', label: 'Story', sub: 'The estate, the process, the people' },
  { href: '/journal', label: 'Journal', sub: 'Writing on altitude, brewing, taste' },
];

type Props = {
  open: boolean;
  onClose: () => void;
};

export function MobileMenu({ open, onClose }: Props) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile menu"
          id="mobile-menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.15 : 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 bg-night text-paper"
        >
          <div className="absolute top-5 left-0 right-0 mx-auto w-[min(92%,1100px)] flex items-center justify-between h-14">
            <Link
              href="/"
              onClick={onClose}
              className="font-sans text-[15px] flex items-center gap-2"
            >
              <LeafGlyph className="w-5 h-5 text-gold" />
              <span className="font-serif font-medium">Chai &amp; Co.</span>
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-paper/20 hover:bg-paper/10 transition-colors"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="absolute inset-0 flex flex-col justify-center px-8">
            <motion.nav
              initial={reduced ? {} : 'hidden'}
              animate="show"
              variants={
                reduced
                  ? {}
                  : {
                      show: {
                        transition: { staggerChildren: 0.08, delayChildren: 0.2 },
                      },
                    }
              }
              aria-label="Mobile site navigation"
              className="space-y-2"
            >
              {links.map((l) => (
                <motion.div
                  key={l.href}
                  variants={
                    reduced
                      ? {}
                      : {
                          hidden: { opacity: 0, y: 24 },
                          show: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                          },
                        }
                  }
                >
                  <Link
                    href={l.href}
                    onClick={onClose}
                    className="group block py-3 border-b border-paper/10"
                  >
                    <div className="flex items-end justify-between gap-6">
                      <span className="font-serif text-4xl tracking-tight group-hover:text-gold transition-colors">
                        {l.label}
                      </span>
                      <span className="small-caps text-paper/40 text-[10px] pb-3 hidden sm:block">
                        {l.sub}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.nav>
          </div>

          <motion.div
            aria-hidden
            className="absolute right-6 bottom-8 md:right-12 md:bottom-12 opacity-[0.06] select-none pointer-events-none"
            initial={reduced ? { opacity: 0.04 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 0.06, y: 0 }}
            transition={{ duration: reduced ? 0.2 : 1.2, delay: reduced ? 0 : 0.4 }}
          >
            <span className="font-serif leading-[0.85] tracking-tighter text-[34vw] md:text-[22vw]">
              Chai
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
