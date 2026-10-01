'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SteamSystem } from '@/components/canvas/SteamSystem';
import { Reveal } from '@/components/ui/Reveal';
import { SplitText } from '@/components/ui/SplitText';
import { Button } from '@/components/ui/Button';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { useReducedMotion } from '@/lib/useReducedMotion';

export function Hero() {
  const ref = useRef<HTMLDivElement>(null!);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const ridge1Y = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 120]);
  const ridge2Y = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 220]);
  const ridge3Y = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 340]);
  const mistX = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 180]);
  const fadeOut = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden min-h-[100svh] flex items-end md:items-center bg-paper pt-28 md:pt-20 pb-16 md:pb-24"
    >
      <svg
        aria-hidden
        className="absolute inset-x-0 bottom-0 w-full h-[92%] z-0"
        viewBox="0 0 1600 800"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F4F0E8" />
            <stop offset="60%" stopColor="#EDE6D8" />
            <stop offset="100%" stopColor="#E6DEC9" />
          </linearGradient>
          <linearGradient id="r3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A39C8A" />
            <stop offset="100%" stopColor="#7F7868" />
          </linearGradient>
          <linearGradient id="r2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8A8372" />
            <stop offset="100%" stopColor="#5E574A" />
          </linearGradient>
          <linearGradient id="r1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6B6659" />
            <stop offset="100%" stopColor="#3B362E" />
          </linearGradient>
        </defs>
        <rect width="1600" height="800" fill="url(#sky)" />
        <motion.g style={{ y: ridge3Y }}>
          <path
            d="M0 520 C 200 440 360 500 520 470 C 720 430 880 490 1080 450 C 1280 410 1440 470 1600 430 L 1600 800 L 0 800 Z"
            fill="url(#r3)"
            opacity="0.55"
          />
        </motion.g>
        <motion.g style={{ y: ridge2Y }}>
          <path
            d="M0 600 C 180 540 340 600 540 560 C 740 520 900 590 1100 550 C 1320 510 1460 570 1600 530 L 1600 800 L 0 800 Z"
            fill="url(#r2)"
            opacity="0.82"
          />
        </motion.g>
        <motion.g style={{ y: ridge1Y }}>
          <path
            d="M0 690 C 240 630 420 700 660 660 C 880 620 1040 690 1260 650 C 1420 620 1520 660 1600 640 L 1600 800 L 0 800 Z"
            fill="url(#r1)"
          />
        </motion.g>
      </svg>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{ opacity: fadeOut }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            x: mistX,
            background:
              'radial-gradient(1200px 400px at 20% 45%, rgba(244,240,232,0.65) 0%, transparent 60%), radial-gradient(900px 380px at 70% 55%, rgba(237,230,216,0.55) 0%, transparent 65%), radial-gradient(700px 300px at 50% 35%, rgba(255,255,255,0.45) 0%, transparent 70%)',
            filter: 'blur(16px)',
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2">
          <SteamSystem
            count={48}
            particleOpacity={0.22}
            spawnRate={0.35}
            colorRgb="250,246,235"
            drift={0.8}
            className="w-full h-full"
          />
        </div>
      </motion.div>

      <div className="relative z-20 w-[min(92%,1100px)] mx-auto px-0 pb-6 md:pb-10">
        <Reveal variant="maskUp">
          <p className="small-caps tracking-[0.28em] text-ink/55 text-[11px] md:text-xs mb-6 md:mb-8">
            Ilam · Eastern Nepal · Est. 1971
          </p>
        </Reveal>
        <h1 className="font-serif font-medium text-fluid-hero leading-[0.95] tracking-tight text-ink max-w-[18ch] mb-8 md:mb-10">
          <SplitText text="Grown in the clouds." as="words" gapPerWord={0.06} />
        </h1>
        <Reveal variant="fadeUp" delay={0.55}>
          <p className="font-sans text-ink/70 md:text-[19px] leading-relaxed max-w-[52ch] mb-10 md:mb-12">
            Single-estate loose-leaf tea from 1,900 metres above the Himalayan
            mist. Small-batch, hand-plucked in April, sold in matte metal tins.
          </p>
        </Reveal>
        <Reveal variant="fadeUp" delay={0.7}>
          <div className="flex items-center gap-3 md:gap-4 flex-wrap">
            <MagneticButton strength={22}>
              <Button variant="primary" size="lg" href="/shop">
                Shop the collection
              </Button>
            </MagneticButton>
            <MagneticButton strength={20}>
              <Button variant="ghost" size="lg" href="/story">
                Read our story
              </Button>
            </MagneticButton>
          </div>
        </Reveal>
      </div>

      <motion.div
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2 bottom-5 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <div className="scroll-cue-line flex flex-col items-center gap-2 text-ink/50">
          <span className="small-caps tracking-[0.28em] text-[10px]">Scroll</span>
          <span className="w-px h-10 bg-ink/30 relative overflow-hidden">
            <span
              className="absolute left-1/2 -translate-x-1/2 top-0 w-px h-4 bg-ink/80"
              aria-hidden
            />
          </span>
        </div>
      </motion.div>
    </section>
  );
}
