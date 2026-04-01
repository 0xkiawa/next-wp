import Image from "next/image";
import Link from "next/link";
import { Post } from "@/lib/wordpress.d";
import { BookOpen, Headphones } from "lucide-react";
import {
  getFeaturedMediaById,
  getAuthorById,
} from "@/lib/wordpress";

export default async function MantelCard({ post }: { post: Post }) {
  const media = await getFeaturedMediaById(post.featured_media).catch(() => null);
  const author = await getAuthorById(post.author).catch(() => null);
  
  // Calculate read time from article content
  const contentStr = post.content?.rendered || "";
  const wordCount = contentStr.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 200);
  const durationStr = `${readTime} min${readTime !== 1 ? 's' : ''}`;

  // Smart detection for audio content
  // Checks if the WordPress content contains HTML5 audio tags or common podcast embeds
  const hasAudio = 
    contentStr.includes('<audio') || 
    contentStr.includes('spotify.com/embed') || 
    contentStr.includes('soundcloud.com/player') || 
    contentStr.includes('embed.podcasts.apple.com');

  return (
    <Link href={`/posts/${post.slug}`} className="block w-full h-full group">
      <div className="flex flex-col h-full bg-black text-white overflow-hidden bg-opacity-100 group-hover:bg-[#111] transition-all">
        
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
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end justify-between p-3 z-10 pointer-events-none">
            <div className="flex items-center text-white drop-shadow-md">
              {hasAudio ? (
                <Headphones className="w-4 h-4 text-white" />
              ) : (
                <BookOpen className="w-4 h-4 text-white" />
              )}
            </div>
            <div className="text-white font-acaslon italic text-sm md:text-base tracking-wide font-medium shadow-black drop-shadow-md">
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
            {/* Byline */}
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-gray-300 font-acaslon italic text-sm lowercase">by</span>
              <span className="text-white font-futura tracking-wide font-bold text-xs md:text-[13px] uppercase">
                {author?.name || "AUTHOR"}
              </span>
            </div>
            
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
