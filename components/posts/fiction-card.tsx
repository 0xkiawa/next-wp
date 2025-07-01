import Link from "next/link";
import Image from "next/image";
import { ArticleContent } from "@/components/article";
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
    <div className="max-w-5xl mx-auto bg-[#f8f8f3] py-12 px-4">
      {/* Main content layout - side by side */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left column - Image, Category, Title, Author */}
        <div className="md:w-1/2 pl-4 md:pl-8">
          <div className="mb-4">
            <div className="mb-2">
              <Link
                href={`/posts/?category=${category.id}`}
                className="text-sm uppercase font-newyorker tracking-wider"
              >
                {category.name}
              </Link>
            </div>

            <h2 className="text-2xl md:text-3xl font-stilson mb-3">
              "{post.title.rendered.replace(/(<([^>]+)>)/gi, '')}"
            </h2>

            <div className="mb-5 font-glacial">
              <p className="text-base ">BY {author.name.toUpperCase()}</p>
            </div>
          </div>

          {/* Image with left spacing */}
          {media && (
            <div className="relative pl-8 md:pl-12">
              <div className="w-4/5 relative rounded-md h-72 md:h-96 lg:h-[28rem] mx-auto">
                <Image
                  src={media.source_url}
                  alt={post.title.rendered.replace(/(<([^>]+)>)/gi, '')}
                  fill
                  className="object-cover rounded"
                />
                <div className="absolute bottom-3 right-3 bg-white rounded-full p-1">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 18V12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 19C21 20.1 20.1 21 19 21C17.9 21 17 20.1 17 19V15C17 13.9 17.9 13 19 13C20.1 13 21 13.9 21 15V19Z" fill="currentColor"/>
                    <path d="M3 19C3 20.1 3.9 21 5 21C6.1 21 7 20.1 7 19V15C7 13.9 6.1 13 5 13C3.9 13 3 13.9 3 15V19Z" fill="currentColor"/>
                  </svg>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-2 pl-8">
                Photograph by {author.name} for KiawaNotes
              </div>
            </div>
          )}
        </div>

        {/* Right column - Article content */}
        <div className="md:w-1/2">
          {/* Moved these divs to align with title */}
          <div className="mb-2 invisible">
            <span className="text-sm uppercase font-newyorker tracking-wider">
              {category.name}
            </span>
          </div>

          <div className="prose prose-sm font-acaslon h-full md:max-h-96 overflow-hidden">
            <div className="md:first-letter:text-5xl md:first-letter:font-bold md:first-letter:float-left md:first-letter:mr-2">
              <ArticleContent
                content={post.content.rendered.substring(0, 550) + '...'}
                className="line-clamp-none"
              />
            </div>
          </div>
          <div className="mt-4">
            <Link
              href={`/posts/${post.slug}`}
              className="text-blue-600 hover:underline font-acaslon"
            >
              Continue reading »
            </Link>
          </div>
        </div>
      </div>

      {/* Fiction sections at bottom */}
      <div className="flex flex-col md:flex-row justify-between mt-10 gap-6">
        {/* THIS WEEK IN FICTION */}
        <div className="md:w-1/2 pl-4 md:pl-8">
          <h3 className="uppercase text-sm font-newyorker tracking-wider mb-2 border-t pt-4">THIS WEEK IN FICTION</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Link href="#" className="font-acaslon hover:underline">
                {author.name} on Sexual Politics and Wanting to Grow Up
              </Link>
            </div>
            {media && (
              <div className="relative h-16 w-16 flex-shrink-0">
                <Image
                  src={media.source_url}
                  alt={author.name}
                  fill
                  className="object-cover rounded"
                  sizes="64px"
                />
              </div>
            )}
          </div>
        </div>

        {/* THE WRITER'S VOICE */}
        <div className="md:w-1/2">
          <h3 className="uppercase text-sm font-newyorker tracking-wider mb-2 border-t pt-4">THE WRITER'S VOICE</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Link href="#" className="font-acaslon hover:underline">
                The Author Reads "{post.title.rendered.replace(/(<([^>]+)>)/gi, '')}"
              </Link>
            </div>
            {author.avatar_urls && (
              <div className="relative h-16 w-16 flex-shrink-0">
                <img
                  src={author.avatar_urls["96"]}
                  alt={author.name}
                  className="object-cover rounded"
                  sizes="64px"
                />
                <div className="absolute bottom-1 right-1 bg-white rounded-full p-0.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 18V12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 19C21 20.1 20.1 21 19 21C17.9 21 17 20.1 17 19V15C17 13.9 17.9 13 19 13C20.1 13 21 13.9 21 15V19Z" fill="currentColor"/>
                    <path d="M3 19C3 20.1 3.9 21 5 21C6.1 21 7 20.1 7 19V15C7 13.9 6.1 13 5 13C3.9 13 3 13.9 3 15V19Z" fill="currentColor"/>
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 ml-4 md:ml-8">
        <Link
          href="/fiction"
          className="text-sm font-acaslon hover:underline"
        >
          All fiction »
        </Link>
      </div>
    </div>
  );
} 