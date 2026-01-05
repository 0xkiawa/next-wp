import Image from "next/image";
import Link from "next/link";
import { Post } from "@/lib/wordpress.d";
import { cn } from "@/lib/utils";
import {
    getFeaturedMediaById,
    getAuthorById,
    getCategoryById,
} from "@/lib/wordpress";

export default async function CultureCard({
    post,
}: {
    post: Post;
}) {
    const media = await getFeaturedMediaById(post.featured_media);
    const author = await getAuthorById(post.author);
    const dateObj = new Date(post.date);
    const dateStr = dateObj.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
    const timeStr = dateObj.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
    });
    const category = await getCategoryById(post.categories[0]);

    return (
        <div className="flex flex-col border-b border-gray-200 pb-8 mb-8 last:border-0">
            <Link href={`/posts/${post.slug}`} className="group block">
                {/* Category Label */}
                <div className="mb-2">
                    <span className="text-red-700 font-bold uppercase text-[10px] tracking-widest font-sans">
                        {category.name}
                    </span>
                </div>

                {/* Headline */}
                <h2
                    className="text-2xl md:text-3xl font-bold font-miller text-black leading-tight mb-2 group-hover:text-gray-700 transition-colors"
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                />

                {/* Deck / Subheadline (using excerpt) */}
                <div
                    className="text-gray-600 text-base md:text-lg font-acaslon leading-snug mb-4 line-clamp-2"
                    dangerouslySetInnerHTML={{
                        __html: post.excerpt.rendered.replace(/<[^>]+>/g, '')
                    }}
                />

                {/* Meta Row: Author & Date */}
                <div className="flex flex-wrap items-center text-xs text-gray-500 font-sans mb-4 gap-x-2">
                    <span className="font-bold text-black border-b border-transparent hover:border-black cursor-pointer transition-colors">
                        By {author.name}
                    </span>
                    <span className="px-1.5 py-0.5 border border-gray-300 rounded text-[9px] uppercase tracking-wide font-bold hover:bg-gray-50 transition-colors hidden sm:inline-block">
                        Follow
                    </span>
                    <span className="text-gray-400">|</span>
                    <span>{dateStr} {timeStr} ET</span>
                </div>

                {/* Action Icons (Simulated) */}
                <div className="flex items-center gap-6 mb-4 text-gray-400">
                    {/* Share */}
                    <div className="flex items-center gap-1.5 hover:text-black transition-colors cursor-pointer">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
                        <span className="text-xs font-sans font-medium">Share</span>
                    </div>
                    {/* Resize */}
                    <div className="flex items-center gap-1.5 hover:text-black transition-colors cursor-pointer">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 12h8" /></svg>
                        <span className="text-xs font-sans font-medium">Resize</span>
                    </div>
                    {/* Listen */}
                    <div className="flex items-center gap-1.5 hover:text-black transition-colors cursor-pointer">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" /></svg>
                        <span className="text-xs font-sans font-medium">Listen (2 min)</span>
                    </div>
                </div>

                {/* Main Image */}
                <div className="relative w-full aspect-[4/3] mb-2 bg-gray-100">
                    {media ? (
                        <Image
                            src={media.source_url}
                            alt={media.alt_text || post.title.rendered}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                            No Image
                        </div>
                    )}
                </div>

                {/* Caption */}
                {media?.caption?.rendered && (
                    <div
                        className="text-[10px] text-gray-500 font-sans leading-tight text-right w-full"
                        dangerouslySetInnerHTML={{ __html: media.caption.rendered.replace(/<[^>]+>/g, '') }}
                    />
                )}
            </Link>
        </div>
    );
}
