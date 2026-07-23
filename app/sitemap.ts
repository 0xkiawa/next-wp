import { MetadataRoute } from "next";
import { getAllAuthors, getAllCategories, getAllPages, getAllPostsForIndexing, getAllTags } from "@/lib/wordpress";
import { siteConfig } from "@/site.config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories, tags, authors, pages] = await Promise.all([
    getAllPostsForIndexing(), getAllCategories(), getAllTags(), getAllAuthors(), getAllPages(),
  ]);

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: `${siteConfig.site_domain}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: `${siteConfig.site_domain}/posts`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    { url: `${siteConfig.site_domain}/posts/categories`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteConfig.site_domain}/posts/authors`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteConfig.site_domain}/posts/tags`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
  ];

  const postUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteConfig.site_domain}/posts/${post.slug}`,
    lastModified: new Date(post.modified),
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [
    ...staticUrls,
    ...postUrls,
    ...categories.map((category) => ({ url: `${siteConfig.site_domain}/categories/${category.slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6 })),
    ...tags.filter((tag) => tag.count > 0).map((tag) => ({ url: `${siteConfig.site_domain}/tags/${tag.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.4 })),
    ...authors.map((author) => ({ url: `${siteConfig.site_domain}/authors/${author.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 })),
    ...pages.map((page) => ({ url: `${siteConfig.site_domain}/pages/${page.slug}`, lastModified: new Date(page.modified), changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
