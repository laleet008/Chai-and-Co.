'use client';

import { useEffect } from 'react';
import type { Product } from '@/lib/products';
import { useCartStore } from '@/store/cart';

type Props = {
  product: Product;
};

export default function ClientAddToCart({ product }: Props) {
  useEffect(() => {
    const handler = (e: CustomEvent<{ slug: string; sizeGrams: number; qty: number }>) => {
      if (e.detail.slug !== product.slug) return;
      useCartStore.getState().addItem({
        product,
        sizeGrams: e.detail.sizeGrams,
        qty: e.detail.qty,
      });
    };
    window.addEventListener('chai:add-to-cart' as any, handler as any);
    return () => window.removeEventListener('chai:add-to-cart' as any, handler as any);
  }, [product]);

  return null;
}
