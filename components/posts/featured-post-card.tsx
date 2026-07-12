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
        <section className="dark:bg-black text-black dark:text-white w-full">
            <div className="flex flex-col md:flex-row min-h-[500px] md:min-h-[700px] lg:min-h-[780px]">

                {/* Content Section */}
                {/* Mobile: Top (Order 1). Desktop: Left (Order 1). */}
                <div className="w-full md:w-1/4 flex flex-col justify-center p-6 md:p-8 lg:p-10 order-1">

                    {/* Label */}
                    <div className="mb-6 md:mb-8 text-center md:text-left">
                        <span className="font-newyorker text-red-600 tracking-widest text-xs uppercase">
                            Featured Story
                        </span>
                    </div>

                    <div className="space-y-6 flex flex-col">
                        <div className="text-center md:text-left">
                            <Link href={`/posts/${slug}`} className="block group">
                                <h1
                                    className="text-3xl md:text-3xl lg:text-4xl font-acaslon leading-[1.1] group-hover:text-red-700 transition-colors"
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
                            className="mt-4 md:mt-6 text-base md:text-base font-acaslon text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-4 text-left"
                            dangerouslySetInnerHTML={{ __html: excerpt.rendered }}
                        />
                    </div>
                </div>

                {/* Image Section */}
                {/* Mobile: Bottom (Order 2). Desktop: Right (Order 2). */}
                {/* Desktop: Framed with padding. Mobile: Full width. */}
                <div className="relative w-full md:w-3/4 min-h-[400px] md:min-h-full order-2">
                    <Image
                        src={featuredImage}
                        alt={title.rendered}
                        fill
                        className="object-cover object-center"
                        priority
                    />
                </div>

            </div>
        </section>
    );
};

export default FeaturedPostCard;
