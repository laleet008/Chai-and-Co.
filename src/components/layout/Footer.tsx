'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { LeafGlyph } from '../ui/Icons';
import { useReducedMotion } from '@/lib/useReducedMotion';

const links = [
  { href: '/shop', label: 'Shop' },
  { href: '/story', label: 'Story' },
  { href: '/journal', label: 'Journal' },
  { href: '/checkout', label: 'Checkout' },
];

export function Footer() {
  const reduced = useReducedMotion();

  return (
    <footer className="relative bg-paper border-t border-ink/10 mt-24">
      <div className="mx-auto w-[min(92%,1100px)] py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 text-ink mb-6">
              <LeafGlyph className="w-8 h-8 text-clay" />
              <span className="font-serif text-3xl tracking-tight">
                Chai &amp; Co.
              </span>
            </div>
            <p className="font-sans text-ink/60 max-w-sm text-[15px] leading-relaxed">
              Single-estate loose-leaf tea from the hills of Ilam, eastern Nepal.
              Small-batch, hand-plucked, sold in matte metal tins since 1971.
            </p>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <p className="small-caps text-ink/50 mb-4">Explore</p>
              <ul className="space-y-3 font-sans">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-ink/80 hover:text-ink hover:underline underline-offset-4 transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="small-caps text-ink/50 mb-4">Contact</p>
              <ul className="space-y-3 font-sans text-ink/80 text-[15px] leading-relaxed">
                <li>
                  Baluwatar<br />
                  Kathmandu 44600
                  <br />
                  Nepal
                </li>
                <li>
                  <a
                    href="mailto:hello@chaiandco.example"
                    className="hover:underline underline-offset-4"
                  >
                    hello@chaiandco.example
                  </a>
                </li>
                <li>+977 1 555 01971</li>
              </ul>
            </div>
            <div>
              <p className="small-caps text-ink/50 mb-4">Follow</p>
              <ul className="space-y-3 font-sans">
                {['Instagram', 'Journal RSS', 'Newsletter'].map((s) => (
                  <li key={s}>
                    <a
                      href="#"
                      className="text-ink/80 hover:text-ink hover:underline underline-offset-4 transition-colors"
                    >
                      {s}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-ink/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="small-caps text-ink/40 text-[11px]">
            © {new Date().getFullYear()} Chai &amp; Co. Pvt. Ltd. · Grown in the clouds.
          </p>
          <motion.p
            className="small-caps text-ink/40 text-[11px] flex items-center gap-2"
            {...(!reduced
              ? { whileHover: { color: '#B3541E' } }
              : {})}
          >
            <LeafGlyph className="w-3.5 h-3.5" />
            Ilam · 1,900&nbsp;m · Est. 1971
          </motion.p>
        </div>
      </div>
    </footer>
  );
}
