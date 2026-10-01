'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Reveal } from '@/components/ui/Reveal';
import { SplitText } from '@/components/ui/SplitText';
import { useReducedMotion } from '@/lib/useReducedMotion';

const STEPS = [
  {
    no: '01',
    title: 'Pluck',
    kicker: 'Dawn · April',
    body:
      'Two leaves and a bud, never more. Our pluckers move up and down the terraces at first light, before the sun clears the ridge. Anything below-standard goes back into the hedge as green manure.',
    color: '#6B8F5E',
    svg: (active: boolean) => (
      <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path
          d="M20 95 C 35 85 45 95 60 85 C 75 75 85 85 100 80 C 115 75 125 85 140 75"
          stroke="#6B8F5E"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          style={active ? { strokeDasharray: 200, strokeDashoffset: 0, transition: 'stroke-dashoffset 1.1s ease' } : { strokeDasharray: 200, strokeDashoffset: 200 }}
        />
        <g style={{ opacity: active ? 1 : 0, transition: 'opacity 0.6s ease 0.35s' }}>
          <path d="M58 84 C 56 74 62 64 72 64 C 78 64 82 70 80 76 C 84 70 90 66 96 68 C 100 70 100 76 96 80 C 100 76 106 72 112 74 C 116 76 116 82 112 84 Z" fill="#6B8F5E" opacity="0.85"/>
          <circle cx="92" cy="72" r="2.5" fill="#1A1714"/>
        </g>
      </svg>
    ),
  },
  {
    no: '02',
    title: 'Wither',
    kicker: '14–18 hours',
    body:
      'Laid out on woven bamboo racks in open-air sheds. 60% of the moisture leaves slowly; the grassy compounds break down. The leaf becomes pliable — it will twist without tearing.',
    color: '#C9A227',
    svg: (active: boolean) => (
      <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M18 95 L 142 95" stroke="#1A1714" strokeOpacity="0.15" strokeWidth="2" strokeLinecap="round"/>
        {[30, 52, 74, 96, 118].map((x, i) => (
          <motion.path
            key={x}
            d={`M${x} 92 C ${x + 8} 78 ${x - 4} 68 ${x + 10} 56`}
            stroke="#C9A227"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            initial={false}
            animate={active ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
        {active && [36, 58, 80, 102, 124].map((x, i) => (
          <motion.circle
            key={x}
            cx={x}
            cy={70 - i * 2}
            r="18"
            fill="#C9A227"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.08, 0] }}
            transition={{ duration: 2.4, delay: i * 0.35, repeat: Infinity, ease: 'easeOut' }}
          />
        ))}
      </svg>
    ),
  },
  {
    no: '03',
    title: 'Roll',
    kicker: 'Hand-rolled',
    body:
      'Small batches rolled on bamboo mats — breaking the cell walls, releasing the oils and enzymes. The twist gives the leaf its shape; the pressure decides how brisk the cup.',
    color: '#B3541E',
    svg: (active: boolean) => (
      <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <motion.g
          animate={active ? { rotate: 360 } : {}}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
          style={{ transformOrigin: '80px 60px', opacity: active ? 1 : 0 }}
        >
          <ellipse cx="80" cy="60" rx="46" ry="14" fill="none" stroke="#B3541E" strokeWidth="2" opacity="0.9"/>
          <ellipse cx="80" cy="60" rx="30" ry="9" fill="none" stroke="#B3541E" strokeWidth="1.5" opacity="0.6"/>
          <path d="M38 58 C 60 52 100 68 122 62" stroke="#1A1714" strokeOpacity="0.3" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </motion.g>
        <motion.path
          d="M 50 78 C 70 92 90 92 110 78"
          stroke="#1A1714"
          strokeOpacity="0.15"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          initial={false}
          animate={active ? { pathLength: 1, opacity: 0.15 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
    ),
  },
  {
    no: '04',
    title: 'Dry',
    kicker: '120 °C · 18 min',
    body:
      'A final pass through a charcoal-fired dryer locks in the flavour. Moisture drops to 3%; the leaves are ready to rest, grade and be sealed into tins within 48 hours.',
    color: '#4F6F52',
    svg: (active: boolean) => (
      <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect x="30" y="72" width="100" height="32" rx="4" fill="none" stroke="#4F6F52" strokeWidth="2.2" style={active ? { strokeDasharray: 300, strokeDashoffset: 0, transition: 'stroke-dashoffset 0.9s ease' } : { strokeDasharray: 300, strokeDashoffset: 300 }}/>
        <line x1="40" y1="72" x2="40" y2="104" stroke="#4F6F52" strokeOpacity="0.35" strokeWidth="1.5" style={active ? { opacity: 0.35 } : { opacity: 0, transition: 'opacity 0.5s ease 0.4s' }}/>
        <line x1="120" y1="72" x2="120" y2="104" stroke="#4F6F52" strokeOpacity="0.35" strokeWidth="1.5" style={active ? { opacity: 0.35 } : { opacity: 0, transition: 'opacity 0.5s ease 0.5s' }}/>
        {active && [0, 1, 2].map((i) => (
          <motion.path
            key={i}
            d={`M${55 + i * 22} 70 C ${58 + i * 22} 52 ${52 + i * 22} 40 ${60 + i * 22} 24`}
            stroke="#C9A227"
            strokeOpacity="0.8"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1, opacity: [0, 0.9, 0] }}
            transition={{ duration: 2, delay: i * 0.35, repeat: Infinity, ease: 'easeOut' }}
          />
        ))}
      </svg>
    ),
  },
] as const;

export function ProcessTimeline() {
  const ref = useRef<HTMLDivElement>(null!);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 70%', 'end 30%'],
  });
  const lineFill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={ref} className="bg-paper py-24 md:py-36 px-6">
      <div className="mx-auto w-[min(92%,1100px)]">
        <div className="max-w-2xl mb-16 md:mb-24">
          <Reveal variant="fadeUpSmall">
            <p className="small-caps tracking-[0.28em] text-[11px] mb-4" style={{ color: '#B3541E' }}>
              Process
            </p>
          </Reveal>
          <Reveal variant="fadeUp" delay={0.05}>
            <h2 className="font-serif text-[clamp(2rem,5vw,3.6rem)] tracking-tight leading-[1.04] text-ink max-w-[14ch] text-balance mb-5">
              <SplitText text="A slow, deliberate day." as="words" />
            </h2>
          </Reveal>
          <Reveal variant="fadeUp" delay={0.12}>
            <p className="font-sans text-[17px] leading-relaxed text-ink/70 max-w-[46ch]">
              From first pluck to sealed tin, every batch passes through four stations
              inside one estate. Nothing crosses a district border in between.
            </p>
          </Reveal>
        </div>

        <div className="relative">
          <div
            aria-hidden
            className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-px bg-ink/12 overflow-hidden"
          >
            <motion.div
              className="absolute inset-x-0 top-0 origin-top"
              style={{
                scaleY: reduced ? 1 : lineFill,
                height: '100%',
                background: '#B3541E',
              }}
            />
          </div>

          <ol className="space-y-16 md:space-y-28">
            {STEPS.map((s, i) => (
              <Step key={s.no} step={s} index={i} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Step({ step, index }: { step: (typeof STEPS)[number]; index: number }) {
  const ref = useRef<HTMLLIElement>(null!);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const right = index % 2 === 1;
  return (
    <li
      ref={ref}
      className={
        'relative grid grid-cols-1 md:grid-cols-2 md:gap-16 gap-8 items-center ' +
        (right ? 'md:[&>*:first-child]:order-2' : '')
      }
    >
      <div className="pl-14 md:pl-0 md:px-10">
        <Reveal variant="fadeUpSmall">
          <p
            className="small-caps tracking-[0.28em] text-[10px] mb-3"
            style={{ color: step.color }}
          >
            Step {step.no} · {step.kicker}
          </p>
        </Reveal>
        <Reveal variant="fadeUp" delay={0.05}>
          <h3 className="font-serif text-4xl md:text-5xl tracking-tight leading-[1.02] mb-4 text-ink max-w-[10ch]">
            {step.title}.
          </h3>
        </Reveal>
        <Reveal variant="fadeUp" delay={0.12}>
          <p className="font-sans text-[16px] leading-relaxed text-ink/70 max-w-[42ch]">
            {step.body}
          </p>
        </Reveal>
      </div>
      <div className="relative pl-14 md:pl-0 md:px-10">
        <div
          className="relative h-40 md:h-48 bg-cream/60 rounded-sm border border-ink/5 overflow-hidden"
          aria-hidden
        >
          {step.svg(inView)}
        </div>
      </div>
      <div
        aria-hidden
        className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-1.5 md:top-[92px] w-4 h-4 rounded-full border-[3px] bg-paper transition-all duration-700"
        style={{
          borderColor: step.color,
          boxShadow: inView ? `0 0 0 6px ${step.color}18` : 'none',
          transform: inView
            ? 'translate(-50%, 0) scale(1)'
            : 'translate(-50%, 0) scale(0.7)',
          opacity: inView ? 1 : 0.4,
        }}
      />
    </li>
  );
}
