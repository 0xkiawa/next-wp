import { Section, Container } from "@/components/craft";
import { getAllPosts } from "@/lib/wordpress";
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
  // Fetch posts from the personal category
  const posts = await getAllPosts({});
  // Skip the first post (index 0) and take the next 3 posts
  const nextPosts = posts.slice(1, 5);
  
  return (
    <div>
      <Container>
        {/* Page Title with Broken Bell Icon */}
        <div className="flex items-center justify-center border-t pt-8 mb-2">
          <h2 className="text-3xl text-center font-bold font-garamond">
            The Unsubscribed
          </h2>
          {/* Broken Bell SVG Icon */}
          <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12,3 C15.3,3 18,5.7 18,9 L18,14 L19,14 C19.6,14 20,14.4 20,15 C20,15.6 19.6,16 19,16 L5,16 C4.4,16 4,15.6 4,15 C4,14.4 4.4,14 5,14 L6,14 L6,9 C6,5.7 8.7,3 12,3 Z" fill="#e53e3e" stroke="none"/>
            <path d="M11,17 L13,17 C13,18.1 12.1,19 11,19 C9.9,19 9,18.1 9,17 L11,17 Z" fill="#e53e3e" stroke="none"/>
            <path d="M12,2 C12.6,2 13,2.4 13,3 L13,4 C13,4 12.6,4 12,4 C11.4,4 11,4 11,4 L11,3 C11,2.4 11.4,2 12,2 Z" fill="#e53e3e" stroke="none"/>
            <path d="M7,8 L5,6 M17,8 L19,6 M10,16 L8,19 M14,16 L16,19" stroke="#e53e3e" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="4" y1="4" x2="20" y2="20" stroke="#8b0000" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="text-center text-xl font-acaslon italic mb-5">
          Observations on stuff you tried to quit but keeps showing up anyway.
        </div>
        
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
              {nextPosts.map((post, idx) => (
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