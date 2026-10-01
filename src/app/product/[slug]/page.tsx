import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PRODUCTS, TEA_TYPE_LABELS, getProduct, priceForSize, type Product } from '@/lib/products';
import { formatPrice } from '@/lib/format';
import { DynamicTeaTin } from '@/components/three/DynamicTeaTin';
import { ProductStickyTin } from '@/components/product/ProductStickyTin';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/Accordion';
import { Chip } from '@/components/ui/Chip';
import { Reveal } from '@/components/ui/Reveal';
import { SplitText } from '@/components/ui/SplitText';
import { ArrowIcon, StarIcon } from '@/components/ui/Icons';
import { BrewWidget, BuyBox } from '@/components/product/BrewWidget';
import { StatMeters } from '@/components/product/StatMeters';
import { Reviews } from '@/components/product/Reviews';
import { FlipCard } from '@/components/home/FlipCards';
import { ProductCard } from '@/components/shop/ProductCard';
import ClientAddToCart from '@/components/product/ClientAddToCart';

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const p = getProduct(params.slug);
  if (!p) {
    return { title: 'Tea not found' };
  }
  const jsonLdProduct = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    image: [
      `https://chaiandco.example/og/product/${p.slug}.png`,
    ],
    description: p.tagline,
    sku: p.id,
    brand: {
      '@type': 'Brand',
      name: 'Chai & Co.',
    },
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: Math.min(...p.sizes.map((s) => priceForSize(p, s.grams))),
      highPrice: Math.max(...p.sizes.map((s) => priceForSize(p, s.grams))),
      priceCurrency: 'NPR',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue:
        p.reviews.reduce((s, r) => s + r.stars, 0) /
        Math.max(1, p.reviews.length),
      reviewCount: p.reviews.length,
    },
  };
  return {
    title: p.name,
    description: `${p.tagline} · ${p.oneLiner}`,
    alternates: { canonical: `/product/${p.slug}` },
    openGraph: {
      title: `${p.name} · Chai & Co.`,
      description: p.tagline,
      type: 'website',
      url: `https://chaiandco.example/product/${p.slug}`,
    },
  };
}

function Breadcrumb({ product }: { product: Product }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex items-center gap-1.5 small-caps text-[11px] text-ink/50">
        <li>
          <Link href="/" className="hover:text-clay transition-colors">
            Home
          </Link>
        </li>
        <li aria-hidden>/</li>
        <li>
          <Link href="/shop" className="hover:text-clay transition-colors">
            Shop
          </Link>
        </li>
        <li aria-hidden>/</li>
        <li className="text-ink/80">
          <span aria-current="page">{product.name}</span>
        </li>
      </ol>
    </nav>
  );
}

export default function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = getProduct(params.slug);
  if (!product) return notFound();

  const avgStars =
    product.reviews.reduce((s, r) => s + r.stars, 0) /
    Math.max(1, product.reviews.length);

  const pairsWell = PRODUCTS.filter(
    (p) => p.id !== product.id && p.type !== product.type,
  ).slice(0, 2);

  return (
    <div className="bg-paper text-ink pt-28 pb-24 px-6 min-h-screen">
      <div className="mx-auto w-[min(92%,1100px)]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-7 order-2 md:order-1">
            <div
              className="relative md:sticky md:top-28 rounded-sm bg-cream border border-ink/5 aspect-[4/5] flex items-center justify-center overflow-hidden"
              style={{ maxHeight: 'min(82vh, 820px)' }}
            >
              <div
                aria-hidden
                className="absolute inset-0 opacity-60"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${product.accent}20, transparent 60%), radial-gradient(circle at 80% 80%, ${product.accent}12, transparent 55%)`,
                }}
              />
              <div className="relative z-10 w-full h-full">
                <ClientAddToCart product={product} />
                <ProductStickyTin product={product} />
              </div>
            </div>
          </div>

          <div className="md:col-span-5 order-1 md:order-2 md:pt-6">
            <Breadcrumb product={product} />

            <Reveal variant="fadeUpSmall">
              <div className="flex items-center gap-2 mb-5 flex-wrap">
                <Chip variant="accent" accent={product.accent}>
                  {TEA_TYPE_LABELS[product.type]}
                </Chip>
                <Chip variant="outline">{product.flush}</Chip>
                <Chip variant="outline">{product.harvestMonth}</Chip>
              </div>
            </Reveal>

            <Reveal variant="fadeUp" delay={0.05}>
              <h1 className="font-serif tracking-tight text-fluid-h2 leading-[1.03] text-balance mb-4">
                <SplitText text={product.name} as="words" />
              </h1>
            </Reveal>

            <Reveal variant="fadeUp" delay={0.1}>
              <p className="font-serif text-xl tracking-tight text-ink/80 leading-snug max-w-md mb-6 italic">
                {product.oneLiner}
              </p>
            </Reveal>

            <Reveal variant="fadeUp" delay={0.15}>
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-ink/10 flex-wrap">
                <p className="font-serif text-4xl tracking-tight text-ink">
                  {formatPrice(priceForSize(product, product.sizes[1]?.grams ?? product.baseGrams))}
                </p>
                <div
                  className="flex items-center gap-1.5 text-gold"
                  aria-label={`${avgStars.toFixed(1)} of 5 stars from ${product.reviews.length} reviews`}
                >
                  <div className="flex items-center gap-0.5">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <StarIcon
                        key={i}
                        className="w-4 h-4"
                        style={{ opacity: i < Math.round(avgStars) ? 1 : 0.15 }}
                      />
                    ))}
                  </div>
                  <span className="font-sans text-[12px] text-ink/60 ml-1">
                    {avgStars.toFixed(1)} · {product.reviews.length} reviews
                  </span>
                </div>
              </div>
            </Reveal>

            <Reveal variant="fadeUp" delay={0.2} className="mb-8">
              <p className="small-caps text-ink/50 mb-3">Tasting notes</p>
              <div className="flex flex-wrap gap-2">
                {product.tastingNotes.map((n, i) => (
                  <Reveal
                    key={n}
                    variant="fadeUpSmall"
                    delay={0.2 + i * 0.06}
                    className="contents"
                  >
                    <Chip variant="accent" accent={product.accent}>
                      {n}
                    </Chip>
                  </Reveal>
                ))}
              </div>
            </Reveal>

            <BuyBox product={product} />

            <div className="mt-10">
              <Accordion>
                <AccordionItem value="description" defaultOpen>
                  <AccordionTrigger>Description</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-[16px] leading-relaxed text-pretty">
                      {product.longDescription}
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="brewing">
                  <AccordionTrigger>Brewing guide</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {[
                        { label: 'Water temp', value: `${product.brewing.waterTempC} °C` },
                        {
                          label: 'Leaf per cup',
                          value: `${product.brewing.leafPerCupG} g`,
                        },
                        {
                          label: 'Steep time',
                          value: `${Math.round(product.brewing.steepSeconds / 60 * 10) / 10} min`,
                        },
                      ].map((row) => (
                        <div key={row.label}>
                          <p className="small-caps text-ink/40 text-[10px] mb-1">
                            {row.label}
                          </p>
                          <p className="font-serif text-xl tracking-tight">
                            {row.value}
                          </p>
                        </div>
                      ))}
                    </div>
                    <ul className="space-y-2">
                      {product.brewing.notes.map((note) => (
                        <li key={note} className="flex gap-3">
                          <span
                            aria-hidden
                            className="mt-2 w-1 h-1 rounded-full shrink-0"
                            style={{ background: product.accent }}
                          />
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="origin">
                  <AccordionTrigger>Origin &amp; harvest</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                      {[
                        { label: 'Elevation', value: product.elevationLabel },
                        { label: 'Harvest window', value: product.harvestWindow },
                        { label: 'Pluck standard', value: product.pluckingStandard },
                        {
                          label: 'Wither',
                          value: `${product.witherHours} h, open air`,
                        },
                      ].map((row) => (
                        <div key={row.label}>
                          <p className="small-caps text-ink/40 text-[10px] mb-1">
                            {row.label}
                          </p>
                          <p className="font-serif text-lg tracking-tight leading-snug">
                            {row.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="shipping">
                  <AccordionTrigger>Shipping &amp; tin</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <p>
                        Matte metal tin, 0.3 mm steel, seam-welded, with a
                        double-lidded inner cap. Keeps light, air and moisture
                        out. Good for up to 18 months from packing, best
                        within 9.
                      </p>
                      <p>
                        Standard shipping across Nepal, 3–5 days, free over{' '}
                        <span className="font-serif">
                          {formatPrice(3000)}
                        </span>
                        . Express 1–2 days, NPR 250. Kathmandu Valley
                        same-day hand-delivery available on orders placed
                        before 2 pm, NPR 400. International on request.
                      </p>
                      <p>
                        Refill bags, no tin, 20% off your next tin when you
                        return the old one to any of our Kathmandu stockists.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <BrewWidget product={product} />

            <StatMeters product={product} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-14">
              <Reveal variant="fadeUp">
                <FlipCard
                  card={product.flavourCard}
                  accent={product.accent}
                  side="flavour"
                />
              </Reveal>
              <Reveal variant="fadeUp" delay={0.08}>
                <FlipCard
                  card={product.originCard}
                  accent={product.accent}
                  side="origin"
                />
              </Reveal>
            </div>

            <Reviews product={product} />

            {pairsWell.length > 0 && (
              <section className="pt-16 border-t border-ink/10 mt-16">
                <Reveal variant="maskUp">
                  <p className="small-caps text-ink/50 mb-3">Pairs well with</p>
                </Reveal>
                <Reveal variant="fadeUp" delay={0.05}>
                  <h2 className="font-serif text-fluid-h2 tracking-tight leading-[1.05] mb-10 max-w-md text-balance">
                    A second cup, different weather.
                  </h2>
                </Reveal>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {pairsWell.map((p, i) => (
                    <Reveal
                      key={p.id}
                      variant="fadeUpSmall"
                      delay={0.08 * i}
                    >
                      <ProductCard product={p} />
                    </Reveal>
                  ))}
                </div>
                <div className="mt-10 flex items-center justify-between flex-wrap gap-4">
                  <p className="small-caps text-ink/40">
                    Four teas in total.
                  </p>
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 small-caps text-ink/80 hover:text-clay transition-colors"
                  >
                    See all four
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
