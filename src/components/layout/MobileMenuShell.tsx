'use client';

import { MobileMenu } from './MobileMenu';
import { useUIStore } from '@/store/ui';

export function MobileMenuShell() {
  const mobileMenuOpen = useUIStore((s) => s.mobileMenuOpen);
  const setMobileMenuOpen = useUIStore((s) => s.setMobileMenuOpen);
  return (
    <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
  );
}
