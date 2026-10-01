'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowIcon, LeafGlyph } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { defaultEasing } from '@/lib/motion';
import { cn } from '@/lib/cn';
import { formatPrice } from '@/lib/format';
import {
  FREE_SHIPPING_THRESHOLD,
  useCartStore,
  EXPRESS_SHIPPING_COST,
  KATHMANDU_SHIPPING_COST,
  STANDARD_SHIPPING_COST,
} from '@/store/cart';
import { useCheckoutStore } from '@/store/checkout';
import type { CheckoutContact, CardDetails } from '@/lib/validators';

type Props = {
  contact: Partial<CheckoutContact>;
  payment: Partial<CardDetails>;
  onPlace: () => void;
  onBack: () => void;
  onEdit: (step: 1 | 2) => void;
};

export function StepReview({ contact, payment, onPlace, onBack, onEdit }: Props) {
  const reduced = useReducedMotion();
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const discount = useCartStore((s) => s.discount());
  const promo = useCartStore((s) => s.promo);
  const delivery = contact.deliveryOption || 'standard';

  const [status, setStatus] = useState<'idle' | 'processing' | 'done'>('idle');
  const didRun = useRef(false);

  function shipping() {
    if (delivery === 'standard') {
      return subtotal >= FREE_SHIPPING_THRESHOLD ? STANDARD_SHIPPING_COST : STANDARD_SHIPPING_COST;
    }
    if (delivery === 'express') return EXPRESS_SHIPPING_COST;
    if (delivery === 'kathmandu') return KATHMANDU_SHIPPING_COST;
    return 0;
  }
  const ship = shipping();
  const total = Math.max(0, subtotal - discount + ship);

  useEffect(() => {
    if (status !== 'processing') return;
    if (didRun.current) return;
    didRun.current = true;
    const t1 = window.setTimeout(() => {
      setStatus('done');
    }, 1500);
    const t2 = window.setTimeout(() => {
      onPlace();
    }, 2200);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      didRun.current = false;
    };
  }, [status, onPlace]);

  const fullName = [contact.firstName, contact.lastName].filter(Boolean).join(' ').trim();
  const phone = contact.phone || '';
  const district = contact.district || '';
  void router;

  const methodLabel =
    payment.method === 'card'
      ? 'Card ending ' + (payment.number?.replace(/\s+/g, '').slice(-4) || '••••')
      : payment.method === 'esewa'
        ? 'eSewa wallet (demo)'
        : payment.method === 'khalti'
          ? 'Khalti wallet (demo)'
          : 'Cash on delivery';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-10 lg:gap-14">
      <div className="space-y-8">
        <Section
          eyebrow="Contact"
          title={fullName || 'Your details'}
          subtitle={[contact.email, phone].filter(Boolean).join(' · ')}
          onEdit={() => onEdit(1)}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-[14.5px]">
            <Row k="Email" v={contact.email || '—'} />
            <Row k="Phone" v={phone || '—'} />
            <Row k="Name" v={fullName || '—'} className="sm:col-span-2" />
            <Row k="Address" v={[contact.address, contact.city, district].filter(Boolean).join(', ') || '—'} className="sm:col-span-2" />
          </div>
        </Section>

        <Section
          eyebrow="Delivery"
          title={
            delivery === 'kathmandu'
              ? 'Kathmandu same-day'
              : delivery === 'express'
                ? 'Express · 1–2 days'
                : subtotal >= FREE_SHIPPING_THRESHOLD
                  ? 'Standard · 3–5 days · Complimentary'
                  : 'Standard · 3–5 days'
          }
          subtitle={district ? 'Delivering to ' + district + ' · Nepal' : 'Delivering within Nepal'}
          onEdit={() => onEdit(1)}
        >
          <div className="text-[14.5px] text-ink/75">
            Hand-packed in matte metal tins lined with food-grade paper. Ships from our Kathmandu dispatch within 24 hours.
          </div>
        </Section>

        <Section
          eyebrow="Payment"
          title={methodLabel}
          subtitle={payment.method === 'card' ? 'Demo card · no charge made' : 'Simulated checkout flow'}
          onEdit={() => onEdit(2)}
        >
          <div className="text-[14.5px] text-ink/75 flex items-center gap-2">
            <LeafGlyph className="w-4 h-4 text-gold/80" aria-hidden />
            Checkout is fully simulated — no payment details leave this browser.
          </div>
        </Section>

        <Section eyebrow="Tins in this order" title={items.length + ' ' + (items.length === 1 ? 'tin' : 'tins')} subtitle="Packed together · shipped together" className="!py-0">
          <ul className="divide-y divide-ink/8 -mx-2">
            {items.length === 0 ? (
              <li className="text-[13px] text-ink/50 py-10 text-center px-2">Your bag is empty.{' '}
                <Link className="text-clay underline" href="/shop">Add some tea</Link>
              </li>
            ) : (
              items.map((i) => (
                <li key={i.key} className="grid grid-cols-[auto,1fr,auto] items-center gap-4 py-3.5 px-2">
                  <span
                    aria-hidden
                    className="w-9 h-11 rounded-sm border border-ink/10 shrink-0"
                    style={{ background: i.accent, backgroundImage: 'linear-gradient(180deg,rgba(255,255,255,0.25),rgba(0,0,0,0.15))' }}
                  />
                  <div className="min-w-0">
                    <p className="font-serif text-[15.5px] leading-tight truncate">{i.name}</p>
                    <p className="text-[11.5px] text-ink/50 small-caps tracking-wider mt-0.5">
                      {i.qty} × {i.sizeLabel}
                    </p>
                  </div>
                  <span className="font-serif text-[15px] tabular-nums text-ink">
                    {formatPrice(i.unitPrice * i.qty)}
                  </span>
                </li>
              ))
            )}
          </ul>
        </Section>

        <div className="flex items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="small-caps text-[11px] tracking-[0.18em] text-ink/55 hover:text-ink transition-colors"
          >
            ← Back to payment
          </button>
          <Button
            type="button"
            variant="primary"
            size="lg"
            loading={status === 'processing'}
            iconRight={status === 'done' ? null : <ArrowIcon className="w-4 h-4" />}
            onClick={() => setStatus('processing')}
            disabled={status !== 'idle' || items.length === 0}
          >
            {status === 'done' ? (
              <span className="inline-flex items-center gap-2">
                <span className="inline-block w-4 h-4 rounded-full bg-paper/95 text-ink flex items-center justify-center text-[11px] leading-none font-bold">✓</span>
                Confirmed
              </span>
            ) : status === 'processing' ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full border-2 border-paper/50 border-t-paper animate-spin" aria-hidden />
                Brewing your order…
              </span>
            ) : (
              'Place order · ' + formatPrice(total)
            )}
          </Button>
        </div>

        <p className="text-[11px] text-ink/40 small-caps tracking-[0.2em] pt-2">
          Demo only · Orders stored in this browser · Cancel any time
        </p>
      </div>

      <aside className="lg:sticky lg:top-28 self-start space-y-6 pt-6 lg:pt-0">
        <div className="border border-ink/10 rounded-sm bg-paper/80 p-5 space-y-5">
          <div className="flex items-center justify-between">
            <p className="small-caps text-[10.5px] tracking-[0.2em] text-ink/55">Total due</p>
            <LeafGlyph className="w-4 h-4 text-gold/80" aria-hidden />
          </div>
          <div>
            <p className="small-caps text-[10.5px] tracking-[0.2em] text-gold mb-1">Nepali rupees</p>
            <motion.p
              key={total}
              initial={reduced ? {} : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-serif text-[44px] leading-none tracking-tight text-ink tabular-nums"
            >
              {formatPrice(total)}
            </motion.p>
          </div>
          <div className="space-y-1.5 pt-4 border-t border-ink/8 text-[13px] font-sans">
            <div className="flex justify-between text-ink/70">
              <span>{items.length} {items.length === 1 ? 'tin' : 'tins'}</span>
              <span className="tabular-nums text-ink">{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-gold">
                <span>{promo === 'CHAI10' ? 'CHAI10 · 10% off' : 'MIST · free ship'}</span>
                <span className="tabular-nums">−{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-ink/70">
              <span>Delivery</span>
              <span className="tabular-nums text-ink">
                {ship === 0 ? 'Complimentary' : formatPrice(ship)}
              </span>
            </div>
          </div>
        </div>
        <AnimatePresence initial={false}>
          {status === 'processing' && (
            <motion.div
              key="processing"
              initial={reduced ? {} : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: reduced ? 0.1 : 0.3, ease: defaultEasing }}
              className="rounded-sm border border-gold/30 bg-gold/5 px-5 py-4 flex items-start gap-3"
            >
              <motion.span
                className="w-4 h-4 mt-0.5 rounded-full border-2 border-gold/40 border-t-gold shrink-0"
                animate={{ rotate: 360 }}
                transition={{ duration: reduced ? 0.6 : 0.9, repeat: Infinity, ease: 'linear' }}
                aria-hidden
              />
              <div>
                <p className="font-serif text-[15.5px] tracking-tight text-ink">Packing your tins…</p>
                <p className="font-sans text-[12.5px] text-ink/55 mt-0.5">
                  Placing the matte metal tins into Ilam paper, printing the dispatch note.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </aside>
    </div>
  );
}

function Section({
  eyebrow,
  title,
  subtitle,
  onEdit,
  children,
  className,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  onEdit?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('border border-ink/10 rounded-sm p-6 md:p-7 bg-paper/85 space-y-5', className)}>
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <p className="small-caps text-[10.5px] tracking-[0.2em] text-gold mb-1">{eyebrow}</p>
          <h3 className="font-serif text-2xl tracking-tight leading-tight truncate">{title}</h3>
          {subtitle && <p className="font-sans text-[13.5px] text-ink/55 mt-1 truncate">{subtitle}</p>}
        </div>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="small-caps text-[11px] tracking-[0.18em] text-ink/55 hover:text-clay transition-colors shrink-0"
          >
            Edit ↗
          </button>
        )}
      </div>
      <div>{children}</div>
    </section>
  );
}

function Row({ k, v, className }: { k: string; v: string; className?: string }) {
  return (
    <div className={cn('grid grid-cols-[110px,1fr] gap-3 items-baseline', className)}>
      <dt className="small-caps text-[10.5px] tracking-[0.2em] text-ink/45 pt-1">{k}</dt>
      <dd className="text-ink/85 min-w-0 break-words">{v}</dd>
    </div>
  );
}
