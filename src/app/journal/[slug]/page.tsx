import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ARTICLES, getArticle, type Article } from '@/lib/articles';
import { getProduct } from '@/lib/products';
import { Reveal } from '@/components/ui/Reveal';
import { SplitText } from '@/components/ui/SplitText';
import { ArrowIcon, LeafGlyph } from '@/components/ui/Icons';
import { DynamicTeaTin } from '@/components/three/DynamicTeaTin';
import ClientReadingProgress from '@/components/journal/ClientReadingProgress';

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = getArticle(params.slug);
  if (!article) return { title: 'Article not found' };
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/journal/${article.slug}` },
    openGraph: {
      title: `${article.title} · Journal`,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.date,
      authors: [article.author.name],
      tags: [article.kicker],
    },
  };
}

export default function JournalArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = getArticle(params.slug);
  if (!article) return notFound();
  const related = getProduct(article.relatedProductSlug);
  const next = article.nextArticleSlug ? getArticle(article.nextArticleSlug) : null;

  return (
    <>
      <ClientReadingProgress />
      <article className="bg-paper text-ink pt-32 pb-32 px-6 min-h-screen">
        <div className="mx-auto max-w-3xl">
          <Reveal variant="maskUp">
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex items-center gap-1.5 small-caps text-[11px] text-ink/50">
                <li>
                  <Link href="/" className="hover:text-clay transition-colors">
                    Home
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li>
                  <Link
                    href="/journal"
                    className="hover:text-clay transition-colors"
                  >
                    Journal
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li>
                  <span aria-current="page" className="text-ink/80">
                    {article.kicker}
                  </span>
                </li>
              </ol>
            </nav>
          </Reveal>

          <Reveal variant="fadeUpSmall" delay={0.02}>
            <p className="small-caps text-ink/50 mb-5">
              {article.kicker} · {article.readMinutes} min read ·{' '}
              {new Date(article.date).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </Reveal>

          <Reveal variant="fadeUp" delay={0.06}>
            <h1 className="font-serif tracking-tight text-fluid-h2 leading-[1.05] mb-10 text-balance">
              <SplitText text={article.title} as="words" gapPerWord={0.04} />
            </h1>
          </Reveal>

          <Reveal variant="fadeUp" delay={0.12}>
            <div className="flex items-center gap-3 pb-10 mb-10 border-b border-ink/10">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-serif text-sm"
                style={{ background: '#B3541E22', color: '#B3541E' }}
                aria-hidden
              >
                {article.author.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <p className="font-serif text-lg tracking-tight leading-tight">
                  {article.author.name}
                </p>
                <p className="small-caps text-ink/40 text-[10px]">
                  {article.author.role}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal variant="maskUp" delay={0.15}>
            <div className="relative float-right md:-mr-40 w-24 md:w-40 h-24 md:h-40 mb-8 mt-6 ml-6 text-clay/80">
              <LeafGlyph className="w-full h-full" />
            </div>
          </Reveal>

          <div className="font-sans text-[17px] leading-[1.85] text-ink/85 space-y-7">
            {article.body.map((block, i) => {
              if (block.type === 'p') {
                return (
                  <Reveal
                    key={i}
                    variant="fadeUpSmall"
                    delay={0.02 * i}
                    className={i === 0 ? 'first-letter:font-serif first-letter:text-[4.5rem] first-letter:leading-[0.8] first-letter:mr-3 first-letter:float-left first-letter:mt-2 first-letter:text-clay' : ''}
                  >
                    <p className="text-pretty">{block.text}</p>
                  </Reveal>
                );
              }
              if (block.type === 'h2') {
                return (
                  <Reveal key={i} variant="fadeUp" delay={0.02 * i} className="pt-6">
                    <h2 className="font-serif text-3xl md:text-4xl tracking-tight text-ink leading-[1.15] mt-2 mb-2 text-balance">
                      {block.text}
                    </h2>
                  </Reveal>
                );
              }
              if (block.type === 'pullquote') {
                return (
                  <Reveal key={i} variant="fadeUp" delay={0.02 * i} className="py-2">
                    <blockquote className="relative border-l-2 border-clay/60 pl-6 my-10 max-w-xl">
                      <p className="font-serif text-[26px] md:text-[30px] leading-[1.3] tracking-tight text-ink/90 italic text-balance">
                        {block.text}
                      </p>
                    </blockquote>
                  </Reveal>
                );
              }
              if (block.type === 'list') {
                return (
                  <Reveal
                    key={i}
                    variant="fadeUpSmall"
                    delay={0.02 * i}
                    className="my-8"
                  >
                    <ul className="space-y-4">
                      {block.items.map((item, li) => (
                        <li key={li} className="flex gap-4 items-start">
                          <span
                            aria-hidden
                            className="mt-3 w-1.5 h-1.5 shrink-0 rounded-full bg-clay"
                          />
                          <p>{item}</p>
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                );
              }
              return null;
            })}
          </div>
        </div>

        {related && (
          <section className="mx-auto w-[min(92%,1100px)] mt-28 border-t border-ink/10 pt-16">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
              <div className="md:col-span-5 md:order-2">
                <div className="aspect-[4/5] bg-cream rounded-sm border border-ink/5 flex items-center justify-center">
                  <DynamicTeaTin
                    accent={related.accent}
                    name={related.name}
                    sub={related.elevationLabel}
                    enableDrag={false}
                    enableCursorParallax
                    enableScrollRotate
                    className="w-[72%] h-[72%]"
                  />
                </div>
              </div>
              <div className="md:col-span-7 md:order-1">
                <Reveal variant="fadeUpSmall">
                  <p className="small-caps text-ink/50 mb-3">Pair with this read</p>
                </Reveal>
                <Reveal variant="fadeUp" delay={0.05}>
                  <h3 className="font-serif text-4xl tracking-tight mb-4 max-w-md text-balance leading-[1.08]">
                    {related.name}.
                  </h3>
                </Reveal>
                <Reveal variant="fadeUp" delay={0.1}>
                  <p className="font-sans text-[16px] leading-relaxed text-ink/70 max-w-lg mb-6">
                    {related.tagline} — {related.oneLiner}
                  </p>
                </Reveal>
                <Reveal variant="fadeUp" delay={0.15}>
                  <Link
                    href={`/product/${related.slug}`}
                    className="inline-flex items-center gap-2 small-caps text-ink hover:text-clay transition-colors"
                  >
                    Read the tin
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </Link>
                </Reveal>
              </div>
            </div>
          </section>
        )}

        {next && (
          <section className="mx-auto w-[min(92%,1100px)] mt-24 pt-16 border-t border-ink/10">
            <Reveal variant="fadeUp">
              <p className="small-caps text-ink/50 mb-5">Next article</p>
              <Link
                href={`/journal/${next.slug}`}
                className="group block"
              >
                <div className="flex items-end justify-between gap-10 pb-10 border-b border-ink/10 flex-wrap">
                  <div>
                    <p className="small-caps text-clay/90 mb-2">{next.kicker}</p>
                    <h3 className="font-serif text-fluid-display tracking-tight leading-[1.05] max-w-3xl text-balance group-hover:text-clay transition-colors duration-500">
                      {next.title}
                      <ArrowIcon className="w-8 h-8 inline-block ml-4 translate-y-[-6px] group-hover:translate-x-2 transition-transform duration-500" />
                    </h3>
                  </div>
                  <p className="small-caps text-ink/40 shrink-0 pb-1 hidden md:block">
                    {next.readMinutes} min
                  </p>
                </div>
              </Link>
            </Reveal>
          </section>
        )}
      </article>
    </>
  );
}
