import { ShopHero, ShopGrid } from '@/components/shop/ShopGrid';

export const metadata = {
  title: 'Shop',
  description:
    'Four single-estate teas from Ilam, Nepal. Mist First Flush, Ilam Gold, Silver Tips, Himalayan Green. Hand-plucked, hand-rolled, matte metal tins.',
};

export default function ShopPage() {
  return (
    <div className="bg-paper text-ink pt-32 pb-32 px-6 min-h-screen">
      <div className="mx-auto w-[min(92%,1100px)]">
        <ShopHero />
        <ShopGrid />
      </div>
    </div>
  );
}
