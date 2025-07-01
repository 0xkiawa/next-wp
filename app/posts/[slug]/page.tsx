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

import { calculateWordCount, calculateReadingTime } from "@/lib/utils/text";
import { BookmarkButton } from "@/components/posts/bookmark-button";

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
  const awaitedParams = await params; // Await params here
  const post = await getPostBySlug(awaitedParams.slug);

  if (!post) return {};

  const title = post.title.rendered;
  const description = post.excerpt.rendered.replace(/<[^>]*>/g, "").trim();

  const ogUrl = new URL(`${siteConfig.site_domain}/api/og`);
  ogUrl.searchParams.append("title", title);
  ogUrl.searchParams.append("description", description);

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

// ✅ Main Post Page
export default async function Page({ params }: { params: { slug: string } }) {
  const awaitedParams = await params; // Await params here
  const post = await getPostBySlug(awaitedParams.slug);
  if (!post) return <div>Post not found.</div>;

  const [featuredMedia, author, category] = await Promise.all([
    post.featured_media ? getFeaturedMediaById(post.featured_media) : null,
    getAuthorById(post.author),
    getCategoryById(post.categories[0]),
  ]);

  const cleanExcerpt = post.excerpt.rendered.replace(/<[^>]*>/g, "").trim();
  const wordCount = calculateWordCount(post.content.rendered);
  const readingTimeMinutes = calculateReadingTime(post.content.rendered);
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

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
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-stilson text-center mb-4">
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
