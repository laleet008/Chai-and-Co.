'use client';

import {
  AnimatePresence,
  LayoutGroup,
  motion,
} from 'framer-motion';
import { useMemo, useState } from 'react';
import { PRODUCTS, TEA_TYPE_LABELS, priceForSize, type Product, type TeaType } from '@/lib/products';
import { formatPrice } from '@/lib/format';
import { ProductCard } from './ProductCard';
import { Reveal } from '@/components/ui/Reveal';
import { SplitText } from '@/components/ui/SplitText';
import { useReducedMotion } from '@/lib/useReducedMotion';

type Sort = 'featured' | 'price-asc' | 'price-desc' | 'caffeine';

const TYPE_FILTERS: { value: 'all' | TeaType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'black', label: 'Black' },
  { value: 'white', label: 'White' },
  { value: 'green', label: 'Green' },
];

export function ShopGrid() {
  const [type, setType] = useState<'all' | TeaType>('all');
  const [maxPrice, setMaxPrice] = useState<number>(6000);
  const [sort, setSort] = useState<Sort>('featured');
  const reduced = useReducedMotion();

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];
    if (type !== 'all') list = list.filter((p) => p.type === type);
    list = list.filter((p) => {
      const minPrice = Math.min(...p.sizes.map((s) => priceForSize(p, s.grams)));
      return minPrice <= maxPrice;
    });
    const withBase = list.map<[Product, number]>((p) => [
      p,
      priceForSize(p, p.baseGrams),
    ]);
    if (sort === 'price-asc') withBase.sort((a, b) => a[1] - b[1]);
    if (sort === 'price-desc') withBase.sort((a, b) => b[1] - a[1]);
    if (sort === 'caffeine') withBase.sort((a, b) => b[0].stats.caffeine - a[0].stats.caffeine);
    return withBase.map(([p]) => p);
  }, [type, maxPrice, sort]);

  const minMax = useMemo(() => {
    const prices = PRODUCTS.flatMap((p) => p.sizes.map((s) => priceForSize(p, s.grams)));
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pt-12">
      <aside className="md:col-span-3 space-y-10 md:sticky md:top-28 self-start">
        <Reveal variant="fadeUpSmall">
          <div>
            <p className="small-caps text-ink/50 mb-3">Type</p>
            <div className="flex md:flex-col flex-wrap gap-2">
              {TYPE_FILTERS.map((opt) => {
                const active = type === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setType(opt.value)}
                    aria-pressed={active}
                    className={
                      'group relative flex items-center justify-between w-full text-left rounded-sm px-4 py-2.5 text-sm border transition-colors duration-300 ' +
                      (active
                        ? 'bg-ink text-paper border-ink'
                        : 'border-ink/10 text-ink/80 hover:border-ink/30 hover:bg-cream')
                    }
                  >
                    <span>{opt.label}</span>
                    <span
                      className={
                        'small-caps text-[10px] ' +
                        (active ? 'text-paper/70' : 'text-ink/40')
                      }
                    >
                      {opt.value === 'all'
                        ? PRODUCTS.length
                        : PRODUCTS.filter((p) => p.type === opt.value).length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        <Reveal variant="fadeUpSmall" delay={0.05}>
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="small-caps text-ink/50">Max price</p>
              <span className="font-serif text-sm">{formatPrice(maxPrice)}</span>
            </div>
            <input
              type="range"
              min={minMax.min}
              max={minMax.max}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
              className="w-full accent-clay"
              aria-label="Maximum price"
            />
            <div className="flex items-center justify-between mt-2 font-sans text-[11px] text-ink/40">
              <span>{formatPrice(minMax.min)}</span>
              <span>{formatPrice(minMax.max)}</span>
            </div>
          </div>
        </Reveal>

        <Reveal variant="fadeUpSmall" delay={0.1}>
          <div>
            <label htmlFor="sort-select" className="small-caps text-ink/50 mb-3 block">
              Sort
            </label>
            <select
              id="sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="w-full rounded-sm px-4 py-2.5 text-sm border border-ink/10 bg-paper focus:border-clay outline-none transition-colors"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: low → high</option>
              <option value="price-desc">Price: high → low</option>
              <option value="caffeine">Caffeine content</option>
            </select>
          </div>
        </Reveal>

        <div className="pt-4 border-t border-ink/10">
          <p className="font-sans text-[13px] text-ink/60">
            Showing <span className="text-ink font-serif">{filtered.length}</span> of {PRODUCTS.length} teas.
          </p>
        </div>
      </aside>

      <div className="md:col-span-9">
        <LayoutGroup>
          {filtered.length === 0 ? (
            <motion.div
              initial={reduced ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-28 text-center border border-dashed border-ink/15 rounded-sm"
            >
              <p className="font-serif text-3xl mb-2">Nothing here.</p>
              <p className="font-sans text-ink/60 text-sm max-w-sm mx-auto mb-6">
                No teas match your current filters. Try loosening the price
                range or resetting the type.
              </p>
              <button
                type="button"
                className="small-caps text-[11px] border border-ink/15 px-4 py-2 hover:bg-cream transition-colors rounded-sm"
                onClick={() => {
                  setType('all');
                  setMaxPrice(minMax.max);
                  setSort('featured');
                }}
              >
                Reset filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-x-6 gap-y-14"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((p, i) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    style={reduced ? {} : { transitionDelay: `${i * 30}ms` }}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </LayoutGroup>
      </div>
    </div>
  );
}

export function ShopHero() {
  return (
    <div className="max-w-3xl">
      <Reveal variant="maskUp">
        <p className="small-caps text-ink/50 mb-4">The collection</p>
      </Reveal>
      <Reveal variant="fadeUp" delay={0.05}>
        <h1 className="font-serif text-fluid-h2 leading-[1.05] tracking-tight mb-8 text-balance">
          <SplitText
            text="Four teas. One hillside."
            as="words"
            gapPerWord={0.05}
          />
        </h1>
      </Reveal>
      <Reveal variant="fadeUp" delay={0.15}>
        <p className="font-sans text-ink/60 text-[16px] leading-relaxed max-w-xl">
          Every tin we make, in one place. From the quiet delicacy of Silver
          Tips to the round, all-day Ilam Gold. Filter by type or by price.
          There is no wrong choice.
        </p>
      </Reveal>
    </div>
  );
}
