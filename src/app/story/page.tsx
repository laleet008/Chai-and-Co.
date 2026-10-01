import type { Metadata } from 'next';
import StoryClient from '@/components/story/StoryClient';

export const metadata: Metadata = {
  title: 'Story',
  description:
    'The estate, the process, the people. A single hillside in Ilam, tended since 1971. Fifty-four years of Bedan Karki family tea.',
  openGraph: {
    title: 'Our Story · Chai & Co.',
    description:
      '12 hectares, 38 pluckers, 4 teas. A single ridge above the mist in eastern Nepal — the full story behind Chai & Co.',
  },
};

export default function Page() {
  return <StoryClient />;
}
