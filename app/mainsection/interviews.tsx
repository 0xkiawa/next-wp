'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Post } from '@/lib/wordpress.d';

interface InterviewsProps {
    post: Post;
}

const Interviews: React.FC<InterviewsProps> = ({ post }) => {
    if (!post) return null;

    const { title, excerpt, _embedded, slug, date } = post;
    const featuredImage = _embedded?.['wp:featuredmedia']?.[0]?.source_url || '/placeholder.jpg';
    const authorName = _embedded?.author?.[0]?.name || 'Unknown Author';
    const formattedDate = new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

    return (
        <section className="relative dark:bg-black w-full border-b border-black dark:border-white overflow-hidden mt-16">
            <div className="flex flex-col md:flex-row min-h-[600px] md:h-[700px]">

                {/* Image Section */}
                {/* Mobile: Absolute Full Background. Desktop: Relative Split Left Side */}
                {/* Image Section */}
                {/* Mobile: Absolute Full Background. Desktop: Relative Split Left Side with Padding */}
                <div className="absolute inset-0 md:relative md:w-1/2 h-full border-r-0 md:border-r border-black dark:border-white order-1 md:p-12">
                    <div className="relative w-full h-full">
                        <Image
                            src={featuredImage}
                            alt={title.rendered}
                            fill
                            className="object-cover"
                            priority
                        />
                        {/* Mobile Dark Overlay for Text Readability */}
                        <div className="absolute inset-0 bg-black/40 md:hidden z-10" />
                    </div>
                </div>

                {/* Content Section */}
                {/* Mobile: overlaid on top (z-20), Text White. Desktop: Right Side, standard colors. */}
                <div className="relative z-20 w-full md:w-1/2 h-full flex flex-col justify-end md:justify-center px-6 pb-12 pt-48 md:p-16 lg:p-24 order-2">

                    {/* Mobile Only Top Header */}
                    <div className="md:hidden absolute top-24 left-0 right-0 text-center">
                        <h2 className="text-sm font-bold tracking-widest uppercase text-white/90 mb-2">Interviews</h2>
                    </div>

                    {/* Desktop Label */}
                    <div className="hidden md:block mb-8">
                        <span className="font-newyorker text-red-600 tracking-widest text-xs uppercase">
                            Interviews
                        </span>
                    </div>

                    <div className="space-y-6 text-white md:text-black md:dark:text-white flex flex-col h-full">
                        <div className="text-center md:text-left">
                            <Link href={`/posts/${slug}`} className="block group">
                                <h1
                                    className="text-4xl md:text-5xl lg:text-6xl font-acaslon leading-[1.1] md:group-hover:text-red-700 transition-colors"
                                    dangerouslySetInnerHTML={{ __html: title.rendered }}
                                />
                            </Link>
                        </div>

                        <div className="pt-2 flex items-center gap-1.5 justify-center md:justify-start flex-wrap">
                            <span className="font-acaslon italic text-sm md:text-base text-white/90 md:text-gray-700 md:dark:text-gray-300 lowercase">by</span>
                            <span className="font-futura font-bold text-xs md:text-sm tracking-[0.1em] text-white md:text-red-600 uppercase">
                                {authorName}
                            </span>
                            <span className="font-acaslon italic text-sm md:text-base text-white/90 md:text-gray-700 md:dark:text-gray-300 mx-1">•</span>
                            <span className="font-acaslon italic text-sm md:text-base text-white/90 md:text-gray-700 md:dark:text-gray-300">
                                {formattedDate}
                            </span>
                        </div>

                        <div
                            className="mt-6 md:mt-12 text-lg md:text-xl font-acaslon text-gray-200 md:text-gray-700 md:dark:text-gray-300 leading-relaxed line-clamp-4 text-left"
                            dangerouslySetInnerHTML={{ __html: excerpt.rendered }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Interviews;
