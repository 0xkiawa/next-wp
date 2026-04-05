
const siteConfig = {
  site_domain: "https://kiawanotes.vercel.app",
  site_name: "KiawaNotes"
};

function testMetadataUrl(title, description, featuredMedia, category, author) {
  const ogUrl = new URL(`${siteConfig.site_domain}/api/og`);
  ogUrl.searchParams.append("title", title);
  ogUrl.searchParams.append("description", description.substring(0, 150));

  if (featuredMedia?.source_url) {
    ogUrl.searchParams.append("image", featuredMedia.source_url);
  }

  if (category?.name) {
    ogUrl.searchParams.append("category", category.name);
  }

  if (author?.name) {
    ogUrl.searchParams.append("author", author.name);
  }

  console.log("Generated OG URL:", ogUrl.toString());
}

testMetadataUrl(
  "Test Article Title",
  "This is a test description for the article that should be truncated if it is too long for the preview.",
  { source_url: "https://wp.example.com/wp-content/uploads/image.jpg" },
  { name: "Culture" },
  { name: "John Doe" }
);
