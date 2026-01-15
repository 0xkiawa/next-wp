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
import AboutTheAuthor from "@/components/posts/about-the-author";
import SetNavbarTitle from "@/components/navigation/SetNavbarTitle";
import { AudioPlayer } from "@/components/posts/audio-player";

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
    <Section className="bg-[#fcfbf9] py-20">
      <Container>
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-16 relative">
            <span className="bg-[#fcfbf9] px-4 relative z-10 font-newyorker text-red-600 tracking-widest text-xs uppercase">
              Up Next
            </span>
            <h3 className="text-4xl md:text-5xl font-bold font-newyorker mt-2 mb-6">
              Let Me Shill You More
            </h3>
            <div className="absolute top-3 left-0 w-full h-px bg-gray-200 -z-0"></div>
          </div>

          {/* Posts Grid */}
          <div className="grid md:grid-cols-3 gap-x-12 gap-y-16">
            {posts.map((post) => (
              <article key={post.id} className="group flex flex-col h-full">
                {/* Featured Image */}
                {post.featured_media && post._embedded?.['wp:featuredmedia']?.[0] && (
                  <Link href={`/posts/${post.slug}`} className="block mb-6 overflow-hidden">
                    <div className="aspect-[3/2] relative transform transition-transform duration-700 hover:scale-[1.02]">
                      <Image
                        src={post._embedded['wp:featuredmedia'][0].source_url}
                        alt={post._embedded['wp:featuredmedia'][0].alt_text || post.title.rendered}
                        className="object-cover"
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  </Link>
                )}

                <div className="flex-1 flex flex-col">
                  {/* Category */}
                  {post._embedded?.['wp:term']?.[0]?.[0] && (
                    <div className="mb-3 text-center">
                      <Link
                        href={`/posts/?category=${post._embedded['wp:term'][0][0].id}`}
                        className="text-[10px] uppercase tracking-[0.2em] text-red-600 font-newyorker hover:text-black transition-colors border-b border-transparent hover:border-red-600 pb-px"
                      >
                        {post._embedded['wp:term'][0][0].name}
                      </Link>
                    </div>
                  )}

                  {/* Title */}
                  <h4 className="mb-4 text-center">
                    <Link
                      href={`/posts/${post.slug}`}
                      className="text-2xl font-bold font-stilson leading-[1.1] group-hover:text-red-700 transition-colors"
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />
                  </h4>

                  {/* Excerpt */}
                  {post.excerpt?.rendered && (
                    <div className="mb-6 text-center px-2">
                      <p
                        className="text-base text-gray-500 font-acaslon leading-relaxed line-clamp-3"
                        dangerouslySetInnerHTML={{
                          __html: post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 100) + '...'
                        }}
                      />
                    </div>
                  )}

                  {/* Read More Link */}
                  <div className="mt-auto text-center">
                    <Link
                      href={`/posts/${post.slug}`}
                      className="inline-flex items-center text-xs font-futura font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-red-600 hover:border-red-600 transition-all"
                    >
                      Read Story
                      <svg className="ml-2 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

// ✅ Pre-generate static paths for all posts
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

// ✅ SEO metadata
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const awaitedParams = await params;
  const post = await getPostBySlug(awaitedParams.slug);

  if (!post || !post.title) return {
    title: "Post Not Found",
  };

  // Fetch additional data for rich OG image
  const [featuredMedia, author, category] = await Promise.all([
    post.featured_media ? getFeaturedMediaById(post.featured_media).catch(() => null) : null,
    getAuthorById(post.author).catch(() => null),
    post.categories?.[0] ? getCategoryById(post.categories[0]).catch(() => null) : null,
  ]);

  const title = post.title.rendered.replace(/<[^>]*>/g, "");
  const description = post.excerpt?.rendered?.replace(/<[^>]*>/g, "").trim() || "";

  // Build OG image URL with all parameters
  const ogUrl = new URL(`${siteConfig.site_domain}/api/og`);
  ogUrl.searchParams.append("title", title);
  ogUrl.searchParams.append("description", description.substring(0, 150));

  // Add featured image if available
  if (featuredMedia?.source_url) {
    ogUrl.searchParams.append("image", featuredMedia.source_url);
  }

  // Add category if available
  if (category?.name) {
    ogUrl.searchParams.append("category", category.name);
  }

  // Add author if available
  if (author?.name) {
    ogUrl.searchParams.append("author", author.name);
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `${siteConfig.site_domain}/posts/${post.slug}`,
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogUrl.toString()],
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

          {/* Audio Player */}
          {post.acf?.article_media && (
            <div className="max-w-2xl mx-auto mb-8">
              <AudioPlayer src={post.acf.article_media} title="Listen to this article" />
            </div>
          )}

          {/* Author Line + Bookmark */}
          <div className="text-center mb-8">
            <p className="text-sm text-gray-600 font-glacial mb-3">
              presented by / {author.name}
            </p>
            <BookmarkButton
              wpPostId={post.id}
              postTitle={post.title.rendered}
              postSlug={post.slug}
            />
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
          <div className="max-w-2xl mx-auto mb-12">
            <div className="text-base leading-relaxed text-black font-garamond italic">
              <p>{excerpt}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-px bg-black"></div>
          </div>

          {/* Full Article Content */}
          <div className="max-w-2xl mx-auto">
            <div className="text-base leading-relaxed text-black prose prose-lg max-w-none" style={{ fontFamily: 'Georgia, serif', lineHeight: '1.7' }}>
              <div className="md:first-letter:text-5xl md:first-letter:font-bold md:first-letter:float-left md:first-letter:mr-2 md:first-letter:leading-none">
                <ArticleContent
                  content={post.content.rendered}
                  className="line-clamp-none"
                />
              </div>
            </div>
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
            <div className="mb-4">
              <p className="text-lg md:text-xl text-gray-700 font-acaslon italic leading-relaxed">
                {cleanExcerpt}
              </p>
            </div>
          )}

          {/* Author Bio Section */}
          <div className="mb-8">
            <AboutTheAuthor authorId={author.id} />
          </div>

          {/* Bookmark Button */}
          <div className="mb-6 text-center">
            <BookmarkButton
              wpPostId={post.id}
              postTitle={post.title.rendered}
              postSlug={post.slug}
            />
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

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <ArticleContent content={post.content.rendered} className="mt-2" />
          </div>
        </div>
      </Container>
    </Section>
  );
}

// Culture Layout Component (WSJ Style)
function CultureLayout({ post, featuredMedia, author, category, cleanExcerpt, formattedDate }: any) {
  return (
    <Section className="bg-white pt-12 pb-20">
      <Container>
        <div className="max-w-3xl mx-auto">
          {/* Eyebrow */}
          <div className="mb-4">
            <Link
              href={`/posts/?category=${category.id}`}
              className="text-red-700 font-bold uppercase tracking-widest text-xs font-jakarta hover:text-blue-900 transition-colors"
            >
              {category.name}
            </Link>
          </div>

          {/* Headline */}
          <h1 className="text-xl md:text-5xl lg:text-xl font-bold font-knockout text-gray-900 leading-[1.1] mb-4 text-left">
            <Balancer>
              <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
            </Balancer>
          </h1>

          {/* Subhead / Excerpt */}
          {cleanExcerpt && (
            <div className="mb-6">
              <p className="text-xl md:text-2xl text-gray-600 font-acaslon italic leading-relaxed text-left">
                {cleanExcerpt}
              </p>
            </div>
          )}

          {/* Meta Data Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-b border-gray-200 py-4 mb-8 gap-4">
            <div className="flex items-center gap-3">
              {/* Author Info */}
              <div className="flex flex-col">
                <span className="font-bold text-sm font-garamond italic">
                  <span className="text-black">By </span>
                  <Link
                    href={`/posts/?author=${author.id}`}
                    className="text-red-700 hover:underline"
                  >
                    {author.name}
                  </Link>
                </span>

                <span className="text-xs text-gray-500 font-newyorker mt-0.5 italic ">
                  {formattedDate}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <BookmarkButton
                wpPostId={post.id}
                postTitle={post.title.rendered}
                postSlug={post.slug}
              />
              {/* Read Time */}
              <div className="flex items-center text-xs text-gray-500 font-glacial uppercase tracking-wider">
                <Clock size={14} className="mr-1.5" />
                {calculateReadingTime(post.content.rendered)} min read
              </div>
            </div>
          </div>

          {/* Audio Player */}
          {post.acf?.article_media && (
            <div className="mb-8">
              <AudioPlayer src={post.acf.article_media} title="Listen to this article" />
            </div>
          )}

          {/* Featured Image */}
          {featuredMedia?.source_url && (
            <figure className="mb-10 relative">
              <Image
                src={featuredMedia.source_url}
                alt={featuredMedia.alt_text || post.title.rendered}
                className="w-full h-auto object-cover"
                width={1200}
                height={800}
                priority
              />
              {featuredMedia.caption && (
                <figcaption
                  className="text-xs text-gray-500 mt-2 text-right font-glacial uppercase tracking-wide"
                  dangerouslySetInnerHTML={{
                    __html: featuredMedia.caption.rendered,
                  }}
                />
              )}
            </figure>
          )}

          {/* Article Content */}
          <div className="prose prose-lg max-w-none font-garamond text-gray-800 leading-loose">
            <ArticleContent content={post.content.rendered} />
          </div>
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
            <div className="text-center mb-4">
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
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-knockout text-center mb-4">
            <Balancer>
              <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
            </Balancer>
          </h1>

          {/* Excerpt */}
          {cleanExcerpt && (
            <div className="text-center mb-6 max-w-2xl mx-auto">
              <p className="text-base md:text-lg text-muted-foreground font-acaslon italic">
                {cleanExcerpt}
              </p>
            </div>
          )}

          {/* Author + Date + Bookmark + Time */}
          <div className="text-center mb-8">
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
            </div>
          </div>

          {/* Audio Player */}
          {post.acf?.article_media && (
            <div className="max-w-2xl mx-auto mb-8">
              <AudioPlayer src={post.acf.article_media} title="Listen to this article" />
            </div>
          )}

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
        </Prose>

        <div className="w-full h-px bg-dark my-8"></div>

        {/* Article Body */}
        <ArticleContent content={post.content.rendered} className="mt-2" />
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

  const [featuredMedia, author, category] = await Promise.all([
    post.featured_media ? getFeaturedMediaById(post.featured_media) : null,
    getAuthorById(post.author),
    getCategoryById(post.categories[0]),
  ]);

  // Handle article_media (audio) - it might be a URL or an ID (number)
  // This robustly handles the case where ACF Return Format is set to "Media ID" instead of "File URL"
  if (post.acf && post.acf.article_media) {
    // If it looks like a number (ID), fetch the media to get the URL
    if (!isNaN(Number(post.acf.article_media)) && Number(post.acf.article_media) > 0) {
      try {
        const audioMedia = await getFeaturedMediaById(Number(post.acf.article_media));
        if (audioMedia?.source_url) {
          post.acf.article_media = audioMedia.source_url;
        }
      } catch (e) {
        console.error('Failed to resolve audio media ID:', e);
      }
    }
  }

  // Get recommended posts based on shared tags
  const recommendedPosts = await getRecommendedPosts(post, 3);

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

  const isCulture = category?.slug === 'culture' ||
    category?.name?.toLowerCase().includes('culture');

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

  if (isCulture) {
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