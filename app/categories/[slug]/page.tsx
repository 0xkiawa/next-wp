import {
  getCategoryBySlug,
  getAllCategories,
  getPostsByCategorySlug,
} from "@/lib/wordpress";
import { Section, Container, Prose } from "@/components/craft";
import { siteConfig } from "@/site.config";
import PostCard from "@/components/posts/post-card";
import Link from "next/link";

import type { Metadata } from "next";

export const revalidate = 60;

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: "Category Not Found | KiawaNotes" };
  }

  const title = `${category.name} | KiawaNotes`;
  const description =
    category.description ||
    `Read all articles filed under "${category.name}" on KiawaNotes — insights by Kiawa Vurner on culture, books, science, and ideas.`;
  const url = `${siteConfig.site_domain}/categories/${slug}`;

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

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [category, posts] = await Promise.all([
    getCategoryBySlug(slug),
    getPostsByCategorySlug(slug),
  ]);

  if (!category) {
    return (
      <Section>
        <Container>
          <Prose>
            <h1>Category Not Found</h1>
            <p>The category you are looking for does not exist.</p>
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
    name: `${category.name} | KiawaNotes`,
    description:
      category.description ||
      `Articles filed under "${category.name}" on KiawaNotes.`,
    url: `${siteConfig.site_domain}/categories/${slug}`,
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
            <h1>{category.name}</h1>
            {category.description && <p>{category.description}</p>}
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
            <p className="text-muted-foreground">No articles in this category yet.</p>
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
