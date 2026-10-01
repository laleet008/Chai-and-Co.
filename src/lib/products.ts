export type TeaType = 'black' | 'green' | 'white' | 'oolong';

export type ProductSize = {
  grams: number;
  multiplier: number;
  label: string;
};

export type ProductReview = {
  id: string;
  name: string;
  location: string;
  stars: 1 | 2 | 3 | 4 | 5;
  date: string;
  title: string;
  body: string;
};

export type Brewing = {
  waterTempC: number;
  leafPerCupG: number;
  steepSeconds: number;
  steepSecondsRange?: [number, number];
  infusions: number;
  water: 'soft' | 'filtered' | 'spring';
  notes: string[];
};

export type ProductStats = {
  caffeine: 1 | 2 | 3 | 4 | 5;
  body: 1 | 2 | 3 | 4 | 5;
  sweetness: 1 | 2 | 3 | 4 | 5;
  astringency: 1 | 2 | 3 | 4 | 5;
};

export type FlipCard = {
  name: string;
  origin: string;
  altitude: string;
  compounds: string[];
  brewingNote: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  type: TeaType;
  flush: string;
  tagline: string;
  oneLiner: string;
  longDescription: string;
  priceBase: number;
  baseGrams: number;
  accent: string;
  tastingNotes: string[];
  sizes: ProductSize[];
  reviews: ProductReview[];
  brewing: Brewing;
  stats: ProductStats;
  harvestMonth: string;
  harvestWindow: string;
  elevationMeters: number;
  elevationLabel: string;
  pluckingStandard: string;
  witherHours: number;
  originCard: FlipCard;
  flavourCard: FlipCard;
};

export const PRODUCT_SIZES_STANDARD: ProductSize[] = [
  { grams: 50, multiplier: 0.55, label: '50 g · sample' },
  { grams: 100, multiplier: 1, label: '100 g · tin' },
  { grams: 250, multiplier: 2.3, label: '250 g · refill' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'mist-first-flush',
    slug: 'mist-first-flush',
    name: 'Mist First Flush',
    type: 'black',
    flush: 'First flush · April',
    tagline: 'Bright, muscatel, light body.',
    oneLiner:
      'The first pluck of the year, before the sun has really woken the hill up.',
    longDescription:
      'Mist First Flush is the narrowest, most particular tea we make. Plucked in the first ten days of April, from only the southern face of the estate — the side that the mist lifts from last. The leaves are small, tender, still carrying a trace of the dew they were picked through. In the cup this tea is bright, almost alive: a muscatel note that sits somewhere between grape and elderflower, a light amber liquor, a clean finish that lingers without weight. This is the tea that the pluckers take home for their own families at the end of the harvest week. Drink it within nine months of packing. Do not add milk.',
    priceBase: 1850,
    baseGrams: 100,
    accent: '#C9A227',
    tastingNotes: ['Muscatel', 'Green grape', 'Elderflower', 'Almond skin', 'Honeyed finish'],
    sizes: PRODUCT_SIZES_STANDARD,
    reviews: [
      {
        id: 'm1',
        name: 'Anita R.',
        location: 'Boudha, Kathmandu',
        stars: 5,
        date: '2026-05-14',
        title: 'The first flush I wait for all year.',
        body:
          'Light, floral, nothing like the heavy second-flush blacks I used to drink. Three minutes at 90 degrees, no sugar, no milk — and the whole apartment smells like a hillside after rain.',
      },
      {
        id: 'm2',
        name: 'Oliver D.',
        location: 'Hackney, London',
        stars: 4,
        date: '2026-04-29',
        title: 'Delicate — brew with attention.',
        body:
          'I over-steeped my first cup and learned my lesson. The second was perfect: a bright, structured tea that I can only describe as tasting like high altitude. Worth the price for a weekend ritual.',
      },
      {
        id: 'm3',
        name: 'Priya S.',
        location: 'Baneshwor, Kathmandu',
        stars: 5,
        date: '2026-06-02',
        title: 'Quieter than Darjeeling first flush, nicer.',
        body:
          'Less astringent, more rounded. The muscatel note is there but it is not showy. I prefer this. The tin is heavy, beautifully made — I have kept the first one I bought, two years ago, for pencils.',
      },
    ],
    brewing: {
      waterTempC: 90,
      leafPerCupG: 2.5,
      steepSeconds: 180,
      steepSecondsRange: [150, 210],
      infusions: 2,
      water: 'filtered',
      notes: [
        'Do not use boiling water — it will dull the muscatel note.',
        'Weigh your leaf, do not guess by eye.',
        'The second infusion is shorter and rounder, 210 seconds.',
      ],
    },
    stats: { caffeine: 3, body: 2, sweetness: 3, astringency: 3 },
    harvestMonth: 'April',
    harvestWindow: 'First 10 days of April',
    elevationMeters: 1900,
    elevationLabel: '1,900 m · south-facing ridge',
    pluckingStandard: 'Two leaves and a bud',
    witherHours: 14,
    originCard: {
      name: 'Ilam South Ridge',
      origin: 'Ilam District, Province No. 1, Nepal',
      altitude: '1,880 – 1,920 m',
      compounds: ['Frost nights', 'Open-air wither', 'Hand-rolled'],
      brewingNote: 'Lower temperature for the first flush, always.',
    },
    flavourCard: {
      name: 'Mist & Muscatel',
      origin: 'Small leaf, low tannin',
      altitude: 'Cooled overnight, slow dry',
      compounds: ['Grape', 'Elderflower', 'Cut hay'],
      brewingNote: 'Brightens when cooled to 70°C in the cup.',
    },
  },
  {
    id: 'ilam-gold',
    slug: 'ilam-gold',
    name: 'Ilam Gold',
    type: 'black',
    flush: 'Second flush · June',
    tagline: 'Malty, honeyed, full body.',
    oneLiner: 'The workhorse. Rich, honest, the tea for a slow morning.',
    longDescription:
      'Ilam Gold is what most of our hillside goes into each year. Plucked through late May and June, after the first monsoon rains have swollen the bushes. Larger, darker leaves, a longer wither, a heavier roll — the result is a rounded, malted black tea with a mouth-coating honey sweetness and a liquor the colour of polished amber. This is our forgiving tea. You can boil the water, you can steep it too long, you can add a splash of milk, and it will still be good. Not fussy. Always ready. The estate workers drink it all day. That is the best review we know.',
    priceBase: 1650,
    baseGrams: 100,
    accent: '#B3541E',
    tastingNotes: ['Toasted malt', 'Wild honey', 'Biscuit', 'Caramel', 'Soft spice'],
    sizes: PRODUCT_SIZES_STANDARD,
    reviews: [
      {
        id: 'i1',
        name: 'Suraj K.',
        location: 'Patan, Lalitpur',
        stars: 5,
        date: '2026-07-12',
        title: 'My everyday for the last three years.',
        body:
          'Morning, afternoon, sometimes late at night if it has been a long one. This tea never lets me down. I like a splash of hot milk with it, nothing fancy.',
      },
      {
        id: 'i2',
        name: 'Clara M.',
        location: 'Vienna, Austria',
        stars: 5,
        date: '2026-06-20',
        title: 'Better than any Assam I have tried at this price.',
        body:
          'Full-bodied but not harsh. The biscuit note is real. I do a four-minute steep with just boiled water and a teaspoon of honey for my mother when she visits. She approves.',
      },
      {
        id: 'i3',
        name: 'Roshni T.',
        location: 'Dhulikhel, Kavre',
        stars: 4,
        date: '2026-08-03',
        title: 'Strong without being bitter.',
        body:
          'I used to drink imported English breakfast tea. This tastes cleaner, and the tin fits perfectly on my small kitchen shelf. The 250 g refill is good value.',
      },
    ],
    brewing: {
      waterTempC: 98,
      leafPerCupG: 3,
      steepSeconds: 240,
      steepSecondsRange: [180, 300],
      infusions: 1,
      water: 'spring',
      notes: [
        'Water at a full boil will not hurt this tea.',
        'Stands up well to a spoon of honey or a splash of milk.',
        'Do not bother with a second infusion — it will not have enough left.',
      ],
    },
    stats: { caffeine: 4, body: 5, sweetness: 4, astringency: 2 },
    harvestMonth: 'June',
    harvestWindow: 'Late May through end of June',
    elevationMeters: 1820,
    elevationLabel: '1,820 m · full estate',
    pluckingStandard: 'Two leaves and a bud, occasional three',
    witherHours: 18,
    originCard: {
      name: 'Full Estate Pluck',
      origin: 'All 12 hectares, Ilam',
      altitude: '1,780 – 1,900 m',
      compounds: ['Longer wither', 'Charcoal drying', 'Heavy roll'],
      brewingNote: 'Milk, honey, lemon — all welcome here.',
    },
    flavourCard: {
      name: 'Honey Malt',
      origin: 'Larger leaf, higher tannin',
      altitude: 'Matured in tin for 4 weeks',
      compounds: ['Toasted grain', 'Golden syrup', 'Nutmeg'],
      brewingNote: 'Improves with two minutes past the recommended steep.',
    },
  },
  {
    id: 'silver-tips',
    slug: 'silver-tips',
    name: 'Silver Tips',
    type: 'white',
    flush: 'Pre-harvest · late March',
    tagline: 'Delicate, floral, peach.',
    oneLiner: 'Just the buds, hand-plucked before the first flush proper begins.',
    longDescription:
      'Silver Tips is the smallest tea we make — less than forty kilos a year, if the season is kind. It is not leaves at all: only the tight, silvery buds, picked in a narrow window of five or six days at the very end of March, before the first real leaves unfurl. Almost no processing: a gentle spread, a low two-day dry, a careful sort by hand. In the cup it is the colour of pale straw and tastes like white peach skin, jasmine at the edge of the nose, a quiet creaminess that only shows up after three or four sips. This is a tea for a quiet afternoon alone. For noticing things. Brew it long, cool, and drink it slowly.',
    priceBase: 2950,
    baseGrams: 50,
    accent: '#D8D4C8',
    tastingNotes: ['White peach', 'Jasmine', 'Orchard blossom', 'Creamy rice', 'Dried apricot'],
    sizes: [
      { grams: 25, multiplier: 0.55, label: '25 g · sample' },
      { grams: 50, multiplier: 1, label: '50 g · tin' },
      { grams: 100, multiplier: 1.9, label: '100 g · small bulk' },
    ],
    reviews: [
      {
        id: 's1',
        name: 'Manisha P.',
        location: 'Jawalakhel, Lalitpur',
        stars: 5,
        date: '2026-04-05',
        title: 'A gift for my mother, who is hard to impress.',
        body:
          'She has been drinking white tea since I was a child and she loved this. Said it tasted like the garden of her childhood home in Terhathum. Highest praise available.',
      },
      {
        id: 's2',
        name: 'Hugo B.',
        location: 'Lyon, France',
        stars: 4,
        date: '2026-05-18',
        title: 'Expensive, and worth it on the right afternoon.',
        body:
          'Delicate is not a strong enough word. There is almost no colour to the liquor, and yet the flavour is layered. Drink this without sugar, without milk, in a small cup, seated somewhere you can see the sky.',
      },
      {
        id: 's3',
        name: 'Aarati G.',
        location: 'Butwal, Rupandehi',
        stars: 5,
        date: '2026-07-22',
        title: 'Four infusions, every one of them different.',
        body:
          'Second is my favourite. The first is jasmine and peach, the second is more apricot, the third is softer — the fourth is a whisper of rice milk. Buy twice what you think you need.',
      },
    ],
    brewing: {
      waterTempC: 80,
      leafPerCupG: 3,
      steepSeconds: 300,
      steepSecondsRange: [240, 600],
      infusions: 4,
      water: 'soft',
      notes: [
        'Cool water. Really. Boiling water will scorch the buds and taste like hay.',
        'You can safely go to a seven-minute first steep — it will not bitter.',
        'Re-infuse, and re-infuse again. The best cup is usually the second or the third.',
      ],
    },
    stats: { caffeine: 1, body: 1, sweetness: 5, astringency: 1 },
    harvestMonth: 'March',
    harvestWindow: 'Last 6 days of March, weather permitting',
    elevationMeters: 1920,
    elevationLabel: '1,920 m · sheltered north terrace',
    pluckingStandard: 'Bud only',
    witherHours: 6,
    originCard: {
      name: 'North Terrace Buds',
      origin: 'Sheltered terrace, northern Ilam',
      altitude: '1,920 m · cold nights',
      compounds: ['Bud-only pluck', 'Shade-dried 48 h', 'Hand sorted'],
      brewingNote: '80°C maximum. Weigh every leaf.',
    },
    flavourCard: {
      name: 'Peach & Quiet',
      origin: 'Minimal processing',
      altitude: 'Dried slowly in the dark',
      compounds: ['White peach', 'Jasmine absolute', 'Short-grain rice'],
      brewingNote: 'Longer than you think, cooler than you think.',
    },
  },
  {
    id: 'himalayan-green',
    slug: 'himalayan-green',
    name: 'Himalayan Green',
    type: 'green',
    flush: 'Spring / summer',
    tagline: 'Grassy, chestnut, sweet finish.',
    oneLiner:
      'A green tea with the backbone of a high-altitude hill. Not vegetal, not thin.',
    longDescription:
      'Most Nepali greens are too bright. Too grassy. Astringent in a way that makes the edges of your tongue feel dry. Ours is steamed for a very short twenty seconds — just long enough to stop the oxidation, not long enough to strip the character out of the leaf. Then it is pan-dried over a low charcoal fire, turned by hand every few minutes, which gives it that roasted-chestnut edge that keeps bringing you back. The liquor is pale green-gold, the smell is cut grass and fresh nuts, the finish is quiet and sweet. We make it from bushes that would otherwise go into the second flush black, from the parts of the estate that are a little too shaded for a truly great black. It is our underrated tea. Drink it cold in summer, iced, with a slice of lime.',
    priceBase: 1450,
    baseGrams: 100,
    accent: '#6B8F5E',
    tastingNotes: ['Cut grass', 'Roasted chestnut', 'Lime pith', 'Fresh pea', 'Sweet rice'],
    sizes: PRODUCT_SIZES_STANDARD,
    reviews: [
      {
        id: 'h1',
        name: 'Devendra M.',
        location: 'Dharan, Sunsari',
        stars: 4,
        date: '2026-05-30',
        title: 'Better iced than hot, to my surprise.',
        body:
          'Tried it hot and it was fine, then tried it cold-brewed overnight in the fridge and it was wonderful. Chestnut note really comes out cold. A lime wedge finishes it.',
      },
      {
        id: 'h2',
        name: 'Emma L.',
        location: 'Brooklyn, New York',
        stars: 5,
        date: '2026-06-17',
        title: 'The first green tea I have actually liked.',
        body:
          'Every green tea I had before this tasted like lawn clippings. This does not. There is a round, nutty quality to it. I have reordered twice.',
      },
      {
        id: 'h3',
        name: 'Shanta B.',
        location: 'New Road, Kathmandu',
        stars: 5,
        date: '2026-07-09',
        title: 'Morning at my desk, every morning.',
        body:
          'Light enough that it does not kill my appetite for breakfast, enough caffeine that I do not need a second cup. The sweet finish lasts longer than I expect it to.',
      },
    ],
    brewing: {
      waterTempC: 85,
      leafPerCupG: 2,
      steepSeconds: 120,
      steepSecondsRange: [90, 180],
      infusions: 3,
      water: 'filtered',
      notes: [
        'Short first steep, or the grassy note will dominate.',
        'Iced: 6 g per litre, cold fridge water, 10 hours.',
        'The third infusion can take a full 5 minutes and will be rounder, nuttier.',
      ],
    },
    stats: { caffeine: 2, body: 3, sweetness: 4, astringency: 2 },
    harvestMonth: 'May – September',
    harvestWindow: 'Between the main black-tea flushes',
    elevationMeters: 1860,
    elevationLabel: '1,860 m · shaded east slope',
    pluckingStandard: 'One leaf and a bud',
    witherHours: 4,
    originCard: {
      name: 'East Slope Shade',
      origin: 'Shaded edge of the estate, Ilam',
      altitude: '1,840 – 1,880 m',
      compounds: ['20 s steam fix', 'Pan-charcoal dried', 'Hand-turned'],
      brewingNote: 'Hot or cold. This tea is bilingual.',
    },
    flavourCard: {
      name: 'Grass & Chestnut',
      origin: 'Short fix, long finish',
      altitude: 'Dried over sal charcoal',
      compounds: ['Sudan grass', 'Sichuan pepper leaf', 'Roasted chestnut'],
      brewingNote: 'Go 10°C warmer and 30 s shorter for espresso-style intensity.',
    },
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function priceForSize(p: Product, grams: number): number {
  const size = p.sizes.find((s) => s.grams === grams) ?? p.sizes[1];
  return Math.round(p.priceBase * size.multiplier);
}

export const TEA_TYPE_LABELS: Record<TeaType, string> = {
  black: 'Black',
  green: 'Green',
  white: 'White',
  oolong: 'Oolong',
};
