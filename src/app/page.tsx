'use client';

import { Hero } from '@/components/home/Hero';
import { StickyTin } from '@/components/home/StickyTin';
import { CollectionRail } from '@/components/home/CollectionRail';
import { OriginMap } from '@/components/home/OriginMap';
import { ProcessTimeline } from '@/components/home/ProcessTimeline';
import { FlipCard } from '@/components/home/FlipCards';
import { Testimonials } from '@/components/home/Testimonials';
import { Newsletter } from '@/components/home/Newsletter';
import { Reveal } from '@/components/ui/Reveal';
import { SplitText } from '@/components/ui/SplitText';
import { PRODUCTS } from '@/lib/products';

export default function HomePage() {
  const threeFlips = [
    { ...PRODUCTS[0].flavourCard, accent: PRODUCTS[0].accent, name: PRODUCTS[0].flavourCard.name, side: 'flavour' as const },
    { ...PRODUCTS[1].originCard, accent: PRODUCTS[1].accent, name: PRODUCTS[1].originCard.name, side: 'origin' as const },
    { ...PRODUCTS[2].flavourCard, accent: PRODUCTS[2].accent, name: PRODUCTS[2].flavourCard.name, side: 'flavour' as const },
  ];

  return (
    <main className="relative bg-paper text-ink">
      <Hero />

      <StickyTin />

      <CollectionRail />

      <OriginMap />

      <ProcessTimeline />

      <section className="bg-paper py-24 md:py-36 px-6">
        <div className="mx-auto w-[min(92%,1100px)]">
          <div className="max-w-2xl mb-16 md:mb-20">
            <Reveal variant="fadeUpSmall">
              <p className="small-caps tracking-[0.28em] text-[11px] mb-4" style={{ color: '#B3541E' }}>
                Library
              </p>
            </Reveal>
            <Reveal variant="fadeUp" delay={0.05}>
              <h2 className="font-serif text-[clamp(2rem,5vw,3.6rem)] tracking-tight leading-[1.04] text-ink max-w-[14ch] text-balance mb-5">
                <SplitText text="Tasting cards, for the curious." as="words" />
              </h2>
            </Reveal>
            <Reveal variant="fadeUp" delay={0.12}>
              <p className="font-sans text-[16px] leading-relaxed text-ink/70 max-w-[46ch]">
                Hover, tap or press Enter to reveal the origin, altitude, flavour
                compounds and brewing note for each tea.
              </p>
            </Reveal>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {threeFlips.map((card, i) => (
              <Reveal
                key={card.name + i}
                variant="fadeUp"
                delay={i * 0.08}
                className="contents"
              >
                <FlipCard card={card} accent={card.accent} side={card.side} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />

      <Newsletter />
    </main>
  );
}
