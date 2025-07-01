import FeaturedPostCard from '@/app/books-culture/sections/book-review-card';
import { getPostsByCategorySlug } from "@/lib/wordpress";

export default async function BookReview() {
  // Fetch the latest post instead of a specific post by ID
  const posts = await getPostsByCategorySlug("books");
  const latestPost = posts[0]; // Get the first post, which is the latest one
  
  return (
    <>
      {/* Featured Post Card */}
      <div className="mb-8 py-4 border-t">
      <h2 className="text-3xl md:text-4xl font-extrabold font-acaslon italic text-center mb-2 mt-0 flex items-center justify-center gap-0.5">
        <span>Book</span>
        {/* Bookmark SVG icon */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="text-red-600"
        >
          <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
        </svg>
        <span>marked</span>
      </h2>
      <div className="text-center text-leading light font-newyorker mb-2">in my mind's library.</div>
        {latestPost && <FeaturedPostCard post={latestPost} />} {/* Display the latest post if available */}
      </div>
    </>
  );
}