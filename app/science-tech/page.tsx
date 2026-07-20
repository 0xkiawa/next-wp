// app/science-tech/page.tsx

import Books from '@/app/science-tech/sections/bookcolumn';
import { Section, Container } from '@/components/craft';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Science & Tech | KiawaNotes',
  description:
    'Science, technology, and innovation through the lens of KiawaNotes. Kiawa Vurner explores how ideas shape the world \u2014 from biology to AI to the future of knowledge.',
  alternates: {
    canonical: 'https://kiawanotes.com/science-tech',
  },
  openGraph: {
    title: 'Science & Tech | KiawaNotes',
    description:
      'Science, technology, and innovation explored by Kiawa Vurner on KiawaNotes.',
    url: 'https://kiawanotes.com/science-tech',
    siteName: 'KiawaNotes',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Science & Tech | KiawaNotes',
    description:
      'Science, technology, and innovation explored by Kiawa Vurner on KiawaNotes.',
    creator: '@kiawavurner',
  },
};

export default function BooksAndCulturePage() {
  return (
    <Section>
      <Container>
        <Books />
      </Container>
    </Section>
  );
}
