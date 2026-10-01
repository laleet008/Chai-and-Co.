import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';
import { LenisProvider } from '@/lib/useLenis';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { Grain } from '@/components/layout/Grain';
import { MobileMenuShell } from '@/components/layout/MobileMenuShell';
import ClientOnly from '@/components/layout/ClientOnly';
import { AppProviders } from '@/components/layout/AppProviders';

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  axes: ['opsz', 'SOFT', 'WONK'],
  display: 'swap'
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap'
});

export const metadata: Metadata = {
  metadataBase: new URL('https://chaiandco.example'),
  title: {
    default: 'Chai & Co. — Grown in the clouds.',
    template: '%s · Chai & Co.'
  },
  description:
    'Single-estate loose-leaf tea from the hills of Ilam, eastern Nepal. Small-batch, hand-plucked, sold in matte metal tins.',
  applicationName: 'Chai & Co.',
  keywords: [
    'tea',
    'Nepal',
    'Ilam',
    'first flush',
    'loose leaf',
    'single estate',
    'premium tea'
  ],
  authors: [{ name: 'Chai & Co.' }],
  creator: 'Chai & Co.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://chaiandco.example',
    siteName: 'Chai & Co.',
    title: 'Chai & Co. — Grown in the clouds.',
    description:
      'Single-estate loose-leaf tea from the hills of Ilam, eastern Nepal.'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chai & Co. — Grown in the clouds.',
    description:
      'Single-estate loose-leaf tea from the hills of Ilam, eastern Nepal.',
    creator: '@chaiandco'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
};

export const viewport: Viewport = {
  themeColor: '#F4F0E8',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Chai & Co.',
    slogan: 'Grown in the clouds.',
    foundingDate: '1971',
    url: 'https://chaiandco.example',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kathmandu',
      addressCountry: 'NP'
    }
  };

  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="font-sans bg-paper text-ink min-h-screen">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LenisProvider>
          <AppProviders>
            <ClientOnly>
              <Nav />
              <MobileMenuShell />
            </ClientOnly>
            <main id="main-content">{children}</main>
            <Footer />
            <Grain />
          </AppProviders>
        </LenisProvider>
      </body>
    </html>
  );
}
