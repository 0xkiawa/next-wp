'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const NewsletterGrid = () => {
  return (
    <section className="bg-white dark:bg-black text-black dark:text-white px-4 py-12 max-w-screen-xl mx-auto font-sans">
      {/* Header */}
      <div className="text-center mb-10 border-t border-gray-300 dark:border-gray-700 mt-8 pt-8">
        <h1 className="text-4xl md:text-6xl font-acaslon italic font-bold tracking-tight text-red-600">The Weekly Edit</h1>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-8 text-xl font-glacial">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-6">
          <ArticleCard
            number={1}
            title="Books We Can't Stop Reading"
            description="A deep dive into the literary world that keeps us inspired this month."
            href="/books-culture#books-column"
          />
          <ArticleCard
            number={2}
            title="5 Authors on the Future"
            description="Voices that are reshaping cultural discourse across generations."
          />
        </div>

        {/* Center Feature */}
        <div className="md:col-span-2">
          <article>
            <Image
              src="/CHEF.jpg"
              alt="Feature Image"
              width={600}
              height={400}
              className="w-full object-cover rounded-lg shadow-md"
            />
            <h2 className="mt-4 text-2xl md:text-3xl font-futura font-extrabold leading-40">
              <span className="text-red-600 font-bold mr-2">3.</span>
              Inside the Creative Lives of Modern Thinkers
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400 text-xl font-glacial md:text-xl">
              From fashion to philosophy, explore the worlds of brilliant minds shaping the now.
            </p>
          </article>
        </div>

        {/* Right Column */}
        <div className="md:col-span-2 space-y-6">
          <ArticleCard
            number={4}
            title="What KiawaNotes Got Right"
            description="A reflection on KiawaNotes's bold covers and brave journalism."
          />
          <ArticleCard
            number={5}
            title="The KiawaNotes Visionaries"
            description="Meet the stylists, editors, and artists leading next season's revolution."
          />
        </div>
      </div>

      {/* Footer CTA */}
      <div className="mt-12 text-center">
        <button className="px-6 py-3 border border-black dark:border-white text-black dark:text-white font-medium tracking-wide hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all font-glacial">
          Subscribe to KiawaNotes
        </button>
      </div>
    </section>
  );
};

// ArticleCard Component
type ArticleCardProps = {
  number: number;
  title: string;
  description: string;
  href?: string;
};

const ArticleCard: React.FC<ArticleCardProps> = ({ number, title, description, href }) => (
  <article className="border-t pt-4">
    <h2 className="text-xl md:text-3xl font-futura font-extrabold leading-40">
      <span className="text-red-600 font-futura font-extrabold leading-40 mr-2">{number}.</span>
      {href ? (
        <Link href={href} className="hover:underline transition">
          {title}
        </Link>
      ) : (
        title
      )}
    </h2>
    <p className="text-gray-600 dark:text-gray-400 mt-2 text-xl font-glacial md:text-xl">{description}</p>
  </article>
);

export default NewsletterGrid;