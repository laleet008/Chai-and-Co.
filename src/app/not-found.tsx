import Link from 'next/link';
import { ArrowIcon, LeafGlyph } from '@/components/ui/Icons';
import { Reveal } from '@/components/ui/Reveal';
import { SplitText } from '@/components/ui/SplitText';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-paper text-ink flex items-center justify-center px-6 py-24">
      <div className="max-w-xl text-center">
        <Reveal variant="fadeUp">
          <div className="mb-10 inline-block">
            <svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              className="text-clay"
              aria-hidden
            >
              <g transform="translate(60,75)">
                <ellipse cx="0" cy="0" rx="36" ry="10" fill="currentColor" opacity="0.12" />
                <path
                  d="M-28 -2 L-24 -28 L24 -28 L28 -2 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  transform="rotate(-18)"
                />
                <path
                  d="M-24 -28 Q0 -38 24 -28 M-20 -14 Q0 -8 20 -14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  opacity="0.5"
                  transform="rotate(-18)"
                />
              </g>
              <g transform="translate(92,40)" opacity="0.85">
                <path
                  d="M0 -8 C6 -6 10 0 10 6 C10 10 6 12 2 12 C-2 12 -6 10 -6 6 C-6 2 -4 -2 0 -8 Z"
                  stroke="currentColor"
                  strokeWidth="1"
                  fill="currentColor"
                  opacity="0.35"
                />
              </g>
            </svg>
          </div>
        </Reveal>

        <Reveal variant="maskUp" delay={0.05}>
          <p className="small-caps text-ink/50 mb-4">404 · page not found</p>
        </Reveal>

        <Reveal variant="fadeUp" delay={0.1}>
          <h1 className="font-serif tracking-tight text-fluid-h2 leading-[1.05] mb-6 text-balance">
            <SplitText text="This cup tipped over." />
          </h1>
        </Reveal>

        <Reveal variant="fadeUp" delay={0.2}>
          <p className="font-sans text-ink/60 text-[15px] leading-relaxed mb-10 max-w-md mx-auto text-pretty">
            The leaf you are looking for may have been moved, harvested early, or
            was never here at all. Let us get you back to something warm.
          </p>
        </Reveal>

        <Reveal variant="fadeUp" delay={0.3}>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button href="/" iconRight={<ArrowIcon />}>
              Return home
            </Button>
            <Button href="/shop" variant="outline" iconRight={<ArrowIcon />}>
              Browse the collection
            </Button>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
