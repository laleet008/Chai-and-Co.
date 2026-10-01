'use client';

import { useState } from 'react';
import { DynamicTeaTin } from '@/components/three/DynamicTeaTin';
import { LeafGlyph } from '@/components/ui/Icons';
import type { Product } from '@/lib/products';
import { cn } from '@/lib/cn';

export function ProductStickyTin({ product }: { product: Product }) {
  const [lookInside, setLookInside] = useState(false);
  const [dragged, setDragged] = useState(false);

  return (
    <div
      className="relative w-full aspect-square md:aspect-[4/5] flex items-center justify-center rounded-sm overflow-hidden"
      style={{
        background: `radial-gradient(circle at 50% 55%, ${product.accent}22 0%, transparent 62%)`,
      }}
    >
      <DynamicTeaTin
        accent={product.accent}
        name={product.name}
        sub={`${product.elevationLabel} · ${product.harvestWindow}`}
        enableDrag
        enableCursorParallax
        enableScrollRotate={false}
        lookInside={lookInside}
        onFirstDrag={() => setDragged(true)}
        className={cn(
          'w-full h-full',
        )}
      />
      <button
        type="button"
        onClick={() => setLookInside((v) => !v)}
        aria-pressed={lookInside}
        className={cn(
          'absolute left-1/2 -translate-x-1/2 bottom-5 z-10',
          'h-10 px-4 rounded-full border border-ink/20 bg-paper/90 backdrop-blur',
          'small-caps tracking-widest text-[11px] text-ink/70 flex items-center gap-2',
          'hover:bg-ink hover:text-paper hover:border-ink transition-colors duration-300',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2',
          dragged ? 'opacity-0 pointer-events-none' : 'opacity-100',
        )}
        style={{ transition: 'opacity 400ms ease' }}
      >
        <LeafGlyph className="w-4 h-4" />
        <span>{lookInside ? 'Seal the tin' : 'Look inside'}</span>
      </button>
    </div>
  );
}
