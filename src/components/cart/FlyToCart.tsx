'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { defaultEasing } from '@/lib/motion';
import { cn } from '@/lib/cn';
import { motion } from 'framer-motion';

type FlightPayload = {
  id: string;
  accent: string;
  fromRect: DOMRect;
  targetSelector?: string;
  key?: string;
};

type FlyCtx = {
  fly: (p: Omit<FlightPayload, 'id'>) => void;
};

const Ctx = createContext<FlyCtx | null>(null);

export function useFlyToCart(): FlyCtx {
  const ctx = useContext(Ctx);
  if (!ctx) {
    return { fly: () => {} };
  }
  return ctx;
}

function bezier(t: number, from: number, ctrl: number, to: number) {
  const u = 1 - t;
  return u * u * from + 2 * u * t * ctrl + t * t * to;
}

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export function FlyToCartProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [flights, setFlights] = useState<FlightPayload[]>([]);
  const queueRef = useRef<FlightPayload[]>([]);
  const cooldownRef = useRef(false);

  useEffect(() => setMounted(true), []);

  const drain = useCallback(() => {
    if (cooldownRef.current) return;
    const next = queueRef.current.shift();
    if (!next) return;
    cooldownRef.current = true;
    setFlights((prev) => [...prev, next]);
    const duration = reduced ? 220 : 760;
    const gap = reduced ? 40 : 80;
    window.setTimeout(() => {
      cooldownRef.current = false;
      if (queueRef.current.length) drain();
    }, duration + gap);
  }, [reduced]);

  const fly = useCallback<FlyCtx['fly']>(
    (p) => {
      if (typeof window === 'undefined') return;
      const id = `fly-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      if (reduced) {
        window.dispatchEvent(new CustomEvent('cart:pulse'));
        window.setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent('cart:fly-complete', { detail: { key: p.key } }),
          );
        }, 220);
        return;
      }
      queueRef.current.push({ id, ...p });
      window.requestAnimationFrame(() => drain());
    },
    [drain, reduced],
  );

  const onDone = useCallback((id: string, key?: string) => {
    setFlights((prev) => prev.filter((f) => f.id !== id));
    window.dispatchEvent(new CustomEvent('cart:pulse'));
    window.setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent('cart:fly-complete', { detail: { key } }),
      );
    }, 200);
  }, []);

  return (
    <Ctx.Provider value={{ fly }}>
      {children}
      {mounted &&
        createPortal(
          <div className="pointer-events-none" aria-hidden>
            {flights.map((f) => (
              <FlightSprite
                key={f.id}
                id={f.id}
                accent={f.accent}
                fromRect={f.fromRect}
                targetSelector={f.targetSelector}
                onDone={() => onDone(f.id, f.key)}
              />
            ))}
          </div>,
          document.body,
        )}
    </Ctx.Provider>
  );
}

function FlightSprite({
  id,
  accent,
  fromRect,
  targetSelector,
  onDone,
}: {
  id: string;
  accent: string;
  fromRect: DOMRect;
  targetSelector?: string;
  onDone: () => void;
}) {
  const W = 72;
  const H = Math.round(W * 1.4);
  const fromX = fromRect.left + fromRect.width / 2 - W / 2;
  const fromY = fromRect.top + fromRect.height / 2 - H / 2;
  const elRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const from = { x: fromX, y: fromY };
    const targetEl =
      (targetSelector &&
        document.querySelector<HTMLElement>(targetSelector)) ||
      document.querySelector<HTMLElement>('[data-cart-icon="true"]');
    const tr = targetEl?.getBoundingClientRect();
    const to = tr
      ? { x: tr.left + tr.width / 2 - W / 2, y: tr.top + tr.height / 2 - H / 2 }
      : from;
    const ctrl = {
      x: (from.x + to.x) / 2,
      y: Math.min(from.y, to.y) - Math.abs(to.x - from.x) * 0.28 - 80,
    };
    const start = performance.now();
    const dur = 750;
    const step = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / dur));
      const e = easeInOutCubic(t);
      const x = bezier(e, from.x, ctrl.x, to.x);
      const y = bezier(e, from.y, ctrl.y, to.y);
      const s = 1 - 0.65 * e;
      const rot = (1 - e) * -16 + e * 8;
      const op = 1 - 0.4 * e;
      const n = elRef.current;
      if (n) {
        n.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rot}deg) scale(${s})`;
        n.style.opacity = `${op}`;
      }
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = null;
        onDoneRef.current?.();
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [fromX, fromY, W, H, targetSelector]);

  const gid = `fly-${id}`;
  return (
    <div
      ref={elRef}
      className="fixed inset-0 pointer-events-none"
      style={{ width: W, height: H, zIndex: 80, willChange: 'transform' }}
    >
      <svg width="100%" height="100%" viewBox="0 0 100 140" aria-hidden>
        <defs>
          <linearGradient id={`${gid}-g`} x1="0" x2="1">
            <stop offset="0" stopColor={accent} stopOpacity="0.8" />
            <stop offset="0.5" stopColor={accent} />
            <stop offset="1" stopColor={accent} stopOpacity="0.72" />
          </linearGradient>
          <linearGradient id={`${gid}-h`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.42" />
            <stop offset="0.25" stopColor="#fff" stopOpacity="0.02" />
            <stop offset="1" stopColor="#000" stopOpacity="0.24" />
          </linearGradient>
        </defs>
        <rect x="14" y="22" width="72" height="104" rx="8" fill={`url(#${gid}-g)`} />
        <rect x="14" y="22" width="72" height="104" rx="8" fill={`url(#${gid}-h)`} />
        <rect x="10" y="13" width="80" height="16" rx="5" fill="#221D18" />
        <rect x="22" y="52" width="56" height="52" rx="3" fill="#F4F0E8" />
        <text x="50" y="74" textAnchor="middle" fontFamily="serif" fontSize="10" fontWeight="500" fill="#1A1714">
          C &amp; Co.
        </text>
        <line x1="32" y1="84" x2="68" y2="84" stroke="#1A1714" strokeOpacity="0.25" strokeWidth="0.6" />
      </svg>
    </div>
  );
}

export function CartBadgeWithPulse({
  count,
  children,
}: {
  count: number;
  children: ReactNode;
}) {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const badgeRef = useRef<HTMLSpanElement | null>(null);
  const prevCountRef = useRef<number>(count);

  useEffect(() => {
    function pulse() {
      const w = wrapRef.current;
      const r = ringRef.current;
      if (w && !reduced) {
        w.animate(
          [
            { transform: 'scale(1)' },
            { transform: 'scale(1.18)' },
            { transform: 'scale(0.93)' },
            { transform: 'scale(1.05)' },
            { transform: 'scale(1)' },
          ],
          { duration: 520, easing: defaultEasing as any },
        );
      }
      if (r && !reduced) {
        r.animate(
          [
            { opacity: 0.85, transform: 'scale(0.6)' },
            { opacity: 0, transform: 'scale(2.3)' },
          ],
          { duration: 650, easing: defaultEasing as any },
        );
      }
    }
    window.addEventListener('cart:pulse', pulse);
    return () => window.removeEventListener('cart:pulse', pulse);
  }, [reduced]);

  const delta = count - prevCountRef.current;

  return (
    <div
      ref={wrapRef}
      data-cart-icon="true"
      className={cn('relative inline-flex items-center justify-center')}
    >
      <motion.div
        aria-hidden
        ref={ringRef}
        className={cn(
          'absolute -inset-2 rounded-full pointer-events-none border-2 border-gold/70',
        )}
        style={{ opacity: 0, transform: 'scale(0.6)' }}
      />
      {children}
      {count > 0 && (
        <motion.span
          ref={badgeRef}
          key={count}
          initial={reduced || delta <= 0 ? {} : { y: 6, opacity: 0, scale: 0.7 }}
          animate={
            reduced || delta <= 0
              ? { y: 0, opacity: 1, scale: 1 }
              : {
                  y: 0,
                  opacity: 1,
                  scale: [1, 1.35, 1],
                  transition: {
                    scale: {
                      duration: 0.42,
                      times: [0, 0.35, 1],
                      ease: [0.34, 1.56, 0.64, 1],
                    },
                  },
                }
          }
          className="absolute -top-2 -right-3 min-w-[20px] h-5 px-1.5 rounded-full bg-clay text-paper text-[10.5px] font-sans font-semibold tabular-nums flex items-center justify-center border border-paper/70"
          aria-hidden="true"
        >
          {count > 99 ? '99+' : count}
        </motion.span>
      )}
    </div>
  );
}
