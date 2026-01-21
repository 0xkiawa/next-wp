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

    const { title, excerpt, _embedded, slug } = post;
    const featuredImage = _embedded?.['wp:featuredmedia']?.[0]?.source_url || '/placeholder.jpg';
    const authorName = _embedded?.author?.[0]?.name || 'Unknown Author';

    return (
        <section className="bg-[#fcfbf9] dark:bg-black text-black dark:text-white w-full border-b border-black dark:border-white">
            <div className="flex flex-col md:flex-row min-h-[600px] md:h-[700px]">
                {/* Mobile Title */}
                <div className="md:hidden pt-8 pb-4 px-4 text-center">
                    <h2 className="text-sm font-bold tracking-widest uppercase mb-2">Interviews</h2>
                </div>

                {/* Image Section */}
                <div className="relative w-full md:w-1/2 h-[500px] md:h-auto border-r-0 md:border-r border-black dark:border-white order-2 md:order-1">
                    <Image
                        src={featuredImage}
                        alt={title.rendered}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Content Section */}
                <div className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-16 lg:p-24 order-3 md:order-2">

                    {/* Desktop Label */}
                    <div className="hidden md:block mb-8">
                        <span className="font-newyorker text-red-600 tracking-widest text-xs uppercase">
                            Interviews
                        </span>
                    </div>

                    <div className="space-y-6">
                        <Link href={`/posts/${slug}`} className="block group">
                            <h1
                                className="text-4xl md:text-5xl lg:text-6xl font-acaslon leading-[1.1] group-hover:text-red-700 transition-colors"
                                dangerouslySetInnerHTML={{ __html: title.rendered }}
                            />
                        </Link>

                        <div
                            className="text-lg md:text-xl font-acaslon text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-4"
                            dangerouslySetInnerHTML={{ __html: excerpt.rendered }}
                        />

                        <div className="pt-4">
                            <p className="font-acaslon italic [font-variant:small-caps] text-sm md:text-base tracking-wide">
                                By <span className="text-red-600">{authorName}</span>
                            </p>
                        </div>

                        <div className="pt-6">
                            <Link href={`/posts/${slug}`}>
                                <button className="px-8 py-3 border border-black dark:border-white font-newyorker text-xs tracking-widest uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                                    Read Interview
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Interviews;
