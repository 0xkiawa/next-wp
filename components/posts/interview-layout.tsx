'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { ArticleContent } from "@/components/article";
import { Post, FeaturedMedia, Author, Category } from "@/lib/wordpress.d";
import { useNavbarTitle } from "@/components/navigation/NavbarTitleContext";

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
}) => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const { setHidden } = useNavbarTitle();
    const router = useRouter();

    // Hide navbar on mount, restore on unmount
    useEffect(() => {
        setHidden(true);
        return () => setHidden(false);
    }, [setHidden]);

    useEffect(() => {
        const handleScroll = () => {
            // Calculate scroll progress (0 to 1) based on how far down we've scrolled
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            // Gradient fully covers at 1.5x viewport height scroll
            const maxScroll = windowHeight * 1.5;
            const progress = Math.min(scrollTop / maxScroll, 1);
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Dynamic gradient opacity based on scroll
    const gradientOpacity = 0.4 + (scrollProgress * 0.6); // 40% to 100%

    return (
        <div className="relative min-h-[200vh]">
            {/* Fixed Back Button */}
            <button
                onClick={() => router.back()}
                className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-all group"
                aria-label="Go back"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-space-mono uppercase tracking-wider">Back</span>
            </button>

            {/* Fixed Background Image with Dynamic Gradient */}
            <div className="fixed inset-0 w-full h-screen -z-10">
                {featuredMedia ? (
                    <div className="relative w-full h-full">
                        <Image
                            src={featuredMedia.source_url}
                            alt={featuredMedia.alt_text || post.title.rendered}
                            fill
                            className="object-cover"
                            priority
                        />
                        {/* Multi-directional Gradient Overlay - Left, Right, Bottom + Dynamic Center */}
                        <div
                            className="absolute inset-0 transition-opacity duration-100"
                            style={{
                                background: `
                  linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 20%, rgba(0,0,0,0) 80%, rgba(0,0,0,0.9) 100%),
                  linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 25%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%),
                  rgba(0,0,0,${gradientOpacity})
                `,
                            }}
                        />
                    </div>
                ) : (
                    <div className="w-full h-full bg-black" />
                )}
            </div>

            {/* Main Content - Overlaid on Top of Image */}
            <div className="relative z-10 min-h-screen flex flex-col justify-center pt-[10vh]">
                <div className="max-w-3xl mx-auto px-6 md:px-8 pb-20">
                    {/* Title */}
                    <h1
                        className="text-4xl md:text-5xl lg:text-6xl font-bold font-acaslon text-white leading-tight mb-8"
                        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />
                </div>
            </div>

            {/* Article Content Section */}
            <div className="relative z-20 bg-transparent">
                <div className="max-w-3xl mx-auto px-6 md:px-8 py-12">
                    {/* Excerpt/Intro */}
                    {post.excerpt.rendered && (
                        <div
                            className="text-xl md:text-2xl font-acaslon italic leading-relaxed text-white/90 mb-12"
                            dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                        />
                    )}

                    <div className="w-24 h-px bg-white/30 mb-12" />

                    {/* Article Body */}
                    <div className="prose prose-lg prose-invert max-w-none font-garamond prose-p:text-white/90 prose-headings:text-white prose-strong:text-white prose-blockquote:text-white/80 leading-loose">
                        <ArticleContent content={post.content.rendered} />
                    </div>

                    {/* End Marker */}
                    <div className="mt-16 pt-8 border-t border-white/20 text-center">
                        <div className="text-sm font-space-mono text-white/50 uppercase tracking-widest">
                            End of Interview
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewLayout;
