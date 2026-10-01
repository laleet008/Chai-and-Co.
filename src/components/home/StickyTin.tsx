'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { DynamicTeaTin } from '@/components/three/DynamicTeaTin';
import { Reveal } from '@/components/ui/Reveal';
import { SplitText } from '@/components/ui/SplitText';
import { useReducedMotion } from '@/lib/useReducedMotion';

const CAPTIONS = [
  {
    eyebrow: 'Pluck',
    line: 'Two leaves and a bud.',
    text: 'Every leaf is hand-selected by our 38 pluckers at dawn — when the mist still lies thick over the hedge rows.',
  },
  {
    eyebrow: 'Wither',
    line: 'Withered in open air.',
    text: 'Laid out on bamboo racks for 14 to 18 hours; moisture leaves slowly; the leaf softens, releasing grassy notes.',
  },
  {
    eyebrow: 'Roll',
    line: 'Rolled by hand.',
    text: 'The twist breaks the cell walls; the oils release. This is where Ilam Gold builds its amber cup.',
  },
] as const;

export function StickyTin() {
  const ref = useRef<HTMLDivElement>(null!);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });
  const warmSpring = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.9,
  });
  const bgString = useTransform(warmSpring, (v) => {
    const l = 92 - v * 6;
    return `linear-gradient(180deg, #F4F0E8 0%, hsl(30, 42%, ${l.toFixed(1)}%) 100%)`;
  });
  const shadowOpacity = useTransform(warmSpring, (v) => `${(0.05 + v * 0.12).toFixed(3)}`);
  const washOpacity = useTransform(warmSpring, (v) => `${(0.04 + v * 0.10).toFixed(3)}`);

  return (
    <motion.section
      ref={ref}
      className="relative bg-paper py-24 md:py-32 px-6"
      style={reduced ? undefined : { background: bgString }}
    >
      <div className="mx-auto w-[min(92%,1100px)]">
        <Reveal variant="fadeUpSmall" className="mb-16 md:mb-20 max-w-2xl">
          <p className="small-caps tracking-[0.28em] text-[11px] mb-4" style={{ color: '#B3541E' }}>
            The craft
          </p>
          <h2 className="font-serif text-[clamp(2rem,5vw,3.6rem)] tracking-tight leading-[1.04] text-ink max-w-[14ch] text-balance">
            From hedge row to tin in a single day.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 min-h-[320vh]">
          <div className="md:col-span-6 order-2 md:order-1 relative">
            <div className="relative h-full">
              {CAPTIONS.map((c, i) => (
                <div
                  key={c.eyebrow}
                  className="relative min-h-[80vh] md:min-h-[100vh] flex items-center"
                >
                  <div className="max-w-md">
                    <Reveal variant="fadeUpSmall">
                      <p
                        className="small-caps tracking-[0.28em] text-[11px] mb-5"
                        style={{ color: '#B3541E' }}
                      >
                        Step 0{i + 1} · {c.eyebrow}
                      </p>
                    </Reveal>
                    <h3 className="font-serif text-[clamp(1.8rem,4.4vw,3.3rem)] tracking-tight leading-[1.02] text-balance max-w-[12ch] mb-5 text-ink">
                      <SplitText text={c.line} as="words" />
                    </h3>
                    <Reveal variant="fadeUp" delay={0.1}>
                      <p className="font-sans text-[17px] leading-relaxed text-ink/70 max-w-[38ch]">
                        {c.text}
                      </p>
                    </Reveal>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-6 order-1 md:order-2 relative">
            <div className="md:sticky md:top-28 h-[60vh] md:h-[80vh]">
              <motion.div
                className="absolute inset-0"
                style={reduced ? undefined : {
                  filter: [
                    'drop-shadow(0 12px 30px rgba(179,84,30,',
                    '))',
                  ].reduce((a, b, i) => i === 1 ? `${a}${shadowOpacity}${b}` : a + b) as any,
                }}
              >
                <DynamicTeaTin
                  accent="#C9A227"
                  name="Mist First Flush"
                  sub="ILAM · 1,900 M · FIRST FLUSH"
                  enableDrag={false}
                  enableCursorParallax
                  enableScrollRotate
                  className="w-full h-full"
                />
              </motion.div>
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={
                  reduced
                    ? undefined
                    : {
                        background: [
                          'radial-gradient(60% 50% at 50% 60%, rgba(201,162,39,',
                          ') 0%, transparent 70%)',
                        ].reduce((a, b, i) => (i === 1 ? `${a}${washOpacity}${b}` : a + b)) as any,
                      }
                }
              />
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
