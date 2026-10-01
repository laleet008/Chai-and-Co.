'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { DynamicTeaTin } from '@/components/three/DynamicTeaTin';
import { Chip } from '@/components/ui/Chip';
import { ArrowIcon, StarIcon } from '@/components/ui/Icons';
import { TEA_TYPE_LABELS, priceForSize, type Product } from '@/lib/products';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/cn';

import type { CSSProperties } from 'react';

type Props = {
  product: Product;
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
};

export function ProductCard({ product, className, style }: Props) {
  const avg =
    product.reviews.reduce((s, r) => s + r.stars, 0) /
    Math.max(1, product.reviews.length);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={cn('group relative', className)}
      style={style}
    >
      <Link href={`/product/${product.slug}`} className="block h-full">
        <div className="relative aspect-[4/5] bg-cream overflow-hidden rounded-sm">
          <motion.div
            className="absolute inset-0 origin-bottom"
            style={{ background: product.accent, opacity: 0 }}
            initial={{ scaleY: 0 }}
            whileHover={{ scaleY: 1, opacity: 0.12 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          />
          <div className="absolute inset-0 flex items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1">
            <DynamicTeaTin
              accent={product.accent}
              name={product.name}
              sub={product.elevationLabel}
              enableDrag={false}
              enableCursorParallax
              enableScrollRotate
              className="w-[70%] h-[78%]"
            />
          </div>

          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            <Chip variant="accent" accent={product.accent}>
              {TEA_TYPE_LABELS[product.type]}
            </Chip>
          </div>

          <div
            className="absolute bottom-3 right-3 z-10 flex items-center gap-1 rounded-full bg-paper/90 backdrop-blur-sm pl-3 pr-2 py-1.5 text-ink border border-ink/10 translate-y-2 opacity-0 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100"
            aria-hidden
          >
            <span className="small-caps text-[10px]">View</span>
            <ArrowIcon className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="pt-5 px-1">
          <div className="flex items-center justify-between gap-3 mb-2">
            <p className="small-caps text-ink/50">{product.flush}</p>
            <div className="flex items-center gap-1 text-gold/90" aria-label={`${avg.toFixed(1)} stars`}>
              <StarIcon className="w-3.5 h-3.5" />
              <span className="font-sans text-[11px] text-ink/50">
                {avg.toFixed(1)}
              </span>
            </div>
          </div>
          <h3 className="font-serif text-2xl tracking-tight leading-snug mb-2 group-hover:text-clay transition-colors duration-300">
            {product.name}
          </h3>
          <p className="font-sans text-[13.5px] text-ink/60 leading-relaxed line-clamp-2 mb-3">
            {product.tagline}
          </p>
          <div className="flex items-end justify-between pt-2 border-t border-ink/5">
            <div>
              <p className="small-caps text-ink/40 text-[10px]">
                From {product.baseGrams} g
              </p>
              <p className="font-serif text-lg text-ink">
                {formatPrice(priceForSize(product, product.sizes[0].grams))}
              </p>
            </div>
            <div className="flex flex-wrap gap-1 mb-0.5">
              {product.tastingNotes.slice(0, 2).map((n) => (
                <span
                  key={n}
                  className="inline-block text-[10px] text-ink/50 small-caps"
                >
                  {n}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
