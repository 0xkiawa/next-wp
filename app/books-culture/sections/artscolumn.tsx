import { Section, Container } from "@/components/craft";
import { getPostsByCategorySlug } from "@/lib/wordpress";
import PostCard  from "@/components/posts/post-mobile-card";


export default async function Page() {
  // Fetch posts from the books category instead of personal
  const posts = await getPostsByCategorySlug("personal");
  const latestPosts = posts.slice(0, 4);

  return (
    <div>
      <Container>
        {/* Page Title */}
        <h2 className="text-xl text-center border-t font-bold font-newyorker pt-8 mb-1">
          Culture Essays 
        </h2>

        {/* Grid Layout - Adjusted for 4 posts */}
        <div className="grid lg:grid-cols-3 gap-2 z-0 font-glacial max-w-6xl mx-auto">
          {latestPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </Container>
    </div>
  );
}