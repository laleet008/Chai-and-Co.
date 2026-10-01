'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Reveal } from '@/components/ui/Reveal';
import { useReducedMotion } from '@/lib/useReducedMotion';

const QUOTES = [
  {
    text: 'The first flush has a quiet brightness — like biting into a stone fruit still cool from the morning. Nothing loud, everything considered.',
    name: 'Priya Thapa',
    title: 'Barista · Himalayan Coffee House, Kathmandu',
    stars: 5,
  },
  {
    text: 'We serve Ilam Gold in the library every autumn. Customers ask for it by name — they recognise the tin before they read the label.',
    name: 'Daniel C. M.',
    title: 'Head of hospitality · Royal Asiatic Society, London',
    stars: 5,
  },
  {
    text: 'Silver Tips is the only white tea I carry that I can also recommend without caveat to a customer who usually drinks only single-origin coffee.',
    name: 'Kushal Subedi',
    title: 'Buyer · House of Teas, Pokhara',
    stars: 5,
  },
] as const;

export function Testimonials() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (reduced) return;
    if (paused) return;
    timer.current = window.setInterval(() => {
      setI((v) => (v + 1) % QUOTES.length);
    }, 7500);
    return () => {
      if (timer.current !== null) window.clearInterval(timer.current);
    };
  }, [reduced, paused]);

  const current = QUOTES[i];
  return (
    <section
      className="relative py-24 md:py-36 px-6 bg-cream border-y border-ink/5"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="What people say"
    >
      <div className="mx-auto w-[min(92%,860px)]">
        <div className="mb-12 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <Reveal variant="fadeUpSmall">
              <p className="small-caps tracking-[0.28em] text-[11px] mb-4" style={{ color: '#B3541E' }}>
                Journal
              </p>
            </Reveal>
            <Reveal variant="fadeUp" delay={0.05}>
              <h2 className="font-serif text-[clamp(1.8rem,4.4vw,3.1rem)] tracking-tight leading-[1.04] text-ink max-w-[14ch] text-balance">
                What people are saying.
              </h2>
            </Reveal>
          </div>
          <Reveal variant="fadeUp" delay={0.1}>
            <div className="flex items-center gap-2" role="tablist" aria-label="Pagination">
              {QUOTES.map((q, idx) => (
                <button
                  key={q.name}
                  onClick={() => setI(idx)}
                  role="tab"
                  aria-selected={idx === i}
                  aria-label={`Go to quote ${idx + 1}`}
                  className={
                    'rounded-full transition-all duration-500 h-2 border-0 p-0 ' +
                    (idx === i ? 'w-10 bg-clay' : 'w-2 bg-ink/20 hover:bg-ink/35')
                  }
                />
              ))}
            </div>
          </Reveal>
        </div>

        <div className="relative min-h-[260px] md:min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
              exit={{ opacity: 0, y: -18, filter: 'blur(6px)' }}
              transition={{ duration: reduced ? 0.3 : 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <p className="font-serif text-[clamp(1.4rem,2.9vw,2.2rem)] leading-[1.3] tracking-tight text-ink text-balance max-w-[26ch]">
                &ldquo;{current.text}&rdquo;
              </p>
              <footer className="mt-8 md:mt-10 flex items-center justify-between gap-6 flex-wrap">
                <div>
                  <p className="font-serif text-lg text-ink">{current.name}</p>
                  <p className="font-sans text-[13px] text-ink/55 mt-1">{current.title}</p>
                </div>
                <div className="flex items-center gap-0.5 text-gold" aria-label={`${current.stars} of 5 stars`}>
                  {[0, 1, 2, 3, 4].map((s) => (
                    <svg
                      key={s}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4"
                      aria-hidden
                    >
                      <path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18 22l-6-3.6L6 22l1.5-7.2L2 10l7.1-1.1L12 2z" />
                    </svg>
                  ))}
                </div>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
