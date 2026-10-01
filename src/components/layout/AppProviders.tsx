'use client';

import type { ReactNode } from 'react';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { FlyToCartProvider } from '@/components/cart/FlyToCart';
import { LoadingScreen } from '@/components/layout/LoadingScreen';
import { CustomCursor } from '@/components/layout/CustomCursor';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <FlyToCartProvider>
      <LoadingScreen />
      <CustomCursor />
      {children}
      <CartDrawer />
    </FlyToCartProvider>
  );
}
