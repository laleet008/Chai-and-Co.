'use client';

import {
  motion,
  AnimatePresence,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { CartIcon, MenuIcon, SearchIcon, WordmarkMark } from '../ui/Icons';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { useUIStore } from '@/store/ui';
import { useCartStore } from '@/store/cart';
import { CartBadgeWithPulse } from '../cart/FlyToCart';

type NavLink = { href: string; label: string };

const links: NavLink[] = [
  { href: '/shop', label: 'Shop' },
  { href: '/story', label: 'Story' },
  { href: '/journal', label: 'Journal' },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { scrollY } = useScroll();
  const reduced = useReducedMotion();
  const toggleMobileMenu = useUIStore((s) => s.toggleMobileMenu);
  const mobileMenuOpen = useUIStore((s) => s.mobileMenuOpen);
  const openCart = useUIStore((s) => s.openCartDrawer);
  const itemCount = useCartStore((s) => s.itemCount());

  useMotionValueEvent(scrollY, 'change', (v) => {
    if (reduced) {
      setScrolled(v > 8);
      return;
    }
    setScrolled(v > 48);
  });

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all',
        reduced
          ? 'py-4 bg-paper/95 backdrop-blur-md border-b border-ink/10'
          : 'py-5',
      )}
    >
      <AnimatePresence initial={false}>
        {!reduced && scrolled && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            aria-hidden
            className="absolute top-3 left-1/2 -translate-x-1/2 w-[min(92%,1100px)] h-14 rounded-full border border-ink/10 bg-paper/80 backdrop-blur-xl shadow-[0_10px_40px_-20px_rgba(26,23,20,0.3)]"
          />
        )}
      </AnimatePresence>

      <div className="relative mx-auto w-[min(92%,1100px)] h-14 flex items-center justify-between">
        <Link
          href="/"
          className="text-ink font-sans text-[15px] z-10 hover:opacity-80 transition-opacity"
          aria-label="Chai & Co. home"
        >
          <WordmarkMark />
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-10 z-10"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="relative small-caps tracking-wider text-[12px] text-ink/80 hover:text-ink transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 z-10">
          <div className="relative h-10 items-center hidden sm:flex">
            <AnimatePresence initial={false} mode="wait">
              {searchOpen ? (
                <motion.input
                  key="input"
                  initial={{ width: 0, minWidth: 0, paddingRight: 0, opacity: 0 }}
                  animate={{ width: 220, opacity: 1 }}
                  exit={{ width: 0, minWidth: 0, opacity: 0, paddingRight: 0 }}
                  transition={{ duration: reduced ? 0.15 : 0.45, ease: [0.16, 1, 0.3, 1] }}
                  type="search"
                  placeholder="Search teas, notes…"
                  aria-label="Search"
                  autoFocus
                  onBlur={() => setSearchOpen(false)}
                  className="h-10 bg-cream rounded-full pl-10 pr-4 outline-none border border-ink/10 focus:border-gold/60 focus:ring-2 focus:ring-gold/20 font-sans text-[14px] text-ink placeholder:text-ink/40 absolute right-0"
                />
              ) : null}
            </AnimatePresence>
            <button
              type="button"
              aria-label={searchOpen ? 'Close search' : 'Search'}
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((v) => !v)}
              className="relative z-[1] w-10 h-10 rounded-full flex items-center justify-center text-ink/80 hover:text-ink hover:bg-cream transition-colors"
            >
              <SearchIcon className="w-5 h-5" />
            </button>
          </div>
          <button
            type="button"
            aria-label={`Open cart · ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
            onClick={openCart}
            className="relative w-10 h-10 rounded-full flex items-center justify-center text-ink/80 hover:text-ink hover:bg-cream transition-colors"
          >
            <CartBadgeWithPulse count={itemCount}>
              <CartIcon className="w-5 h-5" />
            </CartBadgeWithPulse>
          </button>
          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            onClick={toggleMobileMenu}
            className="w-10 h-10 rounded-full flex items-center justify-center text-ink/80 hover:text-ink hover:bg-cream transition-colors md:hidden"
          >
            <MenuIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
