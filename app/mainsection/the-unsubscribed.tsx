import { Section, Container } from "@/components/craft";
import { getAllPosts } from "@/lib/wordpress";
import MantelCard from "@/components/posts/mantel-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Info } from "lucide-react";

interface UnsubscribedProps {
  excludedPostIds?: number[];
}

export default async function Page({ excludedPostIds = [] }: UnsubscribedProps) {
  // Fetch posts from the personal category
  const allPosts = await getAllPosts({});
  // Sort posts by date descending for consistent chronological flow
  const posts = [...allPosts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Filter out excluded posts (posts already shown in other sections)
  const filteredPosts = posts.filter(post => !excludedPostIds.includes(post.id));

  // Take the first 6 posts from the filtered list to show a nice row
  const displayPosts = filteredPosts.slice(0, 6);

  return (
    <div>
      {/* Section Header - Mini Philosophy Style */}
      <div className="text-center max-w-6xl mx-auto px-4 md:px-0 mb-12">
        <div className="w-full h-[14px] md:h-[18px] bg-black mb-12"></div>
        <h2 className="text-4xl md:text-5xl text-black mb-4 flex justify-center items-center">
          <span className="font-futura font-black uppercase tracking-tighter">THE</span>
          <span className="font-stilson uppercase font-medium tracking-tight ml-[2px] md:ml-1">MANTEL</span>
        </h2>
        <p className="text-xl md:text-2xl font-garamond italic text-black max-w-2xl mx-auto mb-5 leading-normal">
          Echoes of the past, resonating in the present. A curated collection of timeless stories.
        </p>
        <p className="text-base md:text-lg font-acaslon italic text-black">
          with <span className="font-space-mono font-bold not-italic text-black ml-[2px]">KIAWAVURNER</span>
        </p>
      </div>

      {/* Carousel Layout with border only on this div */}
      <div className="max-w-[1400px] mx-auto  pt-8 pl-4 lg:pl-12 pr-4 lg:pr-12">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-3">
            {displayPosts.map((post, idx) => (
              <CarouselItem key={post.id} className="pl-2 md:pl-3 basis-[85%] sm:basis-[48%] md:basis-[32%] lg:basis-1/5 xl:basis-1/5">
                <div className="h-full py-1 min-h-[420px]">
                  <MantelCard post={post} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Swipe indicator */}
          <div className="flex items-center justify-center mt-2 mb-2 text-blue-500">
            <Info size={16} className="mr-1" />
            <span className="text-sm font-newyorker font-medium">swipe more</span>
          </div>

          <div className="flex justify-center mt-2">
            <CarouselPrevious className="relative mr-2" />
            <CarouselNext className="relative ml-2" />
          </div>
        </Carousel>
      </div>

    </div>
  );
}
