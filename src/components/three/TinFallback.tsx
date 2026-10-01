import type { SVGProps } from 'react';
import { cn } from '@/lib/cn';

type Props = SVGProps<SVGSVGElement> & {
  accent?: string;
  name?: string;
  rotateY?: number;
  size?: number;
  tilt?: number;
  className?: string;
};

export function TeaTinFallback({
  accent = '#B3541E',
  name = 'Chai & Co.',
  rotateY = 0,
  size = 320,
  tilt = 0,
  className,
  ...rest
}: Props) {
  const w = 200;
  const h = 280;
  const x = 100;
  const y = 10;
  const rim = 14;
  const lid = 36;
  const labelTop = 90;
  const labelH = 130;
  const id = (accent + name).replace(/[^a-zA-Z0-9]/g, '').slice(0, 8);
  const sideShade = (Math.sin(rotateY) + 1) / 2;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 400 400`}
      width={size}
      height={size}
      aria-hidden
      className={cn('block', className)}
      style={{
        transform: `perspective(1200px) rotateY(${rotateY}rad) rotateX(${tilt}rad)`,
      }}
      {...rest}
    >
      <defs>
        <linearGradient id={`${id}-body`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor={accent} stopOpacity="0.55" />
          <stop offset="35%" stopColor={accent} stopOpacity="1" />
          <stop offset="65%" stopColor={accent} stopOpacity="0.92" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id={`${id}-lid`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#2a251f" />
          <stop offset="100%" stopColor="#11100e" />
        </linearGradient>
        <linearGradient id={`${id}-rim`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#77726b" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#d6d2cb" stopOpacity="1" />
          <stop offset="100%" stopColor="#6b665f" stopOpacity="0.9" />
        </linearGradient>
        <radialGradient id={`${id}-shine`} cx="0.3" cy="0.35" r="0.7">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-rough`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
          <feColorMatrix
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0.08 0"
          />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
        <filter id={`${id}-softshadow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="8" />
          <feOffset dx="0" dy="10" result="off" />
          <feFlood floodColor="#1A1714" floodOpacity="0.28" />
          <feComposite in2="off" operator="in" />
          <feComposite in="SourceGraphic" operator="over" />
        </filter>
      </defs>

      <g transform={`translate(${200 - w / 2}, ${200 - h / 2})`}>
        <ellipse
          cx={x}
          cy={h - 4}
          rx={w * 0.44}
          ry={10}
          fill="#1A1714"
          opacity={0.15}
        />

        <rect
          x={x - w / 2}
          y={y + lid}
          width={w}
          height={h - lid - 4}
          rx={4}
          fill={`url(#${id}-body)`}
          stroke={accent}
          strokeOpacity={0.2}
        />
        <rect
          x={x - w / 2}
          y={y + lid}
          width={w}
          height={h - lid - 4}
          rx={4}
          fill={`url(#${id}-shine)`}
        />

        <rect
          x={x - w / 2}
          y={y + lid + rim}
          width={w}
          height={3}
          fill={`url(#${id}-rim)`}
        />
        <rect
          x={x - w / 2}
          y={y + h - 20}
          width={w}
          height={3}
          fill={`url(#${id}-rim)`}
        />

        <g>
          <rect
            x={x - w / 2 + 18}
            y={y + labelTop}
            width={w - 36}
            height={labelH}
            rx={2}
            fill="#F4F0E8"
            opacity={0.96}
            stroke="#1A1714"
            strokeOpacity={0.08}
          />
          <text
            x={x}
            y={y + labelTop + 34}
            textAnchor="middle"
            fontFamily="'Fraunces', 'Playfair Display', Georgia, serif"
            fontSize="20"
            fill="#1A1714"
          >
            Chai &amp; Co.
          </text>
          <line
            x1={x - 44}
            y1={y + labelTop + 54}
            x2={x + 44}
            y2={y + labelTop + 54}
            stroke="#1A1714"
            strokeOpacity="0.3"
            strokeWidth="0.5"
          />
          <text
            x={x}
            y={y + labelTop + 80}
            textAnchor="middle"
            fontFamily="'Fraunces', 'Playfair Display', Georgia, serif"
            fontSize="16"
            fontWeight="500"
            fill="#1A1714"
          >
            {name}
          </text>
          <text
            x={x}
            y={y + labelTop + 104}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize="8.5"
            letterSpacing="2"
            fill="#1A1714"
            opacity="0.7"
            style={{ fontVariant: 'small-caps', textTransform: 'lowercase' }}
          >
            Ilam · Nepal · 1,900 m
          </text>
          <g transform={`translate(${x}, ${y + labelTop + 122})`} opacity="0.85">
            <path
              d="M0 -8 C5 -6 10 -1 10 5 C10 9 6 11 2 11 C-2 11 -6 9 -6 5 C-6 1 -4 -3 0 -8 Z"
              stroke={accent}
              strokeWidth="0.8"
              fill="none"
            />
            <path
              d="M0 -6 C0 -1 2 4 5 8"
              stroke={accent}
              strokeWidth="0.6"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        </g>

        <rect
          x={x - w / 2 + 2}
          y={y}
          width={w - 4}
          height={lid - 2}
          rx={3}
          fill={`url(#${id}-lid)`}
        />
        <rect
          x={x - w / 2}
          y={y + lid - 6}
          width={w}
          height={5}
          rx={2}
          fill={`url(#${id}-rim)`}
        />
        <ellipse
          cx={x}
          cy={y + 4}
          rx={w * 0.44}
          ry={7}
          fill="#0d0b09"
          opacity={0.9}
        />

        <rect
          x={x - w / 2}
          y={y + lid}
          width={w}
          height={h - lid - 4}
          rx={4}
          fill={`${accent}`}
          opacity={0.04 + sideShade * 0.15}
          filter={`url(#${id}-rough)`}
        />
      </g>
    </svg>
  );
}
