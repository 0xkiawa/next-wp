import Image from 'next/image';
import React from 'react';

const ChefQuote = () => {
  return (
    <section className="my-12 px-4 flex flex-col md:flex-row items-center gap-8 max-w-4xl mx-auto">
      {/* Chef image with shadow visible in both light and dark mode */}
      <div className="w-full md:w-1/2">
        <Image
          src="/wine.png"
          alt="Chef cooking illustration"
          className="rounded-xl shadow-lg dark:shadow-gray-700/50 w-full"
          width={500}
          height={500}
        />
      </div>

      {/* Editorial quote */}
      <div className="w-full md:w-1/2 text-center md:text-left">
        <blockquote className="text-xl text-gray-800 font-newyorker dark:text-gray-200 leading-relaxed">
          &quot;Technically insolvent. Aesthetically impeccable.&quot;
        </blockquote>
        <cite className="block mt-4 text-sm text-gray-500 dark:text-gray-400">
          — From the desk of a Filthy Rich
        </cite>
      </div>
    </section>
  );
};

export default ChefQuote;