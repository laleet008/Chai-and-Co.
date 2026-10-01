'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { PRODUCTS, priceForSize, TEA_TYPE_LABELS } from '@/lib/products';
import { formatPrice } from '@/lib/format';
import { DynamicTeaTin } from '@/components/three/DynamicTeaTin';
import { Chip } from '@/components/ui/Chip';
import { ArrowIcon } from '@/components/ui/Icons';
import { Reveal } from '@/components/ui/Reveal';
import { useReducedMotion } from '@/lib/useReducedMotion';

export function CollectionRail() {
  const ref = useRef<HTMLDivElement>(null!);
  const trackRef = useRef<HTMLDivElement>(null!);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const translateX = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? ['0%', '0%'] : ['8%', '-30%'],
  );

  return (
    <section ref={ref} className="bg-paper py-24 md:py-32 overflow-hidden">
      <div className="mx-auto w-[min(92%,1100px)] mb-14 md:mb-20 px-0">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <Reveal variant="fadeUpSmall">
              <p className="small-caps tracking-[0.28em] text-[11px] mb-4" style={{ color: '#B3541E' }}>
                The collection
              </p>
            </Reveal>
            <Reveal variant="fadeUp" delay={0.05}>
              <h2 className="font-serif text-[clamp(2rem,5vw,3.6rem)] tracking-tight leading-[1.04] max-w-[14ch] text-balance text-ink">
                Four single-estate teas.
              </h2>
            </Reveal>
          </div>
          <Reveal variant="fadeUp" delay={0.1}>
            <Link
              href="/shop"
              className="group small-caps tracking-[0.22em] text-[12px] text-ink/70 hover:text-clay flex items-center gap-2"
            >
              <span>All teas</span>
              <ArrowIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </div>

      <motion.div
        ref={trackRef}
        style={{ x: translateX }}
        className="flex items-stretch gap-5 md:gap-8 px-[4vw]"
      >
        {PRODUCTS.map((p, i) => (
          <motion.div
            key={p.id}
            style={{ flex: '0 0 min(82vw, 360px)' }}
            whileHover="hover"
            initial="rest"
          >
            <Link
              href={`/product/${p.slug}`}
              className="group relative block aspect-[4/5] bg-cream rounded-sm overflow-hidden border border-ink/5"
            >
              <motion.div
                aria-hidden
                className="absolute inset-0 origin-bottom pointer-events-none"
                style={{ background: p.accent }}
                variants={{
                  rest: { opacity: 0, scaleY: 0 },
                  hover: { opacity: 0.12, scaleY: 1 },
                }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  variants={{
                    rest: { y: 0 },
                    hover: { y: -8 },
                  }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="w-[72%] h-[78%]"
                >
                  <DynamicTeaTin
                    accent={p.accent}
                    name={p.name}
                    sub={p.elevationLabel}
                    enableDrag={false}
                    enableCursorParallax={false}
                    enableScrollRotate={false}
                    scrollProgressOverride={0.25 + i * 0.1}
                    className="w-full h-full"
                  />
                </motion.div>
              </div>
              <div className="absolute top-3 left-3 z-10">
                <Chip variant="accent" accent={p.accent}>
                  {TEA_TYPE_LABELS[p.type]}
                </Chip>
              </div>
              <motion.div
                aria-hidden
                variants={{
                  rest: { y: 10, opacity: 0 },
                  hover: { y: 0, opacity: 1 },
                }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
                className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 rounded-full bg-paper/90 backdrop-blur px-3 py-1.5 border border-ink/10 text-ink"
              >
                <span className="small-caps tracking-[0.22em] text-[10px]">View</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </motion.div>
            </Link>
            <div className="pt-5 pb-2 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl tracking-tight text-ink leading-tight">
                  {p.name}
                </h3>
                <p className="small-caps text-[11px] text-ink/45 mt-1 tracking-wider">
                  {p.flush} · {p.elevationLabel}
                </p>
              </div>
              <p className="font-serif text-lg tracking-tight text-ink shrink-0">
                {formatPrice(priceForSize(p, p.sizes[1]?.grams ?? p.baseGrams))}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
