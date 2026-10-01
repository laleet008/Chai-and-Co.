import { type FlipCard as FlipCardType } from '@/lib/products';
import { LeafGlyph } from '@/components/ui/Icons';

type Props = {
  card: FlipCardType;
  accent: string;
  side: 'flavour' | 'origin';
};

export function FlipCard({ card, accent, side }: Props) {
  return (
    <div className="group [perspective:1400px]" tabIndex={0}>
      <div
        className={
          'relative w-full aspect-[4/5] rounded-sm transition-transform duration-[600ms] [transform-style:preserve-3d] ' +
          'group-hover:[transform:rotateY(180deg)] focus-within:[transform:rotateY(180deg)] focus:[transform:rotateY(180deg)]'
        }
      >
        <div className="absolute inset-0 rounded-sm border border-ink/10 overflow-hidden [backface-visibility:hidden] bg-cream">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background: `radial-gradient(circle at 60% 40%, ${accent}22, transparent 60%)`,
            }}
            aria-hidden
          />
          <div className="relative z-10 h-full w-full flex flex-col items-center justify-center p-6 text-center">
            <LeafGlyph className="w-16 h-16 mb-5" style={{ color: accent }} />
            <p className="small-caps text-ink/50 mb-2">
              {side === 'flavour' ? 'Flavour' : 'Origin'}
            </p>
            <p className="font-serif text-2xl tracking-tight leading-snug max-w-[90%]">
              {card.name}
            </p>
          </div>
          <div className="absolute bottom-5 left-5 right-5 text-center">
            <p className="small-caps text-ink/40 text-[10px]">
              Hover / tap to flip
            </p>
          </div>
        </div>
        <div
          className="absolute inset-0 rounded-sm overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)] border border-ink/10 bg-paper"
          style={{ boxShadow: '0 20px 60px -30px rgba(26, 23, 20, 0.35)' }}
        >
          <div className="h-full w-full p-6 flex flex-col justify-between">
            <div>
              <p className="small-caps text-ink/50 mb-2">{card.origin}</p>
              <p className="font-serif text-xl tracking-tight mb-1">{card.name}</p>
              <p className="font-sans text-sm text-ink/60">{card.altitude}</p>
            </div>
            <ul className="space-y-1.5 my-4">
              {card.compounds.map((c) => (
                <li key={c} className="flex items-center gap-2 text-[13.5px] text-ink/80">
                  <span
                    className="w-1 h-1 rounded-full"
                    style={{ background: accent }}
                    aria-hidden
                  />
                  {c}
                </li>
              ))}
            </ul>
            <p className="font-sans text-[13px] leading-relaxed text-ink/70 pt-4 border-t border-ink/10">
              {card.brewingNote}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
