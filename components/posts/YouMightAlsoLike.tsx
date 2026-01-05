"use client";
import React, { useEffect, useState } from 'react';
import { Post } from '@/lib/wordpress.d';
import { getTagsByPost, getPostsByTagSlug, getAllPosts } from '@/lib/wordpress';
import PostCard from '@/components/posts/post-mobile-card'; // Assuming this is the correct path for PostCard

interface YouMightAlsoLikeProps {
  currentPost: Post;
}

const YouMightAlsoLike: React.FC<YouMightAlsoLikeProps> = ({ currentPost }) => {
  const [recommendedPosts, setRecommendedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);
      try {
        let posts: Post[] = [];

        // 1. Primary: Find posts that share 1 or more tags with current post
        try {
          const tags = await getTagsByPost(currentPost.id);
          const tagSlugs = tags.map(tag => tag.slug);

          const taggedPostsPromises = tagSlugs.map(slug => getPostsByTagSlug(slug));
          const taggedPostsArrays = await Promise.all(taggedPostsPromises);
          
          // Combine and deduplicate
          const combinedTaggedPosts = taggedPostsArrays.flat();
          const uniqueTaggedPosts = Array.from(new Map(combinedTaggedPosts.map(post => [post.id, post])).values());

          // Exclude current post and sort by date (newer first)
          posts = uniqueTaggedPosts
            .filter(post => post.id !== currentPost.id)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        } catch (tagError) {
          console.error("Error fetching tagged posts:", tagError);
          // Continue to fallback if tag fetching fails
        }

        // 2. Fallback: If less than 3 matching posts found, fill remaining slots with random recent posts
        if (posts.length < 3) {
          try {
            const allPosts = await getAllPosts({});
            const recentRandomPosts = allPosts
              .filter(post => post.id !== currentPost.id && !posts.some(p => p.id === post.id))
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 3 - posts.length);
            posts = [...posts, ...recentRandomPosts];
          } catch (allPostsError) {
            console.error("Error fetching all posts for fallback:", allPostsError);
            // If this also fails, we'll just show what we have
          }
        }

        // Ensure exactly 3 posts are displayed
        setRecommendedPosts(posts.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch recommendations:", err);
        setError("Failed to load recommendations.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentPost]);

  if (loading) {
    return (
      <section className="you-might-like max-w-6xl mx-auto px-4 py-8">
        <h3 className="text-2xl font-bold mb-6">You might also like this</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <p>Loading recommendations...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="you-might-like max-w-6xl mx-auto px-4 py-8">
        <h3 className="text-2xl font-bold mb-6">You might also like this</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  if (recommendedPosts.length === 0) {
    return null; // Or a message indicating no recommendations
  }

  return (
    <section className="you-might-like max-w-6xl mx-auto px-4 py-8">
      <h3 className="text-2xl font-bold mb-6">You might also like this</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendedPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
};

export default YouMightAlsoLike;