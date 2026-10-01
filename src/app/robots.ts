import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/checkout/', '/order/'],
    },
    sitemap: 'https://chaiandco.example/sitemap.xml',
    host: 'https://chaiandco.example',
  };
}
