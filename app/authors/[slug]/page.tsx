import {
  getAuthorBySlug,
  getAllAuthors,
  getPostsByAuthorSlug,
} from "@/lib/wordpress";
import { Section, Container, Prose } from "@/components/craft";
import { siteConfig } from "@/site.config";
import PostCard from "@/components/posts/post-card";
import Link from "next/link";
import Image from "next/image";

import type { Metadata } from "next";

export const revalidate = 60;

export async function generateStaticParams() {
  const authors = await getAllAuthors();
  return authors.map((author) => ({ slug: author.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);

  if (!author) {
    return { title: "Author Not Found | KiawaNotes" };
  }

  const title = `${author.name} | KiawaNotes`;
  const description =
    author.description ||
    `Read all articles by ${author.name} on KiawaNotes — thoughtful writing on culture, books, science, and more.`;
  const url = `${siteConfig.site_domain}/authors/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "KiawaNotes",
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [author, posts] = await Promise.all([
    getAuthorBySlug(slug),
    getPostsByAuthorSlug(slug),
  ]);

  if (!author) {
    return (
      <Section>
        <Container>
          <Prose>
            <h1>Author Not Found</h1>
            <p>The author you are looking for does not exist.</p>
            <Link href="/posts">← Back to all posts</Link>
          </Prose>
        </Container>
      </Section>
    );
  }

  // JSON-LD Person + ProfilePage schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${author.name} | KiawaNotes`,
    url: `${siteConfig.site_domain}/authors/${slug}`,
    mainEntity: {
      "@type": "Person",
      name: author.name,
      description: author.description || undefined,
      image: author.avatar_urls?.["96"] || undefined,
      url: `${siteConfig.site_domain}/authors/${slug}`,
    },
  };

  const avatarUrl = author.avatar_urls?.["96"] || author.avatar_urls?.["48"];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Section>
        <Container className="space-y-8">
          <div className="flex items-center gap-6">
            {avatarUrl && (
              <Image
                src={avatarUrl}
                alt={author.name}
                width={80}
                height={80}
                className="rounded-full"
              />
            )}
            <Prose>
              <h1>{author.name}</h1>
              {author.description && <p>{author.description}</p>}
              <p className="text-muted-foreground">
                {posts.length} {posts.length === 1 ? "article" : "articles"}
              </p>
            </Prose>
          </div>

          {posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No articles by this author yet.</p>
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
