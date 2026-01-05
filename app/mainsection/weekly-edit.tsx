'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const NewsletterGrid = () => {
  return (
    <section className="bg-[#fcfbf9] dark:bg-black text-black dark:text-white px-4 py-16">
      <div className="max-w-screen-xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center mb-16">
          <span className="font-newyorker text-red-600 tracking-widest text-xs uppercase mb-3">
            Newsletter
          </span>
          <h1 className="text-5xl md:text-7xl font-futura font-bold tracking-tight text-center">
            The Weekly Edit
          </h1>
          <div className="w-24 h-1 bg-black dark:bg-white mt-6 mb-2"></div>
          <div className="w-24 h-px bg-black dark:bg-white"></div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column */}
          <div className="md:col-span-3 space-y-8 border-t border-black dark:border-white pt-4 md:border-t-0 md:pt-0">
            <ArticleCard
              number={1}
              title="Books We Can&apos;t Stop Reading"
              description="A deep dive into the literary world that keeps us inspired this month."
              href="/books-culture#books-column"
            />
            <div className="w-full h-px bg-gray-200 dark:bg-gray-800 my-6"></div>
            <ArticleCard
              number={2}
              title="5 Authors on the Future"
              description="Voices that are reshaping cultural discourse across generations."
            />
          </div>

          {/* Center Feature - Wider */}
          <div className="md:col-span-6 border-x border-transparent md:border-gray-200 md:dark:border-gray-800 md:px-8">
            <article className="flex flex-col h-full">
              <div className="relative w-full aspect-[4/3] mb-6 overflow-hidden">
                <Image
                  src="/CHEF.jpg"
                  alt="Feature Image"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="flex flex-col items-center text-center mt-auto">
                <span className="font-newyorker text-red-600 text-xl font-bold mb-2">3</span>
                <h2 className="text-3xl md:text-4xl font-stilson font-bold leading-tight mb-4 hover:text-red-700 transition-colors cursor-pointer">
                  Inside the Creative Lives of Modern Thinkers
                </h2>
                <p className="text-lg md:text-xl font-acaslon text-gray-700 dark:text-gray-300 leading-relaxed">
                  From fashion to philosophy, explore the worlds of brilliant minds shaping the now.
                </p>
              </div>
            </article>
          </div>

          {/* Right Column */}
          <div className="md:col-span-3 space-y-8 border-t border-black dark:border-white pt-4 md:border-t-0 md:pt-0">
            <ArticleCard
              number={4}
              title="What KiawaNotes Got Right"
              description="A reflection on KiawaNotes&apos;s bold covers and brave journalism."
            />
            <div className="w-full h-px bg-gray-200 dark:bg-gray-800 my-6"></div>
            <ArticleCard
              number={5}
              title="The KiawaNotes Visionaries"
              description="Meet the stylists, editors, and artists leading next season&apos;s revolution."
            />
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-20 text-center">
          <div className="inline-block border-y border-black dark:border-white py-1">
            <div className="border-y border-black dark:border-white py-1">
              <button className="px-10 py-3 bg-transparent text-black dark:text-white font-newyorker text-sm tracking-widest uppercase hover:text-red-600 transition-colors">
                Subscribe to KiawaNotes
              </button>
            </div>
          </div>
        </div>
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
  <article className="flex flex-col">
    <span className="font-newyorker text-red-600 text-lg font-bold mb-1">{number}</span>
    <h2 className="text-xl md:text-2xl font-stilson font-bold leading-tight mb-2">
      {href ? (
        <Link href={href} className="hover:text-red-700 transition-colors hover:underline decoration-1 underline-offset-4">
          {title}
        </Link>
      ) : (
        <span className="cursor-pointer hover:text-red-700 transition-colors">{title}</span>
      )}
    </h2>
    <p className="text-gray-600 dark:text-gray-400 font-acaslon text-lg leading-relaxed">
      {description}
    </p>
  </article>
);

export default NewsletterGrid;