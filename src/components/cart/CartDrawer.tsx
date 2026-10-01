'use client';

import {
  AnimatePresence,
  motion,
} from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from '../ui/Dialog';
import { LineItem } from './LineItem';
import { EmptyCupSVG, ShippingProgress } from './ShippingProgress';
import { useCartStore, type CartItem } from '@/store/cart';
import { useUIStore } from '@/store/ui';
import { formatPrice } from '@/lib/format';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { NumberRoll } from '../ui/NumberRoll';
import { ArrowIcon, LeafGlyph } from '../ui/Icons';
import { Button } from '../ui/Button';

type PromoState = 'idle' | 'invalid' | 'applied';

export function CartDrawer() {
  const open = useUIStore((s) => s.cartDrawerOpen);
  const close = useUIStore((s) => s.closeCartDrawer);
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const discount = useCartStore((s) => s.discount());
  const shipping = useCartStore((s) => s.shipping());
  const total = useCartStore((s) => s.total());
  const promo = useCartStore((s) => s.promo);
  const applyPromo = useCartStore((s) => s.applyPromo);
  const reduced = useReducedMotion();
  const [highlightKey, setHighlightKey] = useState<string | null>(null);
  const [promoInput, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState<{ text: string; state: PromoState }>({ text: '', state: 'idle' });
  const promoFieldRef = useRef<HTMLInputElement | null>(null);

  function queueHighlight(key: string) {
    setHighlightKey(key);
  }

  useEffect(() => {
    function onCartFly(e: Event) {
      const custom = e as CustomEvent<{ key: string }>;
      if (custom.detail?.key) {
        setHighlightKey(custom.detail.key);
        useUIStore.getState().openCartDrawer();
        setTimeout(() => {
          const panel = document.querySelector<HTMLElement>('aside[role="dialog"],aside[role="alertdialog"]');
          panel?.scrollTo?.({ top: 0, behavior: 'smooth' });
        }, 360);
      }
    }
    window.addEventListener('cart:fly-complete', onCartFly as EventListener);
    return () => window.removeEventListener('cart:fly-complete', onCartFly as EventListener);
  }, []);

  function onApplyPromo(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = promoInput.trim().toUpperCase();
    if (!trimmed) return;
    const res = applyPromo(trimmed);
    if (res.ok) {
      setPromoMsg({ text: `${res.promo === 'CHAI10' ? '10% off applied' : 'Complimentary shipping applied'}.`, state: 'applied' });
      setPromoInput('');
    } else {
      setPromoMsg({ text: res.error, state: 'invalid' });
      promoFieldRef.current?.setCustomValidity(res.error);
      promoFieldRef.current?.reportValidity();
      if (!reduced) {
        const field = promoFieldRef.current;
        if (field) {
          field.animate(
            [
              { transform: 'translateX(0)' },
              { transform: 'translateX(-4px)' },
              { transform: 'translateX(4px)' },
              { transform: 'translateX(-3px)' },
              { transform: 'translateX(3px)' },
              { transform: 'translateX(0)' },
            ],
            { duration: 380, easing: 'ease' },
          );
        }
      }
    }
  }

  const orderRow = (
    <div className="space-y-2 text-sm font-sans text-ink/80">
      <div className="flex justify-between">
        <span>Subtotal</span>
        <span className="tabular-nums text-ink">
          <NumberRoll value={subtotal} formatter={formatPrice} />
        </span>
      </div>
      <AnimatePresence initial={false}>
        {discount > 0 && (
          <motion.div
            key="discount"
            initial={reduced ? {} : { opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: reduced ? 0.15 : 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-between text-gold"
          >
            <span>
              {promo === 'CHAI10' ? 'Discount (CHAI10)' : 'Shipping (MIST)'}
            </span>
            <span className="tabular-nums">
              −<NumberRoll value={discount} formatter={formatPrice} />
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex justify-between">
        <span>Shipping</span>
        <span className="tabular-nums text-ink">
          {shipping === 0 ? 'Complimentary' : formatPrice(shipping)}
        </span>
      </div>
      <div className="pt-3 mt-3 border-t border-ink/10 flex items-end justify-between gap-6">
        <span className="small-caps text-[11px] tracking-[0.2em] text-ink/55">
          Total · NPR
        </span>
        <span className="font-serif text-2xl tabular-nums text-ink">
          <NumberRoll value={total} formatter={formatPrice} />
        </span>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onClose={close} side="right" widthClass="w-full md:w-[480px]" role="dialog" labelledby="cart-drawer-title">
      <DialogHeader eyebrow="Your bag" title={`${items.length} ${items.length === 1 ? 'tin' : 'tins'}`} onClose={close} />
      <DialogBody className="px-6 md:px-8">
        {items.length === 0 ? (
          <>
            <EmptyCupSVG />
            <div className="mx-auto pb-14 px-6">
              <Link href="/shop" className="block">
                <Button variant="primary" size="lg" fullWidth onClick={close} iconRight={<ArrowIcon className="w-4 h-4 -rotate-45" />}>
                  Browse the collection
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="pb-6">
            <ShippingProgress />
            <div className="mt-8">
              <AnimatePresence initial={false} mode="popLayout">
                {items.map((item: CartItem) => (
                  <LineItem
                    key={item.key}
                    item={item}
                    isHighlighted={highlightKey === item.key}
                    onHighlightEnd={() => setHighlightKey(null)}
                  />
                ))}
              </AnimatePresence>
            </div>
            <form
              onSubmit={onApplyPromo}
              noValidate
              className="mt-8 pt-6 border-t border-ink/8 space-y-2"
            >
              <div className="flex items-center justify-between">
                <label htmlFor="cart-promo" className="small-caps text-[10.5px] tracking-[0.2em] text-ink/55">
                  Promo code
                </label>
                {promoMsg.state !== 'idle' && (
                  <motion.span
                    initial={reduced ? {} : { opacity: 0, y: -2 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={
                      'text-[12px] ' +
                      (promoMsg.state === 'applied' ? 'text-gold' : 'text-red-500')
                    }
                  >
                    {promoMsg.text}
                  </motion.span>
                )}
              </div>
              <div className="flex items-stretch gap-2 rounded-sm overflow-hidden border border-ink/12 focus-within:border-gold/60 transition-colors">
                <LeafGlyph className="w-4 h-4 ml-4 text-ink/35 self-center shrink-0" aria-hidden />
                <input
                  id="cart-promo"
                  ref={promoFieldRef}
                  type="text"
                  autoComplete="off"
                  spellCheck={false}
                  value={promoInput}
                  onChange={(e) => {
                    const v = e.target.value;
                    setPromoInput(v);
                    promoFieldRef.current?.setCustomValidity('');
                    setPromoMsg({ text: '', state: 'idle' });
                  }}
                  placeholder="CHAI10 or MIST"
                  aria-label="Promo code"
                  className="h-11 flex-1 bg-paper outline-none text-ink placeholder:text-ink/35 text-[14px] font-sans px-2 tracking-wide"
                />
                <button
                  type="submit"
                  className="px-5 font-sans text-[13px] font-medium text-ink/70 hover:text-ink hover:bg-ink/5 transition-colors border-l border-ink/12"
                >
                  Apply
                </button>
              </div>
            </form>
            <div className="mt-8 pt-6 border-t border-ink/10">
              {orderRow}
            </div>
          </div>
        )}
      </DialogBody>
      {items.length > 0 && (
        <DialogFooter>
          <Link href="/checkout?step=1" onClick={close} className="block w-full">
            <Button variant="primary" size="lg" fullWidth iconRight={<ArrowIcon className="w-4 h-4" />}>
              Proceed to checkout
            </Button>
          </Link>
          <p className="mt-3 text-[11px] text-center font-sans text-ink/40">
            Secure checkout · Demo only — no payment is processed
          </p>
        </DialogFooter>
      )}
    </Dialog>
  );
}
