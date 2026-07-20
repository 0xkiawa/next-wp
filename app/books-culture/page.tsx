// app/books-culture/page.tsx

import Books from '@/app/books-culture/sections/bookscolumn';
import Arts from '@/app/books-culture/sections/artscolumn';
import BookReview from '@/app/books-culture/sections/bookreview';
import KiawaNotesLibrary from '@/app/books-culture/sections/book-hero';
import CurrentlyReading from '@/app/books-culture/sections/currentbook-reading';
import { Section, Container } from '@/components/craft';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Books & Culture | KiawaNotes',
  description:
    'Discover KiawaNotes\u2019 Books & Culture section \u2014 in-depth reviews, reading lists, and cultural criticism by Kiawa Vurner. Literature, arts, and ideas worth your time.',
  alternates: {
    canonical: 'https://kiawanotes.com/books-culture',
  },
  openGraph: {
    title: 'Books & Culture | KiawaNotes',
    description:
      'In-depth book reviews, reading lists, and cultural criticism by Kiawa Vurner on KiawaNotes.',
    url: 'https://kiawanotes.com/books-culture',
    siteName: 'KiawaNotes',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Books & Culture | KiawaNotes',
    description:
      'In-depth book reviews, reading lists, and cultural criticism by Kiawa Vurner on KiawaNotes.',
    creator: '@kiawavurner',
  },
};

export default function BooksAndCulturePage() {
  return (
    <div className="w-full">
      <KiawaNotesLibrary />

      {/* 📌 Give the Books section an ID so we can link to it */}
      <Books />

      <BookReview />
      <Arts />
      <div id="books-column">
        <CurrentlyReading />
      </div>
    </div>
  );
}
