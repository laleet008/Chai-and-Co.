'use client';

import { type ReactNode, useEffect, useState } from 'react';

export default function ClientOnly({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  if (!hydrated) return fallback ?? null;
  return <>{children}</>;
}
