import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Reveal } from '@/components/ui/Reveal';
import { SplitText } from '@/components/ui/SplitText';
import { ArrowIcon, LeafGlyph } from '@/components/ui/Icons';
import OrderConfirmClient from '@/components/checkout/OrderConfirmClient';

type Params = { id: string };

export function generateMetadata({ params }: { params: Params }): Metadata {
  const id = /^CH\d{6}$/.test(params.id) ? params.id : 'Order';
  return {
    title: `Order ${id} confirmed`,
    description: `Confirmation for Chai & Co. order ${id}. Dispatch from Ilam within two working days.`,
    robots: { index: false, follow: false },
  };
}

export default function OrderConfirmationPage({ params }: { params: Params }) {
  const id = params.id;
  if (!/^CH\d{6}$/.test(id)) return notFound();

  const steps = [
    { label: 'Confirmed' },
    { label: 'Packed' },
    { label: 'Shipped' },
    { label: 'Delivered' },
  ];

  return (
    <div className="bg-paper text-ink pt-32 pb-32 px-6 min-h-screen">
      <div className="mx-auto w-[min(92%,780px)] text-center">
        <Reveal variant="scaleIn" delay={0}>
          <div className="inline-flex mb-8 relative">
            <div className="w-20 h-20 rounded-full bg-cream border border-ink/10 flex items-center justify-center">
              <LeafGlyph className="w-10 h-10 text-clay" />
            </div>
          </div>
        </Reveal>
        <Reveal variant="maskUp" delay={0.05}>
          <p className="small-caps text-ink/50 mb-4">
            Order #{id} · Brewing your order
          </p>
        </Reveal>
        <Reveal variant="fadeUp" delay={0.1}>
          <h1 className="font-serif text-fluid-h2 tracking-tight leading-[1.05] mb-6 text-balance max-w-2xl mx-auto">
            <SplitText text="Thank you. This is the beginning of a cup." as="words" />
          </h1>
        </Reveal>
        <Reveal variant="fadeUp" delay={0.18}>
          <p className="font-sans text-ink/65 text-[16px] leading-relaxed max-w-xl mx-auto mb-16">
          A confirmation has been queued to your email. We will pack and
          dispatch from Ilam within two working days from now. Keep the tin somewhere you.
          </p>
        </Reveal>

        <OrderConfirmClient steps={steps} />

        <div className="mt-20 flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 small-caps text-ink/80 hover:text-clay transition-colors"
          >
            Back to shop
            <ArrowIcon className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 small-caps text-ink/80 hover:text-clay transition-colors"
          >
            Home
            <ArrowIcon className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
