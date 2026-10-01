'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/useReducedMotion';

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  seed: number;
  hue: number;
  active: boolean;
};

export function SteamSystem({
  count = 64,
  className,
  drift = 1,
  colorRgb = '244,240,232',
  particleOpacity = 0.35,
  spawnRate = 0.22,
}: {
  count?: number;
  className?: string;
  drift?: number;
  colorRgb?: string;
  particleOpacity?: number;
  spawnRate?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const poolRef = useRef<Particle[]>([]);
  const reduced = useReducedMotion();
  const rafRef = useRef(0);

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    const pool: Particle[] = [];
    for (let i = 0; i < count; i++) {
      pool.push({
        x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 1, size: 0, seed: 0, hue: 0, active: false,
      });
    }
    poolRef.current = pool;

    function spawn(fromBottom = true) {
      const rect = canvas!.getBoundingClientRect();
      const idle = pool.find((p) => !p.active);
      if (!idle) return;
      const w = rect.width;
      const h = rect.height;
      idle.x = w * (0.15 + Math.random() * 0.7);
      idle.y = fromBottom ? h + 10 : h * (0.3 + Math.random() * 0.6);
      idle.vx = (Math.random() - 0.5) * 0.3 * drift;
      idle.vy = -(0.25 + Math.random() * 0.55) * drift;
      idle.maxLife = 3500 + Math.random() * 2200;
      idle.life = 0;
      idle.size = 40 + Math.random() * 90;
      idle.seed = Math.random() * Math.PI * 2;
      idle.hue = Math.random();
      idle.active = true;
    }

    for (let i = 0; i < Math.floor(count * 0.3); i++) spawn(false);

    let last = performance.now();
    let spawnAccum = 0;

    const tick = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      const rect = canvas!.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      ctx!.clearRect(0, 0, w, h);

      spawnAccum += dt;
      const desiredInterval = 1000 * spawnRate;
      while (spawnAccum > desiredInterval) {
        spawnAccum -= desiredInterval;
        spawn(true);
      }

      for (let i = 0; i < pool.length; i++) {
        const p = pool[i];
        if (!p.active) continue;
        p.life += dt;
        const t = p.life / p.maxLife;
        if (t >= 1) {
          p.active = false;
          continue;
        }
        p.x += p.vx + Math.sin(p.seed + now * 0.0008) * 0.18 * drift;
        p.y += p.vy;
        const growth = 0.6 + t * 1.4;
        const alpha = particleOpacity * (t < 0.1 ? t * 10 : 1) * Math.pow(1 - t, 0.8);
        const grad = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * growth);
        grad.addColorStop(0, `rgba(${colorRgb},${alpha.toFixed(3)})`);
        grad.addColorStop(1, `rgba(${colorRgb},0)`);
        ctx!.fillStyle = grad;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size * growth, 0, Math.PI * 2);
        ctx!.fill();
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [reduced, count, drift, colorRgb, particleOpacity, spawnRate]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
}
