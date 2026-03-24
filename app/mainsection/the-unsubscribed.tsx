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
  const posts = await getAllPosts({});

  // Filter out excluded posts (posts already shown in other sections)
  const filteredPosts = posts.filter(post => !excludedPostIds.includes(post.id));

  // Take the first 6 posts from the filtered list to show a nice row
  const displayPosts = filteredPosts.slice(0, 6);

  return (
    <div>
      {/* Section Header - Mini Philosophy Style */}
      <div className="text-center max-w-6xl mx-auto px-4 md:px-0 mb-10">
        <div className="w-full h-[6px] bg-black mb-8"></div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          <span className="font-futura font-black uppercase">THE </span>
          <span className="font-acaslon italic">Mantel</span>
        </h2>
        <p className="text-lg md:text-xl font-garamond italic text-gray-600 max-w-xl mx-auto mb-4">
          Echoes of the past, resonating in the present. A curated collection of timeless stories.
        </p>
        <p className="text-sm font-acaslon italic text-gray-500">
          with <span className="font-futura font-bold not-italic text-gray-900 tracking-wide">Kiawa Vurner</span>
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
