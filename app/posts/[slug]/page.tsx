import {
  getPostBySlug,
  getFeaturedMediaById,
  getAuthorById,
  getCategoryById,
  getAllPosts,
} from "@/lib/wordpress";

import { Section, Container, Prose } from "@/components/craft";
import { ArticleContent } from "@/components/article";
import { badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/site.config";

import Link from "next/link";
import Image from "next/image";
import Balancer from "react-wrap-balancer";
import { Clock } from "lucide-react";

import type { Metadata } from "next";
import type { Post } from "@/lib/wordpress.d";

import { calculateWordCount, calculateReadingTime } from "@/lib/utils/text";
import { BookmarkButton } from "@/components/posts/bookmark-button";
import { StickyBookmark } from "@/components/posts/sticky-bookmark";
import AboutTheAuthor from "@/components/posts/about-the-author";
import SetNavbarTitle from "@/components/navigation/SetNavbarTitle";
import { AudioPlayer } from "@/components/posts/audio-player";
import InterviewLayout from "@/components/posts/interview-layout";

export const revalidate = 60;

// Helper function to get recommended posts based on shared tags
async function getRecommendedPosts(currentPost: Post, limit: number = 3): Promise<Post[]> {
  try {
    // Get all posts
    const allPosts = await getAllPosts();

    // Filter out the current post
    const otherPosts = allPosts.filter(post => post.id !== currentPost.id);

    // If current post has no tags, return random recent posts
    if (!currentPost.tags || currentPost.tags.length === 0) {
      return otherPosts.slice(0, limit);
    }

    // Score posts based on shared tags
    const scoredPosts = otherPosts.map(post => {
      const sharedTags = post.tags?.filter(tag =>
        currentPost.tags?.includes(tag)
      ) || [];

      return {
        post,
        score: sharedTags.length,
        date: new Date(post.date)
      };
    });

    // Sort by score (most shared tags first), then by date (most recent first)
    const sortedPosts = scoredPosts
      .filter(item => item.score > 0) // Only posts with at least 1 shared tag
      .sort((a, b) => {
        if (a.score !== b.score) {
          return b.score - a.score; // Higher score first
        }
        return b.date.getTime() - a.date.getTime(); // More recent first
      });

    // If we don't have enough posts with shared tags, fill with recent posts
    const recommendedPosts = sortedPosts.map(item => item.post);

    if (recommendedPosts.length < limit) {
      const recentPosts = otherPosts
        .filter(post => !recommendedPosts.some(rp => rp.id === post.id))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit - recommendedPosts.length);

      recommendedPosts.push(...recentPosts);
    }

    return recommendedPosts.slice(0, limit);
  } catch (error) {
    console.error('Error getting recommended posts:', error);
    return [];
  }
}

// Read More Section Component
function ReadMoreSection({ posts }: { posts: Post[] }) {
  if (!posts || posts.length === 0) return null;

  return (
    <Section className="bg-white py-16 px-4 md:px-8">
      {/* Replaced Container with a custom wider div for breathing room */}
      <div className="w-full max-w-[1400px] mx-auto">
        {/* Section Title */}
        <div className="mb-10">
          <h2 className="text-lg md:text-xl font-bold font-futura tracking-[0.25em] text-black uppercase mb-4">
            Related Content
          </h2>
          <div className="w-full h-[14px] bg-black"></div>
        </div>

        {/* Posts Grid - 4 Columns */}
        {/* Removed gap-x and divide-x, using custom padding and borders per column for perfect spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-12">
          {posts.map((post, index) => (
            <article 
              key={post.id} 
              className={cn(
                "flex flex-row md:flex-col h-full",
                // Mobile divider (hidden on desktop)
                "border-b border-gray-200 pb-6 mb-2 md:border-b-0 md:pb-0 md:mb-0",
                // On large screens, add left border to columns 2, 3, 4 with left padding
                index > 0 ? "lg:border-l lg:border-black lg:pl-8 lg:ml-0" : "",
                // On large screens, add right padding to columns 1, 2, 3 so content breathes before the border
                index < 3 ? "lg:pr-8" : "",
                // On md screens (2 cols), add borders/padding accordingly
                "md:max-lg:border-l-0 md:max-lg:pl-0 md:max-lg:pr-4"
              )}
            >
              {/* Left Content (Mobile) / Top Content (Desktop) */}
              <div className="flex-1 flex flex-col pr-4 md:pr-0">
                {/* Category (Eyebrow) */}
                {post._embedded?.['wp:term']?.[0]?.[0] && (
                  <div className="mb-1 md:mb-2">
                    <Link
                      href={`/posts/?category=${post._embedded['wp:term'][0][0].id}`}
                      className="text-sm md:text-base font-acaslon italic text-black hover:text-red-700 transition-colors"
                    >
                      {post._embedded['wp:term'][0][0].name}
                    </Link>
                  </div>
                )}

                {/* Title */}
                <h3 className="mb-2 md:mb-3">
                  <Link
                    href={`/posts/${post.slug}`}
                    className="text-lg md:text-2xl font-stilson leading-[1.1] text-black hover:text-red-700 transition-colors line-clamp-3 md:line-clamp-none"
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                  />
                </h3>

                {/* Excerpt - Hidden on very small mobile if desired, or just smaller. We'll leave it but reduce size/clamps */}
                {post.excerpt?.rendered && (
                  <div className="mb-3 md:mb-6">
                    <p
                      className="text-[13px] md:text-[15px] text-gray-600 font-acaslon leading-relaxed line-clamp-2 md:line-clamp-4"
                      dangerouslySetInnerHTML={{
                        __html: post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
                      }}
                    />
                  </div>
                )}

                {/* Spacer to push byline to bottom of text block */}
                <div className="mt-auto"></div>

                {/* Byline */}
                <div className="mb-0 md:mb-4 flex items-center gap-1.5 mt-2 md:mt-0">
                  <span className="text-[11px] md:text-sm font-acaslon italic text-black lowercase">by</span>
                  <span className="text-[10px] md:text-xs font-bold font-futura tracking-[0.1em] text-black uppercase">
                    {post._embedded?.author?.[0]?.name ? (
                      <Link href={`/posts/?author=${post.author}`} className="hover:text-red-700 transition-colors">
                        {post._embedded.author[0].name}
                      </Link>
                    ) : (
                      "AUTHOR"
                    )}
                  </span>
                </div>
              </div>

              {/* Right Image (Mobile) / Bottom Image (Desktop) */}
              {post.featured_media && post._embedded?.['wp:featuredmedia']?.[0] && (
                <div className="flex-shrink-0 mt-1 md:mt-0 flex items-start md:block">
                  <Link href={`/posts/${post.slug}`} className="block overflow-hidden w-24 h-24 sm:w-32 sm:h-32 md:w-full md:h-auto aspect-square md:aspect-[3/2] relative transform transition-transform duration-700 hover:scale-[1.02]">
                    <Image
                      src={post._embedded['wp:featuredmedia'][0].source_url}
                      alt={post._embedded['wp:featuredmedia'][0].alt_text || post.title.rendered}
                      className="object-cover"
                      fill
                      sizes="(max-width: 768px) 150px, (max-width: 1024px) 50vw, 25vw"
                    />
                  </Link>
                </div>
              )}
            </article>
            ))}
        </div>
      </div>
    </Section>
  );
}

// ✅ Pre-generate static paths for all posts
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

// Auto-transform Cloudinary images to 1200x630 landscape for OG
function toOgImage(url: string): string {
  if (url.includes('res.cloudinary.com')) {
    // Check if it already has transformations (contains /upload/...)
    if (url.includes('/upload/') && !url.includes('w_1200')) {
      return url.replace('/upload/', '/upload/w_1200,h_630,c_fill,q_auto,f_auto/');
    }
  }
  return url;
}

// ✅ SEO metadata
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const awaitedParams = await params;
  const post = await getPostBySlug(awaitedParams.slug);

  if (!post || !post.title) return { title: "Post Not Found" };

  const [author, category] = await Promise.all([
    getAuthorById(post.author).catch(() => null),
    post.categories?.[0] ? getCategoryById(post.categories[0]).catch(() => null) : null,
  ]);

  // Get featured image from embedded data
  const featuredMedia = post._embedded?.["wp:featuredmedia"]?.[0] ?? null;
  
  // Get raw source URL
  const rawImageUrl = featuredMedia?.source_url ?? null;

  // Force landscape crop for WhatsApp/social — works for Cloudinary and any image
  const ogImageUrl = rawImageUrl
    ? rawImageUrl.includes("res.cloudinary.com")
      ? rawImageUrl.replace("/upload/", "/upload/w_1200,h_630,c_fill,q_auto,f_auto/")
      : rawImageUrl
    : null;

  const title = post.title.rendered.replace(/<[^>]*>/g, "");
  const description = post.excerpt?.rendered?.replace(/<[^>]*>/g, "").trim() || "";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `${siteConfig.site_domain}/posts/${post.slug}`,
      siteName: siteConfig.site_name,
      images: ogImageUrl
        ? [{ url: ogImageUrl, width: 1200, height: 630, alt: title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
  };
}
// Science-Tech Layout Component
function ScienceTechLayout({ post, featuredMedia, author, category }: { post: any; featuredMedia: any; author: any; category: any }) {
  const postDate = new Date(post.date);
  const dayNumber = postDate.getDate();
  const dayName = postDate.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
  const time = postDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  }).toUpperCase();

  // Extract excerpt from content (first 200 characters)
  const excerpt = post.content.rendered
    .replace(/(<([^>]+)>)/gi, '') // Remove HTML tags
    .substring(0, 200) + '...';

  return (
    <div className="min-h-screen bg-white py-16 px-8">
      <div className="max-w-4xl mx-auto">
        {/* Category Header at Top */}
        <div className="text-center mb-12">
          <p className="text-2xl text-red-700 font-newyorker">
            {category.name}
          </p>
        </div>

        {/* Header Section */}
        <div className="mb-12">
          {/* Date Section - Day name inline with number */}
          <div className="mb-4 flex items-start gap-3">
            {/* Day number */}
            <h1 className="text-8xl font-extrabold text-black font-futura tracking-40">
              {dayNumber}
            </h1>
            {/* Day name small on right */}
            <div className="text-xs font-bold tracking-wider uppercase mt-2 font-futura">
              {dayName}
            </div>
          </div>

          {/* Horizontal Line */}
          <div className="w-full h-px bg-black mb-6"></div>

          {/* Time - Enlarged and Bold */}
          <div className="mb-8">
            <p className="text-2xl font-extrabold tracking-[0.2em] text-black uppercase font-futura">
              {time}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Article Title */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-black mb-3 font-garamond italic">
              {post.title.rendered.replace(/(<([^>]+)>)/gi, '')}
            </h2>
          </div>

          {/* Audio Player - Made smaller for Science Layout */}
          {post.acf?.article_media && (
            <div className="max-w-sm mx-auto mb-8">
              <AudioPlayer src={post.acf.article_media} title="Listen to this article" />
            </div>
          )}

          {/* Author Line + Bookmark - Scaled down */}
          <div className="text-center mb-8">
            <p className="text-sm text-gray-600 font-glacial mb-3">
              presented by / {author.name}
            </p>
          </div>

          {/* Featured Image */}
          {featuredMedia?.source_url && (
            <figure className="my-4 text-center mb-8">
              <Image
                src={featuredMedia.source_url}
                alt={featuredMedia.alt_text || post.title.rendered}
                className="mx-auto max-w-full h-auto !rounded-none"
                width={featuredMedia.media_details?.width || 1200}
                height={featuredMedia.media_details?.height || 800}
                style={{ borderRadius: 0 }}
                loading="lazy"
                priority={false}
              />
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

          {/* Excerpt */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="text-base leading-relaxed text-black font-garamond italic">
              <p>{excerpt}</p>
            </div>
          </div>

          {/* Bookmark & Time — mobile only */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 lg:hidden">
            <BookmarkButton
              wpPostId={post.id}
              postTitle={post.title.rendered}
              postSlug={post.slug}
            />
            <div className="flex items-center text-xs text-gray-500 font-futura uppercase tracking-widest font-bold">
              <Clock size={14} className="mr-2" />
              {calculateReadingTime(post.content.rendered)} min read
            </div>
          </div>

          {/* Reading time — desktop only */}
          <div className="hidden lg:flex items-center justify-center text-xs text-gray-500 font-futura uppercase tracking-widest font-bold mb-12">
            <Clock size={14} className="mr-2" />
            {calculateReadingTime(post.content.rendered)} min read
          </div>

          {/* Divider */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-px bg-black"></div>
          </div>

          {/* Full Article Content with sticky sidebar bookmark */}
          <div className="max-w-2xl mx-auto">
            <StickyBookmark wpPostId={post.id} postTitle={post.title.rendered} postSlug={post.slug}>
              <div className="text-base leading-relaxed text-black prose prose-lg max-w-none" style={{ fontFamily: 'Georgia, serif', lineHeight: '1.7' }}>
                <div className="md:first-letter:text-5xl md:first-letter:font-bold md:first-letter:float-left md:first-letter:mr-2 md:first-letter:leading-none">
                  <ArticleContent
                    content={post.content.rendered}
                    className="line-clamp-none"
                  />
                </div>
              </div>
            </StickyBookmark>
          </div>

          {/* Article Details Footer */}
          <div className="mt-16 pt-8 border-t border-gray-300">
            <div className="text-sm text-gray-600 space-y-1" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
              <p className="uppercase tracking-wide">
                <Link
                  href={`/posts/?category=${category.id}`}
                  className="hover:underline"
                >
                  {category.name}
                </Link>
              </p>
              <p>Published by {author.name}</p>
              <p>{postDate.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Books Layout Component
function BooksLayout({ post, featuredMedia, author, category, cleanExcerpt, formattedDate }: any) {
  return (
    <Section>
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Category | Date - Button Style */}
          <div className="mb-6">
            <div className="inline-flex overflow-hidden rounded-sm border border-gray-300">
              {/* Category Section - Black background, white text */}
              <Link
                href={`/posts/?category=${category.id}`}
                className="px-4 py-2 bg-black text-white text-sm font-newyorker  uppercase tracking-wide hover:bg-gray-800 transition-colors"
              >
                {category.name}
              </Link>
              {/* Date Section - White background, black text */}
              <div className="px-4 py-2 bg-white text-red-600 text-sm font-newyorker border-l border-gray-300">
                {formattedDate}
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="mb-6">
            <h1 className="text-xl md:text-4xl lg:text-5xl font-knockout leading-tight">
              <Balancer>
                <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
              </Balancer>
            </h1>
          </div>

          {/* Audio Player */}
          {post.acf?.article_media && (
            <div className="mb-8">
              <AudioPlayer src={post.acf.article_media} title="Listen to this article" />
            </div>
          )}

          {/* Excerpt */}
          {cleanExcerpt && (
            <div className="mb-6">
              <p className="text-lg md:text-xl text-gray-700 font-acaslon italic leading-relaxed text-center">
                {cleanExcerpt}
              </p>
            </div>
          )}

          {/* Bookmark & Time — mobile only */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 lg:hidden">
            <BookmarkButton
              wpPostId={post.id}
              postTitle={post.title.rendered}
              postSlug={post.slug}
            />
            <div className="flex items-center text-xs text-gray-500 font-futura uppercase tracking-widest font-bold">
              <Clock size={14} className="mr-2" />
              {calculateReadingTime(post.content.rendered)} min read
            </div>
          </div>

          {/* Reading time — desktop only */}
          <div className="hidden lg:flex items-center justify-center text-xs text-gray-500 font-futura uppercase tracking-widest font-bold mb-8">
            <Clock size={14} className="mr-2" />
            {calculateReadingTime(post.content.rendered)} min read
          </div>

          {/* Author Bio Section */}
          <div className="mb-8">
            <AboutTheAuthor authorId={author.id} />
          </div>

          {/* Featured Image */}
          {featuredMedia?.source_url && (
            <figure className="my-4 text-center">
              <Image
                src={featuredMedia.source_url}
                alt={featuredMedia.alt_text || post.title.rendered}
                className="mx-auto max-w-full h-auto !rounded-none"
                width={featuredMedia.media_details?.width || 1200}
                height={featuredMedia.media_details?.height || 800}
                style={{ borderRadius: 0 }}
                loading="lazy"
                priority={false}
              />
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

          {/* Divider */}
          <div className="w-full h-px bg-gray-300 mb-8"></div>

          {/* Article Content with sticky sidebar bookmark */}
          <StickyBookmark wpPostId={post.id} postTitle={post.title.rendered} postSlug={post.slug}>
            <div className="prose prose-lg max-w-none">
              <ArticleContent content={post.content.rendered} className="mt-2" />
            </div>
          </StickyBookmark>
        </div>
      </Container>
    </Section>
  );
}

// Culture & Personal Layout Component (Centered Style)
function CultureLayout({ post, featuredMedia, author, category, cleanExcerpt, formattedDate }: any) {
  return (
    <Section className="bg-white pt-12 pb-20">
      <Container>
        <div className="max-w-3xl mx-auto">
          
          {/* Top Red bar */}
          <div className="w-16 h-3 bg-red-700 mx-auto mb-4"></div>

          {/* Headline */}
          <h1 className="text-center text-3xl md:text-5xl lg:text-[54px] font-stilson  text-gray-950 leading-[1.15] mb-6">
            <Balancer>
              <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
            </Balancer>
          </h1>

          {/* Subhead / Excerpt */}
          {cleanExcerpt && (
            <div className="mb-6 text-center px-4">
              <p className="text-xl md:text-2xl text-gray-800 font-acaslon italic leading-relaxed">
                {cleanExcerpt}
              </p>
            </div>
          )}

          {/* Bookmark & Time — mobile only */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 lg:hidden">
            <BookmarkButton
              wpPostId={post.id}
              postTitle={post.title.rendered}
              postSlug={post.slug}
            />
            <div className="flex items-center text-xs text-gray-500 font-futura uppercase tracking-widest font-bold">
              <Clock size={14} className="mr-2" />
              {calculateReadingTime(post.content.rendered)} min read
            </div>
          </div>

          {/* Reading time — desktop only */}
          <div className="hidden lg:flex items-center justify-center text-xs text-gray-500 font-futura uppercase tracking-widest font-bold mb-8">
            <Clock size={14} className="mr-2" />
            {calculateReadingTime(post.content.rendered)} min read
          </div>

          {/* Byline */}
          <div className="text-center mb-2 flex items-center justify-center gap-1.5">
            <span className="text-sm md:text-base font-acaslon italic text-black lowercase">
              by
            </span>
            <span className="text-xs md:text-sm font-bold font-futura tracking-[0.15em] text-black uppercase">
              <Link href={`/posts/?author=${author.id}`} className="hover:text-red-700 transition-colors">
                {author.name}
              </Link>
            </span>
          </div>

          {/* Date */}
          <div className="text-center mb-10">
            <span className="text-sm md:text-base text-gray-700 font-acaslon italic">
              {formattedDate}
            </span>
          </div>

          {/* Audio Player */}
          {post.acf?.article_media && (
            <div className="mb-8">
              <AudioPlayer src={post.acf.article_media} title="Listen to this article" />
            </div>
          )}

          {/* Featured Image */}
          {featuredMedia?.source_url && (
            <figure className="mb-10 relative text-center">
              <Image
                src={featuredMedia.source_url}
                alt={featuredMedia.alt_text || post.title.rendered}
                className="w-full h-auto object-cover max-w-full !rounded-none"
                width={1200}
                height={800}
                style={{ borderRadius: 0 }}
                priority
              />
              {featuredMedia.caption && (
                <figcaption
                  className="text-sm text-gray-500 mt-3 text-right font-acaslon italic"
                  dangerouslySetInnerHTML={{
                    __html: featuredMedia.caption.rendered,
                  }}
                />
              )}
            </figure>
          )}

          <div className="mb-10 pb-6 border-b border-gray-200"></div>

          {/* Article Content with sticky sidebar bookmark */}
          <StickyBookmark wpPostId={post.id} postTitle={post.title.rendered} postSlug={post.slug}>
            <div className="prose prose-lg max-w-none font-acaslon text-gray-900 leading-loose">
              <ArticleContent content={post.content.rendered} />
            </div>
          </StickyBookmark>

        </div>
      </Container>
    </Section>
  );
}

// Default Layout Component
function DefaultLayout({ post, featuredMedia, author, category, cleanExcerpt, wordCount, readingTimeMinutes, formattedDate }: any) {
  return (
    <Section>
      <Container>
        <Prose>
          {/* Category */}
          {category && (
            <div className="mb-4">
              <Link
                href={`/posts/?category=${category.id}`}
                className={cn(
                  "text-xs lg:text-2xl font-newyorker uppercase text-red-700 transition-colors",
                  "!no-underline"
                )}
              >
                <span dangerouslySetInnerHTML={{ __html: category.name }} />
              </Link>
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-knockout mb-4">
            <Balancer>
              <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
            </Balancer>
          </h1>

          {/* Excerpt */}
          {cleanExcerpt && (
            <div className="mb-6 max-w-2xl">
              <p className="text-base md:text-lg text-muted-foreground font-acaslon italic">
                {cleanExcerpt}
              </p>
            </div>
          )}

          {/* Bookmark & Time — mobile only */}
          <div className="flex flex-col sm:flex-row items-start gap-4 mb-6 lg:hidden">
            <BookmarkButton
              wpPostId={post.id}
              postTitle={post.title.rendered}
              postSlug={post.slug}
            />
            <div className="flex items-center text-sm text-muted-foreground h-10">
              <Clock size={14} className="mr-1.5" />
              <span>{readingTimeMinutes} min read</span>
            </div>
          </div>

          {/* Reading time — desktop only */}
          <div className="hidden lg:flex items-center text-sm text-muted-foreground h-10 mb-6">
            <Clock size={14} className="mr-1.5" />
            <span>{readingTimeMinutes} min read</span>
          </div>

          {/* Author + Date */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <p className="font-miller text-sm text-muted-foreground">
              Published by{" "}
              <Link
                href={`/posts/?author=${author.id}`}
                className="font-stilson text-primary/90"
              >
                {author.name}
              </Link>{" "}
              • {formattedDate}
            </p>
          </div>

          {/* Audio Player */}
          {post.acf?.article_media && (
            <div className="max-w-2xl mb-8">
              <AudioPlayer src={post.acf.article_media} title="Listen to this article" />
            </div>
          )}

          {/* Featured Image */}
          {featuredMedia?.source_url && (
            <figure className="my-4">
              <Image
                src={featuredMedia.source_url}
                alt={featuredMedia.alt_text || post.title.rendered}
                className="max-w-full h-auto !rounded-none"
                width={featuredMedia.media_details?.width || 1200}
                height={featuredMedia.media_details?.height || 800}
                style={{ borderRadius: 0 }}
                loading="lazy"
                priority={false}
              />
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

        <div className="w-full h-px bg-dark my-8"></div>

        {/* Article Body with sticky sidebar bookmark */}
        <StickyBookmark wpPostId={post.id} postTitle={post.title.rendered} postSlug={post.slug}>
          <ArticleContent content={post.content.rendered} className="mt-2" />
        </StickyBookmark>
      </Container>
    </Section>
  );
}

// ✅ Main Post Page
export default async function Page({ params }: { params: { slug: string } }) {
  const awaitedParams = await params;
  const post = await getPostBySlug(awaitedParams.slug);
  if (!post || !post.id) {
    return (
      <Section>
        <Container>
          <Prose>
            <h2>Post Not Found</h2>
            <p>The post you are looking for does not exist or could not be loaded.</p>
          </Prose>
        </Container>
      </Section>
    );
  }

  // ✅ Use embedded data from the post fetch (media, author, term)
  // This avoids redundant API calls and is more reliable
  const featuredMedia = (post._embedded?.["wp:featuredmedia"]?.[0] as any) ?? null;
  const author = (post._embedded?.["author"]?.[0] as any) ?? await getAuthorById(post.author).catch(() => null);
  const category = (post._embedded?.["wp:term"]?.[0]?.[0] as any) ?? (post.categories?.[0] ? await getCategoryById(post.categories[0]).catch(() => null) : null);

  // Handle article_media (audio)
  // Simple pass-through: We assume the user provides a valid, accessible URL (e.g., Cloudinary)
  // This avoids issues with the free hosting provider blocking file access or HTTPS mixing.
  if (post.acf && post.acf.article_media) {
    // Ensure it's treated as a string
    post.acf.article_media = String(post.acf.article_media);
  }

  // Get recommended posts based on shared tags
  const recommendedPosts = await getRecommendedPosts(post, 4);

  // Helper function to decode HTML entities
  const decodeHtmlEntities = (text: string): string => {
    const entities: { [key: string]: string } = {
      '&#8220;': '"', // left double quotation mark
      '&#8221;': '"', // right double quotation mark
      '&#8216;': "'", // left single quotation mark
      '&#8217;': "'", // right single quotation mark
      '&#8211;': '–', // en dash
      '&#8212;': '—', // em dash
      '&#8230;': '…', // ellipsis
      '&#38;': '&',   // ampersand
      '&amp;': '&',   // ampersand
      '&lt;': '<',    // less than
      '&gt;': '>',    // greater than
      '&quot;': '"',  // double quote
      '&apos;': "'",  // single quote
      '&#039;': "'",  // single quote (numeric)
      '&nbsp;': ' ',  // non-breaking space
      '&#160;': ' ',  // non-breaking space (numeric)
    };

    let decoded = text;
    for (const [entity, char] of Object.entries(entities)) {
      decoded = decoded.replace(new RegExp(entity, 'g'), char);
    }
    // Also handle numeric entities generically
    decoded = decoded.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)));
    // Handle hex entities
    decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)));
    return decoded;
  };

  const cleanExcerpt = decodeHtmlEntities(post.excerpt.rendered.replace(/<[^>]*>/g, "").trim());
  const wordCount = calculateWordCount(post.content.rendered);
  const readingTimeMinutes = calculateReadingTime(post.content.rendered);
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Check category types for layout selection
  const isScienceTech = category?.slug === 'science-tech' ||
    category?.name?.toLowerCase().includes('science') ||
    category?.name?.toLowerCase().includes('tech');

  const isBooks = category?.slug === 'books' ||
    category?.name?.toLowerCase().includes('books');

  const isInterview = category?.slug === 'interviews' ||
    category?.name?.toLowerCase().includes('interviews') ||
    category?.name?.toLowerCase().includes('interview');

  const isCulture = category?.slug === 'culture' ||
    category?.name?.toLowerCase().includes('culture');

  const isPersonal = category?.slug === 'personal' ||
    category?.name?.toLowerCase().includes('personal');

  // Render appropriate layout based on category
  if (isScienceTech) {
    return (
      <>
        <SetNavbarTitle title={post.title.rendered} />
        <ScienceTechLayout post={post} featuredMedia={featuredMedia} author={author} category={category} />
        <ReadMoreSection posts={recommendedPosts} />
      </>
    );
  }

  if (isInterview) {
    return (
      <>
        <SetNavbarTitle title={post.title.rendered} />
        <InterviewLayout
          post={post}
          featuredMedia={featuredMedia}
          author={author}
          category={category}
          formattedDate={formattedDate}
        />
      </>
    )
  }

  if (isBooks) {
    return (
      <>
        <SetNavbarTitle title={post.title.rendered} />
        <BooksLayout
          post={post}
          featuredMedia={featuredMedia}
          author={author}
          category={category}
          cleanExcerpt={cleanExcerpt}
          formattedDate={formattedDate}
        />
        <ReadMoreSection posts={recommendedPosts} />
      </>
    );
  }

  if (isCulture || isPersonal) {
    return (
      <>
        <SetNavbarTitle title={post.title.rendered} />
        <CultureLayout
          post={post}
          featuredMedia={featuredMedia}
          author={author}
          category={category}
          cleanExcerpt={cleanExcerpt}
          formattedDate={formattedDate}
        />
        <ReadMoreSection posts={recommendedPosts} />
      </>
    );
  }

  return (
    <>
      <SetNavbarTitle title={post.title.rendered} />
      <DefaultLayout
        post={post}
        featuredMedia={featuredMedia}
        author={author}
        category={category}
        cleanExcerpt={cleanExcerpt}
        wordCount={wordCount}
        readingTimeMinutes={readingTimeMinutes}
        formattedDate={formattedDate}
      />
      <ReadMoreSection posts={recommendedPosts} />
    </>
  );
}