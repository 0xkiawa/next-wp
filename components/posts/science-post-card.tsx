import Link from "next/link";
import { ArticleContent } from "@/components/article";
import { getAuthorById, getCategoryById } from "@/lib/wordpress";

export default async function FeaturedPostCard({ post }: { post: any }) {
  const author = await getAuthorById(post.author);
  const postDate = new Date(post.date);
  const dayNumber = postDate.getDate();
  const dayName = postDate.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
  const time = postDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  }).toUpperCase();
  const category = await getCategoryById(post.categories[0]);

  // Extract excerpt from content (first 200 characters)
  const excerpt = post.content.rendered
    .replace(/(<([^>]+)>)/gi, '') // Remove HTML tags
    .substring(0, 200) + '...';

  return (
    <div className="bg-white py-16 px-8">
      <div className="max-w-4xl mx-auto">
        {/* Category Header at Top */}
        <div className="text-center mb-12">
          <p className="text-2xl italic text-red-700 font-bold font-garamond">
            {category.name}
          </p>
        </div>

        {/* Header Section */}
        <div className="mb-12">
          {/* Date Section - Day name inline with number */}
          <div className="mb-4 flex items-start gap-3">
            {/* Day number */}
            <h1 className="text-8xl font-extrabold text-black font-futura tracking-40">
              {dayNumber}
            </h1>
            {/* Day name small on right */}
            <div className="text-xs font-bold tracking-wider  uppercase mt-2 font-futura">
              {dayName}
            </div>
          </div>

          {/* Horizontal Line */}
          <div className="w-full h-px bg-black mb-6"></div>

          {/* Time - Enlarged and Bold */}
          <div className="mb-8">
            <p className="text-2xl font-extrabold tracking-[0.2em] text-black uppercase font-futura">
              {time}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Article Title */}
          <div className="text-center mb-6">
            <h2 className="text-4xl font-bold text-black mb-3 font-garamond italic">
              {post.title.rendered.replace(/(<([^>]+)>)/gi, '')}
            </h2>
          </div>

          {/* Author Line */}
          <div className="text-center mb-8">
            <p className="text-sm text-gray-600 font-glacial">
              presented by / {author.name}
            </p>
          </div>

          {/* Excerpt Content with Inline Link */}
          <div className="max-w-2xl mx-auto">
            <div className="text-base leading-relaxed text-black font-garamond italic">
              <span dangerouslySetInnerHTML={{
                __html: (post.excerpt?.rendered || post.content.rendered.substring(0, 400))
                  .replace(/<p>/g, '') // Strip p tags to make it inline
                  .replace(/<\/p>/g, '')
                  .replace('[&hellip;]', '...') // Handle WordPress ellipsis
                  + ' '
              }} />
              <Link
                href={`/posts/${post.slug}`}
                className="text-blue-600 hover:underline inline-block font-caslon text-sm tracking-wide italic ml-1"
              >
                Continue reading »
              </Link>
            </div>
          </div>

          {/* Article Details Footer */}
          <div className="mt-16 pt-8 border-t border-gray-300">
            <div className="text-sm text-gray-600 space-y-1 font-futura font-bold">
              <p className="uppercase tracking-wide">
                <Link
                  href={`/posts/?category=${category.id}`}
                  className="hover:underline"
                >
                  {category.name}
                </Link>
              </p>
              <p>Published by {author.name}</p>
              <p>{postDate.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}