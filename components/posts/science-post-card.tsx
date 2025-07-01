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
    <div className="min-h-screen bg-white py-16 px-8">
      <div className="max-w-4xl mx-auto">
        {/* Category Header at Top */}
        <div className="text-center mb-12">
          <p className="text-2xl italic text-black font-bold" style={{ fontFamily: 'Georgia, serif' }}>
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

          {/* Excerpt */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="text-base leading-relaxed text-black font-garamond italic">
              <p>{excerpt}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-px bg-black"></div>
          </div>

          {/* Full Article Content */}
          <div className="max-w-2xl mx-auto">
            <div className="text-base leading-relaxed text-black prose prose-lg max-w-none" style={{ fontFamily: 'Georgia, serif', lineHeight: '1.7' }}>
              <div className="md:first-letter:text-5xl md:first-letter:font-bold md:first-letter:float-left md:first-letter:mr-2 md:first-letter:leading-none">
                <ArticleContent
                  content={post.content.rendered}
                  className="line-clamp-none"
                />
              </div>
            </div>
          </div>

          {/* Continue Reading Link */}
          <div className="max-w-2xl mx-auto mt-8">
            <Link
              href={`/posts/${post.slug}`}
              className="text-blue-600 hover:underline italic"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Continue reading the full article »
            </Link>
          </div>

          {/* Article Details Footer */}
          <div className="mt-16 pt-8 border-t border-gray-300">
            <div className="text-sm text-gray-600 space-y-1" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
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

          {/* Related Sections */}
          <div className="flex flex-col md:flex-row justify-between mt-12 gap-6 pt-8 border-t border-gray-200">
            {/* MORE FROM THIS CATEGORY */}
            <div className="md:w-1/2">
              <h3 className="uppercase text-sm font-medium tracking-wider mb-4 text-black" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                MORE FROM {category.name.toUpperCase()}
              </h3>
              <div className="space-y-2">
                <Link href={`/posts/?category=${category.id}`} className="block hover:underline" style={{ fontFamily: 'Georgia, serif' }}>
                  Explore all articles in {category.name}
                </Link>
              </div>
            </div>

            {/* BY THIS AUTHOR */}
            <div className="md:w-1/2">
              <h3 className="uppercase text-sm font-medium tracking-wider mb-4 text-black" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                BY {author.name.toUpperCase()}
              </h3>
              <div className="space-y-2">
                <Link href={`/posts/?author=${author.id}`} className="block hover:underline" style={{ fontFamily: 'Georgia, serif' }}>
                  View all articles by {author.name}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}