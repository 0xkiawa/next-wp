// app/books-culture/page.tsx

import Books from '@/app/books-culture/sections/bookscolumn';
import Arts from '@/app/books-culture/sections/artscolumn';
import BookReview from '@/app/books-culture/sections/bookreview';
import KiawaNotesLibrary from '@/app/books-culture/sections/book-hero';
import CurrentlyReading from '@/app/books-culture/sections/currentbook-reading';
import { Section, Container } from '@/components/craft';

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
