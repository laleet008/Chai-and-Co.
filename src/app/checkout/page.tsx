import type { Metadata } from 'next';
import CheckoutClient from '@/components/checkout/CheckoutClient';

export const metadata: Metadata = {
  title: 'Checkout',
  description:
    'Three steps to secure your tin: contact, payment, review. Simulated checkout — no real payment processed.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Checkout · Chai & Co.',
    description: 'Review your tins, choose delivery, confirm. Hand-packed from Ilam.',
    type: 'website',
  },
};

export default function Page() {
  return <CheckoutClient />;
}
