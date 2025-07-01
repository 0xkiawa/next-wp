"use client ";
import Image from 'next/image';
import { getPostsByCategorySlug } from "@/lib/wordpress";

export default async function BookLayout() {
  // Fetch the latest book post from WordPress
  const books = await getPostsByCategorySlug("books");
  const currentBook = books[0]; // Get the first post, which is the latest one
  
  // Extract book data from the WordPress post
  const bookData = {
    title: currentBook?.title?.rendered || "No book found",
    author: currentBook?.acf?.author || "Unknown author", // Assuming you have an ACF field for author
    excerpt: currentBook?.excerpt?.rendered || "No excerpt available",
    coverImage: currentBook?.featured_media ? 
      (await getFeaturedMediaById(currentBook.featured_media))?.source_url : 
      "/CHEF.jpg" // Fallback image
  };

  return (
    <div className="font-serif max-w-5xl mx-auto">
      {/* Header with magazine-style title */}
      <div className="border-b-2 border-black mb-6">
        <h1 className="text-4xl font-acaslon italic tracking-widest font-bold text-center my-8">The Reader </h1>
      </div>

      {/* Book display grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {/* Left column - Book cover */}
        <div className="relative">
          <div className="sticky top-6">
            <Image 
              src={bookData.coverImage} 
              alt={bookData.title}
              width={500}
              height={750}
              className="w-full object-cover shadow-lg"
              priority
            />
            <div className="mt-4 text-sm text-red-600 font-acaslon italic">
              Currently Reading
            </div>
          </div>
        </div>

        {/* Middle column - Book info */}
        <div className="space-y-6">
          <h2 className="text-4xl font-stilson tracking-40 font-bold leading-tight" 
              dangerouslySetInnerHTML={{ __html: bookData.title }}></h2>
          <p className="text-xl italic">by {bookData.author}</p>
          
          <div className="w-16 h-1 bg-black my-6"></div>
          
          <div className="space-y-">
            <p className="text-sm uppercase tracking-wider font-semibold">FROM THE PAGES</p>
            <div className="flex flex-wrap items-end">
              <p className="text-lg leading-relaxed font-glacial first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2 inline"
                 dangerouslySetInnerHTML={{ __html: bookData.excerpt }}></p>
              <a
                href={`/posts/${currentBook?.slug}`}
                className="ml-2 bg-black text-white px-3 py-1 text-sm uppercase tracking-wider hover:bg-gray-800 inline-block"
              >
                Full Review
              </a>
            </div>
          </div>
        </div>

        {/* Right column - Editor's note */}
        <div className="lg:pt-6">
          <div className="bg-gray-50 p-6 mb-6">
            <h3 className="text-xl font-bold mb-4 border-b border-gray-300 pb-2">Editor's Note</h3>
            <p className="text-base mb-6">
              A captivating read that transports you into its world from the very first page. 
              The author's prose flows with elegance, creating vivid imagery that lingers long after you've closed the book.
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer with magazine-style signature */}
      <div className="border-t-2 border-black pt-6 pb-12 text-center">
        <p className="text-sm uppercase tracking-wider">
          {new Date().toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
        </p>
      </div>
    </div>
  );
}

// Import the function to get featured media
import { getFeaturedMediaById } from "@/lib/wordpress";