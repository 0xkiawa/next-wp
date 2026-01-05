import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Section, Container } from "@/components/craft";
import { getFeaturedMediaById, getAuthorById, getCategoryById } from "@/lib/wordpress";

export default async function FeaturedPostCard({ post }: { post: any }) {
  const media = await getFeaturedMediaById(post.featured_media);
  const author = await getAuthorById(post.author);
  const date = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const category = await getCategoryById(post.categories[0]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {/* Left column for text content */}
        <div className="flex flex-col justify-center px-4 md:pl-10 md:pr-0 pt-10 md:pt-10">
          {/* Category display */}
          <div className="text-center mb-2">
            <Link 
              href={`/posts/?category=${category.id}`}
              className={cn(
                "text-xs md:text-xl font-newyorker font-bold uppercase hover:text-red-700 transition-colors text-red-600",
                "!no-underline"
              )}
            >
              <span dangerouslySetInnerHTML={{ __html: category.name }} />
            </Link>
          </div>

          {/* Title */}
          <Link href={`/posts/${post.slug}`} className="hover:text-red-600 transition-colors">
            <h2 
              className="text-2xl md:text-4xl font-bold tracking-wide text-center md:text-left mb-6 font-stilson"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            ></h2>
          </Link>

          {/* Author and date */}
          <div className="text-sm text-muted-foreground text-center md:text-left font-miller mb-4">
            By {author.name} | {date}
          </div>

          {/* Excerpt */}
          <div 
            className="text-base md:text-lg mb-6 text-center md:text-left font-acaslon italic"
            dangerouslySetInnerHTML={{
              __html: post.excerpt.rendered,
            }}
          ></div>

          {/* Listen button */}
          <div className="flex justify-center md:justify-start mb-4">
            <Link 
              href={`/audio/${post.slug}`}
              className="flex items-center gap-2 bg-background text-xs font-bold border border-black dark:border-white rounded-full px-4 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-md"
              aria-label="Listen to audio version"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="17" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-red-600 transition-transform duration-300 group-hover:scale-110"
              >
                <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
              </svg>
              <span className="uppercase tracking-wide font-futura">Listen</span>
            </Link>
          </div>
        </div>

        {/* Right column for image */}
        {media && (
          <div className="relative h-80 sm:h-120 md:h-[500px] lg:h-[500px] px-4 md:pl-0 md:pr-10">
            <Image
              src={media.source_url}
              alt={post.title.rendered}
              fill
              className="object-cover md:object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        )}
      </div>
    </div>
  );
}
