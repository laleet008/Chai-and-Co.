'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import { SteamSystem } from '@/components/canvas/SteamSystem';
import { Reveal } from '@/components/ui/Reveal';
import { SplitText } from '@/components/ui/SplitText';
import { useReducedMotion } from '@/lib/useReducedMotion';

const emailSchema = z.string().email('Enter a valid email.').min(5);

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'error' | 'success'>('idle');
  const [msg, setMsg] = useState('');
  const reduced = useReducedMotion();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = emailSchema.safeParse(email.trim());
    if (!res.success) {
      setState('error');
      setMsg(res.error.issues[0]?.message ?? 'Enter a valid email.');
      return;
    }
    setState('success');
    setMsg('');
    setEmail('');
  }

  return (
    <section className="relative bg-paper py-24 md:py-32 overflow-hidden px-6">
      <div className="mx-auto w-[min(92%,1000px)] relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-end">
          <div className="md:col-span-7">
            <Reveal variant="fadeUpSmall">
              <p className="small-caps tracking-[0.28em] text-[11px] mb-4" style={{ color: '#B3541E' }}>
                Journal
              </p>
            </Reveal>
            <Reveal variant="fadeUp" delay={0.05}>
              <h2 className="font-serif text-[clamp(2rem,5vw,3.6rem)] tracking-tight leading-[1.04] text-ink max-w-[12ch] text-balance mb-5">
                <SplitText text="A letter from Ilam, four times a year." as="words" />
              </h2>
            </Reveal>
            <Reveal variant="fadeUp" delay={0.12}>
              <p className="font-sans text-[16px] leading-relaxed text-ink/70 max-w-[46ch]">
                Harvest notes, altitude diaries, brewing guides — sent out with each
                season. No spam, no sales drivel. Unsubscribe with one click.
              </p>
            </Reveal>
          </div>

          <div className="md:col-span-5 relative">
            <form onSubmit={onSubmit} className="relative" noValidate>
              <div
                className={
                  'relative flex items-stretch rounded-sm overflow-hidden border transition-all duration-400 ' +
                  (state === 'error'
                    ? 'border-red-500/60'
                    : state === 'success'
                    ? 'border-gold/60'
                    : 'border-ink/12')
                }
                style={{
                  animation: state === 'error' && !reduced ? 'shake 380ms ease' : undefined,
                }}
              >
                <AnimatePresence mode="wait">
                  {state !== 'success' ? (
                    <motion.input
                      key="field"
                      initial={false}
                      animate={{ width: '100%', minWidth: 0, paddingLeft: 18, paddingRight: 18, opacity: 1 }}
                      exit={{ width: '0%', paddingLeft: 0, paddingRight: 0, opacity: 0 }}
                      transition={{ duration: reduced ? 0.15 : 0.5, ease: [0.16, 1, 0.3, 1] }}
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      aria-label="Email address"
                      placeholder="you@household.kitchen"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (state === 'error') setState('idle');
                      }}
                      className="h-14 bg-paper text-ink placeholder:text-ink/35 font-sans text-[15px] outline-none"
                      style={{ flex: '1 1 auto' }}
                    />
                  ) : (
                    <motion.div
                      key="done"
                      initial={{ width: 0, minWidth: 0, opacity: 0 }}
                      animate={{ width: '100%', opacity: 1 }}
                      transition={{ duration: reduced ? 0.15 : 0.55, ease: [0.16, 1, 0.3, 1] }}
                      className="h-14 flex items-center gap-3 bg-paper pl-5"
                      role="status"
                      aria-live="polite"
                    >
                      <motion.span
                        initial={{ scale: 0, opacity: 0, rotate: -25 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        transition={{ delay: reduced ? 0 : 0.25, duration: reduced ? 0.15 : 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-center justify-center w-7 h-7 rounded-full bg-gold/90 text-ink shrink-0"
                        aria-hidden
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                          <path d="M5 12l5 5L20 7" />
                        </svg>
                      </motion.span>
                      <p className="font-serif text-[17px] text-ink">Thank you — see you in Ilam.</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {state !== 'success' && (
                    <motion.button
                      key="btn"
                      initial={false}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: reduced ? 0.1 : 0.3 }}
                      type="submit"
                      className="shrink-0 h-14 px-5 bg-ink text-paper small-caps tracking-[0.24em] text-[11px] hover:bg-night transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                    >
                      Subscribe
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              <AnimatePresence>
                {state === 'error' && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-3 text-[13px] text-red-600/90 font-sans"
                    role="alert"
                  >
                    {msg}
                  </motion.p>
                )}
              </AnimatePresence>

              {state === 'success' && !reduced && (
                <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[280px] h-[140px]">
                  <SteamSystem
                    count={22}
                    spawnRate={0.09}
                    particleOpacity={0.32}
                    drift={0.55}
                    colorRgb="232,220,190"
                    className="w-full h-full"
                  />
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
      `}</style>
    </section>
  );
}
