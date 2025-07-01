import { Section, Container } from "@/components/craft";
import { getPostsByCategorySlug } from "@/lib/wordpress";
import PostCard from "@/components/posts/post-mobile-card";

export default async function Page() {
  // Fetch posts from both books and personal categories
  const booksPromise = getPostsByCategorySlug("books");
  const personalPromise = getPostsByCategorySlug("personal");
  
  // Wait for both promises to resolve
  const [booksPosts, personalPosts] = await Promise.all([booksPromise, personalPromise]);
  
  // Get up to 2 books posts
  const booksToShow = booksPosts.slice(0, 2);
  
  // Get up to 2 personal posts
  const personalToShow = personalPosts.slice(0, 2);
  
  // Combine posts for display, ensuring we have at most 4 total
  const combinedPosts = [...booksToShow, ...personalToShow].slice(0, 4);

  return (
    <div>
      
        {/* Page Title */}
        <h2 className="mt-4 text-2xl text-center border-t font-extrabold font-futura tracking-40 pt-8 mb-1">
          Culture Essays 
        </h2>

        {/* Grid Layout - Adjusted for combined posts */}
        <div className="grid lg:grid-cols-4 gap-2 z-0 font-glacial max-w-6xl mx-auto">
          {combinedPosts.map((post, index) => (
            <PostCard 
              key={post.id} 
              post={post}
              isLast={index === combinedPosts.length - 1}
              // Optional: You could add a category indicator here if needed
              // categoryType={booksPosts.some(bp => bp.id === post.id) ? 'book' : 'personal'}
            />
          ))}
        </div>
    </div>
  );
}