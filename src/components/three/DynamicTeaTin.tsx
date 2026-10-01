'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { TeaTinFallback } from '@/components/three/TinFallback';
import { useReducedMotion } from '@/lib/useReducedMotion';
import type { TeaTinCore } from '@/components/three/TeaTin';

type Props = Parameters<typeof TeaTinCore>[0] & {
  className?: string;
  style?: React.CSSProperties;
  frameloopDemand?: boolean;
  scrollProgressOverride?: number;
};

const TeaTinSceneDynamic = dynamic(
  () => import('@/components/three/TeaTin').then((m) => ({ default: m.TeaTinScene })),
  { ssr: false, loading: () => <TinSkeleton /> },
);

function TinSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        className="relative rounded-sm"
        style={{
          width: '55%',
          aspectRatio: '1 / 1.4',
          background: 'linear-gradient(180deg,#EDE6D8 0%,#D8D4C8 100%)',
          animation: 'tin-pulse 1.6s ease-in-out infinite',
        }}
        aria-hidden
      >
        <div className="absolute inset-x-0 top-0 h-[12%] rounded-t-sm bg-ink/5" />
        <div className="absolute inset-x-0 top-[11%] h-px bg-ink/10" />
        <div className="absolute inset-x-[12%] top-[28%] h-[32%] rounded-sm bg-paper/70" />
        <div className="absolute inset-x-0 bottom-0 h-3 rounded-b-[50%] bg-ink/8 blur-sm translate-y-1" />
      </div>
      <style jsx>{`
        @keyframes tin-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.95; }
        }
      `}</style>
    </div>
  );
}

function WebGLAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const c = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext('webgl2') || c.getContext('webgl'))
    );
  } catch {
    return false;
  }
}

export function DynamicTeaTin({
  className,
  style,
  scrollProgressOverride = 0,
  frameloopDemand = true,
  name = 'Mist First Flush',
  accent = '#C9A227',
  sub = 'ILAM · NEPAL · 1,900 m',
  enableDrag = false,
  enableCursorParallax = true,
  enableScrollRotate = true,
  lookInside = false,
  onFirstDrag,
}: Props) {
  const ref = useRef<HTMLDivElement>(null!);
  const reduced = useReducedMotion();
  const [glOk, setGlOk] = useState<boolean | null>(null);
  const [progress, setProgress] = useState(scrollProgressOverride);

  useEffect(() => {
    setGlOk(WebGLAvailable());
  }, []);

  useEffect(() => {
    if (!enableScrollRotate || reduced) return;
    setProgress(scrollProgressOverride);
  }, [scrollProgressOverride, enableScrollRotate, reduced]);

  useEffect(() => {
    if (!enableScrollRotate || reduced) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const compute = () => {
      const rect = el.getBoundingClientRect();
      const vh = typeof window !== 'undefined' ? window.innerHeight : 720;
      const t = (vh - rect.top) / (vh + rect.height);
      const clamped = Math.max(0, Math.min(1, t));
      setProgress(clamped);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [enableScrollRotate, reduced]);

  const showFallback = reduced || glOk === false || glOk === null;

  return (
    <div
      ref={ref}
      className={className}
      style={style}
      data-tin-wrapper
    >
      {showFallback ? (
        <div className="w-full h-full flex items-center justify-center">
          <TeaTinFallback
            accent={accent}
            name={name}
            rotateY={progress * 450}
            tilt={0.25 - progress * 0.4}
            className="w-[72%] max-w-[340px] h-auto"
          />
        </div>
      ) : (
        <Suspense fallback={<TinSkeleton />}>
          <TeaTinSceneDynamic
            accent={accent}
            name={name}
            sub={sub}
            scrollProgress={progress}
            lookInside={lookInside}
            enableDrag={enableDrag}
            enableCursorParallax={enableCursorParallax}
            enableScrollRotate={!enableDrag}
            frameloopDemand={frameloopDemand}
            onFirstDrag={onFirstDrag}
            className="w-full h-full"
          />
        </Suspense>
      )}
    </div>
  );
}
