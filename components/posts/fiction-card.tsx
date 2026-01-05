import Link from "next/link";
import Image from "next/image";
import { ArticleContent } from "@/components/article";
import { getFeaturedMediaById, getAuthorById, getCategoryById, getAllPosts } from "@/lib/wordpress";

export default async function TheWeekendEssay() {
  // Fetch all posts and find the most recent one posted on Saturday (The Weekend Essay)
  const allPosts = await getAllPosts();

  // Find posts that were published on a Saturday (day 6 in JavaScript: 0=Sunday, 6=Saturday)
  const saturdayPosts = allPosts.filter(p => {
    const postDate = new Date(p.date);
    return postDate.getDay() === 6; // Saturday
  });

  // Use the most recent Saturday post, or fallback to latest post if no Saturday post exists
  const post = saturdayPosts.length > 0 ? saturdayPosts[0] : allPosts[0];

  if (!post) return null;

  const media = await getFeaturedMediaById(post.featured_media);
  const author = await getAuthorById(post.author);
  const category = await getCategoryById(post.categories[0]);

  return (
    <div className="max-w-7xl mx-auto bg-[#f8f8f3] text-black py-12 px-4 relative transition-colors duration-300">
      {/* Center Title */}
      <div className="text-center mb-12">
        <h2 className="font-newyorker tracking-widest text-xs uppercase font-bold text-red-700">The Weekend Essay</h2>
      </div>

      {/* Main content layout - side by side */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left column - Image, Category, Title, Author */}
        <div className="md:w-1/2 pl-4 md:pl-8">
          <div className="mb-4">
            <div className="mb-2">
              <Link
                href={`/posts/?category=${category.id}`}
                className="text-sm uppercase font-knockout tracking-wider text-red-700 hover:text-black transition-colors"
              >
                {category.name}
              </Link>
            </div>

            <h2 className="text-2xl md:text-3xl font-stilson mb-3 leading-tight">
              <Link href={`/posts/${post.slug}`} className="hover:text-gray-700 transition-colors text-black">
                <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
              </Link>
            </h2>

            <div className="mb-5 font-acaslon italic font-extrabold">
              <p className="text-base text-black">BY {author.name}</p>
            </div>
          </div>

          {/* Image with left spacing */}
          {media && (
            <div className="relative pl-0 md:pl-12">
              <div className="w-full relative rounded-md aspect-[4/5] md:aspect-[3/4] lg:h-[28rem] mx-auto">
                <Link href={`/posts/${post.slug}`}>
                  <Image
                    src={media.source_url}
                    alt={media.alt_text || post.title.rendered}
                    fill
                    className="object-cover rounded hover:opacity-95 transition-opacity"
                  />
                </Link>
              </div>
              <div className="text-xs text-gray-400 mt-2 pl-0 md:pl-12 italic font-acaslon">
                Photograph by {author.name}
              </div>
            </div>
          )}
        </div>

        {/* Right column - Article content */}
        <div className="md:w-1/2 flex flex-col justify-center">

          <div className="prose prose-sm max-w-none font-acaslon h-full max-h-96 overflow-hidden text-gray-700 dark:text-black leading-relaxed md:pr-0">
            <div className="md:first-letter:text-6xl md:first-letter:font-bold md:first-letter:float-left md:first-letter:mr-3 md:first-letter:mt-[-10px] md:first-letter:text-black">
              <ArticleContent
                content={post.content.rendered.substring(0, 600) + '...'}
                className="line-clamp-none"
              />
            </div>
          </div>
          <div className="mt-6">
            <Link
              href={`/posts/${post.slug}`}
              className="text-red-700 hover:text-black font-futura uppercase text-xs font-bold tracking-widest border-b border-red-700 hover:border-black pb-1 transition-all"
            >
              Continue reading
            </Link>
          </div>
        </div>
      </div>

      {/* Dynamic Category Link */}
      <div className="mt-12 text-center border-t border-gray-300 pt-4 max-w-xs mx-auto">
        <Link
          href={`/posts/?category=${category.id}`}
          className="text-sm font-acaslon hover:underline italic text-gray-600 hover:text-black transition-colors"
        >
          All {category.name} »
        </Link>
      </div>
    </div>
  );
} 