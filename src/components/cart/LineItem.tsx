'use client';

import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import Link from 'next/link';
import { formatPrice } from '@/lib/format';
import { useCartStore, type CartItem } from '@/store/cart';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { cn } from '@/lib/cn';
import { CloseIcon } from '../ui/Icons';

function TinThumb({ accent, size = 64 }: { accent: string; size?: number }) {
  const gid = 'tt-' + accent.slice(1);
  return (
    <svg width={size} height={Math.round(size * 1.35)} viewBox="0 0 100 135" aria-hidden className="shrink-0">
      <defs>
        <linearGradient id={gid + 'g'} x1="0" x2="1">
          <stop offset="0" stopColor={accent} stopOpacity="0.85" />
          <stop offset="0.55" stopColor={accent} />
          <stop offset="1" stopColor={accent} stopOpacity="0.78" />
        </linearGradient>
        <linearGradient id={gid + 'h'} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="0.2" stopColor="#ffffff" stopOpacity="0.02" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.18" />
        </linearGradient>
      </defs>
      <rect x="14" y="20" width="72" height="104" rx="8" fill={'url(#' + gid + 'g)'} />
      <rect x="14" y="20" width="72" height="104" rx="8" fill={'url(#' + gid + 'h)'} />
      <rect x="10" y="12" width="80" height="16" rx="5" fill="#221D18" />
      <rect x="22" y="48" width="56" height="54" rx="3" fill="#F4F0E8" opacity="0.95" />
      <text x="50" y="68" textAnchor="middle" fontFamily="serif" fontSize="8.5" fontWeight="500" fill="#1A1714">
        C &amp; Co.
      </text>
      <text x="50" y="82" textAnchor="middle" fontFamily="sans-serif" fontSize="4.5" letterSpacing="1.1" fill="#1A1714" opacity="0.7">
        ILAM · 1,900M
      </text>
      <line x1="30" y1="88" x2="70" y2="88" stroke="#1A1714" strokeOpacity="0.25" strokeWidth="0.5" />
      <text x="50" y="96" textAnchor="middle" fontFamily="sans-serif" fontSize="5.5" fill="#1A1714" opacity="0.8" fontStyle="italic">
        Single estate
      </text>
    </svg>
  );
}

export function LineItem({
  item,
  isHighlighted = false,
  onHighlightEnd,
}: {
  item: CartItem;
  isHighlighted?: boolean;
  onHighlightEnd?: () => void;
}) {
  const reduced = useReducedMotion();
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const qty = item.qty;
  const total = item.unitPrice * qty;
  const qtyMinusId = 'qtym-' + item.key;
  const qtyPlusId = 'qtyp-' + item.key;

  function step(delta: -1 | 1) {
    const next = Math.max(1, Math.min(20, qty + delta));
    updateQty(item.key, next);
  }

  const highlightAnimation = isHighlighted
    ? {
        backgroundColor: ['rgba(201,162,39,0.12)', 'rgba(201,162,39,0.0)'],
        opacity: 1,
        y: 0,
        transition: {
          backgroundColor: { duration: 1.4, ease: [0.16, 1, 0.3, 1] as any, times: [0, 1] },
          opacity: { duration: 0.3 },
          y: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as any },
        },
        onAnimationComplete: (definition: string) => {
          if (definition === 'animate' && isHighlighted) onHighlightEnd?.();
        },
      }
    : { opacity: 1, y: 0 };

  return (
    <LayoutGroup id={'li-' + item.key}>
      <motion.article
        layout={!reduced}
        layoutRoot={!reduced}
        initial={reduced ? {} : { opacity: 0, y: 8 }}
        animate={highlightAnimation as any}
        exit={
          reduced
            ? { opacity: 0 }
            : { opacity: 0, y: -6, height: 0, marginTop: 0, marginBottom: 0, transition: { duration: 0.35 } }
        }
        transition={{ duration: reduced ? 0.18 : 0.4, ease: [0.16, 1, 0.3, 1] as any }}
        className={cn(
          'group relative grid grid-cols-[auto,1fr] gap-4 py-5 border-b border-ink/8 last:border-b-0',
          isHighlighted ? 'rounded-sm px-2 -mx-2' : '',
        )}
      >
        <Link
          href={'/product/' + item.slug}
          aria-label={'View ' + item.name}
          className="block relative shrink-0"
        >
          <TinThumb accent={item.accent} size={64} />
        </Link>
        <div className="min-w-0 flex flex-col gap-2">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link
                href={'/product/' + item.slug}
                className="font-serif text-[17px] leading-tight tracking-tight text-ink hover:text-clay transition-colors truncate block"
              >
                {item.name}
              </Link>
              <p className="mt-1 small-caps text-[10.5px] tracking-[0.18em] text-ink/50">
                {item.sizeLabel}
              </p>
            </div>
            <button
              type="button"
              aria-label={'Remove ' + item.name}
              onClick={() => removeItem(item.key)}
              className="w-9 h-9 rounded-full flex items-center justify-center border border-ink/10 text-ink/45 hover:text-red-500 hover:border-red-200 hover:bg-red-50/40 transition-colors shrink-0"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-end justify-between gap-4 mt-2">
            <div className="flex items-center h-10 rounded-sm border border-ink/12 bg-paper overflow-hidden">
              <button
                id={qtyMinusId}
                type="button"
                aria-label="Decrease quantity"
                onClick={() => step(-1)}
                className="w-10 h-10 flex items-center justify-center text-ink/55 hover:text-ink hover:bg-ink/5 transition-colors text-lg leading-none"
              >
                −
              </button>
              <AnimatePresence mode="wait">
                <motion.span
                  key={qty}
                  initial={reduced ? {} : { y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={reduced ? {} : { y: -8, opacity: 0 }}
                  transition={{ duration: reduced ? 0.1 : 0.22, ease: [0.16, 1, 0.3, 1] as any }}
                  className="inline-block w-8 text-center font-sans text-[15px] text-ink tabular-nums select-none"
                >
                  {qty}
                </motion.span>
              </AnimatePresence>
              <button
                id={qtyPlusId}
                type="button"
                aria-label="Increase quantity"
                onClick={() => step(1)}
                className="w-10 h-10 flex items-center justify-center text-ink/55 hover:text-ink hover:bg-ink/5 transition-colors text-lg leading-none"
              >
                +
              </button>
            </div>
            <p className="font-serif text-lg text-ink tabular-nums">{formatPrice(total)}</p>
          </div>
        </div>
      </motion.article>
    </LayoutGroup>
  );
}
