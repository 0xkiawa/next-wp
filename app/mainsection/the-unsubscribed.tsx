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
      {/* Text above border */}
      <div className="text-center max-w-6xl mx-auto pl-4 md:pl-0 pr-4 md:pr-0 mb-6">
        <div className="text-3xl font-newyorker font-bold lowercase mb-2">
          the mantel
        </div>
        <p className="text-2xl font-garamond italic text-gray-600 max-w-2xl mx-auto">
          Echoes of the past, resonating in the present. A curated collection of timeless stories.
        </p>
      </div>

      {/* Carousel Layout with border only on this div */}
      <div className="max-w-[1400px] mx-auto border-t pt-8 pl-4 lg:pl-12 pr-4 lg:pr-12">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-3 md:-ml-6">
            {displayPosts.map((post, idx) => (
              <CarouselItem key={post.id} className="pl-3 md:pl-6 basis-[85%] sm:basis-1/2 md:basis-[40%] xl:basis-1/5 lg:basis-1/4">
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
