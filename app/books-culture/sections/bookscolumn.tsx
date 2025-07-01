
import { Section, Container } from "@/components/craft";
import { getPostsByCategorySlug } from "@/lib/wordpress";
import PostCard from "@/components/posts/post-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Info } from "lucide-react";

export default async function Page() {
  // Fetch posts from the books category instead of personal
  const posts = await getPostsByCategorySlug("personal");
  const latestPosts = posts.slice(0, 4);

  return (
    <div>
      <Container>
        {/* Page Title */}
        <h2 className="text-xl text-center border-t font-bold font-newyorker pt-8 mb-5">
          READING LISTS
        </h2>

        {/* Carousel Layout */}
        <div className="max-w-6xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {latestPosts.map((post, idx) => (
                <CarouselItem key={post.id} className="pl-2 md:pl-4 basis-[66.6%] md:basis-[85%] lg:basis-1/3">
                  <div className="p-1">
                    <PostCard post={post} isLast={true} />
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
      </Container>
    </div>
  );
}