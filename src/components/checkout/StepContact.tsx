'use client';

import { useEffect, useRef } from 'react';
import {
  FormProvider,
  useController,
  useForm,
  useFormContext,
  type FieldValues,
  type Path,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { checkoutContactSchema, districtOptions, type CheckoutContact } from '@/lib/validators';
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

type Props = {
  initial: Partial<CheckoutContact>;
  onSubmit: (values: CheckoutContact) => void;
};

type Method = 'standard' | 'express' | 'kathmandu';

const DELIVERY_ROWS: { id: Method; title: string; sub: string }[] = [
  { id: 'standard', title: 'Standard', sub: '3–5 business days · Free over NPR 3,000' },
  { id: 'express', title: 'Express', sub: '1–2 business days · Tracked' },
  { id: 'kathmandu', title: 'Kathmandu same-day', sub: 'Order before 12pm · Inside Ring Road' },
];

function FieldLabel({ id, children, required }: { id: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label htmlFor={id} className="block small-caps text-[10.5px] tracking-[0.18em] text-ink/55 mb-2">
      {children}
      {required ? <span aria-hidden className="text-clay/70 ml-1">·</span> : null}
    </label>
  );
}

type FieldProps<T extends FieldValues> = {
  name: Path<T>;
  id: string;
  label: string;
  placeholder?: string;
  type?: string;
  inputMode?: 'text' | 'numeric' | 'email' | 'tel';
  autoComplete?: string;
  required?: boolean;
  className?: string;
};

function Field<T extends FieldValues>({
  name,
  id,
  label,
  placeholder,
  type = 'text',
  inputMode,
  autoComplete,
  required,
  className,
}: FieldProps<T>) {
  const { control } = useFormContext<T>();
  const {
    field,
    fieldState: { error, invalid },
  } = useController<T>({ name, control });
  const labelWrapRef = useRef<HTMLLabelElement | null>(null);

  useEffect(() => {
    if (!error || !labelWrapRef.current) return;
    const el = labelWrapRef.current;
    if (el.getAttribute('data-shook-once') === error.message) return;
    el.setAttribute('data-shook-once', error.message || '');
    el.animate(
      [
        { transform: 'translateX(0)' },
        { transform: 'translateX(-3px)' },
        { transform: 'translateX(3px)' },
        { transform: 'translateX(-2px)' },
        { transform: 'translateX(2px)' },
        { transform: 'translateX(0)' },
      ],
      { duration: 340, easing: 'ease-in-out' },
    );
  }, [error]);

  return (
    <div className={className}>
      <FieldLabel id={id} required={required}>
        <label ref={labelWrapRef} id={'lbl-' + id} htmlFor={id} className="contents">
          {label}
        </label>
      </FieldLabel>
      <input
        {...field}
        id={id}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={invalid || undefined}
        aria-describedby={error ? 'err-' + id : undefined}
        className={cn(
          'w-full h-12 rounded-sm bg-paper border px-4 font-sans text-[15px] text-ink placeholder:text-ink/35 outline-none transition-colors',
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

function SelectField<T extends FieldValues>({
  name,
  id,
  label,
  options,
  required,
  className,
}: {
  name: Path<T>;
  id: string;
  label: string;
  options: { value: string; label: string }[];
  required?: boolean;
  className?: string;
}) {
  const { control } = useFormContext<T>();
  const {
    field,
    fieldState: { error, invalid },
  } = useController<T>({ name, control });
  return (
    <div className={className}>
      <FieldLabel id={id} required={required}>
        {label}
      </FieldLabel>
      <div className="relative">
        <select
          {...field}
          id={id}
          aria-invalid={invalid || undefined}
          aria-describedby={error ? 'err-' + id : undefined}
          className={cn(
            'appearance-none w-full h-12 rounded-sm bg-paper border pl-4 pr-10 font-sans text-[15px] text-ink outline-none transition-colors',
            error ? 'border-red-400/60 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-ink/12 focus:border-gold/60 focus:ring-2 focus:ring-gold/20',
          )}
        >
          <option value="" disabled>
            Select district
          </option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/40" aria-hidden>
          <path d="M6 9 L12 15 L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
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

export function StepContact({ initial, onSubmit }: Props) {
  const reduced = useReducedMotion();
  const router = useRouter();
  const subtotal = useCartStore((s) => s.subtotal());
  const items = useCartStore((s) => s.items);

  const districtOptList = districtOptions.map((d) => ({ value: d, label: d }));

  const defaults: CheckoutContact = {
    email: initial.email || '',
    firstName: initial.firstName || '',
    lastName: initial.lastName || '',
    phone: initial.phone || '',
    address: initial.address || '',
    city: initial.city || '',
    district: (initial.district as CheckoutContact['district']) || districtOptions[0],
    deliveryOption: (initial.deliveryOption as CheckoutContact['deliveryOption']) || 'standard',
  };

  const methods = useForm<CheckoutContact>({
    resolver: zodResolver(checkoutContactSchema) as any,
    defaultValues: defaults,
    mode: 'onTouched',
    reValidateMode: 'onChange',
    shouldFocusError: true,
  });
  const {
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = methods;

  const selectedDelivery = watch('deliveryOption');

  useEffect(() => {
    if (Object.keys(errors).length) {
      const first = document.querySelector<HTMLElement>('input[aria-invalid="true"],select[aria-invalid="true"]');
      if (first) {
        first.focus({ preventScroll: false });
        first.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
      }
    }
  }, [errors, reduced]);

  function deliveryPrice(id: Method) {
    if (id === 'standard') return STANDARD_SHIPPING_COST;
    if (id === 'express') return EXPRESS_SHIPPING_COST;
    if (id === 'kathmandu') return KATHMANDU_SHIPPING_COST;
    return 0;
  }

  function localSubmit(values: CheckoutContact) {
    onSubmit(values);
  }

  const { control } = methods;
  const { field: deliveryField } = useController<CheckoutContact>({
    name: 'deliveryOption',
    control,
  });

  return (
    <FormProvider {...(methods as any)}>
      <form onSubmit={handleSubmit(localSubmit)} noValidate className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-10 lg:gap-14">
        <div className="space-y-7">
          <div className="border-b border-ink/10 pb-7">
            <p className="small-caps text-[10.5px] tracking-[0.2em] text-gold mb-2">Contact</p>
            <h2 className="font-serif text-3xl tracking-tight mb-2">How should we reach you?</h2>
            <p className="font-sans text-ink/60 text-[15px]">We&apos;ll email your order confirmation. No spam — ever.</p>
          </div>
          <Field<CheckoutContact>
            id="cc-email"
            name="email"
            label="Email address"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            placeholder="you@household.kitchen"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field<CheckoutContact>
              id="cc-fn"
              name="firstName"
              label="First name"
              autoComplete="given-name"
              required
              placeholder="Prakash"
            />
            <Field<CheckoutContact>
              id="cc-ln"
              name="lastName"
              label="Last name"
              autoComplete="family-name"
              required
              placeholder="Shrestha"
            />
          </div>
          <Field<CheckoutContact>
            id="cc-phone"
            name="phone"
            label="Phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            placeholder="+977 98XX XXX XXX"
          />

          <div className="border-b border-ink/10 pb-7 pt-2">
            <p className="small-caps text-[10.5px] tracking-[0.2em] text-gold mb-2">Delivery</p>
            <h2 className="font-serif text-3xl tracking-tight mb-2">Where should we send the tins?</h2>
            <p className="font-sans text-ink/60 text-[15px]">Matte metal tins packed by hand in Ilam paper. Ships within Nepal.</p>
          </div>

          <Field<CheckoutContact>
            id="cc-address"
            name="address"
            label="Street address"
            autoComplete="street-address"
            required
            placeholder="House / tole, nearest landmark"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field<CheckoutContact>
              id="cc-city"
              name="city"
              label="City"
              autoComplete="address-level2"
              required
              placeholder="Kathmandu"
            />
            <SelectField<CheckoutContact>
              id="cc-district"
              name="district"
              label="District"
              options={districtOptList}
              required
            />
          </div>

          <div className="pt-4">
            <p className="small-caps text-[10.5px] tracking-[0.2em] text-ink/55 mb-4">Delivery option</p>
            <div className="grid gap-3">
              {DELIVERY_ROWS.map((r) => {
                const selected = selectedDelivery === r.id;
                return (
                  <label
                    key={r.id}
                    htmlFor={'del-' + r.id}
                    className={cn(
                      'group relative grid grid-cols-[auto,1fr,auto] items-center gap-4 rounded-sm border bg-paper px-4 py-4 cursor-pointer transition-colors',
                      selected ? 'border-gold/70 bg-gold/5' : 'border-ink/12 hover:border-ink/25',
                    )}
                  >
                    <input
                      {...deliveryField}
                      id={'del-' + r.id}
                      type="radio"
                      className="peer sr-only"
                      value={r.id}
                      checked={selected}
                      onChange={() => deliveryField.onChange(r.id)}
                    />
                    <span
                      aria-hidden
                      className={cn(
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
                        selected ? 'border-gold bg-gold' : 'border-ink/25 bg-paper group-hover:border-ink/45',
                      )}
                    >
                      {selected && (
                        <motion.span
                          layoutId="delivery-dot"
                          className="w-2 h-2 rounded-full bg-ink"
                          transition={{ duration: reduced ? 0.12 : 0.28, ease: defaultEasing }}
                        />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-serif text-[17px] tracking-tight text-ink">{r.title}</span>
                      <span className="block text-[13px] text-ink/55 mt-0.5">{r.sub}</span>
                    </span>
                    <span className="text-right tabular-nums font-serif text-[15px] text-ink whitespace-nowrap">
                      {r.id === 'standard' ? (
                        subtotal >= FREE_SHIPPING_THRESHOLD ? (
                          <span className="text-gold font-medium">Free</span>
                        ) : (
                          formatPrice(0)
                        )
                      ) : (
                        formatPrice(deliveryPrice(r.id))
                      )}
                    </span>
                    {selected && !reduced && (
                      <motion.span
                        aria-hidden
                        layoutId="delivery-ring"
                        className="absolute inset-0 rounded-sm pointer-events-none border-[1.5px] border-gold/80"
                        transition={{ duration: 0.3, ease: defaultEasing }}
                      />
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 pt-6 border-t border-ink/10">
            <button
              type="button"
              onClick={() => router.push('/shop')}
              className="small-caps text-[11px] tracking-[0.18em] text-ink/55 hover:text-ink transition-colors"
            >
              ← Back to shop
            </button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isSubmitting}
              iconRight={<ArrowIcon className="w-4 h-4" />}
            >
              Continue to payment
            </Button>
          </div>
        </div>

        <aside className="lg:sticky lg:top-28 self-start space-y-6 pt-6 lg:pt-0">
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
              <div className="flex justify-between text-ink/70">
                <span>Shipping</span>
                <span className="tabular-nums text-ink">
                  {selectedDelivery === 'standard'
                    ? subtotal >= FREE_SHIPPING_THRESHOLD
                      ? 'Free'
                      : formatPrice(0)
                    : formatPrice(deliveryPrice(selectedDelivery))}
                </span>
              </div>
              <div className="flex justify-between pt-3 mt-2 border-t border-ink/10 text-ink">
                <span className="small-caps tracking-[0.18em] text-[11px] text-ink/55 self-center">Total</span>
                <span className="font-serif text-2xl tabular-nums">
                  {formatPrice(subtotal + deliveryPrice(selectedDelivery))}
                </span>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-ink/40 small-caps tracking-[0.2em] leading-relaxed">
            Demo checkout · no payment is processed. Your cart is saved to this browser.
          </p>
        </aside>
      </form>
    </FormProvider>
  );
}
