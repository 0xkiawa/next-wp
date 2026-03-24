import { Section } from "@/components/craft";
import { getPostsByCategorySlug } from "@/lib/wordpress";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

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
    <Section className="bg-white py-16 px-4 md:px-8">
      {/* Replaced Container with a custom wider div for breathing room */}
      <div className="w-full max-w-[1400px] mx-auto">
        {/* Section Title */}
        <div className="mb-10">
          <h2 className="text-lg md:text-xl font-bold font-futura tracking-[0.25em] text-black uppercase mb-4">
            Books
          </h2>
          <div className="w-full h-[14px] bg-black"></div>
        </div>

        {/* Posts Grid - 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-12">
          {combinedPosts.map((post, index) => (
            <article
              key={post.id}
              className={cn(
                "flex flex-row md:flex-col h-full",
                // Mobile divider (hidden on desktop)
                "border-b border-gray-200 pb-6 mb-2 md:border-b-0 md:pb-0 md:mb-0",
                // On large screens, add left border to columns 2, 3, 4 with left padding
                index > 0 ? "lg:border-l lg:border-black lg:pl-8 lg:ml-0" : "",
                // On large screens, add right padding to columns 1, 2, 3 so content breathes before the border
                index < 3 ? "lg:pr-8" : "",
                // On md screens (2 cols), add borders/padding accordingly
                "md:max-lg:border-l-0 md:max-lg:pl-0 md:max-lg:pr-4"
              )}
            >
              {/* Left Content (Mobile) / Top Content (Desktop) */}
              <div className="flex-1 flex flex-col pr-4 md:pr-0">
                {/* Category (Eyebrow) */}
                {post._embedded?.['wp:term']?.[0]?.[0] && (
                  <div className="mb-1 md:mb-2">
                    <Link
                      href={`/posts/?category=${post._embedded['wp:term'][0][0].id}`}
                      className="text-sm md:text-base font-acaslon italic text-black hover:text-red-700 transition-colors"
                    >
                      {post._embedded['wp:term'][0][0].name}
                    </Link>
                  </div>
                )}

                {/* Title */}
                <h3 className="mb-2 md:mb-3">
                  <Link
                    href={`/posts/${post.slug}`}
                    className="text-lg md:text-2xl font-stilson leading-[1.1] text-black hover:text-red-700 transition-colors line-clamp-3 md:line-clamp-none"
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                  />
                </h3>

                {/* Excerpt */}
                {post.excerpt?.rendered && (
                  <div className="mb-3 md:mb-6">
                    <p
                      className="text-[13px] md:text-[15px] text-gray-600 font-acaslon leading-relaxed line-clamp-2 md:line-clamp-4"
                      dangerouslySetInnerHTML={{
                        __html: post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
                      }}
                    />
                  </div>
                )}

                {/* Spacer to push byline to bottom of text block */}
                <div className="mt-auto"></div>

                {/* Byline */}
                <div className="mb-0 md:mb-4 flex items-center gap-1.5 mt-2 md:mt-0">
                  <span className="text-[11px] md:text-sm font-acaslon italic text-black lowercase">by</span>
                  <span className="text-[10px] md:text-xs font-bold font-futura tracking-[0.1em] text-black uppercase">
                    {post._embedded?.author?.[0]?.name ? (
                      <Link href={`/posts/?author=${post.author}`} className="hover:text-red-700 transition-colors">
                        {post._embedded.author[0].name}
                      </Link>
                    ) : (
                      "AUTHOR"
                    )}
                  </span>
                </div>
              </div>

              {/* Right Image (Mobile) / Bottom Image (Desktop) */}
              {post.featured_media && post._embedded?.['wp:featuredmedia']?.[0] && (
                <div className="flex-shrink-0 mt-1 md:mt-0 flex items-start md:block">
                  <Link href={`/posts/${post.slug}`} className="block overflow-hidden w-24 h-24 sm:w-32 sm:h-32 md:w-full md:h-auto aspect-square md:aspect-[3/2] relative transform transition-transform duration-700 hover:scale-[1.02]">
                    <Image
                      src={post._embedded['wp:featuredmedia'][0].source_url}
                      alt={post._embedded['wp:featuredmedia'][0].alt_text || post.title.rendered}
                      className="object-cover"
                      fill
                      sizes="(max-width: 768px) 150px, (max-width: 1024px) 50vw, 25vw"
                    />
                  </Link>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
