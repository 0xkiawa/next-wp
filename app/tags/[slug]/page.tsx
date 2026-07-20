import {
  getTagBySlug,
  getAllTags,
  getPostsByTagSlug,
} from "@/lib/wordpress";
import { Section, Container, Prose } from "@/components/craft";
import { siteConfig } from "@/site.config";
import PostCard from "@/components/posts/post-card";
import Link from "next/link";

import type { Metadata } from "next";

export const revalidate = 60;

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({ slug: tag.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);

  if (!tag) {
    return { title: "Tag Not Found | KiawaNotes" };
  }

  const title = `${tag.name} | KiawaNotes`;
  const description =
    tag.description ||
    `Explore articles tagged "${tag.name}" on KiawaNotes — written by Kiawa Vurner on culture, books, science, and more.`;
  const url = `${siteConfig.site_domain}/tags/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "KiawaNotes",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [tag, posts] = await Promise.all([
    getTagBySlug(slug),
    getPostsByTagSlug(slug),
  ]);

  if (!tag) {
    return (
      <Section>
        <Container>
          <Prose>
            <h1>Tag Not Found</h1>
            <p>The tag you are looking for does not exist.</p>
            <Link href="/posts">← Back to all posts</Link>
          </Prose>
        </Container>
      </Section>
    );
  }

  // JSON-LD CollectionPage schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${tag.name} | KiawaNotes`,
    description:
      tag.description || `Articles tagged "${tag.name}" on KiawaNotes.`,
    url: `${siteConfig.site_domain}/tags/${slug}`,
    isPartOf: {
      "@type": "WebSite",
      name: "KiawaNotes",
      url: siteConfig.site_domain,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Section>
        <Container className="space-y-8">
          <Prose>
            <h1>{tag.name}</h1>
            {tag.description && <p>{tag.description}</p>}
            <p className="text-muted-foreground">
              {posts.length} {posts.length === 1 ? "article" : "articles"}
            </p>
          </Prose>

          {posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No articles with this tag yet.</p>
          )}

          <Link
            href="/posts"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← All articles
          </Link>
        </Container>
      </Section>
    </>
  );
}
