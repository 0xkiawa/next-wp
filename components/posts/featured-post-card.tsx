'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Post } from '@/lib/wordpress.d';

interface FeaturedPostCardProps {
    post: Post;
}

const FeaturedPostCard: React.FC<FeaturedPostCardProps> = ({ post }) => {
    if (!post) return null;

    const { title, excerpt, _embedded, slug, date } = post;
    const featuredImage = _embedded?.['wp:featuredmedia']?.[0]?.source_url || '/placeholder.jpg';
    const authorName = _embedded?.author?.[0]?.name || 'Unknown Author';
    const formattedDate = new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

    return (
        <section className="dark:bg-black text-black dark:text-white w-full border-b border-black dark:border-white">
            <div className="flex flex-col md:flex-row min-h-auto md:min-h-[700px]">

                {/* Content Section */}
                {/* Mobile: Top (Order 1). Desktop: Left (Order 1). */}
                <div className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-16 lg:p-24 order-1 md:border-r border-black dark:border-white">

                    {/* Label */}
                    <div className="mb-6 md:mb-8 text-center md:text-left">
                        <span className="font-newyorker text-red-600 tracking-widest text-xs uppercase">
                            Featured Story
                        </span>
                    </div>

                    <div className="space-y-6 flex flex-col h-full">
                        <div className="text-center md:text-left">
                            <Link href={`/posts/${slug}`} className="block group">
                                <h1
                                    className="text-3xl md:text-3xl lg:text-3xl font-acaslon leading-[1.1] group-hover:text-red-700 transition-colors"
                                    dangerouslySetInnerHTML={{ __html: title.rendered }}
                                />
                            </Link>
                        </div>

                        <div className="pt-2 flex items-center gap-1.5 justify-center md:justify-start text-center md:text-left flex-wrap">
                            <span className="font-acaslon italic text-sm md:text-base text-gray-700 dark:text-gray-300 lowercase">by</span>
                            <span className="font-futura font-bold text-xs md:text-sm tracking-[0.1em] text-red-600 uppercase">
                                {authorName}
                            </span>
                            <span className="font-acaslon italic text-sm md:text-base text-gray-700 dark:text-gray-300 mx-1">•</span>
                            <span className="font-acaslon italic text-sm md:text-base text-gray-700 dark:text-gray-300">
                                {formattedDate}
                            </span>
                        </div>

                        <div
                            className="mt-6 md:mt-12 text-lg md:text-xl font-acaslon text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-4 text-left"
                            dangerouslySetInnerHTML={{ __html: excerpt.rendered }}
                        />
                    </div>
                </div>

                {/* Image Section */}
                {/* Mobile: Bottom (Order 2). Desktop: Right (Order 2). */}
                {/* Desktop: Framed with padding. Mobile: Full width. */}
                <div className="relative w-full md:w-1/2 min-h-[400px] md:h-auto order-2 md:p-12 border-t md:border-t-0 border-black dark:border-white">
                    <div className="relative w-full h-[400px] md:h-full">
                        <Image
                            src={featuredImage}
                            alt={title.rendered}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>

            </div>
        </section>
    );
};

export default FeaturedPostCard;
