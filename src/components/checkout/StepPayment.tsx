'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  FormProvider,
  useController,
  useForm,
  useFormContext,
  type FieldValues,
  type Path,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import {
  cardDetailsSchema,
  type CardDetails,
} from '@/lib/validators';
import { ArrowIcon, LeafGlyph } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { defaultEasing } from '@/lib/motion';
import { cn } from '@/lib/cn';
import {
  useCartStore,
  EXPRESS_SHIPPING_COST,
  KATHMANDU_SHIPPING_COST,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_COST,
} from '@/store/cart';
import { formatPrice } from '@/lib/format';
import { useCheckoutStore } from '@/store/checkout';

type Props = {
  initial: Partial<CardDetails>;
  onSubmit: (values: CardDetails) => void;
  onBack: () => void;
};

type Method = CardDetails['method'];
const METHOD_ROWS: { id: Method; title: string; sub: string }[] = [
  { id: 'card', title: 'Card', sub: 'Debit or credit · 3D secure demo' },
  { id: 'esewa', title: 'eSewa', sub: 'Popular Nepali digital wallet · demo' },
  { id: 'khalti', title: 'Khalti', sub: 'Nepal digital payment · demo' },
  { id: 'cod', title: 'Cash on delivery', sub: 'Pay when your tin arrives' },
];

function detectBrand(num: string): 'visa' | 'mastercard' | 'amex' | 'discover' | 'unionpay' | 'generic' {
  const s = num.replace(/\s+/g, '');
  if (/^4/.test(s)) return 'visa';
  if (/^(5[1-5]|2[2-7])/.test(s)) return 'mastercard';
  if (/^3[47]/.test(s)) return 'amex';
  if (/^(6011|65|64[4-9])/.test(s)) return 'discover';
  if (/^62/.test(s)) return 'unionpay';
  return 'generic';
}

function maskCardNumber(input: string) {
  const dig = input.replace(/\D/g, '').slice(0, 19);
  const groups: string[] = [];
  for (let i = 0; i < dig.length; i += 4) groups.push(dig.slice(i, i + 4));
  return groups.join(' ');
}

function maskExpiry(input: string) {
  const d = input.replace(/\D/g, '').slice(0, 4);
  if (d.length <= 2) return d;
  return d.slice(0, 2) + '/' + d.slice(2);
}

function maskCvc(input: string) {
  return input.replace(/\D/g, '').slice(0, 4);
}

const BRAND_LOGOS: Record<string, React.ReactNode> = {
  visa: (
    <text x="260" y="50" textAnchor="end" fontFamily="serif" fontStyle="italic" fontWeight="800" fontSize="20" fill="#1A1F71">
      VISA
    </text>
  ),
  mastercard: (
    <g transform="translate(230, 36)">
      <circle cx="0" cy="0" r="14" fill="#EB001B" opacity="0.9" />
      <circle cx="18" cy="0" r="14" fill="#F79E1B" opacity="0.92" />
      <path d="M 9 -12 C 3 -4 3 4 9 12 C 15 4 15 -4 9 -12 Z" fill="#FF5F00" opacity="0.85" />
    </g>
  ),
  amex: (
    <text x="258" y="54" textAnchor="end" fontFamily="sans-serif" fontWeight="800" fontSize="14" fill="#2E77BC" letterSpacing="1.5">
      AMEX
    </text>
  ),
  discover: (
    <text x="258" y="54" textAnchor="end" fontFamily="sans-serif" fontWeight="700" fontSize="13" fill="#FF6A00">
      DISCOVER
    </text>
  ),
  unionpay: (
    <text x="258" y="54" textAnchor="end" fontFamily="sans-serif" fontWeight="700" fontSize="12" fill="#C8102E">
      UnionPay
    </text>
  ),
  generic: (
    <g transform="translate(232, 30)">
      <rect width="50" height="30" rx="5" fill="#1A1714" opacity="0.15" />
      <text x="25" y="20" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fontWeight="600" fill="#1A1714" opacity="0.55">
        CARD
      </text>
    </g>
  ),
};

function Field<T extends FieldValues>({
  name,
  id,
  label,
  type,
  inputMode,
  placeholder,
  onValueChange,
  autoComplete,
  maxLength,
  className,
}: {
  name: Path<T>;
  id: string;
  label: string;
  type?: string;
  inputMode?: 'text' | 'numeric';
  placeholder?: string;
  onValueChange?: (v: string) => string;
  autoComplete?: string;
  maxLength?: number;
  className?: string;
}) {
  const { control } = useFormContext<T>();
  const {
    field,
    fieldState: { error, invalid },
  } = useController<T>({ name, control });
  return (
    <div className={className}>
      <label htmlFor={id} className="block small-caps text-[10.5px] tracking-[0.18em] text-ink/55 mb-2">
        {label}
        <span aria-hidden className="text-clay/70 ml-1">·</span>
      </label>
      <input
        {...field}
        id={id}
        type={type || 'text'}
        inputMode={inputMode}
        placeholder={placeholder}
        autoComplete={autoComplete}
        maxLength={maxLength}
        aria-invalid={invalid || undefined}
        aria-describedby={error ? 'err-' + id : undefined}
        onChange={(e) => {
          const v = onValueChange ? onValueChange(e.target.value) : e.target.value;
          field.onChange(v);
        }}
        className={cn(
          'w-full h-12 rounded-sm bg-paper border px-4 font-sans text-[15px] text-ink placeholder:text-ink/35 outline-none transition-colors tracking-wide',
          error ? 'border-red-400/60 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-ink/12 focus:border-gold/60 focus:ring-2 focus:ring-gold/20',
        )}
      />
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={'err-' + id}
            role="alert"
            key={error.message || 'e'}
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: defaultEasing }}
            className="mt-1.5 text-[12px] text-red-600/90 font-sans"
          >
            {error.message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function StepPayment({ initial, onSubmit, onBack }: Props) {
  const reduced = useReducedMotion();
  const router = useRouter();
  const defaults: CardDetails = {
    method: initial.method || 'card',
    number: initial.number || '',
    name: initial.name || '',
    expiry: initial.expiry || '',
    cvc: initial.cvc || '',
  };
  const methods = useForm<CardDetails>({
    resolver: zodResolver(cardDetailsSchema) as any,
    defaultValues: defaults,
    mode: 'onTouched',
  });
  const { handleSubmit, watch, control } = methods;

  const method = watch('method');
  const number = watch('number') || '';
  const name = watch('name') || '';
  const expiry = watch('expiry') || '';
  const cvc = watch('cvc') || '';
  const brand = useMemo(() => detectBrand(number), [number]);

  const [flipped, setFlipped] = useState(false);
  const [hoverFace, setHoverFace] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 160, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 160, damping: 18, mass: 0.6 });
  const rotY = useTransform(sx, (v) => (reduced ? 0 : v * 16));
  const rotX = useTransform(sy, (v) => (reduced ? 0 : -v * 12));

  const showCard = method === 'card';
  void hoverFace;

  function handleCardMove(e: React.MouseEvent) {
    if (!showCard || reduced) return;
    const r = cardRef.current?.getBoundingClientRect();
    if (!r) return;
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    mx.set(x * 2);
    my.set(y * 2);
  }
  function resetCard() {
    mx.set(0);
    my.set(0);
  }

  const { field: methodField } = useController<CardDetails>({ name: 'method', control });

  function localSubmit(values: CardDetails) {
    onSubmit(values);
  }

  return (
    <FormProvider {...(methods as any)}>
      <form onSubmit={handleSubmit(localSubmit)} noValidate className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-10 lg:gap-14">
        <div className="space-y-7 order-2 lg:order-1">
          <div className="order-1 lg:order-none">
            <div
              ref={cardRef}
              className="mx-auto max-w-[360px] aspect-[1.586/1] my-4"
              style={{ perspective: '1100px' }}
              onMouseMove={handleCardMove}
              onMouseEnter={() => setHoverFace(true)}
              onMouseLeave={() => {
                resetCard();
                setHoverFace(false);
              }}
            >
              <motion.div
                className="relative w-full h-full"
                style={{
                  transformStyle: 'preserve-3d',
                  rotateY: showCard ? rotY : 0,
                  rotateX: showCard ? rotX : 0,
                }}
                animate={{
                  rotateY: flipped ? 180 : 0,
                  rotateX: flipped ? 0 : undefined,
                }}
                transition={{ duration: reduced ? 0.1 : 0.65, ease: defaultEasing }}
              >
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-2xl p-6 text-paper overflow-hidden"
                  style={{
                    backfaceVisibility: 'hidden',
                    transformStyle: 'preserve-3d',
                    background:
                      'linear-gradient(135deg, #221D18 0%, #1A1714 40%, #2E2620 100%)',
                    boxShadow: '0 30px 80px -30px rgba(26,23,20,0.55), inset 0 1px 0 rgba(255,255,255,0.08)',
                  }}
                >
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-[0.08]"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle at 18% 22%, #C9A227 0px, transparent 120px), radial-gradient(circle at 82% 90%, #B3541E 0px, transparent 150px)',
                    }}
                  />
                  <div className="relative z-10 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <LeafGlyph className="w-5 h-5 text-gold" aria-hidden />
                      <div>
                        <p className="small-caps text-[9px] tracking-[0.24em] text-paper/50">Chai &amp; Co.</p>
                        <p className="font-serif text-[15px] leading-tight">Premium tea card</p>
                      </div>
                    </div>
                    <div className="w-14 h-10 rounded-md" style={{ background: 'linear-gradient(135deg,#C9A227,#B3541E)' }} />
                  </div>
                  <div className="relative z-10 mt-8">
                    <svg width="100%" height="56" viewBox="0 0 290 56" className="overflow-visible" aria-hidden>
                      {number
                        ? (
                          <>
                            <text
                              x="6"
                              y="40"
                              fontFamily="'Courier New', monospace"
                              fontSize="22"
                              letterSpacing="3.5"
                              fill="#EDE6D8"
                              opacity="0.98"
                            >
                              {(() => {
                                const g = (number || '').split(' ');
                                let out = '';
                                for (let i = 0; i < 4; i++) {
                                  if (g[i]) out += g[i] + '  ';
                                  else out += '••••  ';
                                }
                                return out.trim();
                              })()}
                            </text>
                          </>
                        )
                        : (
                          <text x="6" y="40" fontFamily="'Courier New', monospace" fontSize="22" letterSpacing="3.5" fill="#EDE6D8" opacity="0.55">
                            ••••  ••••  ••••  ••••
                          </text>
                        )}
                      {BRAND_LOGOS[brand]}
                    </svg>
                  </div>
                  <div className="relative z-10 grid grid-cols-[1fr,auto] gap-6 mt-6 items-end">
                    <div>
                      <p className="small-caps text-[9px] tracking-[0.22em] text-paper/45 mb-1">Cardholder</p>
                      <p className="font-serif text-[15px] tracking-wide uppercase min-h-[1.2em] truncate min-w-0">
                        {name || 'YOUR NAME'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="small-caps text-[9px] tracking-[0.22em] text-paper/45 mb-1">Expires</p>
                      <p className="font-mono text-[15px] tabular-nums min-h-[1.2em]">{expiry || 'MM/YY'}</p>
                    </div>
                  </div>
                </div>

                <div
                  aria-hidden
                  className="absolute inset-0 rounded-2xl text-paper overflow-hidden"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    background: 'linear-gradient(135deg,#221D18,#1A1714)',
                  }}
                >
                  <div className="absolute top-6 left-0 right-0 h-10 bg-black/70" />
                  <div className="absolute bottom-14 left-6 right-16 h-10 bg-paper/85 rounded-sm flex items-center px-4 justify-end gap-3">
                    <span className="font-mono text-[14px] text-ink/70 italic tracking-widest min-h-[1em]">
                      {cvc ? (
                        (brand === 'amex' ? '••••' : '•••') + cvc
                      ) : (
                        brand === 'amex' ? '••••' : '•••'
                      )}
                    </span>
                  </div>
                  <p className="absolute bottom-14 right-4 small-caps text-[9px] tracking-[0.22em] text-paper/55">
                    {cvc || (brand === 'amex' ? 'CVV 4D' : 'CVV')}
                  </p>
                  <p className="absolute bottom-6 left-6 small-caps text-[9px] tracking-[0.22em] text-paper/40 max-w-[75%]">
                    Demo only · no charge is made · signature panel
                  </p>
                </div>
              </motion.div>
            </div>
            {!reduced && showCard && (
              <p className="text-center text-[11px] text-ink/45 small-caps tracking-[0.18em] -mt-1">
                Hover to tilt · CVC field flips the card
              </p>
            )}
          </div>

          <div className="border-b border-ink/10 pb-7 pt-6">
            <p className="small-caps text-[10.5px] tracking-[0.2em] text-gold mb-2">Payment method</p>
            <h2 className="font-serif text-3xl tracking-tight mb-2">How would you like to pay?</h2>
            <p className="font-sans text-ink/60 text-[15px]">Fully simulated. No data leaves your browser.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {METHOD_ROWS.map((r) => {
              const selected = method === r.id;
              return (
                <label
                  key={r.id}
                  htmlFor={'pay-' + r.id}
                  className={cn(
                    'group relative block rounded-sm border px-4 py-3 cursor-pointer transition-colors',
                    selected ? 'border-gold/70 bg-gold/5' : 'border-ink/12 hover:border-ink/25 bg-paper',
                  )}
                >
                  <input
                    {...methodField}
                    id={'pay-' + r.id}
                    type="radio"
                    className="sr-only"
                    value={r.id}
                    checked={selected}
                    onChange={() => methodField.onChange(r.id)}
                  />
                  <p className="font-serif text-[16px] tracking-tight text-ink">{r.title}</p>
                  <p className="mt-1 text-[11.5px] text-ink/55 leading-snug">{r.sub}</p>
                  {selected && !reduced && (
                    <motion.span
                      aria-hidden
                      layoutId="paymethod-ring"
                      className="absolute inset-0 rounded-sm pointer-events-none border-[1.5px] border-gold/80"
                      transition={{ duration: 0.3, ease: defaultEasing }}
                    />
                  )}
                </label>
              );
            })}
          </div>

          <AnimatePresence initial={false}>
            {method === 'card' && (
              <motion.div
                key="card-fields"
                initial={reduced ? {} : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
                transition={{ duration: reduced ? 0.15 : 0.4, ease: defaultEasing }}
                className="space-y-5"
              >
                <div className="border-t border-ink/10 pt-7">
                  <p className="small-caps text-[10.5px] tracking-[0.2em] text-ink/55 mb-4">Card details</p>
                  <Field<CardDetails>
                    id="sp-number"
                    name="number"
                    label="Card number"
                    inputMode="numeric"
                    placeholder="4242 4242 4242 4242"
                    autoComplete="cc-number"
                    maxLength={24}
                    onValueChange={maskCardNumber}
                  />
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mt-5">
                    <Field<CardDetails>
                      id="sp-exp"
                      name="expiry"
                      label="Expiry (MM/YY)"
                      inputMode="numeric"
                      placeholder="12/29"
                      autoComplete="cc-exp"
                      maxLength={5}
                      onValueChange={maskExpiry}
                      className="md:col-span-2"
                    />
                    <Field<CardDetails>
                      id="sp-cvc"
                      name="cvc"
                      label="CVC"
                      inputMode="numeric"
                      placeholder={brand === 'amex' ? '1234' : '123'}
                      autoComplete="cc-csc"
                      maxLength={4}
                      onValueChange={maskCvc}
                      className="md:col-span-1"
                    />
                  </div>
                  <div className="mt-5">
                    <Field<CardDetails>
                      id="sp-name"
                      name="name"
                      label="Name on card"
                      placeholder="Prakash Shrestha"
                      autoComplete="cc-name"
                      maxLength={60}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence initial={false}>
            {method !== 'card' && (
              <motion.div
                key="alt-method"
                initial={reduced ? {} : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduced ? 0.12 : 0.35, ease: defaultEasing }}
                className="rounded-sm border border-gold/30 bg-gold/[0.04] px-5 py-5"
              >
                <div className="flex items-start gap-3">
                  <LeafGlyph className="w-4 h-4 text-gold mt-1 shrink-0" aria-hidden />
                  <div>
                    <p className="font-serif text-[18px] tracking-tight text-ink">
                      {method === 'cod'
                        ? 'Cash on delivery · pay on receipt'
                        : method === 'esewa'
                          ? 'Continue to eSewa (demo)'
                          : 'Continue to Khalti (demo)'}
                    </p>
                    <p className="font-sans text-[13.5px] text-ink/60 mt-1 leading-relaxed">
                      {method === 'cod'
                        ? 'Tins are packed in Ilam paper. Pay in rupees when your courier arrives — signature required.'
                        : 'You&apos;ll be taken through a mock wallet flow, then returned to Chai &amp; Co. with your order confirmed. No funds are moved.'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between gap-4 pt-6 border-t border-ink/10">
            <button
              type="button"
              onClick={onBack}
              className="small-caps text-[11px] tracking-[0.18em] text-ink/55 hover:text-ink transition-colors"
            >
              ← Back to contact
            </button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              iconRight={<ArrowIcon className="w-4 h-4" />}
            >
              Review your order
            </Button>
          </div>
        </div>

        <aside className="lg:sticky lg:top-28 self-start space-y-6 pt-6 lg:pt-0 order-1 lg:order-2">
          <SideSummary method={method} />
        </aside>
      </form>

      <FlipBridge onCvcFocus={(f) => setFlipped(f && !reduced)} onCvcHover={setHoverFace} />
    </FormProvider>
  );
}

function SideSummary({
  method,
}: {
  method: Method;
}) {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const discount = useCartStore((s) => s.discount());
  const promo = useCartStore((s) => s.promo);
  const delivery = useCheckoutStore((s) => s.contact.deliveryOption) || 'standard';
  void method;

  function shipping() {
    if (delivery === 'standard') return STANDARD_SHIPPING_COST;
    if (delivery === 'express') return EXPRESS_SHIPPING_COST;
    if (delivery === 'kathmandu') return KATHMANDU_SHIPPING_COST;
    return 0;
  }
  const ship = shipping();
  const total = Math.max(0, subtotal - discount + ship);

  return (
    <div className="border border-ink/10 rounded-sm bg-paper/80 p-5 space-y-5">
      <div className="flex items-center justify-between">
        <p className="small-caps text-[10.5px] tracking-[0.2em] text-ink/55">Order summary</p>
        <LeafGlyph className="w-4 h-4 text-gold/80" aria-hidden />
      </div>
      <ul className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
        {items.length === 0 ? (
          <li className="text-[13px] text-ink/50 py-6 text-center">Your bag is empty.</li>
        ) : (
          items.map((i) => (
            <li key={i.key} className="grid grid-cols-[auto,1fr,auto] items-center gap-3">
              <span
                aria-hidden
                className="w-8 h-10 rounded-sm border border-ink/10 shrink-0"
                style={{ background: i.accent, backgroundImage: 'linear-gradient(180deg,rgba(255,255,255,0.25),rgba(0,0,0,0.15))' }}
              />
              <div className="min-w-0">
                <p className="font-serif text-[14px] leading-tight truncate">{i.name}</p>
                <p className="text-[11px] text-ink/50 small-caps tracking-wider">
                  {i.qty} × {i.sizeGrams}g
                </p>
              </div>
              <span className="font-serif tabular-nums text-[13.5px]">{formatPrice(i.unitPrice * i.qty)}</span>
            </li>
          ))
        )}
      </ul>
      <div className="space-y-1.5 pt-4 border-t border-ink/8 text-[13px] font-sans">
        <div className="flex justify-between text-ink/70">
          <span>Subtotal</span>
          <span className="tabular-nums text-ink">{formatPrice(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-gold">
            <span>{promo === 'CHAI10' ? 'Discount (CHAI10)' : 'Shipping (MIST)'}</span>
            <span className="tabular-nums">−{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-ink/70">
          <span>Shipping</span>
          <span className="tabular-nums text-ink">
            {ship === 0 ? 'Complimentary' : formatPrice(ship)}
          </span>
        </div>
        <div className="flex justify-between pt-3 mt-2 border-t border-ink/10 text-ink">
          <span className="small-caps tracking-[0.18em] text-[11px] text-ink/55 self-center">Total</span>
          <span className="font-serif text-2xl tabular-nums">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}

function FlipBridge({
  onCvcFocus,
  onCvcHover,
}: {
  onCvcFocus: (f: boolean) => void;
  onCvcHover: (h: boolean) => void;
}) {
  useEffect(() => {
    const cvc = document.getElementById('sp-cvc') as HTMLInputElement | null;
    if (!cvc) return;
    function onFocus() { onCvcFocus(true); }
    function onBlur() { onCvcFocus(false); }
    function onMouseEnter() { onCvcHover(true); }
    function onMouseLeave() { onCvcHover(false); }
    cvc.addEventListener('focus', onFocus);
    cvc.addEventListener('blur', onBlur);
    cvc.addEventListener('mouseenter', onMouseEnter);
    cvc.addEventListener('mouseleave', onMouseLeave);
    return () => {
      cvc.removeEventListener('focus', onFocus);
      cvc.removeEventListener('blur', onBlur);
      cvc.removeEventListener('mouseenter', onMouseEnter);
      cvc.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [onCvcFocus, onCvcHover]);
  return null;
}
