import { Section, Container, Prose } from "@/components/craft";
import { ArticleContent } from "@/components/article";
import { badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import Balancer from "react-wrap-balancer";
import { Clock, Cpu, Zap } from "lucide-react";
import { BookmarkButton } from "@/components/posts/bookmark-button";

interface ScienceTechPostLayoutProps {
  post: any;
  featuredMedia: any;
  author: any;
  category: any;
  cleanExcerpt: string;
  wordCount: number;
  readingTimeMinutes: number;
  formattedDate: string;
}

export function ScienceTechPostLayout({
  post,
  featuredMedia,
  author,
  category,
  cleanExcerpt,
  wordCount,
  readingTimeMinutes,
  formattedDate,
}: ScienceTechPostLayoutProps) {
  return (
    <Section>
      <Container>
        {/* Science & Tech Header with Tech Icons */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg mb-8">
          <div className="flex items-center justify-center mb-4">
            <Cpu className="mr-2" size={24} />
            <span className="text-xl font-bold">SCIENCE & TECHNOLOGY</span>
            <Zap className="ml-2" size={24} />
          </div>
          
          {/* Category */}
          {category && (
            <div className="text-center mb-4">
              <Link
                href={`/posts/?category=${category.id}`}
                className={cn(
                  "text-sm lg:text-lg font-newyorker uppercase text-yellow-300 transition-colors",
                  "!no-underline hover:text-yellow-100"
                )}
              >
                <span dangerouslySetInnerHTML={{ __html: category.name }} />
              </Link>
            </div>
          )}

          {/* Title with Tech Styling */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-stilson text-center mb-4">
            <Balancer>
              <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
            </Balancer>
          </h1>

          {/* Excerpt */}
          {cleanExcerpt && (
            <div className="text-center mb-6 max-w-2xl mx-auto">
              <p className="text-base md:text-lg text-blue-100 font-acaslon italic">
                {cleanExcerpt}
              </p>
            </div>
          )}
        </div>

        <Prose>
          {/* Author + Date + Bookmark + Time with Tech Theme */}
          <div className="text-center mb-8 bg-gray-50 p-6 rounded-lg border-l-4 border-blue-600">
            <p className="font-miller text-sm text-muted-foreground">
              Published by{" "}
              <Link
                href={`/posts/?author=${author.id}`}
                className="font-stilson text-blue-600 hover:text-blue-800"
              >
                {author.name}
              </Link>{" "}
              • {formattedDate}
            </p>

            <div className="mt-2">
              <BookmarkButton
                wpPostId={post.id}
                postTitle={post.title.rendered}
                postSlug={post.slug}
              />
            </div>

            <div className="flex items-center justify-center mt-2 text-sm text-muted-foreground">
              <Clock size={14} className="mr-1" />
              <span>{readingTimeMinutes} min read</span>
              <span className="mx-2">•</span>
              <span>{wordCount} words</span>
            </div>
          </div>

          {/* Featured Image with Tech Border */}
          {featuredMedia?.source_url && (
            <figure className="my-8 text-center">
              <div className="border-4 border-gradient-to-r from-blue-500 to-purple-500 rounded-lg overflow-hidden">
                <Image
                  src={featuredMedia.source_url}
                  alt={featuredMedia.alt_text || post.title.rendered}
                  className="mx-auto max-w-full h-auto"
                  width={featuredMedia.media_details?.width || 1200}
                  height={featuredMedia.media_details?.height || 800}
                  loading="lazy"
                  priority={false}
                />
              </div>
              {featuredMedia.caption && (
                <figcaption
                  className="text-sm text-muted-foreground mt-2 italic"
                  dangerouslySetInnerHTML={{
                    __html: featuredMedia.caption.rendered,
                  }}
                />
              )}
            </figure>
          )}
        </Prose>

        {/* Tech-themed separator */}
        <div className="w-full h-px bg-gradient-to-r from-blue-500 to-purple-500 my-8"></div>

        {/* Article Body with Tech Styling */}
        <div className="prose prose-lg max-w-none">
          <ArticleContent content={post.content.rendered} className="mt-2" />
        </div>
      </Container>
    </Section>
  );
}