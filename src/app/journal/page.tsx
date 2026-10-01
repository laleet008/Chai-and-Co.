import { Reveal } from '@/components/ui/Reveal';
import { SplitText } from '@/components/ui/SplitText';
import { ArrowIcon } from '@/components/ui/Icons';
import Link from 'next/link';

export const metadata = {
  title: 'Journal',
  description:
    'Short writing on brewing, altitude, tasting notes and the quiet craft of tea from Ilam.',
};

const posts = [
  {
    slug: 'how-to-brew-a-first-flush',
    kicker: 'Brewing guide',
    title: 'How to brew a first flush.',
    excerpt:
      'Cooler water, more leaf, shorter than you think. A short guide to not wasting the good stuff.',
    read: '4 min',
  },
  {
    slug: 'what-altitude-does',
    kicker: 'On the leaf',
    title: 'What altitude does to a tea leaf.',
    excerpt:
      'Slow growth means concentrated flavour. The hill does most of the work before the pluckers arrive.',
    read: '6 min',
  },
  {
    slug: 'reading-a-tasting-note',
    kicker: 'Tasting',
    title: 'Reading a tasting note.',
    excerpt:
      'Muscatel, honeyed, chestnut — what those words actually refer to, and what to ignore.',
    read: '5 min',
  },
];

export default function JournalPage() {
  return (
    <div className="bg-paper text-ink pt-32 pb-32 px-6 min-h-screen">
      <div className="mx-auto w-[min(92%,1100px)]">
        <Reveal variant="maskUp">
          <p className="small-caps text-ink/50 mb-4">Journal</p>
        </Reveal>
        <Reveal variant="fadeUp" delay={0.05}>
          <h1 className="font-serif text-fluid-h2 leading-[1.05] tracking-tight mb-10 max-w-3xl text-balance">
            <SplitText
              text="Short writing on the quiet craft of tea."
              as="words"
            />
          </h1>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-ink/10">
          {posts.map((p, i) => (
            <Reveal
              key={p.slug}
              variant="fadeUp"
              delay={0.08 * i}
              className="group"
            >
              <Link
                href={`/journal/${p.slug}`}
                className="block h-full border-t border-ink/10 pt-6"
              >
                <div className="aspect-[16/10] bg-cream rounded-sm mb-6 border border-ink/5 transition-colors group-hover:bg-clay/10" />
                <p className="small-caps text-ink/50 mb-2">
                  {p.kicker} · {p.read}
                </p>
                <h2 className="font-serif text-2xl leading-snug tracking-tight mb-3 group-hover:text-clay transition-colors">
                  {p.title}
                </h2>
                <p className="font-sans text-ink/60 text-[15px] leading-relaxed mb-4">
                  {p.excerpt}
                </p>
                <span className="inline-flex items-center gap-2 small-caps text-ink/70 group-hover:text-clay transition-colors">
                  Read
                  <ArrowIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
