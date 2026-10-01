export type Article = {
  slug: string;
  kicker: string;
  title: string;
  excerpt: string;
  readMinutes: number;
  date: string;
  author: {
    name: string;
    role: string;
  };
  pullquote: string;
  body: Array<
    | { type: 'p'; text: string }
    | { type: 'h2'; text: string }
    | { type: 'pullquote'; text: string }
    | { type: 'list'; items: string[] }
  >;
  nextArticleSlug: string | null;
  relatedProductSlug: string;
};

export const ARTICLES: Article[] = [
  {
    slug: 'how-to-brew-a-first-flush',
    kicker: 'Brewing guide',
    title: 'How to brew a first flush.',
    excerpt:
      'Cooler water, more leaf, shorter than you think. A short guide to not wasting the good stuff.',
    readMinutes: 4,
    date: '2026-06-18',
    author: { name: 'Sonam G.', role: 'Head of Quality' },
    pullquote:
      'Boiling water on a first flush is the same thing as overcooking a vegetable. It is still food. It is not good food.',
    body: [
      {
        type: 'p',
        text: 'A first flush is a fragile thing. The leaves are small, still half asleep, packed with all the volatile oils that the plant spent the winter holding back. Treat them roughly and you will get a thin, astringent cup. Treat them gently and you will taste the hill in April.',
      },
      {
        type: 'h2',
        text: 'The water temperature question.',
      },
      {
        type: 'p',
        text: 'For a black tea this is low. 90°C, not 100. If you do not have a kettle with a temperature control, boil, then pour the water between two cups four times. That will get you there. Do not skip this step. Really.',
      },
      {
        type: 'pullquote',
        text: 'If it tastes like hay, your water was too hot. If it tastes like nothing, your leaf was too little.',
      },
      {
        type: 'h2',
        text: 'Weigh your leaf.',
      },
      {
        type: 'p',
        text: 'Two and a half grams per two-hundred-and-fifty-millilitre cup. Not a teaspoon. Not a pinch. The density of these leaves changes from week to week even in the same tin. A small kitchen scale is the single best tea-related purchase you will ever make. Ours came from a stationery shop in New Road and has lasted eleven years.',
      },
      {
        type: 'h2',
        text: 'Three minutes. Not more.',
      },
      {
        type: 'list',
        items: [
          'At two minutes you get mostly the flower notes — elderflower, a hint of cut grass.',
          'At three minutes you get the structure: the muscatel, the backbone. This is the cup we brew for tasting.',
          'At four minutes you have left the window. Drinkable, if you know you like it, but no longer a first flush.',
        ],
      },
      {
        type: 'p',
        text: 'A good first flush can be infused twice. The second cup is rounder, quieter, with less of the sharpness and more honey. Three minutes again, another five degrees warmer. That is it. No sugar, no milk, and a window open if you can manage it.',
      },
    ],
    nextArticleSlug: 'what-altitude-does',
    relatedProductSlug: 'mist-first-flush',
  },
  {
    slug: 'what-altitude-does',
    kicker: 'On the leaf',
    title: 'What altitude does to a tea leaf.',
    excerpt:
      'Slow growth means concentrated flavour. The hill does most of the work before the pluckers arrive.',
    readMinutes: 6,
    date: '2026-05-02',
    author: { name: 'Raj Kumar K.', role: 'Estate manager' },
    pullquote:
      'At two thousand metres a tea bush does not hurry. Neither should the person drinking it.',
    body: [
      {
        type: 'p',
        text: 'The easiest way to understand altitude in tea is to think about ripening fruit. A strawberry picked in early summer, after a cold spring, tastes different from one grown quickly under plastic. Different sugars, different acids. The hill is the cold spring. It is also the sun.',
      },
      {
        type: 'h2',
        text: 'What the cold does.',
      },
      {
        type: 'p',
        text: 'Every hundred metres up loses roughly half a degree Celsius in average temperature over a year. That does not sound like much. Over a growing season it is the difference between a leaf that has to work hard for every centimetre of growth, and one that does not.',
      },
      {
        type: 'p',
        text: 'A slow-growing leaf concentrates things. Caffeine rises, for one. Polyphenols — the compounds that give a tea its backbone — accumulate. Amino acids, which give the sweetness and the umami, accumulate even faster. The ratio between them shifts, which is why high-altitude tea is sweet in a way that low-altitude tea almost never is.',
      },
      {
        type: 'pullquote',
        text: 'You can taste the sun in a tea that was grown quickly. You can taste the cold in one that was not.',
      },
      {
        type: 'h2',
        text: 'What the sun does.',
      },
      {
        type: 'p',
        text: 'UV intensity goes up with altitude. More UV radiation through the thinner atmosphere means more of the pigmented compounds in the leaf that act as its sunblock. Those compounds are largely the ones that, when oxidized, become the flavour compounds of a black tea. Colour, aroma, body — the sun, indirectly, gives you all three.',
      },
      {
        type: 'h2',
        text: 'What the mist does.',
      },
      {
        type: 'p',
        text: 'Ilam is misty for a hundred mornings a year, maybe more. Diffuse light reaches the leaf instead of harsh direct sun; the plant does not have to defend itself by going tough and small. Instead it makes big, tender leaves with all the floral notes that diffuse light is famous for. Without the mist we would still make good tea. We would not make this tea.',
      },
    ],
    nextArticleSlug: 'reading-a-tasting-note',
    relatedProductSlug: 'silver-tips',
  },
  {
    slug: 'reading-a-tasting-note',
    kicker: 'Tasting',
    title: 'Reading a tasting note.',
    excerpt:
      'Muscatel, honeyed, chestnut — what those words actually refer to, and what to ignore.',
    readMinutes: 5,
    date: '2026-04-11',
    author: { name: 'Priya S.', role: 'Blender' },
    pullquote:
      'A tasting note is not a fact. It is a hand signal across a room. If you see it, wave back.',
    body: [
      {
        type: 'p',
        text: 'Every tea you buy comes with a row of little words: muscatel, hay, wild honey, cut grass, roasted chestnut, jasmine, dried apricot. Some of these are literal. Most of them are analogies. Here is how to read them without getting annoyed.',
      },
      {
        type: 'h2',
        text: 'First: what they are not.',
      },
      {
        type: 'p',
        text: 'They are not ingredient lists. A tea that tastes like muscatel has no grape in it. A tea that tastes like chestnut has not been near a chestnut tree. Think of them instead as coordinates in a shared space of flavours that English-speaking tasters have been using for roughly a hundred and fifty years.',
      },
      {
        type: 'list',
        items: [
          'Muscatel — the middle-note of a Muscat grape. Sweet, tart, almost alcoholic. In tea it means a particular kind of Darjeeling-esque brightness from first-flush leaf oxidized just the right amount.',
          'Honeyed — not actually honey, but a round, low-toned sweetness that sits at the back of the tongue rather than the front. Not sugar-sweet.',
          'Grassy — the smell of a freshly mown lawn in the first five minutes. Can be good, if it is light grass, or bad, if it is hay that has been left out in the rain.',
          'Malty — the round bready sweetness of toasted grain and Milo. Almost always a second-flush or later black tea.',
        ],
      },
      {
        type: 'pullquote',
        text: 'Ignore tasting notes that list more than five things. If everything is there, nothing is.',
      },
      {
        type: 'h2',
        text: 'Second: how to actually use them.',
      },
      {
        type: 'p',
        text: 'Use them to notice things, not to predict things. A note says chestnut — brew the tea, sip, and ask yourself: is there a nuttiness here? A warm roasted quality? You may not taste chestnut exactly. You will taste something that shares a family resemblance with chestnut, and that is what the writer was trying to name. Once you have found the thing, you will start tasting it in other teas too. That is the point.',
      },
      {
        type: 'h2',
        text: 'Third: what to ignore.',
      },
      {
        type: 'p',
        text: 'Any tasting note with more than five adjectives. Any note that uses the words "complex" or "balanced" without telling you in what direction. Any note that describes a tea in terms of another tea brand. Terms used only once. "Elegant." "Subtle." Those are placeholders. The good notes use nouns — peach skin, fresh hay, cut lemon — not adjectives.',
      },
    ],
    nextArticleSlug: null,
    relatedProductSlug: 'ilam-gold',
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
