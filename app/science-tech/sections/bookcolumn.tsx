import { Section, Container } from "@/components/craft";
import { getPostsByCategorySlug } from "@/lib/wordpress";
import PostCard from "@/components/posts/post-card-mobile";

export default async function Page() {
  // Fetch posts and slice to get only the latest 4
  const posts = await getPostsByCategorySlug("personal");
  const latestPosts = posts.slice(0, 4);

  return (
    <div>
      <Container>
        <h2 className="text-3xl text-left font-extrabold font-newyorker tracking-40">Science and Tech</h2>
        {/* Container for title and grid with max-width */}
        <div className="max-w-6xl mx-auto border-t">
          {/* Page Title - Positioned to the left */}
          <h2 className="mt-4 text-4xl text-left font-extrabold font-newyorker tracking-40 mb-4">
          </h2>

          {/* Grid Layout - Adjusted for 4 posts */}
          <div className="grid lg:grid-cols-4 gap-2 z-0 font-glacial ">
            {latestPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}