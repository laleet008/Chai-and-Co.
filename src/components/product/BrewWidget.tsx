'use client';

import { motion, useSpring, useTransform, useMotionValueEvent } from 'framer-motion';
import { useMemo, useRef, useState } from 'react';
import type { Product } from '@/lib/products';
import { formatPrice } from '@/lib/format';
import { priceForSize } from '@/lib/products';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { useCartStore } from '@/store/cart';
import { useUIStore } from '@/store/ui';
import { useFlyToCart } from '@/components/cart/FlyToCart';

type Props = {
  product: Product;
};

function dialAngleForTemp(tempC: number) {
  const min = 70;
  const max = 100;
  const clamped = Math.min(max, Math.max(min, tempC));
  const t = (clamped - min) / (max - min);
  return -110 + t * 220;
}

export function BrewWidget({ product }: { product: Product }) {
  const reduced = useReducedMotion();
  const [temp, setTemp] = useState<number>(product.brewing.waterTempC);
  const [steepSeconds, setSteepSeconds] = useState<number>(product.brewing.steepSeconds);
  const angle = useSpring(dialAngleForTemp(temp), { stiffness: 160, damping: 22 });
  const needleRotate = useTransform(angle, (a) => a);
  const [dragging, setDragging] = useState(false);

  useMotionValueEvent(angle, 'change', (a) => {
    const norm = (a + 110) / 220;
    const min = 70;
    const max = 100;
    const v = Math.round(min + norm * (max - min));
    if (!dragging && Math.abs(v - temp) > 0.1) {
      /* no-op; state drives spring, not the inverse */
    }
  });

  function onDialDrag(_e: any, info: { point: { x: number; y: number } }) {
    const r = 90;
    const cx = 0;
    const cy = 0;
    const dx = info.point.x - cx;
    const dy = info.point.y - cy;
    let deg = (Math.atan2(dy, dx) * 180) / Math.PI;
    const minDeg = -110;
    const maxDeg = 110;
    deg = Math.min(maxDeg, Math.max(minDeg, deg));
    angle.set(deg);
    const norm = (deg + 110) / 220;
    const min = 70;
    const max = 100;
    setTemp(Math.round(min + norm * (max - min)));
  }

  const steepProgress = useMemo(() => {
    const min = product.brewing.steepSecondsRange?.[0] ?? 60;
    const max = product.brewing.steepSecondsRange?.[1] ?? 480;
    return Math.min(1, Math.max(0, (steepSeconds - min) / (max - min)));
  }, [steepSeconds, product.brewing]);

  const cupLiquor = useMemo(() => {
    const depth = steepProgress * 0.85 + 0.15;
    const hot = temp > 92;
    const cool = temp < 82;
    const base = product.type === 'green'
      ? ['#d5d87a', '#8a8f3e']
      : product.type === 'white'
      ? ['#eadfba', '#c8b270']
      : hot
      ? ['#b3541e', '#5c2a0b']
      : ['#c2783a', '#6f3d14'];
    const mid = cool ? base[0] : base[1];
    return { height: depth, color: mid };
  }, [steepProgress, temp, product.type]);

  const mm = Math.floor(steepSeconds / 60);
  const ss = steepSeconds % 60;

  return (
    <div className="rounded-sm border border-ink/10 bg-cream/60 p-6 md:p-8 mt-14">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <p className="small-caps text-ink/50 mb-2">Brewing widget</p>
          <p className="font-serif text-2xl tracking-tight max-w-md">
            Dial in your cup.
          </p>
        </div>
        <div className="text-right">
          <p className="small-caps text-ink/50 text-[10px]">Leaf</p>
          <p className="font-serif text-lg">
            {product.brewing.leafPerCupG} g / 250 ml
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-2 flex items-center justify-center">
          <div
            className="relative"
            style={{ width: 200, height: 200 }}
          >
            <svg viewBox="-100 -100 200 200" width="200" height="200" aria-hidden>
              <circle cx="0" cy="0" r="78" fill="#F4F0E8" stroke="#1A1714" strokeOpacity="0.08" />
              {!reduced && (
                <>
                  {Array.from({ length: 11 }).map((_, i) => {
                    const a = -110 + (i / 10) * 220;
                    const rad = (a * Math.PI) / 180;
                    const sx = Math.cos(rad) * 70;
                    const sy = Math.sin(rad) * 70;
                    const ex = Math.cos(rad) * 62;
                    const ey = Math.sin(rad) * 62;
                    return (
                      <line
                        key={i}
                        x1={sx}
                        y1={sy}
                        x2={ex}
                        y2={ey}
                        stroke="#1A1714"
                        strokeOpacity="0.3"
                        strokeWidth="1"
                      />
                    );
                  })}
                  {[70, 80, 90, 100].map((tick, i) => {
                    const a = -110 + (i / 3) * 220;
                    const rad = (a * Math.PI) / 180;
                    const x = Math.cos(rad) * 52;
                    const y = Math.sin(rad) * 52 + 3;
                    return (
                      <text
                        key={tick}
                        x={x}
                        y={y}
                        textAnchor="middle"
                        fontSize="8"
                        fontFamily="'Inter', system-ui, sans-serif"
                        fill="#1A1714"
                        opacity="0.55"
                      >
                        {tick}°
                      </text>
                    );
                  })}
                </>
              )}
              <g
                onPointerDown={() => setDragging(true)}
                onPointerUp={() => setDragging(false)}
                onPointerLeave={() => setDragging(false)}
              >
                <motion.circle
                  cx="0"
                  cy="0"
                  r="48"
                  fill="#1A1714"
                  fillOpacity="0.04"
                  style={{ cursor: reduced ? 'default' : 'grab' }}
                  drag={reduced ? false : true}
                  dragControls={undefined as any}
                  onDrag={onDialDrag}
                  dragElastic={0}
                  dragMomentum={false}
                />
                <motion.line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="-56"
                  stroke={product.accent}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  style={{ rotate: needleRotate, transformOrigin: '0px 0px' }}
                />
                <circle cx="0" cy="0" r="5" fill={product.accent} />
              </g>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none pt-16">
              <div className="text-center">
                <p className="font-serif text-4xl tracking-tight leading-none text-ink">
                  {temp}
                  <span className="text-xl text-ink/50">°C</span>
                </p>
                <p className="small-caps text-ink/40 text-[10px] mt-1">
                  Water
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 flex items-center justify-center">
          <svg viewBox="0 0 200 180" width="180" height="160" aria-hidden>
            <g transform="translate(40, 40)">
              <path
                d="M10 20 L10 90 C10 110 30 120 60 120 C90 120 110 110 110 90 L110 20 Z"
                fill="#F4F0E8"
                stroke="#1A1714"
                strokeOpacity="0.15"
                strokeWidth="1.5"
              />
              <clipPath id="cup-clip">
                <path d="M12 22 L12 88 C12 108 30 118 60 118 C90 118 108 108 108 88 L108 22 Z" />
              </clipPath>
              <g clipPath="url(#cup-clip)">
                <motion.rect
                  x="8"
                  y="120"
                  width="104"
                  height="104"
                  fill={cupLiquor.color}
                  animate={{ y: 120 - cupLiquor.height * 90 }}
                  transition={{ duration: reduced ? 0.1 : 0.7, ease: [0.16, 1, 0.3, 1] }}
                />
              </g>
              <path
                d="M10 20 L110 20"
                stroke="#1A1714"
                strokeOpacity="0.3"
                strokeWidth="1"
              />
              <path
                d="M110 40 C132 40 144 58 142 74 C140 90 126 100 110 94"
                fill="none"
                stroke="#1A1714"
                strokeOpacity="0.18"
                strokeWidth="1.5"
              />
              {!reduced && (
                <g opacity="0.35">
                  {[0, 1, 2].map((i) => (
                    <motion.path
                      key={i}
                      d={`M${40 + i * 18} 6 Q${44 + i * 18} -4 ${48 + i * 18} 6 Q${44 + i * 18} 12 ${40 + i * 18} 6 Z`}
                      fill="#C7CBC4"
                      animate={{
                        y: [-2, -14, -2],
                        opacity: [0, 0.4, 0],
                      }}
                      transition={{
                        duration: 3 + i * 0.4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 0.6,
                      }}
                    />
                  ))}
                </g>
              )}
            </g>
          </svg>
        </div>

        <div className="md:col-span-1 flex flex-col justify-between gap-4">
          <div>
            <p className="small-caps text-ink/50 text-[10px] mb-1">Steep time</p>
            <p className="font-serif text-3xl tracking-tight tabular-nums">
              {mm}:{String(ss).padStart(2, '0')}
            </p>
            <input
              type="range"
              min={product.brewing.steepSecondsRange?.[0] ?? 60}
              max={product.brewing.steepSecondsRange?.[1] ?? 480}
              step={15}
              value={steepSeconds}
              onChange={(e) => setSteepSeconds(parseInt(e.target.value, 10))}
              className="w-full accent-clay mt-3"
              aria-label={`Steep time, currently ${mm} minutes ${ss} seconds`}
            />
            <div className="flex justify-between mt-1 text-[10px] font-sans text-ink/40">
              <span>{Math.round((product.brewing.steepSecondsRange?.[0] ?? 60) / 60 * 10) / 10}m</span>
              <span>{Math.round((product.brewing.steepSecondsRange?.[1] ?? 480) / 60 * 10) / 10}m</span>
            </div>
          </div>
          <div className="pt-4 border-t border-ink/10">
            <p className="small-caps text-ink/50 text-[10px] mb-1">Infusions</p>
            <p className="font-serif text-2xl">
              {product.brewing.infusions}
              <span className="text-base text-ink/40"> cups</span>
            </p>
          </div>
          <div>
            <p className="small-caps text-ink/50 text-[10px] mb-1">Water</p>
            <p className="font-serif text-lg capitalize">
              {product.brewing.water}
            </p>
          </div>
        </div>
      </div>

      <ul className="pt-6 mt-6 border-t border-ink/10 space-y-2">
        {product.brewing.notes.map((n) => (
          <li key={n} className="flex gap-3 text-[14.5px] text-ink/70">
            <span
              className="mt-1.5 shrink-0 w-1 h-1 rounded-full"
              style={{ background: product.accent }}
              aria-hidden
            />
            <span>{n}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BuyBox({ product }: Props) {
  const reduced = useReducedMotion();
  const [sizeGrams, setSizeGrams] = useState<number>(product.sizes[1]?.grams ?? product.baseGrams);
  const [qty, setQty] = useState<number>(1);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { fly } = useFlyToCart();

  const unitPrice = priceForSize(product, sizeGrams);
  const total = unitPrice * qty;

  function stepQty(delta: number) {
    setQty((v) => Math.min(20, Math.max(1, v + delta)));
  }

  function handleAdd() {
    const add = useCartStore.getState().addItem;
    const size = product.sizes.find((s) => s.grams === sizeGrams) || product.sizes[product.sizes.length - 1];
    const btn = buttonRef.current;
    const rect = btn?.getBoundingClientRect();
    const { key, unitPrice: lineUnit } = add({
      product,
      sizeGrams: size.grams,
      qty,
    });
    if (rect) {
      fly({
        accent: product.accent,
        fromRect: rect,
        key,
      });
    } else {
      window.dispatchEvent(new CustomEvent('cart:pulse'));
      window.setTimeout(() => {
        window.dispatchEvent(new CustomEvent('cart:fly-complete', { detail: { key } }));
      }, 180);
    }
    void lineUnit;
  }

  return (
    <div className="border-y border-ink/10 py-8 space-y-7">
      <div>
        <p className="small-caps text-ink/50 mb-3">Size</p>
        <div className="grid grid-cols-3 gap-2">
          {product.sizes.map((size) => {
            const active = size.grams === sizeGrams;
            const thisPrice = priceForSize(product, size.grams);
            return (
              <button
                key={size.grams}
                type="button"
                aria-pressed={active}
                onClick={() => setSizeGrams(size.grams)}
                className={
                  'relative rounded-sm border p-3 text-left transition-all duration-300 ' +
                  (active
                    ? 'bg-ink text-paper border-ink'
                    : 'bg-paper text-ink border-ink/12 hover:border-ink/30')
                }
              >
                <p className="font-serif text-lg tracking-tight">
                  {size.grams}
                  <span className={'text-xs ml-1 ' + (active ? 'text-paper/60' : 'text-ink/40')}>g</span>
                </p>
                <p className={'small-caps text-[10px] mt-0.5 ' + (active ? 'text-paper/60' : 'text-ink/40')}>
                  {size.label.split(' · ').slice(1).join(' · ') || 'Tin'}
                </p>
                <p className={'font-mono text-[11px] mt-2 tabular-nums ' + (active ? 'text-paper/80' : 'text-ink/60')}>
                  {formatPrice(thisPrice)}
                </p>
                {active && (
                  <motion.span
                    aria-hidden
                    layoutId={`size-${product.id}`}
                    className="absolute inset-0 rounded-sm pointer-events-none border-2 border-gold"
                    transition={reduced ? {} : { duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="small-caps text-ink/50 mb-1">Quantity</p>
          <div className="flex items-center h-11 border border-ink/10 rounded-sm overflow-hidden">
            <button
              type="button"
              onClick={() => stepQty(-1)}
              className="w-11 h-full hover:bg-cream transition-colors text-ink text-xl"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <div className="h-full w-14 relative overflow-hidden font-serif text-xl">
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span
                  key={qty}
                  initial={reduced ? {} : { y: '-110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: reduced ? 0.1 : 0.45, ease: [0.16, 1, 0.3, 1] }}
                  aria-live="polite"
                >
                  {qty}
                </motion.span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => stepQty(1)}
              className="w-11 h-full hover:bg-cream transition-colors text-ink text-xl"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
        <div className="text-right">
          <p className="small-caps text-ink/40 text-[10px]">Total</p>
          <p className="font-serif text-3xl tracking-tight text-ink tabular-nums">
            {formatPrice(total)}
          </p>
        </div>
      </div>

      <button
        type="button"
        ref={buttonRef}
        onClick={handleAdd}
        className="group relative w-full h-14 rounded-sm overflow-hidden text-paper bg-ink hover:bg-night focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
      >
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-0 group-hover:w-full bg-clay transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        />
        <span className="relative z-10 small-caps tracking-widest text-xs">
          Add to cart · {qty} × {formatPrice(unitPrice)}
        </span>
      </button>

      <p className="small-caps text-ink/40 text-[10px] text-center">
        Free shipping over NPR 3,000 · Matte metal tin · No tea bag, ever.
      </p>
    </div>
  );
}
