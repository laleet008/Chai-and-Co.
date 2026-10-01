import { type Product } from '@/lib/products';
import { Reveal } from '@/components/ui/Reveal';
import { StarIcon } from '@/components/ui/Icons';

type Props = {
  product: Product;
};

export function Reviews({ product }: Props) {
  const avg =
    product.reviews.reduce((sum, r) => sum + r.stars, 0) /
    Math.max(1, product.reviews.length);

  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = product.reviews.filter((r) => r.stars === star).length;
    return { star, count, pct: (count / product.reviews.length) * 100 };
  });

  return (
    <section className="pt-16 border-t border-ink/10 mt-16">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-14">
        <Reveal variant="fadeUpSmall" className="md:col-span-4">
          <div>
            <p className="small-caps text-ink/50 mb-3">Reviews</p>
            <div className="flex items-end gap-3 mb-4">
              <p className="font-serif text-6xl tracking-tight leading-none">
                {avg.toFixed(1)}
              </p>
              <div className="pb-1">
                <div className="flex items-center gap-0.5 text-gold">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <StarIcon
                      key={i}
                      className="w-3.5 h-3.5"
                      style={{ opacity: i < Math.round(avg) ? 1 : 0.15 }}
                    />
                  ))}
                </div>
                <p className="small-caps text-ink/40 mt-1 text-[10px]">
                  {product.reviews.length} reviews
                </p>
              </div>
            </div>
            <div className="space-y-2">
              {distribution.map((row) => (
                <div key={row.star} className="flex items-center gap-3">
                  <span className="w-4 text-right text-xs text-ink/60 font-serif">
                    {row.star}
                  </span>
                  <div className="flex-1 h-1.5 bg-ink/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold/80"
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                  <span className="w-6 text-left text-[11px] text-ink/50 tabular-nums">
                    {row.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="md:col-span-8 space-y-8">
          {product.reviews.map((r, i) => (
            <Reveal
              key={r.id}
              variant="fadeUpSmall"
              delay={i * 0.06}
              className="pt-8 md:pt-0 border-t md:border-t-0 border-ink/10 first:border-t-0"
            >
              <div className="flex items-center justify-between mb-2 gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-serif text-ink text-sm"
                    style={{
                      background: `${product.accent}22`,
                      color: product.accent,
                    }}
                    aria-hidden
                  >
                    {r.name.trim().split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </div>
                  <div>
                    <p className="font-serif text-lg tracking-tight leading-tight">
                      {r.name}
                    </p>
                    <p className="small-caps text-ink/40 text-[10px]">
                      {r.location} · {new Date(r.date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 text-gold" aria-label={`${r.stars} of 5 stars`}>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <StarIcon
                      key={i}
                      className="w-3.5 h-3.5"
                      style={{ opacity: i < r.stars ? 1 : 0.15 }}
                    />
                  ))}
                </div>
              </div>
              <p className="font-serif text-xl tracking-tight leading-snug mb-2 mt-3">
                {r.title}
              </p>
              <p className="font-sans text-[15.5px] leading-relaxed text-ink/75">
                {r.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
