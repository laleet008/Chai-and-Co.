'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PRODUCTS, getProduct, priceForSize, type Product } from '@/lib/products';
import { validatePromoCode, type PromoCode } from '@/lib/validators';
import { formatPrice } from '@/lib/format';

export type CartItem = {
  key: string;
  productId: string;
  slug: string;
  name: string;
  accent: string;
  sizeGrams: number;
  sizeLabel: string;
  unitPrice: number;
  qty: number;
};

export const FREE_SHIPPING_THRESHOLD = 3000;
export const STANDARD_SHIPPING_COST = 0;
export const EXPRESS_SHIPPING_COST = 250;
export const KATHMANDU_SHIPPING_COST = 400;

type PersistedShapeV1 = {
  version: 1;
  items: CartItem[];
  promo: PromoCode | null;
};

type PersistedShape = PersistedShapeV1;

type CartState = PersistedShape & {
  addItem: (input: { product: Product; sizeGrams: number; qty?: number }) => {
    key: string;
    unitPrice: number;
  };
  removeItem: (key: string) => void;
  updateQty: (key: string, qty: number) => void;
  applyPromo: (code: string) =>
    | { ok: true; promo: PromoCode }
    | { ok: false; error: string };
  clear: () => void;
  subtotal: () => number;
  discount: () => number;
  shipping: (deliveryOption?: 'standard' | 'express' | 'kathmandu') => number;
  total: (deliveryOption?: 'standard' | 'express' | 'kathmandu') => number;
  itemCount: () => number;
  progressToFreeShipping: () => number;
  distanceToFreeShipping: () => number;
};

function buildKey(productId: string, sizeGrams: number): string {
  return `${productId}__${sizeGrams}`;
}

function migrate(
  persisted: unknown,
): PersistedShape {
  if (
    persisted &&
    typeof persisted === 'object' &&
    'version' in persisted &&
    (persisted as { version: number }).version === 1
  ) {
    return persisted as PersistedShape;
  }
  return { version: 1, items: [], promo: null };
}

function safeStorage<T>(): ReturnType<typeof createJSONStorage<T>> {
  return createJSONStorage(() => ({
    getItem: (name) => {
      try {
        if (typeof window === 'undefined') return null;
        return window.localStorage.getItem(name);
      } catch {
        return null;
      }
    },
    setItem: (name, value) => {
      try {
        if (typeof window === 'undefined') return;
        window.localStorage.setItem(name, value);
      } catch {
        /* ignore */
      }
    },
    removeItem: (name) => {
      try {
        if (typeof window === 'undefined') return;
        window.localStorage.removeItem(name);
      } catch {
        /* ignore */
      }
    },
  }));
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      version: 1,
      items: [],
      promo: null,

      addItem: ({ product, sizeGrams, qty = 1 }) => {
        const safeQty = Math.max(1, Math.min(20, Math.floor(qty)));
        const size =
          product.sizes.find((s) => s.grams === sizeGrams) ?? product.sizes[1];
        const unitPrice = priceForSize(product, size.grams);
        const key = buildKey(product.id, size.grams);

        set((state) => {
          const existing = state.items.find((i) => i.key === key);
          const items = existing
            ? state.items.map((i) =>
                i.key === key
                  ? { ...i, qty: Math.min(20, i.qty + safeQty) }
                  : i,
              )
            : [
                ...state.items,
                {
                  key,
                  productId: product.id,
                  slug: product.slug,
                  name: product.name,
                  accent: product.accent,
                  sizeGrams: size.grams,
                  sizeLabel: size.label,
                  unitPrice,
                  qty: safeQty,
                },
              ];
          return { items };
        });

        return { key, unitPrice };
      },

      removeItem: (key) => {
        set((state) => ({ items: state.items.filter((i) => i.key !== key) }));
      },

      updateQty: (key, qty) => {
        const safeQty = Math.max(1, Math.min(20, Math.floor(qty)));
        set((state) => ({
          items: state.items
            .map((i) => (i.key === key ? { ...i, qty: safeQty } : i)),
        }));
      },

      applyPromo: (code) => {
        const promo = validatePromoCode(code);
        if (!promo) {
          return { ok: false as const, error: 'This code is not valid.' };
        }
        set({ promo });
        return { ok: true as const, promo };
      },

      clear: () => set({ items: [], promo: null }),

      subtotal: () => {
        const { items } = get();
        return items.reduce(
          (sum, i) => sum + i.unitPrice * i.qty,
          0,
        );
      },

      discount: () => {
        const { promo, subtotal } = get();
        const s = subtotal();
        if (promo === 'CHAI10') return Math.round(s * 0.1);
        return 0;
      },

      shipping: (deliveryOption = 'standard') => {
        const subtotal = get().subtotal();
        const freeShip = get().promo === 'MIST' || subtotal >= FREE_SHIPPING_THRESHOLD;
        if (deliveryOption === 'standard' || freeShip) {
          return freeShip && deliveryOption === 'standard'
            ? 0
            : deliveryOption === 'standard'
            ? subtotal >= FREE_SHIPPING_THRESHOLD
              ? 0
              : STANDARD_SHIPPING_COST
            : 0;
        }
        if (deliveryOption === 'express') return EXPRESS_SHIPPING_COST;
        if (deliveryOption === 'kathmandu') return KATHMANDU_SHIPPING_COST;
        return 0;
      },

      total: (deliveryOption) => {
        const s = get().subtotal();
        const d = get().discount();
        const ship = get().shipping(deliveryOption);
        return Math.max(0, s - d + ship);
      },

      itemCount: () => {
        return get().items.reduce((n, i) => n + i.qty, 0);
      },

      progressToFreeShipping: () => {
        const s = get().subtotal();
        if (s >= FREE_SHIPPING_THRESHOLD) return 1;
        return Math.min(1, s / FREE_SHIPPING_THRESHOLD);
      },

      distanceToFreeShipping: () => {
        const s = get().subtotal();
        return Math.max(0, FREE_SHIPPING_THRESHOLD - s);
      },
    }),
    {
      name: 'chai-and-co-cart',
      version: 1,
      migrate: (persistedState) => migrate(persistedState) as any,
      storage: safeStorage<CartState>(),
      partialize: (state) => ({
        version: state.version,
        items: state.items,
        promo: state.promo,
      }),
    },
  ),
);

export function formatShippingCost(
  option: 'standard' | 'express' | 'kathmandu',
  subtotal: number,
  mistPromoApplied: boolean,
): string {
  if (option === 'standard' && subtotal >= FREE_SHIPPING_THRESHOLD) {
    return 'Free';
  }
  if (mistPromoApplied) return 'Free';
  if (option === 'standard') return formatPrice(STANDARD_SHIPPING_COST);
  if (option === 'express') return formatPrice(EXPRESS_SHIPPING_COST);
  return formatPrice(KATHMANDU_SHIPPING_COST);
}

export { getProduct };
export const allProducts = () => PRODUCTS;
