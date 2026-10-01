'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CheckoutContact, CardDetails } from '@/lib/validators';

type OrderSummary = {
  id: string;
  createdAt: number;
  contact: CheckoutContact;
  paymentMethod: CardDetails['method'];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  itemCount: number;
};

type CheckoutState = {
  step: 1 | 2 | 3;
  contact: Partial<CheckoutContact>;
  payment: Partial<CardDetails>;
  lastOrder: OrderSummary | null;
  setStep: (s: 1 | 2 | 3) => void;
  setContact: (c: Partial<CheckoutContact>) => void;
  setPayment: (p: Partial<CardDetails>) => void;
  commitOrder: (input: Omit<OrderSummary, 'id' | 'createdAt'>) => OrderSummary;
  loadOrder: (id: string) => OrderSummary | null;
  clearCheckout: () => void;
};

type PersistedOrders = {
  orders: OrderSummary[];
};

function storage<T>() {
  return createJSONStorage<T>(() => ({
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

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set, get) => ({
      step: 1,
      contact: {},
      payment: { method: 'card' },
      lastOrder: null,

      setStep: (s) => set({ step: s }),
      setContact: (c) =>
        set((state) => ({ contact: { ...state.contact, ...c } })),
      setPayment: (p) =>
        set((state) => ({ payment: { ...state.payment, ...p } })),

      commitOrder: (input) => {
        const id = `CH${Math.floor(Math.random() * 900000 + 100000)}`;
        const order: OrderSummary = {
          id,
          createdAt: Date.now(),
          ...input,
        };
        const existing = ((get() as unknown as { orders?: OrderSummary[] }).orders ??
          []) as OrderSummary[];
        const next = [...existing, order];
        (set as any)({ orders: next, lastOrder: order });
        return order;
      },

      loadOrder: (id) => {
        const existing = ((get() as unknown as { orders?: OrderSummary[] })
          .orders ?? []) as OrderSummary[];
        return existing.find((o) => o.id === id) ?? null;
      },

      clearCheckout: () => set({ step: 1, contact: {}, payment: { method: 'card' } }),
    }),
    {
      name: 'chai-and-co-checkout',
      storage: storage<CheckoutState & { orders: OrderSummary[] }>(),
      partialize: (state) =>
        ({
          contact: state.contact,
          payment: state.payment,
          lastOrder: state.lastOrder,
          orders: (state as unknown as { orders?: OrderSummary[] }).orders ?? [],
        } as any),
    },
  ),
);
