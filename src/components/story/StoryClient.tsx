'use client';

import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Reveal } from '@/components/ui/Reveal';
import { SplitText } from '@/components/ui/SplitText';
import { LeafGlyph } from '@/components/ui/Icons';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { defaultEasing, staggerChildrenFactory } from '@/lib/motion';
import { cn } from '@/lib/cn';

const HILLS_DRAW = 3.8;

function OpeningHills() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  const prog = useSpring(scrollYProgress, { stiffness: 90, damping: 22, mass: 0.8 });
  const mistY = useTransform(prog, [0, 1], [0, -40]);
  const sunPulse = useSpring(0, { stiffness: 140, damping: 18, mass: 0.5 });
  void sunPulse;

  return (
    <div ref={containerRef} className="relative w-full aspect-[16/10] md:aspect-[2.1/1] rounded-sm overflow-hidden border border-ink/8 bg-gradient-to-b from-[#F4F0E8] via-[#EFE8DB] to-[#D9D1BE]">
      <svg viewBox="0 0 1200 600" className="absolute inset-0 w-full h-full" aria-hidden>
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F4F0E8" />
            <stop offset="55%" stopColor="#EFE0C6" />
            <stop offset="100%" stopColor="#D8C9A6" />
          </linearGradient>
          <linearGradient id="ridge1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8A9B72" />
            <stop offset="100%" stopColor="#4F6F52" />
          </linearGradient>
          <linearGradient id="ridge2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6B8F5E" />
            <stop offset="100%" stopColor="#3D5A40" />
          </linearGradient>
          <linearGradient id="ridge3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#547448" />
            <stop offset="100%" stopColor="#2A3E2E" />
          </linearGradient>
          <filter id="storyMist" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.004" numOctaves="2" seed="4" />
            <feColorMatrix values="0 0 0 0 0.97  0 0 0 0 0.95  0 0 0 0 0.9  0 0 0 0.6 0" />
          </filter>
        </defs>

        <rect width="1200" height="600" fill="url(#skyGrad)" />

        <g transform="translate(960,110)">
          <circle r="62" fill="#C9A227" opacity="0.18" />
          <circle r="42" fill="#C9A227" opacity="0.32" />
          <circle r="26" fill="#C9A227" opacity="0.55" />
        </g>

        <motion.g style={{ y: mistY }}>
          <rect x="-50" y="280" width="1300" height="90" filter="url(#storyMist)" />
          <rect x="-50" y="360" width="1300" height="70" filter="url(#storyMist)" opacity="0.7" />
        </motion.g>

        <motion.path
          d="M 0 440 C 120 380 220 390 340 410 C 460 430 540 370 660 395 C 780 420 860 360 980 395 C 1080 425 1150 405 1200 420 L 1200 600 L 0 600 Z"
          fill="url(#ridge1)"
          initial={reduced ? {} : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0.2 : 0.9, delay: 0.05, ease: defaultEasing }}
        />

        <motion.path
          d="M 0 470 C 160 430 280 440 400 455 C 520 470 640 420 760 445 C 880 470 980 430 1100 455 C 1140 463 1180 458 1200 465 L 1200 600 L 0 600 Z"
          fill="url(#ridge2)"
          initial={reduced ? {} : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration: reduced ? 0.2 : HILLS_DRAW,
            ease: defaultEasing,
            delay: 0.25,
            pathLength: { delay: 0.15 },
          }}
          style={{ stroke: '#3D5A40', strokeWidth: 1.2, fillOpacity: 0.94 }}
        />

        <motion.path
          d="M -20 510 C 120 485 260 498 400 505 C 540 512 680 485 820 502 C 960 519 1060 495 1220 510 L 1220 600 L -20 600 Z"
          fill="url(#ridge3)"
          initial={reduced ? {} : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration: reduced ? 0.2 : HILLS_DRAW + 0.4,
            ease: defaultEasing,
            delay: 0.5,
            pathLength: { delay: 0.4 },
          }}
          style={{ stroke: '#2A3E2E', strokeWidth: 1.1, fillOpacity: 0.96 }}
        />

        <motion.g
          initial={reduced ? {} : { opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduced ? 0.2 : 0.9, delay: 1.3, ease: defaultEasing }}
        >
          <g transform="translate(760,470)">
            <path d="M 0 0 L -3 -14 L 3 -14 Z" fill="#1A1714" opacity="0.75" />
            <circle r="4" cx="0" cy="-16" fill="#B3541E" stroke="#1A1714" strokeWidth="1" />
            <g transform="translate(-16,-42)">
              <motion.rect width="32" height="22" fill="#E9E4D4" stroke="#1A1714" strokeWidth="1.2" rx="1"
                initial={reduced ? {} : { scaleY: 0, transformOrigin: 'bottom' }}
                animate={{ scaleY: 1 }}
                transition={{ duration: reduced ? 0.2 : 0.55, delay: 1.6, ease: defaultEasing }}
              />
              <polygon points="-3,0 35,0 16,-14" fill="#8B3A1A" stroke="#1A1714" strokeWidth="1.1" />
            </g>
          </g>
        </motion.g>

        <motion.g
          initial={reduced ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduced ? 0.15 : 0.8, delay: 1.9, ease: defaultEasing }}
        >
          {[
            [110, 402], [160, 398], [230, 405], [290, 400], [355, 410], [415, 408], [505, 392], [570, 398],
            [650, 442], [710, 440], [870, 448], [945, 450], [1005, 446], [1075, 460],
          ].map(([x, y], i) => (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r="1.6"
              fill="#1A1714"
              opacity="0.55"
              initial={reduced ? {} : { opacity: 0, scale: 0 }}
              animate={{ opacity: 0.55, scale: 1 }}
              transition={{
                duration: reduced ? 0.1 : 0.35,
                delay: reduced ? 0 : 2 + i * 0.03,
                ease: defaultEasing,
              }}
            />
          ))}
        </motion.g>
      </svg>

      <div className="absolute bottom-6 left-6 md:left-10 text-ink/55 small-caps text-[10.5px] tracking-[0.22em]">
        <p>26° 54′ N · 87° 55′ E</p>
        <p className="mt-1">Ridge above Ilam · 1,940 m</p>
      </div>
      <div className="absolute top-6 right-6 md:right-10 flex items-center gap-2 text-ink/45 small-caps text-[10.5px] tracking-[0.22em]">
        <LeafGlyph className="w-3.5 h-3.5 text-clay/80" />
        <span>Est. 1971</span>
      </div>
    </div>
  );
}

function BushTangleSVG({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 480 360" className="w-full h-full" aria-hidden>
      <defs>
        <linearGradient id="btbg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F4F0E8" />
          <stop offset="100%" stopColor="#E3DAC7" />
        </linearGradient>
        <radialGradient id="btpaper" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#F6F1E6" />
          <stop offset="100%" stopColor="#E6DCC6" />
        </radialGradient>
      </defs>
      <rect width="480" height="360" fill="url(#btbg)" />
      <circle cx="240" cy="180" r="150" fill="url(#btpaper)" opacity="0.8" />

      <motion.g
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-10%' }}
        variants={staggerChildrenFactory(0.08)}
      >
        {Array.from({ length: 13 }).map((_, row) =>
          Array.from({ length: 9 }).map((__, col) => {
            const cx = 90 + col * 34 + (row % 2 ? 17 : 0);
            const cy = 90 + row * 20;
            const key = row + '-' + col;
            return (
              <motion.path
                key={key}
                d={'M ' + cx + ' ' + cy + ' c 3 -8 12 -7 13 1 c 1 8 -8 12 -14 7 c -5 -4 -5 -7 -1 -8 z'}
                fill={accent}
                opacity={0.68 + ((row + col) % 3) * 0.1}
                variants={{
                  hidden: { opacity: 0, y: 6, scale: 0.7 },
                  visible: { opacity: 0.68 + ((row + col) % 3) * 0.1, y: 0, scale: 1 },
                }}
                transition={{ duration: 0.45, ease: defaultEasing }}
              />
            );
          })
        )}
      </motion.g>

      <motion.path
        d="M 40 330 Q 240 275 440 335"
        stroke="#1A1714"
        strokeWidth="1.2"
        fill="none"
        opacity="0.25"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 2.2, ease: defaultEasing }}
      />
    </svg>
  );
}

function HandSVG() {
  return (
    <svg viewBox="0 0 480 360" className="w-full h-full" aria-hidden>
      <rect width="480" height="360" fill="#E9E4D4" />
      <motion.g
        initial={{ opacity: 0, x: -8 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.8, ease: defaultEasing }}
      >
        <path
          d="M 150 250 C 160 210 180 190 200 180 C 210 155 228 150 238 168 C 242 148 258 148 262 165 C 266 148 284 150 288 172 C 294 152 314 158 320 182 L 330 215 C 340 240 338 262 318 280 L 285 305 C 275 315 258 320 240 318 L 202 315 C 180 312 162 300 154 282 L 148 262 Z"
          fill="#D9B894"
          stroke="#1A1714"
          strokeWidth="1.4"
        />
        <motion.path
          d="M 205 200 L 212 182 L 218 170 M 230 202 L 238 180 M 258 205 L 264 184 M 282 210 L 288 192"
          stroke="#1A1714"
          strokeWidth="1"
          fill="none"
          opacity="0.45"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 1.3, delay: 0.3, ease: defaultEasing }}
        />
      </motion.g>

      <motion.g
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-10%' }}
        variants={staggerChildrenFactory(0.06)}
      >
        {Array.from({ length: 9 }).map((_, i) => (
          <motion.path
            key={i}
            d={'M ' + (320 + i * 12) + ' ' + (210 - i * 3) + ' c 4 -9 14 -8 15 0 c 1 9 -10 13 -15 7 z'}
            fill="#4F6F52"
            variants={{
              hidden: { opacity: 0, y: -6, rotate: -6 },
              visible: { opacity: 0.85, y: 0, rotate: 0 },
            }}
            transition={{ duration: 0.55, ease: defaultEasing }}
          />
        ))}
      </motion.g>

      <motion.text
        x="240"
        y="70"
        textAnchor="middle"
        fontFamily="serif"
        fontSize="15"
        fill="#1A1714"
        opacity="0.55"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.55 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        Plucking, two leaves and a bud
      </motion.text>
    </svg>
  );
}

function WitheringRackSVG() {
  return (
    <svg viewBox="0 0 480 360" className="w-full h-full" aria-hidden>
      <rect width="480" height="360" fill="#221D18" />
      <motion.g
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.6, ease: defaultEasing }}
      >
        {[80, 140, 200, 260].map((y, r) => (
          <g key={r}>
            <line x1="60" y1={y} x2="420" y2={y} stroke="#8B7A5C" strokeWidth="3" strokeLinecap="round" />
            <line x1="60" y1={y + 18} x2="420" y2={y + 18} stroke="#6B5A3D" strokeWidth="1.4" strokeDasharray="4 3" />
            <motion.line
              x1="60" y1={y} x2="420" y2={y}
              stroke="#C9A227"
              strokeWidth="0.8"
              opacity="0.35"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, delay: 0.15 + r * 0.08, ease: defaultEasing }}
            />
          </g>
        ))}
        {[75, 140, 200, 255].map((y, r) =>
          Array.from({ length: 42 }).map((__, c) => (
            <motion.ellipse
              key={r + '-' + c}
              cx={72 + c * 9}
              cy={y + 7}
              rx="3.4"
              ry="1.1"
              fill={c % 3 === 0 ? '#547448' : c % 3 === 1 ? '#6B8F5E' : '#8A9B72'}
              initial={{ opacity: 0, scale: 0.2 }}
              whileInView={{ opacity: 0.9, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.45,
                delay: 0.2 + r * 0.08 + c * 0.01,
                ease: defaultEasing,
              }}
            />
          ))
        )}
      </motion.g>
      <motion.text
        x="240"
        y="328"
        textAnchor="middle"
        fontFamily="serif"
        fontSize="14"
        fill="#EFE8DB"
        opacity="0.7"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.7 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.5 }}
      >
        Twelve hours · open air · natural wither
      </motion.text>
    </svg>
  );
}

function RolledLeafSVG() {
  return (
    <svg viewBox="0 0 480 360" className="w-full h-full" aria-hidden>
      <rect width="480" height="360" fill="#EFE8DB" />
      <motion.g
        initial={{ opacity: 0, rotate: -6 }}
        whileInView={{ opacity: 1, rotate: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.9, ease: defaultEasing }}
      >
        <ellipse cx="240" cy="180" rx="170" ry="130" fill="#F4F0E8" stroke="#1A1714" strokeWidth="1.2" />
        {Array.from({ length: 18 }).map((_, i) => {
          const angle = (i / 18) * Math.PI * 2;
          const a = 140;
          const b = 100;
          const cx = 240 + Math.cos(angle) * (a - 40 - (i % 3) * 12);
          const cy = 180 + Math.sin(angle) * (b - 28 - (i % 4) * 10);
          const rot = (angle * 180) / Math.PI + 90;
          return (
            <motion.path
              key={i}
              d={'M 0 0 c 4 -13 18 -11 19 2 c 1 13 -14 18 -19 11 z'}
              fill={i % 2 === 0 ? '#4F6F52' : '#6B8F5E'}
              opacity={0.82}
              style={{ transform: 'translate(' + cx + 'px, ' + cy + 'px) rotate(' + rot + 'deg)' }}
              initial={{ opacity: 0, scale: 0.4 }}
              whileInView={{ opacity: 0.82, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.03, ease: defaultEasing }}
            />
          );
        })}
        <motion.g
          animate={{ rotate: 360 }}
          style={{ transformOrigin: '240px 180px' }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        >
          <ellipse cx="370" cy="180" rx="14" ry="9" fill="none" stroke="#C9A227" strokeWidth="1" opacity="0.6" />
          <ellipse cx="110" cy="180" rx="14" ry="9" fill="none" stroke="#C9A227" strokeWidth="1" opacity="0.6" />
        </motion.g>
      </motion.g>
    </svg>
  );
}

function EstateMapSVG() {
  const reduced = useReducedMotion();
  return (
    <div className="relative w-full aspect-[16/11] rounded-sm overflow-hidden border border-ink/8 bg-gradient-to-b from-[#EFE8DB] via-[#E3DAC7] to-[#D8C9A6]">
      <svg viewBox="0 0 960 660" className="absolute inset-0 w-full h-full" aria-hidden>
        <defs>
          <linearGradient id="emapRidge1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#B3BE90" />
            <stop offset="100%" stopColor="#6B8F5E" />
          </linearGradient>
          <linearGradient id="emapRidge2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8A9B72" />
            <stop offset="100%" stopColor="#4F6F52" />
          </linearGradient>
          <linearGradient id="riverGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7E9EB3" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#5A7B95" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        <rect width="960" height="660" fill="#EFE8DB" />

        <motion.path
          d="M 0 410 C 130 360 220 370 340 390 C 460 410 540 350 660 375 C 780 400 880 350 960 380 L 960 660 L 0 660 Z"
          fill="url(#emapRidge1)"
          initial={reduced ? {} : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: reduced ? 0.15 : 0.9, ease: defaultEasing }}
        />
        <motion.path
          d="M -30 470 C 130 440 280 448 400 460 C 520 472 660 445 780 465 C 860 478 920 460 990 472 L 990 660 L -30 660 Z"
          fill="url(#emapRidge2)"
          initial={reduced ? {} : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: reduced ? 0.2 : 2.6, ease: defaultEasing }}
          style={{ stroke: '#2A3E2E', strokeWidth: 1.1, fillOpacity: 0.95 }}
        />

        <motion.path
          d="M 0 560 C 90 558 160 548 220 536 C 300 520 350 520 420 510 C 500 498 570 476 640 472 C 710 468 770 482 830 478 C 880 475 930 456 960 452"
          stroke="url(#riverGrad)"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          initial={reduced ? {} : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: '-5%' }}
          transition={{ duration: reduced ? 0.2 : 3.2, ease: defaultEasing, delay: 0.2 }}
        />

        <motion.g
          initial={reduced ? {} : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: reduced ? 0.15 : 0.8, delay: 0.7, ease: defaultEasing }}
        >
          <rect x="100" y="320" width="760" height="1" fill="#1A1714" opacity="0.18" strokeDasharray="5 6" />
          <rect x="100" y="420" width="760" height="1" fill="#1A1714" opacity="0.18" strokeDasharray="5 6" />
          <rect x="100" y="520" width="760" height="1" fill="#1A1714" opacity="0.18" strokeDasharray="5 6" />
        </motion.g>

        <motion.g
          initial={reduced ? {} : { opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: reduced ? 0.2 : 0.85, delay: 0.45, ease: defaultEasing }}
        >
          {Array.from({ length: 7 }).map((_, row) =>
            Array.from({ length: 11 }).map((__, col) => {
              const cx = 200 + col * 52 + (row % 2 ? 26 : 0);
              const cy = 340 + row * 28;
              if (cx < 150 || cx > 820 || cy < 320 || cy > 540) return null;
              const k = 'e' + row + '-' + col;
              return (
                <motion.path
                  key={k}
                  d={'M ' + cx + ' ' + cy + ' c 5 -11 18 -10 19 2 c 1 11 -13 17 -19 10 z'}
                  fill="#4F6F52"
                  opacity={0.62 + ((row + col) % 3) * 0.1}
                  initial={reduced ? {} : { opacity: 0, scale: 0.4, y: 4 }}
                  whileInView={{ opacity: 0.62 + ((row + col) % 3) * 0.1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.42,
                    delay: reduced ? 0 : 0.55 + row * 0.04 + col * 0.015,
                    ease: defaultEasing,
                  }}
                />
              );
            })
          )}
        </motion.g>

        <motion.g
          transform="translate(500,410)"
          initial={reduced ? {} : { opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: reduced ? 0.2 : 0.7, delay: 1.1, ease: defaultEasing }}
        >
          <g transform="translate(-22,-42)">
            <rect width="44" height="30" fill="#EFE8DB" stroke="#1A1714" strokeWidth="1.4" />
            <polygon points="-4,0 48,0 22,-18" fill="#8B3A1A" stroke="#1A1714" strokeWidth="1.2" />
            <rect x="18" y="10" width="8" height="20" fill="#B3541E" />
          </g>
          <motion.circle
            r="3.2"
            cx="0"
            cy="-4"
            fill="#B3541E"
            stroke="#1A1714"
            strokeWidth="1"
            animate={reduced ? {} : { r: [3.2, 5.2, 3.2], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: defaultEasing, delay: 1.3 }}
          />
          <motion.path
            d="M 0 0 L 220 -130"
            stroke="#1A1714"
            strokeWidth="1.1"
            strokeDasharray="3 3"
            fill="none"
            opacity="0.6"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 1.4, ease: defaultEasing }}
          />
          <motion.g
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1.7, ease: defaultEasing }}
            transform="translate(222,-150)"
          >
            <rect x="-12" y="-24" width="168" height="86" rx="3" fill="#F4F0E8" stroke="#C9A227" strokeWidth="1.2" />
            <text x="-2" y="-6" fontFamily="sans-serif" fontSize="10" fill="#1A1714" opacity="0.55" letterSpacing="1.5">
              CHAI &amp; CO. ESTATE
            </text>
            <text x="-2" y="14" fontFamily="serif" fontSize="15" fill="#1A1714">
              12 hectares · single plot
            </text>
            <text x="-2" y="34" fontFamily="serif" fontSize="14" fill="#4F6F52">
              38 pluckers · 4 teas
            </text>
            <text x="-2" y="54" fontFamily="sans-serif" fontSize="11" fill="#1A1714" opacity="0.7">
              1,820–2,060 m · 1,780 mm rainfall
            </text>
          </motion.g>
        </motion.g>

        <motion.text
          x="110"
          y="595"
          fontFamily="serif"
          fontSize="13"
          fill="#1A1714"
          opacity="0.55"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.55 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1.9 }}
        >
          Mai Khola · Ilam district · Province 1
        </motion.text>

        <g transform="translate(60, 90)">
          <text fontFamily="sans-serif" fontSize="10" fill="#1A1714" opacity="0.55" letterSpacing="1.6">
            ALTITUDE
          </text>
          {[
            { label: '2,060 m', y: 0, c: '#4F6F52' },
            { label: '1,940 m', y: 22, c: '#6B8F5E' },
            { label: '1,820 m', y: 44, c: '#8A9B72' },
          ].map((row, i) => (
            <g key={i} transform={'translate(0,' + (22 + i * 22) + ')'}>
              <motion.rect
                width="14"
                height="10"
                fill={row.c}
                initial={{ width: 0 }}
                whileInView={{ width: 14 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 1.3 + i * 0.15, ease: defaultEasing }}
              />
              <motion.text
                x="22"
                y="9"
                fontFamily="serif"
                fontSize="12"
                fill="#1A1714"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.85 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 1.5 + i * 0.15 }}
              >
                {row.label}
              </motion.text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

type Block = {
  eyebrow: string;
  heading: string;
  body: string[];
  SVG: React.ComponentType<{ accent?: string }> | React.ComponentType;
  accent: string;
  reverse?: boolean;
};

const STORY_BLOCKS: Block[] = [
  {
    eyebrow: 'The land',
    heading: 'Twelve hectares, one ridge.',
    body: [
      'The plot runs 240 vertical metres up a single south-facing fold in the hills. Cloud hangs in the treeline most mornings, burns off by ten, returns at dusk.',
      'Soils are loam over sandstone, the old bed of a river that ran here before the hills folded. It drains fast — the roots go deep, the leaves stay small and intense.',
    ],
    SVG: (p: any) => <BushTangleSVG accent={p.accent || '#6B8F5E'} />,
    accent: '#6B8F5E',
  },
  {
    eyebrow: 'The hands',
    heading: 'Thirty-eight pluckers, most of them second-generation.',
    body: [
      'Every leaf is picked by hand. The rule is two leaves and a bud, pinched clean between thumb and forefinger, nothing larger. A good hand fills four baskets a day; a great hand fills six.',
      'Pluckers own a quarter of the estate through a family share trust set up in 2008. Every harvest bonus is split equally between wages, trust, and reinvestment.',
    ],
    SVG: HandSVG,
    accent: '#B3541E',
    reverse: true,
  },
  {
    eyebrow: 'The wither',
    heading: 'Twelve hours, open air, watched over.',
    body: [
      'Leaves go straight from the baskets to the withering racks — woven cane, strung from the rafters of the processing hall. Fans move the air gently; no heat, no hurry.',
      'By morning the moisture content is half what it was. The leaf is flexible, darkening, ready to roll without breaking. This is the step that most small gardens rush. We don\'t.',
    ],
    SVG: WitheringRackSVG,
    accent: '#C9A227',
  },
  {
    eyebrow: 'The roll',
    heading: 'Palm, not machine. Two thousand leaves a day.',
    body: [
      'Rolling breaks the cell walls, releases the oils that will become the liquor. We do it on wooden tables, one handful at a time — ten minutes per handful, steady pressure in a figure-eight.',
      'A machine would do it in ninety seconds. It would also bruise the edges, strip flavour, and make the liquor thin. The difference is small, but it compounds across every steep.',
    ],
    SVG: RolledLeafSVG,
    accent: '#4F6F52',
    reverse: true,
  },
];

const TIMELINE: { year: string; title: string; body: string; accent: string }[] = [
  { year: '1971', title: 'The first cuttings', body: 'Bedan Karki plants 6,200 tea bushes from Darjeeling stock on family land above Ilam village. The cash crop at the time is cardamom.', accent: '#8A9B72' },
  { year: '1984', title: 'First processing hall', body: 'A wood-fired dryer and four withering racks go up, replacing the kitchen roof and the sun-bleached courtyard. Production is 280 kg that year.', accent: '#C9A227' },
  { year: '1997', title: 'Mist First Flush, named', body: 'The light spring lot — plucked over four mornings in early April — is bottled separately and shipped to a buyer in Kyoto. It is the first tea we name, rather than grade.', accent: '#6B8F5E' },
  { year: '2008', title: 'Plucker share trust', body: 'Twenty-five percent of the estate title transfers to a family trust, granting each plucker household a share of the annual harvest bonus.', accent: '#B3541E' },
  { year: '2025', title: 'Chai &amp; Co.', body: 'We bottle four teas as Chai &amp; Co. — Mist, Ilam Gold, Silver Tips, and Himalayan Green. Everything is still packed by hand on the estate.', accent: '#4F6F52' },
];

export default function StoryClient() {
  const reduced = useReducedMotion();
  return (
    <div className="bg-paper text-ink pt-32 pb-32 px-6 min-h-screen">
      <div className="mx-auto w-[min(92%,1160px)]">
        <Reveal variant="maskUp">
          <p className="small-caps text-ink/50 mb-4">Our story</p>
        </Reveal>
        <Reveal variant="fadeUp" delay={0.05}>
          <h1 className="font-serif text-fluid-display leading-[1.03] tracking-tight mb-10 max-w-4xl text-balance">
            <SplitText
              text="A hillside above the mist, in eastern Nepal."
              as="words"
              gapPerWord={0.05}
            />
          </h1>
        </Reveal>
        <Reveal variant="fadeUp" delay={0.15} className="mb-16 max-w-2xl">
          <p className="font-sans text-[17px] leading-relaxed text-ink/70">
            Chai &amp; Co. is one twelve-hectare plot on a ridge above Ilam, planted in 1971, still
            tended by the same family and thirty-eight pairs of hands. We make four teas, slowly.
          </p>
        </Reveal>

        <Reveal variant="fadeUp" delay={0.08} className="mb-28">
          <OpeningHills />
        </Reveal>

        <div className="space-y-40 mb-40">
          {STORY_BLOCKS.map((b, i) => (
            <section
              key={i}
              className={cn(
                'grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start',
              )}
            >
              <div
                className={cn(
                  'lg:col-span-6 space-y-6 flex flex-col justify-center',
                  b.reverse ? 'lg:order-2' : 'lg:order-1',
                )}
              >
                <Reveal variant="fadeUp">
                  <p className="small-caps text-[11px] tracking-[0.22em]" style={{ color: b.accent }}>
                    {b.eyebrow}
                  </p>
                </Reveal>
                <Reveal variant="fadeUp" delay={0.06}>
                  <h2 className="font-serif text-[clamp(1.8rem,3.8vw,3.1rem)] leading-[1.08] tracking-tight text-balance max-w-xl">
                    {b.heading}
                  </h2>
                </Reveal>
                {b.body.map((p, pi) => (
                  <Reveal
                    key={pi}
                    variant="fadeUp"
                    delay={0.12 + pi * 0.05}
                    className="font-sans text-[16.5px] leading-[1.78] text-ink/75 max-w-xl"
                  >
                    <p>{p}</p>
                  </Reveal>
                ))}
              </div>
              <div
                className={cn(
                  'lg:col-span-6',
                  b.reverse ? 'lg:order-1' : 'lg:order-2',
                )}
              >
                <Reveal variant="scaleIn" delay={0.14}>
                  <div
                    className="aspect-[4/3] rounded-sm overflow-hidden border border-ink/8 shadow-[0_30px_80px_-40px_rgba(26,23,20,0.35)]"
                    style={{ background: b.accent + '10' }}
                  >
                    <b.SVG accent={b.accent} />
                  </div>
                </Reveal>
              </div>
            </section>
          ))}
        </div>

        <section className="relative mb-40 py-24 md:py-32 border-y border-ink/10 overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 30%, #C9A227 0, transparent 50%), radial-gradient(circle at 80% 70%, #B3541E 0, transparent 55%)',
            }}
          />
          <div className="relative mx-auto max-w-4xl text-center">
            <Reveal variant="fadeUp">
              <LeafGlyph className="w-10 h-10 text-clay/80 mx-auto mb-8" />
            </Reveal>
            <Reveal variant="maskUp" delay={0.05}>
              <blockquote className="font-serif italic text-[clamp(1.5rem,3.6vw,2.6rem)] leading-[1.25] tracking-tight text-ink text-balance">
                “Good tea is not the yield. Good tea is the leaf
                that is left on the bush — because it wasn&apos;t
                ready yet.”
              </blockquote>
            </Reveal>
            <Reveal variant="fadeUp" delay={0.25}>
              <p className="mt-10 small-caps text-[11px] tracking-[0.24em] text-ink/50">
                — Bedan Karki · founder · 2011
              </p>
            </Reveal>
          </div>
        </section>

        <section className="mb-40">
          <div className="mb-16 max-w-2xl">
            <Reveal variant="fadeUp">
              <p className="small-caps text-[11px] tracking-[0.22em] text-gold mb-4">
                Timeline
              </p>
            </Reveal>
            <Reveal variant="fadeUp" delay={0.05}>
              <h2 className="font-serif text-[clamp(1.8rem,3.6vw,2.8rem)] leading-[1.08] tracking-tight text-balance">
                Fifty-four years, one ridge.
              </h2>
            </Reveal>
          </div>

          <ol className="relative">
            <motion.div
              aria-hidden
              className="absolute left-4 md:left-1/2 top-4 bottom-4 w-px md:-translate-x-1/2"
              style={{
                background: 'linear-gradient(to bottom, rgba(26,23,20,0.15), rgba(26,23,20,0.38), rgba(26,23,20,0.15))',
                transformOrigin: 'top',
              }}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: '-5%' }}
              transition={{ duration: reduced ? 0.2 : 1.1, ease: defaultEasing }}
            />

            {TIMELINE.map((t, i) => {
              const left = i % 2 === 0;
              return (
                <li
                  key={t.year}
                  className={cn(
                    'relative grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 pb-16 last:pb-0 items-start',
                  )}
                >
                  <div
                    className={cn(
                      'absolute left-0 md:left-1/2 md:-translate-x-1/2 top-2 z-10',
                    )}
                  >
                    <motion.span
                      aria-hidden
                      className="block w-4 h-4 rotate-45"
                      style={{
                        background: t.accent,
                        boxShadow: '0 0 0 3px #F4F0E8, 0 0 0 4.5px rgba(26,23,20,0.15)',
                      }}
                      initial={reduced ? {} : { scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, margin: '-10%' }}
                      transition={{ duration: reduced ? 0.15 : 0.55, delay: 0.1 + i * 0.04, ease: defaultEasing }}
                    />
                  </div>

                  <div
                    className={cn(
                      'pl-12 md:pl-0 md:pr-12',
                      left ? 'md:text-right md:col-start-1' : 'md:col-start-2 md:pl-12',
                    )}
                  >
                    <Reveal variant="fadeUp" delay={0.12 + i * 0.03}>
                      <p className="font-serif text-4xl md:text-5xl tracking-tight mb-3" style={{ color: t.accent }}>
                        {t.year}
                      </p>
                    </Reveal>
                    <Reveal variant="fadeUp" delay={0.18 + i * 0.03}>
                      <h3 className="font-serif text-xl md:text-2xl leading-tight mb-3">
                        {t.title}
                      </h3>
                    </Reveal>
                    <Reveal variant="fadeUp" delay={0.24 + i * 0.03}>
                      <p className="font-sans text-[15.5px] leading-relaxed text-ink/70 max-w-lg md:ml-auto">
                        {t.body}
                      </p>
                    </Reveal>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="mb-8">
          <div className="mb-14 max-w-2xl">
            <Reveal variant="fadeUp">
              <p className="small-caps text-[11px] tracking-[0.22em] text-gold mb-4">
                The estate
              </p>
            </Reveal>
            <Reveal variant="fadeUp" delay={0.05}>
              <h2 className="font-serif text-[clamp(1.8rem,3.6vw,2.8rem)] leading-[1.08] tracking-tight text-balance">
                Twelve hectares, three altitudes, one family.
              </h2>
            </Reveal>
          </div>
          <Reveal variant="fadeUp" delay={0.08}>
            <EstateMapSVG />
          </Reveal>
        </section>
      </div>
    </div>
  );
}
