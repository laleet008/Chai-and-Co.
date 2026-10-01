'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useSpring, useTransform, useMotionValueEvent } from 'framer-motion';
import { Reveal } from '@/components/ui/Reveal';
import { useReducedMotion } from '@/lib/useReducedMotion';

const STATS = [
  { label: 'Metres above sea', value: 1900, suffix: ' m' },
  { label: 'Hectares under leaf', value: 12, suffix: '' },
  { label: 'Pluckers on the hedge', value: 38, suffix: '' },
  { label: 'Years of continuous harvest', value: 54, suffix: '' },
] as const;

function AnimatedStat({ v, label, suffix }: { v: number; label: string; suffix: string }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const spring = useSpring(0, { stiffness: reduced ? 9999 : 55, damping: 16, mass: 0.9 });
  const [display, setDisplay] = useState(reduced ? v : 0);

  useEffect(() => {
    if (inView) spring.set(v);
  }, [inView, spring, v]);

  useMotionValueEvent(spring, 'change', (val) => {
    setDisplay(Math.round(val));
  });

  useEffect(() => {
    if (reduced) setDisplay(v);
  }, [reduced, v]);

  const formatted = display.toLocaleString('en-US');
  return (
    <div className="min-w-0">
      <p className="small-caps text-[10px] tracking-[0.28em] text-paper/45 mb-3">{label}</p>
      <p className="font-serif text-[clamp(2rem,4.4vw,3.2rem)] leading-none tracking-tight text-paper">
        <span ref={ref} className="tabular-nums">{formatted}</span>
        <span className="text-gold/90">{suffix}</span>
      </p>
    </div>
  );
}

export function OriginMap() {
  const ref = useRef<HTMLDivElement>(null!);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const reduced = useReducedMotion();

  return (
    <section
      ref={ref}
      className="bg-night text-paper py-24 md:py-36 overflow-hidden relative"
      aria-labelledby="origin-heading"
    >
      <div className="mx-auto w-[min(92%,1100px)]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-6 relative">
            <Reveal variant="fadeUpSmall">
              <p className="small-caps tracking-[0.28em] text-[11px] mb-4 text-gold/90">
                Origin
              </p>
            </Reveal>
            <Reveal variant="fadeUp" delay={0.05}>
              <h2 id="origin-heading" className="font-serif text-[clamp(2rem,5vw,3.6rem)] tracking-tight leading-[1.04] max-w-[12ch] text-balance mb-6">
                A valley in eastern Nepal.
              </h2>
            </Reveal>
            <Reveal variant="fadeUp" delay={0.12}>
              <p className="font-sans text-[16px] leading-relaxed text-paper/65 max-w-[40ch] mb-10">
                Ilam, Province 1 — rolling hills that run east to the Kanchenjunga
                range. Mist settles most mornings; the monsoon lasts 14 weeks.
                Twelve hectares of Camellia sinensis on terraces cut by hand in 1971.
              </p>
            </Reveal>

            <div className="grid grid-cols-2 gap-x-6 gap-y-10">
              {STATS.map((s) => (
                <AnimatedStat
                  key={s.label}
                  label={s.label}
                  v={s.value}
                  suffix={s.suffix}
                />
              ))}
            </div>
          </div>

          <div className="md:col-span-6 relative">
            <div className="relative w-full aspect-[4/3] md:aspect-square">
              <svg
                aria-hidden
                viewBox="0 0 600 600"
                className="absolute inset-0 w-full h-full"
              >
                <defs>
                  <radialGradient id="ilamGlow" cx="62%" cy="58%" r="18%">
                    <stop offset="0%" stopColor="#C9A227" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#C9A227" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <rect width="600" height="600" fill="transparent" />
                <circle cx="372" cy="350" r="120" fill="url(#ilamGlow)" />
                <motion.path
                  d="M 90 210 C 140 140 230 90 310 100 C 410 112 495 160 540 230 C 555 260 548 310 515 340 C 480 375 475 420 455 470 C 435 520 380 540 320 530 C 260 520 210 498 165 458 C 110 408 72 345 68 280 C 64 225 74 250 90 210 Z"
                  fill="none"
                  stroke="rgba(244,240,232,0.55)"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  style={{
                    strokeDasharray: 2600,
                    strokeDashoffset: 2600,
                    transition: inView && !reduced
                      ? 'stroke-dashoffset 3.5s cubic-bezier(0.16,1,0.3,1) 0.2s'
                      : 'none',
                    ...(inView ? { strokeDashoffset: 0 } : null),
                  }}
                />
                <motion.path
                  d="M 280 310 C 330 300 360 330 385 348 C 410 365 440 380 460 370 C 480 360 495 335 515 340"
                  fill="none"
                  stroke="rgba(199,203,196,0.4)"
                  strokeWidth="1.2"
                  strokeDasharray="4 6"
                />
                <g>
                  <motion.circle
                    cx="372"
                    cy="350"
                    r="24"
                    fill="none"
                    stroke="#C9A227"
                    strokeWidth="1.5"
                    initial={reduced ? { scale: 1, opacity: 0.6 } : { scale: 0, opacity: 0 }}
                    animate={inView ? { scale: [0, 1.1, 1], opacity: [0, 0.9, 0.7] } : {}}
                    transition={reduced ? {} : {
                      delay: 1.5, duration: 1.8, ease: [0.16, 1, 0.3, 1],
                      repeat: Infinity, repeatDelay: 1.1,
                    }}
                  />
                  <motion.circle
                    cx="372"
                    cy="350"
                    r="6"
                    fill="#C9A227"
                    initial={reduced ? { scale: 1 } : { scale: 0 }}
                    animate={inView ? { scale: [0, 1.25, 1] } : {}}
                    transition={reduced ? {} : { delay: 1.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  />
                  <motion.text
                    x="372"
                    y="395"
                    textAnchor="middle"
                    fill="#F4F0E8"
                    fontFamily="'Inter', system-ui, sans-serif"
                    fontSize="14"
                    letterSpacing="4"
                    style={{
                      opacity: 0,
                      transition: inView && !reduced
                        ? 'opacity 0.6s ease 1.3s'
                        : 'none',
                      ...(inView ? { opacity: 0.7 } : null),
                    }}
                  >
                    ILAM
                  </motion.text>
                </g>
                <text
                  x="505"
                  y="215"
                  fill="rgba(244,240,232,0.45)"
                  fontFamily="'Inter', system-ui, sans-serif"
                  fontSize="11"
                  letterSpacing="3"
                  textAnchor="end"
                >
                  NEPAL
                </text>
                <text
                  x="100"
                  y="215"
                  fill="rgba(244,240,232,0.45)"
                  fontFamily="'Inter', system-ui, sans-serif"
                  fontSize="11"
                  letterSpacing="3"
                >
                  CHINA
                </text>
                <text
                  x="100"
                  y="500"
                  fill="rgba(244,240,232,0.45)"
                  fontFamily="'Inter', system-ui, sans-serif"
                  fontSize="11"
                  letterSpacing="3"
                >
                  INDIA
                </text>
                <text
                  x="475"
                  y="495"
                  fill="rgba(244,240,232,0.45)"
                  fontFamily="'Inter', system-ui, sans-serif"
                  fontSize="11"
                  letterSpacing="3"
                >
                  BANGLADESH
                </text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
