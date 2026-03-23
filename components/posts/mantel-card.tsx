import Image from "next/image";
import Link from "next/link";
import { Post } from "@/lib/wordpress.d";
import { Play } from "lucide-react";
import {
  getFeaturedMediaById,
  getAuthorById,
} from "@/lib/wordpress";

export default async function MantelCard({ post }: { post: Post }) {
  const media = await getFeaturedMediaById(post.featured_media).catch(() => null);
  const author = await getAuthorById(post.author).catch(() => null);
  
  // Use post.acf?.article_media_duration if it exists, otherwise a fallback default
  const durationStr = post.acf?.article_media_duration || "12mins";

  return (
    <Link href={`/posts/${post.slug}`} className="block w-full h-full group">
      <div className="flex flex-col h-full bg-black text-white overflow-hidden border border-black group-hover:border-gray-800 transition-all">
        
        {/* Image Section - Square/Tall aspect */}
        <div className="relative aspect-square w-full overflow-hidden">
          {media?.source_url ? (
            <Image
              src={media.source_url}
              alt={post.title.rendered}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-neutral-900" />
          )}

          {/* Gradient Overlay for bottom text visibility over image */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end justify-between p-3 z-10">
            <div className="flex items-center text-white drop-shadow-md">
              <Play className="w-4 h-4 fill-white text-white" />
            </div>
            <div className="text-white font-acaslon italic text-sm tracking-wide font-medium shadow-black drop-shadow-md">
              {durationStr}
            </div>
          </div>
        </div>

        {/* Content Section - Solid Black Background */}
        <div className="flex flex-col flex-1 p-4 md:p-5 bg-black">
          {/* Title */}
          <h3 
            className="text-white font-stilson text-xl md:text-2xl leading-[1.2] mb-6 line-clamp-3 group-hover:text-gray-300 transition-colors"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
          
          <div className="mt-auto">
            {/* Author */}
            <p className="text-white font-futura tracking-wide font-bold text-xs md:text-[13px] uppercase mb-1">
              {author?.name || "AUTHOR"}
            </p>
            
            {/* Subtitle / Excerpt */}
            <div 
              className="text-gray-400 font-acaslon text-xs md:text-sm line-clamp-1"
              dangerouslySetInnerHTML={{
                __html: post.excerpt?.rendered?.replace(/<[^>]*>/g, '').substring(0, 80) || "Writer and Contributor"
              }}
            />
          </div>
        </div>
        
      </div>
    </Link>
  );
}
