import { type Product } from '@/lib/products';
import { Reveal } from '@/components/ui/Reveal';

type Props = {
  product: Product;
};

const labels: Record<keyof Product['stats'], string> = {
  caffeine: 'Caffeine',
  body: 'Body',
  sweetness: 'Sweetness',
  astringency: 'Astringency',
};

export function StatMeters({ product }: Props) {
  return (
    <Reveal variant="fadeUpSmall" className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-ink/10 mt-14">
      {(Object.keys(labels) as (keyof Product['stats'])[]).map((key, i) => {
        const value = product.stats[key];
        return (
          <div key={key}>
            <div className="flex items-end justify-between mb-3">
              <p className="small-caps text-ink/50">{labels[key]}</p>
              <p className="font-serif text-sm text-ink">
                {value}
                <span className="text-ink/40"> / 5</span>
              </p>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className="flex-1 h-1.5 first:rounded-l-full last:rounded-r-full overflow-hidden bg-ink/10"
                >
                  <div
                    className="h-full transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] origin-left"
                    style={{
                      transform: `scaleX(${step <= value ? 1 : 0})`,
                      background: step <= value ? product.accent : 'transparent',
                      transitionDelay: `${(i + step) * 40}ms`,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </Reveal>
  );
}
