import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '@/store/cart';
import { PRODUCTS } from '@/lib/products';

beforeEach(() => {
  useCartStore.getState().clear();
});

const mist = PRODUCTS[0];
const gold = PRODUCTS[1];

describe('cart store', () => {
  it('starts empty', () => {
    expect(useCartStore.getState().items).toHaveLength(0);
    expect(useCartStore.getState().subtotal()).toBe(0);
    expect(useCartStore.getState().itemCount()).toBe(0);
  });

  it('adds an item with computed unitPrice based on size and slug key', () => {
    const { key, unitPrice } = useCartStore.getState().addItem({
      product: mist,
      sizeGrams: mist.sizes[1].grams,
    });
    expect(key).toContain(mist.id);
    expect(unitPrice).toBeGreaterThan(0);
    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].qty).toBe(1);
    expect(items[0].unitPrice).toBe(unitPrice);
  });

  it('increments qty when the same size+product is added twice', () => {
    useCartStore.getState().addItem({ product: mist, sizeGrams: 100 });
    useCartStore.getState().addItem({ product: mist, sizeGrams: 100, qty: 2 });
    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].qty).toBe(3);
  });

  it('keeps two sizes of the same product as separate lines', () => {
    useCartStore.getState().addItem({ product: mist, sizeGrams: mist.sizes[0].grams });
    useCartStore.getState().addItem({ product: mist, sizeGrams: mist.sizes[1].grams });
    expect(useCartStore.getState().items).toHaveLength(2);
  });

  it('updates qty clamped between 1 and 20', () => {
    const { key } = useCartStore.getState().addItem({ product: gold, sizeGrams: gold.sizes[1].grams });
    useCartStore.getState().updateQty(key, 999);
    expect(useCartStore.getState().items[0].qty).toBe(20);
    useCartStore.getState().updateQty(key, -5);
    expect(useCartStore.getState().items[0].qty).toBe(1);
  });

  it('CHAI10 takes 10% off subtotal', () => {
    useCartStore.getState().addItem({ product: gold, sizeGrams: 100 });
    const sub = useCartStore.getState().subtotal();
    const r = useCartStore.getState().applyPromo('CHAI10');
    expect(r.ok).toBe(true);
    expect(useCartStore.getState().discount()).toBe(Math.round(sub * 0.1));
  });

  it('rejects invalid promo codes', () => {
    const r = useCartStore.getState().applyPromo('nope');
    expect(r.ok).toBe(false);
  });

  it('computes distance to free shipping from threshold', () => {
    useCartStore.getState().addItem({ product: gold, sizeGrams: gold.sizes[1].grams, qty: 1 });
    const d = useCartStore.getState().distanceToFreeShipping();
    expect(d).toBeGreaterThan(0);
    expect(useCartStore.getState().progressToFreeShipping()).toBeLessThan(1);
  });

  it('progress === 1 once subtotal crosses threshold', () => {
    useCartStore.getState().addItem({ product: mist, sizeGrams: 250, qty: 5 });
    expect(useCartStore.getState().progressToFreeShipping()).toBe(1);
    expect(useCartStore.getState().shipping('standard')).toBe(0);
  });

  it('removes items without breaking the remaining lines', () => {
    const { key } = useCartStore.getState().addItem({ product: mist, sizeGrams: 100 });
    useCartStore.getState().addItem({ product: gold, sizeGrams: 100 });
    useCartStore.getState().removeItem(key);
    expect(useCartStore.getState().items.map((i) => i.productId)).toEqual([gold.id]);
  });
});
