import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Section, Container } from "@/components/craft";import { ArticleContent } from "@/components/article";
import { getFeaturedMediaById, getAuthorById, getCategoryById } from "@/lib/wordpress";
import { ChevronDown } from "lucide-react"; // Import the ChevronDown icon

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
    <>
      <div className="max-w-[90%] md:max-w-[85%] lg:max-w-[80%] mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-6">
          {/* Left column for text content - reduced padding to push content left */}
          <div className="flex flex-col justify-center px-0 md:pl-0 md:pr-8 pt-6 md:pt-10">
            {/* Category display with font-newyorker styling - centered */}
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
            
            {/* Title in uppercase with distinctive styling and link */}
            <Link href={`/posts/${post.slug}`} className="hover:text-red-600 transition-colors">
              <h2 
                className="text-2xl md:text-4xl font-bold tracking-wide text-center md:text-left mb-6 font-stilson"
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              ></h2>
            </Link>
            
            {/* Article excerpt with specific styling */}
            <div 
              className="text-base md:text-lg mb-6 text-center md:text-left font-acaslon italic"
              dangerouslySetInnerHTML={{
                __html: post.excerpt.rendered,
              }}
            ></div>
            
            {/* Author and date information */}
            <div className="text-sm text-muted-foreground text-center md:text-left font-miller mb-4">
              By {author.name} | {date}
            </div>
          </div>
          
          {/* Right column for image */}
          {media && (
            <div className="relative h-80 sm:h-120 md:h-[500px]">
              <Image
                src={media.source_url}
                alt={post.title.rendered}
                fill
                className="object-cover md:object-cover"
                sizes="(max-width: 200px) 60vw, 50vw"
                priority
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Scroll Down CTA */}
      <div className="flex justify-center items-center mt-12 mb-4 animate-bounce">
        <a 
          href="#more-content" 
          className="flex flex-col items-center text-blue-500 hover:text-black transition-colors"
          aria-label="Scroll down to see more content"
        >
          <span className="text-sm uppercase tracking-wider mb-2">Scroll Down</span>
          <ChevronDown size={24} />
          <ChevronDown size={24} className="-mt-4" />
        </a>
      </div>
    </>
  );
}