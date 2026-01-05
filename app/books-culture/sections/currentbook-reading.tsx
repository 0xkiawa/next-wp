import Image from 'next/image';
import { getPostsByCategorySlug, getFeaturedMediaById } from "@/lib/wordpress";
import Link from 'next/link';

// NOTE: We are fetching inside a client component or async server component. 
// Since this file seems to be used as a Server Component in the previous version (async function),
// we will maintain that pattern if possible. However, the previous file started with "use client" but was an async function default export, which is contradictory in some Next.js versions if not handled correctly as a Server Component.
// Given the folder structure implies it's a section, and usually sections in App Router can be Server Components if they are async.
// BUT, line 1 was "use client ". Async components are only supported in Server Components.
// If "use client" is present, it cannot be async. 
// I will convert this to a Server Component by NOT using "use client" and keeping it async.
// This is the safest way to avoid hydration mismatch with data fetching.

export default async function BookLayout() {
  // Fetch the latest book post from WordPress
  // We use a try-catch block to handle potential API failures gracefully
  let bookData = null;
  let currentBook = null;

  try {
    const books = await getPostsByCategorySlug("books");
    currentBook = books && books.length > 0 ? books[0] : null;

    if (currentBook) {
      const coverImageMedia = currentBook.featured_media ? await getFeaturedMediaById(currentBook.featured_media) : null;

      bookData = {
        title: currentBook.title.rendered,
        author: currentBook.acf?.author || "Unknown Author", // Safe access if acf is missing
        excerpt: currentBook.excerpt.rendered.replace(/(<([^>]+)>)/gi, "").substring(0, 150) + "...",
        coverImage: coverImageMedia?.source_url || "/CHEF.jpg",
        slug: currentBook.slug
      };
    }
  } catch (error) {
    console.error("Error fetching book data:", error);
  }

  // Fallback if no book found
  if (!bookData) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto py-16 px-4 md:px-8 font-jakarta">
      {/* Top Label */}
      <div className="flex items-center justify-center mb-12">
        <span className=" text-xs font-bold uppercase tracking-widest text-red-600 font-newyorker">
          Book of the Month
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-12 lg:gap-20 items-center md:items-start">
        {/* Left: Huge Book Cover */}
        <div className="w-full md:w-5/12 lg:w-4/12 flex flex-col items-center">
          <div className="relative w-[280px] md:w-full aspect-[2/3] shadow-2xl transition-transform duration-500 hover:scale-[1.02]">
            <Image
              src={bookData.coverImage}
              alt={bookData.title}
              fill
              className="object-cover rounded-sm"
              sizes="(max-width: 768px) 280px, 400px"
              priority
            />

            {/* Overlay Badge */}
            <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 bg-black text-white p-3 md:p-4 rounded-full w-20 h-20 md:w-24 md:h-24 flex items-center justify-center text-center shadow-lg border-4 border-white flex z-10">
              <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest leading-tight font-jakarta">
                Current<br />Read
              </p>
            </div>
          </div>
        </div>

        {/* Right: Info & Review */}
        <div className="w-full md:w-7/12 lg:w-8/12 pt-4 text-center md:text-left">
          <h2 className="text-3xl md:text-5xl lg:text-7xl font-jakarta font-bold leading-[0.9] text-black mb-4">
            <span dangerouslySetInnerHTML={{ __html: bookData.title }}></span>
          </h2>

          <p className="text-xl md:text-2xl font-acaslon italic text-gray-600 mb-8">
            by {bookData.author}
          </p>

          {/* Progress Bar Visual (Static for design) */}
          <div className="mb-8 max-w-sm mx-auto md:mx-0">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 font-jakarta">
              <span>Start</span>
              <span>Finish</span>
            </div>
            <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-red-600 w-[45%]"></div>
            </div>
            <p className="text-right text-[10px] text-red-600 font-bold mt-1 font-jakarta">45% COMPLETE</p>
          </div>

          <div className="prose prose-lg text-gray-500 mb-8 max-w-none font-jakarta leading-relaxed mx-auto md:mx-0">
            <p>{bookData.excerpt}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link
              href={`/posts/${bookData.slug}`}
              className="bg-black text-white px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-red-700 transition-colors font-jakarta"
            >
              Read Review
            </Link>
            <Link
              href="/books-culture"
              className="border border-black px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors font-jakarta"
            >
              Archive
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}