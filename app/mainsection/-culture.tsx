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
      {/* Page Title - positioned outside and above the border */}
      <div className="max-w-6xl mx-auto pl-4 md:pl-0 pr-4 md:pr-0">
        <h2 className="mt-4 text-4xl text-left font-extrabold font-newyorker tracking-40 mb-4">
          Culture
        </h2>
      </div>

      {/* Grid Layout with border only on this container */}
      <div className="max-w-6xl mx-auto border-t pt-8 pl-4 md:pl-0 pr-4 md:pr-0">
        <div className="grid lg:grid-cols-4 gap-2 z-0 font-glacial">
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
    </div>
  );
}
