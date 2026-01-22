import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArticleContent } from "@/components/article";
import { BookmarkButton } from "@/components/posts/bookmark-button";
import { Post, FeaturedMedia, Author, Category } from "@/lib/wordpress.d";
import { calculateReadingTime } from "@/lib/utils/text";

interface InterviewLayoutProps {
    post: Post;
    featuredMedia: FeaturedMedia | null;
    author: Author;
    category: Category;
    formattedDate: string;
}

const InterviewLayout: React.FC<InterviewLayoutProps> = ({
    post,
    featuredMedia,
    author,
    category,
    formattedDate,
}) => {
    const readingTime = calculateReadingTime(post.content.rendered);

    return (
        <div className="relative min-h-screen">
            {/* Hero Section - Fixed Background */}
            <div className="fixed top-0 left-0 w-full h-screen -z-10">
                {featuredMedia ? (
                    <div className="relative w-full h-full">
                        <Image
                            src={featuredMedia.source_url}
                            alt={featuredMedia.alt_text || post.title.rendered}
                            fill
                            className="object-cover"
                            priority
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
                    </div>
                ) : (
                    <div className="w-full h-full bg-gray-900" />
                )}

                {/* Hero Content (Title & Meta) - Positioned at Bottom */}
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 lg:p-24 text-white">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-4">
                            <span className="font-newyorker text-red-500 tracking-widest text-xs uppercase bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                                {category?.name || 'Interview'}
                            </span>
                        </div>

                        <h1
                            className="text-4xl md:text-6xl lg:text-7xl font-bold font-knockout leading-tight mb-6"
                            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                        />

                        <div className="flex flex-col md:flex-row md:items-center gap-6 text-gray-300 font-space-mono text-sm md:text-base">
                            <div className="flex items-center gap-2">
                                <span>By {author.name}</span>
                            </div>
                            <span className="hidden md:block">•</span>
                            <div>
                                {formattedDate}
                            </div>
                            <span className="hidden md:block">•</span>
                            <div>
                                {readingTime} min read
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content - Scrolls Over Hero */}
            <div className="relative z-10 mt-[100vh] bg-white min-h-screen">
                <div className="max-w-3xl mx-auto py-20 px-6 md:px-8">
                    {/* Excerpt/Intro */}
                    {post.excerpt.rendered && (
                        <div
                            className="text-xl md:text-2xl font-acaslon italic leading-relaxed text-gray-700 mb-12 first-letter:text-5xl first-letter:float-left first-letter:mr-3 first-letter:font-bold"
                            dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                        />
                    )}

                    <div className="w-24 h-px bg-black mb-12 opacity-20 mx-auto" />

                    {/* Article Body */}
                    <div className="prose prose-lg max-w-none font-garamond text-gray-900 leading-loose">
                        <ArticleContent content={post.content.rendered} />
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-16 pt-8 border-t border-gray-100 flex justify-between items-center">
                        <BookmarkButton
                            wpPostId={post.id}
                            postTitle={post.title.rendered}
                            postSlug={post.slug}
                        />
                        <div className="text-sm font-space-mono text-gray-500 uppercase">
                            End of Interview
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewLayout;
