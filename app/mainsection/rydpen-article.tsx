/**
 * Rydpen Sponsored Article Card — homepage card matching FeaturedPostCard style.
 * Links to /sponsored/rydpen for the full article.
 * Auto-expires after June 15, 2026 (server-side).
 */

import Image from 'next/image';
import Link from 'next/link';

const EXPIRY = new Date('2026-06-15T00:00:00+03:00');

export default function RydpenArticle() {
  if (new Date() > EXPIRY) return null;

  return (
    <section className="dark:bg-black text-black dark:text-white w-full max-w-full border-b border-black dark:border-white overflow-hidden">
      <div className="flex flex-col md:flex-row md:min-h-[700px] w-full">

        {/* Content Section — Left on desktop, Top on mobile */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-16 lg:p-24 order-1 md:border-r border-black dark:border-white">

          {/* Label */}
          <div className="mb-6 md:mb-8 text-center md:text-left">
            <span className="font-newyorker text-red-600 tracking-widest text-[10px] sm:text-xs uppercase break-words">
              Sponsored · EdTech &amp; Infrastructure
            </span>
          </div>

          <div className="space-y-6 flex flex-col h-full">
            <div className="text-center md:text-left">
              <Link href="/sponsored/rydpen" className="block group">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-acaslon leading-[1.1] group-hover:text-red-700 transition-colors">
                  The Algorithm That Could <em className="italic">Fix</em> Africa{"'"}s Education Crisis — Starting in Kenya
                </h1>
              </Link>
            </div>

            <div className="pt-2 flex items-center gap-1.5 justify-center md:justify-start text-center md:text-left flex-wrap">
              <span className="font-acaslon italic text-sm md:text-base text-gray-700 dark:text-gray-300 lowercase">by</span>
              <span className="font-futura font-bold text-xs md:text-sm tracking-[0.1em] text-red-600 uppercase">
                Kiawa Vurner
              </span>
              <span className="font-acaslon italic text-sm md:text-base text-gray-700 dark:text-gray-300 mx-1">•</span>
              <span className="font-acaslon italic text-sm md:text-base text-gray-700 dark:text-gray-300">
                May 2026
              </span>
              <span className="font-acaslon italic text-sm md:text-base text-gray-700 dark:text-gray-300 mx-1">•</span>
              <span className="font-acaslon italic text-sm md:text-base text-gray-500 dark:text-gray-400">
                12 min read
              </span>
            </div>

            <div className="mt-6 md:mt-12 text-lg md:text-xl font-acaslon text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-4 text-left">
              <p>
                A new AI platform called Rydpen wants to do for grading what Stripe did for payments:
                make the impossible infrastructure invisible, and hand the power back to the people who
                need it most. Published in partnership with <strong>Rydpen</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Image Section — Right on desktop, Bottom on mobile */}
        <div className="relative w-full md:w-1/2 flex flex-col order-2 md:p-12 border-t md:border-t-0 border-black dark:border-white">
          <Link href="/sponsored/rydpen" className="block relative w-full h-[400px] md:h-auto md:flex-1">
            <Image
              src="/solomonw.png"
              alt="Image of :Rydpen app founder Solomon Wambua"
              fill
              className="object-cover"
              priority
            />
          </Link>
          <div className="p-4 md:p-0 md:pt-4 text-sm font-acaslon italic text-gray-600 dark:text-gray-400 text-center md:text-left">
            Image of :Rydpen app founder Solomon Wambua
          </div>
        </div>

      </div>
    </section>
  );
}
