import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://chaiandco.example';
  const now = new Date();
  const products: MetadataRoute.Sitemap = [
    'mist-first-flush',
    'ilam-gold',
    'silver-tips',
    'himalayan-green',
  ].map((slug) => ({
    url: `${base}/product/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));
  const journals: MetadataRoute.Sitemap = [
    'how-to-brew-a-first-flush',
    'what-altitude-does',
    'reading-a-tasting-note',
  ].map((slug) => ({
    url: `${base}/journal/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/shop`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/story`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/journal`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/checkout`, lastModified: now, changeFrequency: 'never', priority: 0.3 },
    ...products,
    ...journals,
  ];
}
