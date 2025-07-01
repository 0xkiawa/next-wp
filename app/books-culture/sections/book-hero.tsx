'use client';

import React from 'react';

const KiawaNotesLibrary = () => {
  const bars = [
    { color: 'bg-emerald-800', topOffset: '-mt-8', height: 'h-40', width: 'w-2' },
    { color: 'bg-rose-900', topOffset: '-mt-6', height: 'h-36', width: 'w-3' },
    { color: 'bg-indigo-700', topOffset: '-mt-5', height: 'h-36', width: 'w-1' },
    { color: 'bg-yellow-600', topOffset: '-mt-4', height: 'h-36', width: 'w-4' },
    { color: 'bg-stone-600', topOffset: '-mt-2', height: 'h-30', width: 'w-1' },
    { color: 'bg-orange-700', topOffset: '-mt-9', height: 'h-40', width: 'w-3' },
    { color: 'bg-indigo-700', topOffset: '-mt-10', height: 'h-37', width: 'w-1' },
    { color: 'bg-rose-900', topOffset: '-mt-14', height: 'h-44', width: 'w-4' },
    { color: 'bg-yellow-600', topOffset: '-mt-14', height: 'h-40', width: 'w-0.5' },
    { color: 'bg-stone-600', topOffset: '-mt-5', height: 'h-36', width: 'w-3' },
    { color: 'bg-orange-700', topOffset: '-mt-8', height: 'h-34', width: 'w-0.5' },
    { color: 'bg-emerald-800', topOffset: '-mt-2', height: 'h-32', width: 'w-3' },
    { color: 'bg-rose-900', topOffset: '-mt-6', height: 'h-34', width: 'w-2' },
    { color: 'bg-yellow-600', topOffset: '-mt-16', height: 'h-48', width: 'w-6' },
    { color: 'bg-stone-600', topOffset: '-mt-10', height: 'h-30', width: 'w-1' },
    { color: 'bg-indigo-700', topOffset: '-mt-6', height: 'h-40', width: 'w-3' },
    { color: 'bg-emerald-800', topOffset: '-mt-10', height: 'h-40', width: 'w-2' },
    { color: 'bg-stone-600', topOffset: '-mt-6', height: 'h-39', width: 'w-1' },
    { color: 'bg-orange-700', topOffset: '-mt-5', height: 'h-37', width: 'w-5' },
    { color: 'bg-indigo-700', topOffset: '-mt-7', height: 'h-40', width: 'w-1' }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col items-center pt-8">
      {/* Title */}
      <div className="mb-16">
        <h1 className="font-acaslon italic text-center text-4xl font-light tracking-wider">
          KiawaNotes{' '}
          <span className="flex items-center justify-center font-glacial">
            <span>l</span>
            <span className="inline-block transform rotate-12 origin-bottom-left text-4xl font-futura font-bold text-orange-700">
              I
            </span>
            <span className="inline-block font-glacial ml-1">brary</span>
          </span>
        </h1>
      </div>

      <div className="h-8"></div>

      <div className="relative h-64 w-full max-w-3xl mx-auto">
        <div className="flex justify-center gap-1.5 absolute inset-x-0">
          {bars.map((bar, index) => (
            <div
              key={index}
              className={`${bar.color} ${bar.topOffset} ${bar.height} ${bar.width} transform transition-all duration-300 hover:scale-y-110`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default KiawaNotesLibrary;
