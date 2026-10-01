'use client';

import { create } from 'zustand';

type UIState = {
  mobileMenuOpen: boolean;
  cartDrawerOpen: boolean;
  loadingScreenDone: boolean;
  setMobileMenuOpen: (v: boolean) => void;
  setCartDrawerOpen: (v: boolean) => void;
  toggleMobileMenu: () => void;
  toggleCartDrawer: () => void;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  setLoadingScreenDone: (v: boolean) => void;
};

export const useUIStore = create<UIState>((set) => ({
  mobileMenuOpen: false,
  cartDrawerOpen: false,
  loadingScreenDone: false,
  setMobileMenuOpen: (v) => set({ mobileMenuOpen: v }),
  setCartDrawerOpen: (v) => set({ cartDrawerOpen: v }),
  toggleMobileMenu: () => set((s) => ({ mobileMenuOpen: !s.mobileMenuOpen })),
  toggleCartDrawer: () => set((s) => ({ cartDrawerOpen: !s.cartDrawerOpen })),
  openCartDrawer: () => set({ cartDrawerOpen: true }),
  closeCartDrawer: () => set({ cartDrawerOpen: false }),
  setLoadingScreenDone: (v) => set({ loadingScreenDone: v }),
}));
